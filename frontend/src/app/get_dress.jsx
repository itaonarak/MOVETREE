import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Avatar } from "@/components/Avatar";
import { ITEMS, ITEMS_BY_ID, SLOTS } from "@/data/wardrobe";
import { buyItem, equipItem, unequipSlot, useOutfit } from "@/services/outfit";

const icons = {
  back: require("assets/get_dress/back_normal.svg"),
  coin: require("assets/get_dress/coin_normal.svg"),
};

function Coin({ amount, size = 16, className = "" }) {
  return (
    <View className={`flex-row items-center ${className}`}>
      <Image source={icons.coin} style={{ width: size, height: size }} contentFit="contain" />
      <Text className="ml-1 font-semibold text-ink">{amount}</Text>
    </View>
  );
}

function ItemCard({ item, owned, equipped, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="m-[1%] items-center rounded-2xl bg-paper p-2"
      // fixed width so a short last row doesn't stretch
      style={{ width: "31.33%", borderWidth: 2, borderColor: selected ? "#3E513B" : "transparent" }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={item.name}
    >
      {/* Thumbnail: real artwork when available, colour swatch placeholder otherwise */}
      <View className="aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white">
        {item.image ? (
          <Image source={item.image} style={{ width: "100%", height: "100%" }} contentFit="contain" />
        ) : (
          <View
            className="h-3/5 w-3/5 rounded-full"
            style={{ backgroundColor: item.color, borderWidth: 1, borderColor: "#D3E3D4" }}
          />
        )}
        {equipped && (
          <View className="absolute right-1 top-1 rounded-full bg-brand px-1.5">
            <Text className="text-[9px] font-semibold text-white">ใส่อยู่</Text>
          </View>
        )}
      </View>
      <Text className="mt-1 text-xs font-medium text-ink" numberOfLines={1}>
        {item.name}
      </Text>
      {owned ? (
        <Text className="text-[10px] text-ink-soft">มีแล้ว</Text>
      ) : (
        <Coin amount={item.price} size={12} />
      )}
    </Pressable>
  );
}

export default function GetDress() {
  const { coins, owned, equipped } = useOutfit();
  const [slot, setSlot] = useState(SLOTS[0].key);
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

  const items = ITEMS.filter((i) => i.slot === slot);

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

  let actionLabel = "เลือกไอเทมเพื่อลองใส่";
  if (selected) {
    if (!isOwned) actionLabel = canAfford ? `ซื้อและใส่ • ${selected.price}` : "เหรียญไม่พอ";
    else actionLabel = isEquipped ? "ถอดออก" : "ใส่";
  }
  const actionDisabled = !selected || (!isOwned && !canAfford);

  return (
    <Screen>
      {/* header */}
      <View className="h-14 flex-row items-center justify-between px-5">
        <Pressable onPress={goBack} hitSlop={10} accessibilityLabel="back">
          <Image source={icons.back} style={{ width: 24, height: 24 }} tintColor="#E8F5E9" />
        </Pressable>
        <Text className="text-lg font-semibold text-white">แต่งตัว</Text>
        <View className="rounded-full bg-paper px-2.5 py-0.5">
          <Coin amount={coins} />
        </View>
      </View>

      <View className="flex-1 bg-sage-light">
        {/* avatar stage */}
        <View className="mx-5 mt-4 h-56 items-center justify-center rounded-3xl bg-paper">
          <Avatar outfit={preview} style={{ height: "90%" }} />
          {selected && !isOwned && (
            <View className="absolute left-3 top-3 rounded-full bg-accent px-2 py-0.5">
              <Text className="text-[10px] font-semibold text-white">กำลังลองใส่</Text>
            </View>
          )}
        </View>

        {/* slot tabs */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
          >
            {SLOTS.map((s) => {
              const active = s.key === slot;
              return (
                <Pressable
                  key={s.key}
                  onPress={() => setSlot(s.key)}
                  className={`rounded-full px-4 py-1.5 ${active ? "bg-brand" : "bg-paper"}`}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <Text className={`text-sm font-medium ${active ? "text-white" : "text-ink"}`}>
                    {s.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* items */}
        <FlatList
          key={slot}
          data={items}
          keyExtractor={(i) => i.id}
          numColumns={3}
          contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 96 }}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              owned={owned.includes(item.id)}
              equipped={equipped[item.slot] === item.id}
              selected={item.id === selectedId}
              onPress={() => setSelectedId(item.id === selectedId ? null : item.id)}
            />
          )}
        />

        {/* action */}
        <View className="absolute bottom-6 left-5 right-5">
          <Pressable
            onPress={handleAction}
            disabled={actionDisabled}
            className={`h-12 items-center justify-center rounded-2xl ${actionDisabled ? "bg-sage" : "bg-brand"}`}
            style={{ opacity: actionDisabled ? 0.7 : 1 }}
          >
            <Text className="font-semibold text-white">{actionLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
