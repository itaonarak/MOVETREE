// Wardrobe catalog for the dress-up feature.
//
// HOW LAYERING WORKS
// The avatar is a stack of same-size transparent images drawn on top of each
// other: base body first, then one image per slot in SLOTS order. Every
// clothing PNG must be exported on the SAME artboard as the base body
// (ARTBOARD, currently 2360x1640) with a transparent background and the garment
// already positioned where it sits on the body. No per-item x/y offsets needed.
//
// Because the artboard is mostly empty space, two crop rectangles (in artboard
// pixels) decide what is actually shown:
//   AVATAR_VIEW  — the part of the artboard drawn as the avatar
//   item.thumb   — the part shown as the shop thumbnail (zoomed to the item)
//
// ADDING ARTWORK
// Drop files in assets/cloth/<category>/ and add items below with `image` set,
// plus a `thumb` box around the drawing (use thumbAround(x0, y0, x1, y1) with
// the opaque bounding box of the PNG), then include them in ITEMS.
//
// LATER: this list (prices, ownership, equipped outfit, coins) should come from
// the backend; keep the same shape so screens don't need to change.

export const AVATAR_BASE = require("assets/cloth/body.png");
export const ARTBOARD = { width: 2360, height: 1640 };
// Body occupies ~x 991-1373, y 221-1506; padded so hats/shoes/bags fit
// (tallest hat starts at y 106, widest hat/pants span x 909-1466).
export const AVATAR_VIEW = { x: 880, y: 90, width: 600, height: 1490 };
// Kept for older callers: aspect ratio of the visible avatar.
export const AVATAR_SIZE = { width: AVATAR_VIEW.width, height: AVATAR_VIEW.height };

// Layers: array order = draw order (bottom -> top). An item's `slot` decides
// which layer it replaces (only one item per slot can be worn).
export const SLOTS = [
  { key: "shoes" },
  { key: "bottom" }, // pants and skirts share this layer
  { key: "top" },
  { key: "bag" },
  { key: "hair" }, // drawn over clothes so long hair falls over the shoulders
  { key: "hat" },
];

// Shop tabs (key = item.category). Bought vs locked is shown per item.
export const TABS = [
  { key: "hair", label: "ทรงผม" },
  { key: "top", label: "เสื้อ" },
  { key: "pants", label: "กางเกง" },
  { key: "skirt", label: "กระโปรง" },
  { key: "shoes", label: "รองเท้า" },
  { key: "hat", label: "หมวก" },
  { key: "bag", label: "กระเป๋า" },
];

// Square crop around a bounding box, with padding.
export function thumbAround(x0, y0, x1, y1, pad = 40) {
  const size = Math.max(x1 - x0, y1 - y0) + pad * 2;
  return {
    x: (x0 + x1) / 2 - size / 2,
    y: (y0 + y1) / 2 - size / 2,
    width: size,
    height: size,
  };
}

