import { View } from "react-native";
import { Image } from "expo-image";
import { ARTBOARD, AVATAR_BASE, AVATAR_VIEW, ITEMS_BY_ID, SLOTS } from "@/data/wardrobe";

// Positions a full-artboard image so only `view` (artboard px) is visible
// inside a container with the same aspect ratio as `view`.
function artStyle(view) {
  return {
    position: "absolute",
    width: `${(ARTBOARD.width / view.width) * 100}%`,
    height: `${(ARTBOARD.height / view.height) * 100}%`,
    left: `${(-view.x / view.width) * 100}%`,
    top: `${(-view.y / view.height) * 100}%`,
  };
}

// Shows one region of artboard-sized artwork (or several stacked layers).
export function ArtCrop({ sources, view, style }) {
  const layer = artStyle(view);
  return (
    <View
      style={[{ aspectRatio: view.width / view.height, overflow: "hidden" }, style]}
      pointerEvents="none"
    >
      {sources.map((source, i) => (
        <Image key={i} source={source} style={layer} contentFit="fill" />
      ))}
    </View>
  );
}

// Draws the character as stacked layers: base body, then each equipped item in
// SLOTS order. Artwork must share the base body's artboard (see wardrobe.js).
// `outfit` = { [slotKey]: itemId }. Size it with style (width or height).
export function Avatar({ outfit = {}, style }) {
  const layers = SLOTS.map((slot) => ITEMS_BY_ID[outfit[slot.key]])
    .filter((item) => item?.image)
    .map((item) => item.image);

  return <ArtCrop sources={[AVATAR_BASE, ...layers]} view={AVATAR_VIEW} style={style} />;
}
