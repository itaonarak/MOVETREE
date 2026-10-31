import { Image } from "expo-image";

const LOGO = require("../../assets/icon/logo.png");
const RATIO = 1731 / 372; // width / height of logo-cropped.png

// MoveTree wordmark (white). Pass the height you want; width follows the ratio.
export function Logo({ height = 40 }) {
  return (
    <Image
      source={LOGO}
      style={{ height, width: height * RATIO }}
      contentFit="contain"
    />
  );
}
