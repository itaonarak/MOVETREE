// Shared, persisted dress-up state: coins, owned items and the equipped outfit.
// Any screen can read it with useOutfit() and stays in sync (camera overlay,
// get_dress, later profile). Persisted locally for now.
// TODO: replace load/save with backend calls once the API exists.
import { useSyncExternalStore } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ITEMS, ITEMS_BY_ID } from "@/data/wardrobe";

const STORAGE_KEY = "movetree_outfit";

const DEFAULT_STATE = {
  coins: 999, // placeholder — same number the profile page shows
  owned: ITEMS.filter((i) => i.price === 0).map((i) => i.id), // free starter items
  equipped: {}, // { [slotKey]: itemId }
};

let state = DEFAULT_STATE;
const listeners = new Set();

function emit(next) {
  state = next;
  listeners.forEach((l) => l());
  save(next);
}

async function save(value) {
  try {
    const json = JSON.stringify(value);
    if (Platform.OS === "web") localStorage.setItem(STORAGE_KEY, json);
    else await SecureStore.setItemAsync(STORAGE_KEY, json);
  } catch (e) {
    console.warn("Failed to save outfit", e);
  }
}

async function load() {
  try {
    const json =
      Platform.OS === "web"
        ? localStorage.getItem(STORAGE_KEY)
        : await SecureStore.getItemAsync(STORAGE_KEY);
    if (!json) return;
    const saved = JSON.parse(json);
    // Drop ids that no longer exist in the catalog
    const owned = (saved.owned ?? []).filter((id) => ITEMS_BY_ID[id]);
    const equipped = Object.fromEntries(
      Object.entries(saved.equipped ?? {}).filter(([, id]) => owned.includes(id)),
    );
    state = {
      coins: saved.coins ?? DEFAULT_STATE.coins,
      owned: [...new Set([...DEFAULT_STATE.owned, ...owned])],
      equipped,
    };
    listeners.forEach((l) => l());
  } catch (e) {
    console.warn("Failed to load outfit", e);
  }
}
load();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOutfit() {
  return useSyncExternalStore(subscribe, () => state);
}

// Returns false (and changes nothing) if the item is unknown, owned, or too expensive.
export function buyItem(id) {
  const item = ITEMS_BY_ID[id];
  if (!item || state.owned.includes(id) || state.coins < item.price) return false;
  emit({
    ...state,
    coins: state.coins - item.price,
    owned: [...state.owned, id],
    equipped: { ...state.equipped, [item.slot]: id },
  });
  return true;
}

export function equipItem(id) {
  const item = ITEMS_BY_ID[id];
  if (!item || !state.owned.includes(id)) return;
  emit({ ...state, equipped: { ...state.equipped, [item.slot]: id } });
}

export function unequipSlot(slot) {
  const { [slot]: _removed, ...rest } = state.equipped;
  emit({ ...state, equipped: rest });
}
