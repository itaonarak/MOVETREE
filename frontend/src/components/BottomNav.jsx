import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = [
  { key: "home", icon: "home" },
  { key: "camera", icon: "camera-outline" },
  { key: "tasks", icon: "clipboard-outline" },
  { key: "profile", icon: "person-circle-outline" },
];

// Floating menu bar pinned to the bottom of the screen.
export function BottomNav({ active, onPress }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="absolute left-10 right-10 h-14 flex-row items-center justify-around rounded-2xl bg-sage-light/80"
      style={{ bottom: insets.bottom + 16, elevation: 6 }}
    >
      {TABS.map(({ key, icon }) => (
        <Pressable
          key={key}
          onPress={() => onPress(key)}
          hitSlop={10}
          className={`h-10 w-10 items-center justify-center rounded-xl ${active === key ? "bg-white/60" : ""}`}
        >
          <Ionicons name={icon} size={24} color="#3E513B" />
        </Pressable>
      ))}
    </View>
  );
}
