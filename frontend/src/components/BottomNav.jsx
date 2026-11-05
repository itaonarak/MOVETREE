import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Icons from assets/icon/feed. NOTE: the exported file names don't match their
// contents (they're shifted), so each entry is mapped by what the SVG actually draws:
// `normal` = outline icon, `active` = filled icon for the current page.
const TABS = [
  {
    key: "home",
    normal: require("assets/icon/feed/home2_active.svg"), // outline house
    active: require("assets/icon/feed/profile1_normal.svg"), // filled house
  },
  {
    key: "camera",
    normal: require("assets/icon/feed/camera2,_active.svg"), // outline camera
    active: require("assets/icon/feed/home1_normal.svg"), // filled camera
  },
  {
    key: "tasks",
    normal: require("assets/icon/feed/task2_active.svg"), // outline clipboard
    active: require("assets/icon/feed/friends2_active.svg"), // filled clipboard
  },
  {
    key: "profile",
    normal: require("assets/icon/feed/profile2_active.svg"), // outline person circle
    active: require("assets/icon/feed/bell1_normal.svg"), // filled person circle
  },
];

// Floating menu bar pinned to the bottom of the screen.
// `transparent` (used on the feed) lets the posts show through the bar.
export function BottomNav({ active, onPress, transparent = false }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="absolute left-14 right-14 h-12 flex-row items-center justify-around rounded-2xl"
      style={{
        bottom: insets.bottom + 16,
        // Android draws elevation shadows *through* translucent views as a dark
        // smudge, so the transparent variant drops the shadow.
        elevation: transparent ? 0 : 6,
        shadowColor: "#000",
        shadowOpacity: transparent ? 0 : 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        backgroundColor: transparent ? "rgba(143, 160, 125, 0.55)" : "rgb(143, 160, 125)",
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onPress(tab.key)}
            hitSlop={10}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.key}
            className="h-10 w-10 items-center justify-center"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Image
              source={isActive ? tab.active : tab.normal}
              style={{ width: 24, height: 24 }}
              contentFit="contain"
            />
          </Pressable>
        );
      })}
    </View>
  );
}
