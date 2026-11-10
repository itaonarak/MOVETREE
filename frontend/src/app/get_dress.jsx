import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { POPUP_SIZE } from "@/components/popupSize";
import { ArtCrop, Avatar } from "@/components/Avatar";
import { ITEMS, ITEMS_BY_ID, TABS } from "@/data/wardrobe";
import { buyItem, equipItem, unequipSlot, useOutfit } from "@/services/outfit";

const icons = {
  back: require("assets/icon/getdress/back_normal.svg"),
  coin: require("assets/icon/getdress/coin_normal.svg"),
  lock: require("assets/icon/getdress/icon_lock.svg"),
};

const COLUMNS = 3;
const MIN_ROWS = 3; // grid always shows at least this many rows of cells

const CELL_BG = "#E8F5E9";
const CELL_BG_WORN = "#D5DCCB"; // darker shade for the item currently worn
const SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 4,
};

// Coin icon + amount. `iconFirst` = icon before the number (coin balance),
// otherwise number then icon (prices).
function Coin({ amount, size = 16, iconFirst = false, textClass = "text-sm text-ink-soft" }) {
  const icon = (
    <Image source={icons.coin} style={{ width: size, height: size }} contentFit="contain" />
  );
  return (
    <View className="flex-row items-center">
      {iconFirst && icon}
      <Text className={`font-medium ${iconFirst ? "ml-1" : "mr-0.5"} ${textClass}`}>{amount}</Text>
      {!iconFirst && icon}
    </View>
  );
}

function ItemCell({ item, owned, worn, onPress }) {
  const border = { borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#D3E3D4" };

  // empty filler cell
  if (!item) return <View className="aspect-square flex-1" style={[border, { backgroundColor: CELL_BG }]} />;

  return (
    <Pressable
      onPress={onPress}
      className="aspect-square flex-1 items-center justify-center"
      style={[border, { backgroundColor: worn ? CELL_BG_WORN : CELL_BG }]}
      accessibilityRole="button"
      accessibilityState={{ selected: worn }}
      accessibilityLabel={owned ? item.name : `${item.name} ${item.price}`}
    >
      <ArtCrop sources={[item.image]} view={item.thumb} style={{ width: "92%" }} />

      {!owned && (
        <>
          <Image
            source={icons.lock}
            style={{ position: "absolute", left: 6, top: 6, width: 18, height: 18 }}
            contentFit="contain"
          />
          <View className="absolute bottom-1.5 right-2">
            <Coin amount={item.price} size={11} textClass="text-[11px] text-ink" />
          </View>
        </>
      )}
    </Pressable>
  );
}

function PopupButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="h-8 items-center justify-center rounded-xl bg-brand px-5"
      style={SHADOW}
      accessibilityRole="button"
    >
      <Text className="text-sm font-semibold text-white">{label}</Text>
    </Pressable>
  );
}

// Confirmation before spending coins. Tapping outside the card cancels.
function BuyPopup({ item, canAfford, onCancel, onConfirm }) {
  return (
    <Pressable
      onPress={onCancel}
      className="absolute inset-0 items-center justify-center"
      accessibilityLabel="close"
    >
      <Pressable
        onPress={() => {}} // swallow taps on the card itself
        className="items-center justify-center rounded-2xl px-5"
        style={[{ backgroundColor: CELL_BG }, SHADOW, POPUP_SIZE]}
      >
        <Text className="text-base font-semibold text-brand-dark">
          {canAfford ? "ยืนยันที่จะซื้อด้วย" : "เหรียญไม่พอ"}
        </Text>
        <View className="mb-3">
          <Coin amount={item.price} size={16} textClass="text-base text-brand-dark" />
        </View>
        {canAfford ? (
          <View className="w-full flex-row justify-between px-2">
            <PopupButton label="ไม่" onPress={onCancel} />
            <PopupButton label="ใช่" onPress={onConfirm} />
          </View>
        ) : (
          <PopupButton label="ตกลง" onPress={onCancel} />
        )}
      </Pressable>
    </Pressable>
  );
}

export default function GetDress() {
  const { coins, owned, equipped } = useOutfit();
  const [tab, setTab] = useState(TABS[0].key);
  const [buyingId, setBuyingId] = useState(null); // locked item awaiting confirmation

  const buying = buyingId ? ITEMS_BY_ID[buyingId] : null;

  // Items for the current tab, padded with empty cells to fill the grid
  const cells = useMemo(() => {
    const items = ITEMS.filter((i) => i.category === tab);
    const total = Math.max(MIN_ROWS * COLUMNS, Math.ceil(items.length / COLUMNS) * COLUMNS);
    return [...items, ...Array(total - items.length).fill(null)];
  }, [tab]);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/Camera");
  }

  // Owned: tap to wear / take off. Locked: ask to buy (no try-on).
  function handlePress(item) {
    if (!owned.includes(item.id)) setBuyingId(item.id);
    else if (equipped[item.slot] === item.id) unequipSlot(item.slot);
    else equipItem(item.id);
  }

  function confirmBuy() {
    if (buying) buyItem(buying.id); // buying also puts it on
    setBuyingId(null);
  }

  return (
    <Screen>
      {/* header */}
      <View className="h-16 flex-row items-center justify-center px-5">
        <Pressable
          onPress={goBack}
          hitSlop={10}
          accessibilityLabel="back"
          className="absolute left-5"
        >
          <Image source={icons.back} style={{ width: 26, height: 26 }} tintColor="#FFFFFF" />
        </Pressable>
        <Text className="text-xl font-semibold text-white">แต่งตัว</Text>
      </View>

      <View className="flex-1" style={{ backgroundColor: CELL_BG }}>
        {/* avatar stage */}
        <View className="h-80 items-center justify-center bg-sage-light">
          <Avatar outfit={equipped} style={{ height: "92%" }} />
          <View className="absolute right-4 top-4">
            <Coin amount={coins} size={18} iconFirst />
          </View>
        </View>

        {/* category tabs */}
        <View className="bg-brand-dark">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TABS.map((t, i) => {
              const active = t.key === tab;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setTab(t.key)}
                  className={`h-8 w-28 items-center justify-center ${active ? "bg-brand-dark" : "bg-brand"}`}
                  style={i > 0 && { borderLeftWidth: 1, borderColor: "#E8F5E9" }}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <Text className="text-sm font-medium text-white">{t.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* items grid */}
        <FlatList
          key={tab}
          data={cells}
          keyExtractor={(item, i) => item?.id ?? `empty-${i}`}
          numColumns={COLUMNS}
          renderItem={({ item }) => (
            <ItemCell
              item={item}
              owned={item && owned.includes(item.id)}
              worn={item && equipped[item.slot] === item.id}
              onPress={() => handlePress(item)}
            />
          )}
        />
      </View>

      {buying && (
        <BuyPopup
          item={buying}
          canAfford={coins >= buying.price}
          onCancel={() => setBuyingId(null)}
          onConfirm={confirmBuy}
        />
      )}
    </Screen>
  );
}
