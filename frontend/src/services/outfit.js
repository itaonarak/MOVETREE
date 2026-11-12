
import { useSyncExternalStore } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ITEMS_BY_ID } from "@/data/wardrobe";
import { apiRequest } from "./api";

const STORAGE_PREFIX = "movetree_outfit_";

const DEFAULT_STATE = {
  coins: 0,
  owned: [],
  equipped: {},
  prices: {},
  loading: true,
};

let state = DEFAULT_STATE;
let accountId = null;
let refreshSequence = 0;

const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

function getStorageKey(userId) {
  return `${STORAGE_PREFIX}${userId}`;
}

async function saveEquipped(equipped, userId = accountId) {
  if (!userId) return;

  try {
    const json = JSON.stringify(equipped);
    const key = getStorageKey(userId);

    if (Platform.OS === "web") {
      localStorage.setItem(key, json);
    } else {
      await SecureStore.setItemAsync(key, json);
    }
  } catch (e) {
    console.warn("Failed to save outfit", e);
  }
}

async function loadEquipped(userId) {
  try {
    const key = getStorageKey(userId);

    const json =
      Platform.OS === "web"
        ? localStorage.getItem(key)
        : await SecureStore.getItemAsync(key);

    if (!json) return {};

    const saved = JSON.parse(json);

    return Object.fromEntries(
      Object.entries(saved).filter(
        ([, id]) => ITEMS_BY_ID[id]
      )
    );
  } catch (e) {
    console.warn("Failed to load outfit", e);
    return {};
  }
}

// Load balance, catalog and owned items for the logged-in account.
export async function refreshOutfit() {
  const requestId = ++refreshSequence;

  try {
    // Identify the current account from the access token.
    const profile = await apiRequest("/users/me");
    const userId = profile.user_id;

    if (!userId) {
      throw new Error("ไม่พบข้อมูลบัญชีผู้ใช้");
    }

    if (requestId !== refreshSequence) return false;

    // Reset outfit state when switching accounts.
    if (accountId !== userId) {
      accountId = userId;

      state = {
        ...DEFAULT_STATE,
        loading: true,
      };

      notify();

      const savedEquipped = await loadEquipped(userId);

      if (requestId !== refreshSequence) return false;

      state = {
        ...state,
        equipped: savedEquipped,
      };

      notify();
    }

    const [balanceData, catalogData, ownedData] = await Promise.all([
      apiRequest("/points/balance"),
      apiRequest("/points/catalog"),
      apiRequest("/points/owned"),
    ]);

    if (requestId !== refreshSequence || accountId !== userId) {
      return false;
    }

    const prices = {};

    for (const item of catalogData.items ?? []) {
      if (ITEMS_BY_ID[item.code]) {
        prices[item.code] = item.price;
      }
    }

    const owned = (ownedData.owned ?? []).filter(
      (id) => ITEMS_BY_ID[id]
    );

    const equipped = Object.fromEntries(
      Object.entries(state.equipped).filter(
        ([, id]) => owned.includes(id)
      )
    );

    state = {
      coins: balanceData.balance ?? 0,
      owned,
      prices,
      equipped,
      loading: false,
    };

    notify();

    await saveEquipped(equipped, userId);

    return true;
  } catch (e) {
    console.warn("Failed to refresh outfit", e);

    if (requestId === refreshSequence) {
      state = {
        ...state,
        loading: false,
      };

      notify();
    }

    return false;
  }
}

// Clear in-memory data when logging out.
// Keep the account's saved outfit so it can be restored on next login.
export function clearOutfit() {
  refreshSequence++;
  accountId = null;
  state = {
    ...DEFAULT_STATE,
    loading: false,
  };
  notify();
}

function initialize() {
  refreshOutfit();
}

initialize();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOutfit() {
  return useSyncExternalStore(subscribe, () => state);
}

// Purchase item using backend.
export async function buyItem(id) {
  const item = ITEMS_BY_ID[id];
  const price = state.prices[id];
  const userId = accountId;

  if (!userId) {
    return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };
  }

  if (!item) {
    return { success: false, error: "ไม่พบไอเทม" };
  }

  if (state.owned.includes(id)) {
    return { success: false, error: "คุณมีไอเทมนี้แล้ว" };
  }

  if (typeof price !== "number") {
    return { success: false, error: "ยังโหลดราคาสินค้าไม่สำเร็จ" };
  }

  if (state.coins < price) {
    return { success: false, error: "คะแนนไม่เพียงพอ" };
  }

  try {
    const result = await apiRequest("/points/purchase", {
      method: "POST",
      body: JSON.stringify({ code: id }),
    });

    if (accountId !== userId) {
      return { success: false, error: "บัญชีผู้ใช้เปลี่ยนไปแล้ว" };
    }

    const owned = [...state.owned, id];
    const equipped = {
      ...state.equipped,
      [item.slot]: id,
    };

    state = {
      ...state,
      coins: result.balance,
      owned,
      equipped,
    };

    notify();
    await saveEquipped(equipped, userId);

    return { success: true };
  } catch (e) {
    console.warn("Purchase failed", e);
    return {
      success: false,
      error: e.message || "ซื้อไอเทมไม่สำเร็จ",
    };
  }
}

export function equipItem(id) {
  const item = ITEMS_BY_ID[id];

  if (!accountId || !item || !state.owned.includes(id)) return;

  const equipped = {
    ...state.equipped,
    [item.slot]: id,
  };

  state = { ...state, equipped };
  notify();
  saveEquipped(equipped, accountId);
}

export function unequipSlot(slot) {
  if (!accountId) return;

  const { [slot]: _removed, ...rest } = state.equipped;

  state = {
    ...state,
    equipped: rest,
  };

  notify();
  saveEquipped(rest, accountId);
}
