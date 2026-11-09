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
// Body occupies ~x 991-1373, y 221-1506; padded so hats/shoes/bags fit.
export const AVATAR_VIEW = { x: 880, y: 120, width: 600, height: 1460 };
// Kept for older callers: aspect ratio of the visible avatar.
export const AVATAR_SIZE = { width: AVATAR_VIEW.width, height: AVATAR_VIEW.height };

// Layers: array order = draw order (bottom -> top). An item's `slot` decides
// which layer it replaces (only one item per slot can be worn).
export const SLOTS = [
  { key: "shoes" },
  { key: "bottom" }, // pants and skirts share this layer
  { key: "top" },
  { key: "bag" },
  { key: "hat" },
];

// Shop tabs. "owned" is special: shows every bought item.
export const TABS = [
  { key: "owned", label: "ซื้อแล้ว" },
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

// --- shoes (real artwork) ---------------------------------------------------
const SHOE_IMAGES = [
  require("assets/cloth/shoes/shoes_1.png"),
  require("assets/cloth/shoes/shoes_2.png"),
  require("assets/cloth/shoes/shoes_3.png"),
  require("assets/cloth/shoes/shoes_4.png"),
  require("assets/cloth/shoes/shoes_5.png"),
  require("assets/cloth/shoes/shoes_6.png"),
  require("assets/cloth/shoes/shoes_7.png"),
  require("assets/cloth/shoes/shoes_8.png"),
  require("assets/cloth/shoes/shoes_9.png"),
  require("assets/cloth/shoes/shoes_10.png"),
  require("assets/cloth/shoes/shoes_11.png"),
  require("assets/cloth/shoes/shoes_12.png"),
  require("assets/cloth/shoes/shoes_13.png"),
  require("assets/cloth/shoes/shoes_14.png"),
  require("assets/cloth/shoes/shoes_15.png"),
  require("assets/cloth/shoes/shoes_16.png"),
];
// Opaque bounding boxes of the shoe PNGs (sandals / sneakers / boots / tall boots)
const SHOE_BOXES = [
  [1091, 1464, 1271, 1520], [1091, 1464, 1271, 1520], [1091, 1464, 1271, 1520], [1091, 1464, 1271, 1520],
  [1079, 1345, 1293, 1506], [1058, 1258, 1307, 1508], [1079, 1345, 1293, 1506], [1079, 1345, 1293, 1506],
  [1058, 1258, 1307, 1508], [1058, 1258, 1307, 1508], [1058, 1258, 1307, 1508], [1079, 1345, 1293, 1506],
  [1075, 1294, 1302, 1542], [1075, 1294, 1302, 1542], [1075, 1294, 1302, 1542], [1075, 1294, 1302, 1542],
];
const SHOES = SHOE_IMAGES.map((image, i) => ({
  id: `shoes_${i + 1}`,
  slot: "shoes",
  category: "shoes",
  name: `รองเท้า ${i + 1}`,
  price: i === 0 ? 0 : 50 + i * 10, // first pair is free (starter)
  color: "#8B6B55",
  image,
  thumb: thumbAround(...SHOE_BOXES[i]),
}));

export const ITEMS = [...SHOES];

export const ITEMS_BY_ID = Object.fromEntries(ITEMS.map((item) => [item.id, item]));
