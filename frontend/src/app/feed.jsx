// 4. FEED PAGE  (route: "/feed") — shown after login
import { FlatList, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { PostCard } from "@/components/Post";
import { BottomNav } from "@/components/BottomNav";
import { Logo } from "@/components/Logo";

// Sample data — replace with data from your backend later
const SAMPLE = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  username: "วอดล์1",
  location: "ต้นจามจุรี",
  image: `https://picsum.photos/seed/movetree${i}/800/600`,
  caption: "บรรยากาศดีมาก สงบร่มรื่น",
  time: "10 ต.ค. 10:00 น.",
}));

export default function FeedScreen() {
  const insets = useSafeAreaInsets();

  function handleTab(tab) {
    // TODO: navigate to camera / tasks / profile pages once they exist
    if (tab === "home") return;
  }

  return (
    <Screen padBottom={false}>
      {/* Header */}
      <View className="h-14 flex-row items-center justify-between px-5">
        <Pressable hitSlop={10}>
          <Ionicons name="location-outline" size={24} color="#E8F5E9" />
        </Pressable>
        <Logo height={30} />
        <Pressable onPress={() => router.push("/notifications")} hitSlop={10}>
          <Ionicons name="notifications-outline" size={24} color="#E8F5E9" />
        </Pressable>
      </View>

      <View className="flex-1 bg-sage-light">
        <FlatList
          data={SAMPLE}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => <PostCard post={item} />}
          ListHeaderComponent={
            <View className="items-center pb-1">
              <Ionicons name="caret-down" size={14} color="#8A9E7A" />
            </View>
          }
          // leave room so the last post isn't hidden behind the bottom bar
          contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
          showsVerticalScrollIndicator={false}
        />
        <BottomNav active="home" onPress={handleTab} />
      </View>
    </Screen>
  );
}