// --- artwork ------------------------------------------------------------------
// Each entry: [image, opaque bounding box (x0, y0, x1, y1) on the artboard].
// Boxes ignore a few stray pixels some PNGs have far outside the body.
const HAIR_ART = [
  [require("assets/cloth/Hair/hair_1.png"), [954, 217, 1393, 714]],
  [require("assets/cloth/Hair/hair_2.png"), [954, 217, 1393, 714]],
  [require("assets/cloth/Hair/hair_3.png"), [984, 200, 1404, 658]],
  [require("assets/cloth/Hair/hair_4.png"), [984, 200, 1404, 658]],
  [require("assets/cloth/Hair/hair_5.png"), [984, 200, 1404, 658]],
  [require("assets/cloth/Hair/hair_6.png"), [968, 219, 1427, 767]],
  [require("assets/cloth/Hair/hair_7.png"), [968, 219, 1427, 767]],
  [require("assets/cloth/Hair/hair_8.png"), [954, 217, 1393, 714]],
  [require("assets/cloth/Hair/hair_9.png"), [984, 200, 1404, 658]],
  [require("assets/cloth/Hair/hair_10.png"), [954, 217, 1393, 714]],
  [require("assets/cloth/Hair/hair_11.png"), [968, 219, 1427, 767]],
  [require("assets/cloth/Hair/hair_12.png"), [955, 218, 1383, 606]],
  [require("assets/cloth/Hair/hair_13.png"), [955, 218, 1383, 606]],
  [require("assets/cloth/Hair/hair_14.png"), [968, 219, 1427, 767]],
  [require("assets/cloth/Hair/hair_15.png"), [955, 218, 1383, 606]],
  [require("assets/cloth/Hair/hair_16.png"), [955, 218, 1383, 606]],
];
const SHIRTS_ART = [
  [require("assets/cloth/shirt/shirt_1.png"), [1040, 646, 1344, 1066]],
  [require("assets/cloth/shirt/shirt_2.png"), [1040, 646, 1344, 1065]],
  [require("assets/cloth/shirt/shirt_3.png"), [1040, 646, 1344, 1065]],
  [require("assets/cloth/shirt/shirt_4.png"), [1040, 646, 1344, 1066]],
  [require("assets/cloth/shirt/shirt_5.png"), [1040, 646, 1344, 1065]],
  [require("assets/cloth/shirt/shirt_6.png"), [1040, 646, 1344, 1065]],
  [require("assets/cloth/shirt/shirt_7.png"), [1040, 646, 1344, 1065]],
  [require("assets/cloth/shirt/shirt_8.png"), [1040, 646, 1344, 1066]],
  [require("assets/cloth/shirt/shirt_9.png"), [1075, 607, 1290, 905]],
  [require("assets/cloth/shirt/shirt_10.png"), [1046, 639, 1318, 951]],
  [require("assets/cloth/shirt/shirt_11.png"), [1046, 639, 1318, 951]],
  [require("assets/cloth/shirt/shirt_12.png"), [1046, 639, 1318, 951]],
  [require("assets/cloth/shirt/shirt_13.png"), [1036, 645, 1327, 1083]],
  [require("assets/cloth/shirt/shirt_14.png"), [1036, 645, 1327, 1083]],
  [require("assets/cloth/shirt/shirt_15.png"), [1056, 611, 1313, 1042]],
  [require("assets/cloth/shirt/shirt_16.png"), [1053, 634, 1319, 1042]],
  [require("assets/cloth/shirt/shirt_17.png"), [1053, 634, 1319, 1042]],
  [require("assets/cloth/shirt/shirt_18.png"), [1053, 634, 1319, 1042]],
  [require("assets/cloth/shirt/shirt_19.png"), [1056, 611, 1313, 1042]],
  [require("assets/cloth/shirt/shirt_20.png"), [1036, 645, 1327, 1083]],
  [require("assets/cloth/shirt/shirt_21.png"), [1036, 645, 1327, 1495]],
  [require("assets/cloth/shirt/shirt_22.png"), [1056, 611, 1313, 1042]],
  [require("assets/cloth/shirt/shirt_23.png"), [1056, 611, 1313, 1042]],
  [require("assets/cloth/shirt/shirt_24.png"), [1001, 631, 1347, 1354]],
  [require("assets/cloth/shirt/shirt_25(1).png"), [1029, 608, 1339, 910]],
  [require("assets/cloth/shirt/shirt_25.png"), [1046, 629, 1311, 910]],
];
const PANTS_ART = [
  [require("assets/cloth/Pants/pants_1.png"), [1041, 863, 1321, 1354]],
  [require("assets/cloth/Pants/pants_2.png"), [1041, 863, 1321, 1354]],
  [require("assets/cloth/Pants/pants_3.png"), [1041, 863, 1321, 1354]],
  [require("assets/cloth/Pants/pants_4.png"), [1041, 863, 1321, 1354]],
  [require("assets/cloth/Pants/pants_5.png"), [909, 883, 1375, 1441]],
  [require("assets/cloth/Pants/pants_6.png"), [1052, 908, 1326, 1427]],
  [require("assets/cloth/Pants/pants_7.png"), [1040, 911, 1331, 1421]],
  [require("assets/cloth/Pants/pants_8.png"), [1033, 901, 1333, 1425]],
  [require("assets/cloth/Pants/pants_9.png"), [1033, 875, 1323, 1404]],
  [require("assets/cloth/Pants/pants_10.png"), [1033, 875, 1323, 1404]],
  [require("assets/cloth/Pants/pants_11.png"), [1040, 911, 1331, 1421]],
  [require("assets/cloth/Pants/pants_12.png"), [1033, 901, 1333, 1425]],
];
const SKIRTS_ART = [
  [require("assets/cloth/skirt/Skirt_1.png"), [1011, 872, 1338, 1381]],
  [require("assets/cloth/skirt/Skirt_2.png"), [1009, 872, 1400, 1218]],
  [require("assets/cloth/skirt/Skirt_3.png"), [1002, 853, 1370, 1168]],
  [require("assets/cloth/skirt/Skirt_4.png"), [1022, 840, 1371, 1357]],
  [require("assets/cloth/skirt/Skirt_5.png"), [1032, 885, 1324, 1086]],
  [require("assets/cloth/skirt/Skirt_6.png"), [1002, 853, 1370, 1168]],
  [require("assets/cloth/skirt/Skirt_7.png"), [1022, 840, 1371, 1357]],
  [require("assets/cloth/skirt/Skirt_8.png"), [1011, 872, 1338, 1381]],
  [require("assets/cloth/skirt/Skirt_9.png"), [1009, 872, 1400, 1218]],
];
const SHOES_ART = [
  [require("assets/cloth/Shoes/shoes_1.png"), [1091, 1464, 1272, 1521]],
  [require("assets/cloth/Shoes/shoes_2.png"), [1091, 1464, 1272, 1521]],
  [require("assets/cloth/Shoes/shoes_3.png"), [1091, 1464, 1272, 1521]],
  [require("assets/cloth/Shoes/shoes_4.png"), [1091, 1464, 1272, 1521]],
  [require("assets/cloth/Shoes/shoes_5.png"), [1079, 1345, 1294, 1507]],
  [require("assets/cloth/Shoes/shoes_6.png"), [1058, 1258, 1308, 1509]],
  [require("assets/cloth/Shoes/shoes_7.png"), [1079, 1345, 1294, 1507]],
  [require("assets/cloth/Shoes/shoes_8.png"), [1079, 1345, 1294, 1507]],
  [require("assets/cloth/Shoes/shoes_9.png"), [1058, 1258, 1308, 1509]],
  [require("assets/cloth/Shoes/shoes_10.png"), [1058, 1258, 1308, 1509]],
  [require("assets/cloth/Shoes/shoes_11.png"), [1058, 1258, 1308, 1509]],
  [require("assets/cloth/Shoes/shoes_12.png"), [1079, 1345, 1294, 1507]],
  [require("assets/cloth/Shoes/shoes_13.png"), [1075, 1294, 1303, 1543]],
  [require("assets/cloth/Shoes/shoes_14.png"), [1075, 1294, 1303, 1543]],
  [require("assets/cloth/Shoes/shoes_15.png"), [1075, 1294, 1303, 1543]],
  [require("assets/cloth/Shoes/shoes_16.png"), [1075, 1294, 1303, 1543]],
];
const HATS_ART = [
  [require("assets/cloth/Hat/Hat_1.png"), [915, 128, 1466, 783]],
  [require("assets/cloth/Hat/Hat_2.png"), [966, 194, 1410, 419]],
  [require("assets/cloth/Hat/Hat_3.png"), [942, 200, 1393, 627]],
  [require("assets/cloth/Hat/Hat_4.png"), [971, 185, 1384, 386]],
  [require("assets/cloth/Hat/Hat_5.png"), [942, 200, 1393, 627]],
  [require("assets/cloth/Hat/Hat_6.png"), [972, 302, 1389, 436]],
  [require("assets/cloth/Hat/Hat_7.png"), [1004, 106, 1378, 339]],
  [require("assets/cloth/Hat/Hat_8(1).png"), [966, 194, 1410, 419]],
  [require("assets/cloth/Hat/Hat_8.png"), [1004, 106, 1378, 339]],
  [require("assets/cloth/Hat/Hat_9.png"), [971, 185, 1384, 386]],
];
const BAGS_ART = [
  [require("assets/cloth/Backpack/Backpack_1.png"), [1102, 640, 1368, 1021]],
  [require("assets/cloth/Backpack/Backpack_2.png"), [1216, 649, 1311, 912]],
  [require("assets/cloth/Backpack/Backpack_3.png"), [1108, 623, 1324, 1001]],
  [require("assets/cloth/Backpack/Backpack_4.png"), [1108, 623, 1324, 1001]],
  [require("assets/cloth/Backpack/Backpack_5.png"), [1031, 638, 1272, 1043]],
  [require("assets/cloth/Backpack/Backpack_6.png"), [1216, 649, 1311, 912]],
  [require("assets/cloth/Backpack/Backpack_7.png"), [1031, 638, 1272, 1043]],
  [require("assets/cloth/Backpack/Backpack_8.png"), [1102, 640, 1368, 1021]],
];

