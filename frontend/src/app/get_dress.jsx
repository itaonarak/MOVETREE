import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { ArtCrop, Avatar } from "@/components/Avatar";
import { ITEMS, ITEMS_BY_ID, TABS } from "@/data/wardrobe";
import { buyItem, equipItem, unequipSlot, useOutfit } from "@/services/outfit";

const icons = {
  back: require("assets/icon/getdress/back_normal.svg"),
  coin: require("assets/icon/getdress/coin_normal.svg"),
};

const COLUMNS = 3;
const MIN_ROWS = 3; // grid always shows at least this many rows of cells

function Coin({ amount, size = 16, textClass = "text-ink-soft" }) {
  return (
    <View className="flex-row items-center">
      <Image source={icons.coin} style={{ width: size, height: size }} contentFit="contain" />
      <Text className={`ml-1 font-medium text-sm ${textClass}`}>{amount}</Text>
    </View>
  );
}

function ItemCell({ item, owned, equipped, selected, onPress }) {
  const border = { borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#D3E3D4" };

  // empty filler cell
  if (!item) return <View className="aspect-square flex-1 bg-paper" style={border} />;

  return (
    <Pressable
      onPress={onPress}
      className="aspect-square flex-1 items-center justify-center bg-paper"
      style={[border, selected && { backgroundColor: "#D5E0CB" }]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={item.name}
    >
      {item.image && item.thumb ? (
        <ArtCrop sources={[item.image]} view={item.thumb} style={{ width: "85%" }} />
      ) : (
        <View
          className="h-1/2 w-1/2 rounded-full"
          style={{ backgroundColor: item.color, borderWidth: 1, borderColor: "#D3E3D4" }}
        />
      )}

      {equipped && (
        <View className="absolute left-2.5 top-2.5 rounded-full bg-brand px-2 py-0.5">
          <Text className="text-[9px] font-semibold text-white">ใส่อยู่</Text>
        </View>
      )}
      {!owned && (
        <View className="absolute bottom-2.5 right-3">
          <Coin amount={item.price} size={12} />
        </View>
      )}
    </Pressable>
  );
}

export default function GetDress() {
  const { coins, owned, equipped } = useOutfit();
  const [tab, setTab] = useState(TABS[0].key);
  const [selectedId, setSelectedId] = useState(null); // item being tried on

  const selected = selectedId ? ITEMS_BY_ID[selectedId] : null;
  const isOwned = selected && owned.includes(selected.id);
  const isEquipped = selected && equipped[selected.slot] === selected.id;
  const canAfford = selected && coins >= selected.price;

  // Preview = saved outfit + whatever is being tried on (even if not bought yet)
  const preview = useMemo(
    () => (selected ? { ...equipped, [selected.slot]: selected.id } : equipped),
    [equipped, selected],
  );

  // Items for the current tab, padded with empty cells to fill the grid
  const cells = useMemo(() => {
    const items =
      tab === "owned"
        ? ITEMS.filter((i) => owned.includes(i.id))
        : ITEMS.filter((i) => i.category === tab);
    const total = Math.max(MIN_ROWS * COLUMNS, Math.ceil(items.length / COLUMNS) * COLUMNS);
    return [...items, ...Array(total - items.length).fill(null)];
  }, [tab, owned]);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/Camera");
  }

  function handleAction() {
    if (!selected) return;
    if (!isOwned) buyItem(selected.id); // buying also equips it
    else if (isEquipped) unequipSlot(selected.slot);
    else equipItem(selected.id);
    setSelectedId(null);
  }

  let actionLabel = "";
  if (selected) {
    if (!isOwned) actionLabel = canAfford ? `ซื้อและใส่ • ${selected.price}` : "เหรียญไม่พอ";
    else actionLabel = isEquipped ? "ถอดออก" : "ใส่";
  }
  const actionDisabled = !selected || (!isOwned && !canAfford);

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

      <View className="flex-1 bg-paper">
        {/* avatar stage */}
        <View className="h-80 items-center justify-center bg-sage-light">
          <Avatar outfit={preview} style={{ height: "92%" }} />
          <View className="absolute right-5 top-4">
            <Coin amount={coins} size={18} />
          </View>
          {selected && !isOwned && (
            <View className="absolute left-5 top-4 rounded-full bg-accent px-2 py-0.5">
              <Text className="text-[10px] font-semibold text-white">กำลังลองใส่</Text>
            </View>
          )}
        </View>

        {/* category tabs */}
        <View className="bg-brand">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TABS.map((t, i) => {
              const active = t.key === tab;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => {
                    setTab(t.key);
                    setSelectedId(null);
                  }}
                  className={`h-8 w-24 items-center justify-center ${active ? "bg-brand-dark" : "bg-brand"}`}
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
          contentContainerStyle={{ paddingBottom: selected ? 88 : 16 }}
          renderItem={({ item }) => (
            <ItemCell
              item={item}
              owned={item && owned.includes(item.id)}
              equipped={item && equipped[item.slot] === item.id}
              selected={item?.id === selectedId}
              onPress={() => setSelectedId(item.id === selectedId ? null : item.id)}
            />
          )}
        />

        {/* action (only while an item is selected) */}
        {selected && (
          <View className="absolute bottom-5 left-5 right-5">
            <Pressable
              onPress={handleAction}
              disabled={actionDisabled}
              className={`h-12 items-center justify-center rounded-2xl ${actionDisabled ? "bg-sage" : "bg-brand"}`}
              style={{ opacity: actionDisabled ? 0.7 : 1 }}
            >
              <Text className="font-semibold text-white">{actionLabel}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Screen>
  );
}
