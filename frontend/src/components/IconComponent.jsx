import { Image } from "expo-image";

export function IconComponent({ source, style = {} }) {
  return <Image source={source} style={style} />;
}
