import { Pressable, Text } from "react-native";

export function Button({ title, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="h-11 items-center justify-center self-center rounded-xl bg-sage px-4 active:opacity-80"
      style={{ elevation: 4 }}
    >
      <Text className="text-base text-white font-semibold">{title}</Text>
    </Pressable>
  );
}
