// 3. NOTIFICATION PAGE  (route: "/notifications")
// TODO: blank for now — build the notification list here
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";

export default function NotificationsScreen() {
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/feed");
  }

  return (
    <Screen>
      <View className="h-14 flex-row items-center px-5">
        <Pressable onPress={goBack} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#E8F5E9" />
        </Pressable>
      </View>
      <View className="flex-1 bg-sage-light" />
    </Screen>
  );
}
