// Wardrobe catalog for the dress-up feature.
//
// HOW LAYERING WORKS
// The avatar is a stack of same-size transparent images drawn on top of each
// other: base body first, then one image per slot in SLOTS order. For this to
// line up, every clothing PNG must be exported on the SAME artboard as the base
// body (currently 163x330, see AVATAR_SIZE) with a transparent background and
// the garment already positioned where it sits on the body. Then no per-item
// x/y offsets are needed — every layer is simply drawn full-size.
//
// ADDING ARTWORK
// Drop files in assets/get_dress/cloth/ and set `image` on the item, e.g.
//   image: require("assets/get_dress/cloth/top_green_shirt.png"),
// Items with `image: null` are placeholders: they can be bought/equipped and
// are shown as a colour swatch in the shop, but draw nothing on the avatar.
//
// LATER: this list (prices, ownership, equipped outfit, coins) should come from
// the backend; keep the same shape so screens don't need to change.

export const AVATAR_BASE = require("assets/profile/demo.png");
export const AVATAR_SIZE = { width: 163, height: 330 };

// Array order = draw order (bottom -> top). `label` is shown as a tab.
export const SLOTS = [
  { key: "bottom", label: "กางเกง" },
  { key: "shoes", label: "รองเท้า" },
  { key: "top", label: "เสื้อ" },
  { key: "hair", label: "ทรงผม" },
  { key: "accessory", label: "เครื่องประดับ" },
];

export const ITEMS = [
  // hair
  { id: "hair_short", slot: "hair", name: "ผมสั้น", price: 0, color: "#F3E3A1", image: null },
  { id: "hair_long", slot: "hair", name: "ผมยาว", price: 60, color: "#8B5E3C", image: null },
  { id: "hair_bun", slot: "hair", name: "ผมมวย", price: 80, color: "#2E2A26", image: null },
  // top
  { id: "top_tshirt", slot: "top", name: "เสื้อยืด", price: 0, color: "#FFFFFF", image: null },
  { id: "top_leaf", slot: "top", name: "เสื้อใบไม้", price: 120, color: "#5C7A4A", image: null },
  { id: "top_jacket", slot: "top", name: "แจ็กเก็ต", price: 200, color: "#3E513B", image: null },
  // bottom
  { id: "bottom_shorts", slot: "bottom", name: "กางเกงขาสั้น", price: 0, color: "#6B5B4B", image: null },
  { id: "bottom_skirt", slot: "bottom", name: "กระโปรง", price: 90, color: "#4A3B2E", image: null },
  { id: "bottom_jeans", slot: "bottom", name: "ยีนส์", price: 150, color: "#3B5A7A", image: null },
  // shoes
  { id: "shoes_sneaker", slot: "shoes", name: "ผ้าใบ", price: 0, color: "#EDEDED", image: null },
  { id: "shoes_boots", slot: "shoes", name: "บูท", price: 110, color: "#3A2A20", image: null },
  // accessory
  { id: "acc_bow", slot: "accessory", name: "โบว์", price: 40, color: "#C9A0A0", image: null },
  { id: "acc_hat", slot: "accessory", name: "หมวกสาน", price: 100, color: "#D8B878", image: null },
  { id: "acc_leaf", slot: "accessory", name: "ใบไม้ติดผม", price: 70, color: "#7FA36A", image: null },
];

export const ITEMS_BY_ID = Object.fromEntries(ITEMS.map((item) => [item.id, item]));
