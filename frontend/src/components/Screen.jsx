import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export function Screen({ children, bg = "bg-brand", padBottom = true }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 items-center bg-line/40">
      <View
        className={`w-full max-w-[430px] flex-1 ${bg}`}
        style={{
          paddingTop: insets.top,
          paddingBottom: padBottom ? insets.bottom : 0,
        }}
      >
        {children}
      </View>
    </View>
  );
}
