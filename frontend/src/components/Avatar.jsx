import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { AVATAR_BASE, AVATAR_SIZE, ITEMS_BY_ID, SLOTS } from "@/data/wardrobe";

// Draws the character as stacked layers: base body, then each equipped item in
// SLOTS order. Every layer fills the same box, so artwork must share the base
// body's artboard (see src/data/wardrobe.js).
// `outfit` = { [slotKey]: itemId }. Size it with style (width or height).
export function Avatar({ outfit = {}, style }) {
  const layers = SLOTS.map((slot) => ITEMS_BY_ID[outfit[slot.key]]).filter(
    (item) => item?.image,
  );

  return (
    <View
      style={[{ aspectRatio: AVATAR_SIZE.width / AVATAR_SIZE.height }, style]}
      pointerEvents="none"
    >
      <Image source={AVATAR_BASE} style={StyleSheet.absoluteFill} contentFit="contain" />
      {layers.map((item) => (
        <Image
          key={item.id}
          source={item.image}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
        />
      ))}
    </View>
  );
}