const PRICE = 50;

// First item of each category is free (starter); the rest cost PRICE.
function makeItems(art, { prefix, slot, category, name }) {
  return art.map(([image, box], i) => ({
    id: `${prefix}_${i + 1}`,
    slot,
    category,
    name: `${name} ${i + 1}`,
    price: i === 0 ? 0 : PRICE,
    image,
    thumb: thumbAround(...box),
  }));
}

export const ITEMS = [
  ...makeItems(HAIR_ART, { prefix: "hair", slot: "hair", category: "hair", name: "ทรงผม" }),
  ...makeItems(SHIRTS_ART, { prefix: "shirt", slot: "top", category: "top", name: "เสื้อ" }),
  ...makeItems(PANTS_ART, { prefix: "pants", slot: "bottom", category: "pants", name: "กางเกง" }),
  ...makeItems(SKIRTS_ART, { prefix: "skirt", slot: "bottom", category: "skirt", name: "กระโปรง" }),
  ...makeItems(SHOES_ART, { prefix: "shoes", slot: "shoes", category: "shoes", name: "รองเท้า" }),
  ...makeItems(HATS_ART, { prefix: "hat", slot: "hat", category: "hat", name: "หมวก" }),
  ...makeItems(BAGS_ART, { prefix: "bag", slot: "bag", category: "bag", name: "กระเป๋า" }),
];

export const ITEMS_BY_ID = Object.fromEntries(ITEMS.map((item) => [item.id, item]));
