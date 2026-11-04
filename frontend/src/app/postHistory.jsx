import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { PostCard } from "@/components/PostCard";
import { BottomNav } from "@/components/BottomNav";
import { Logo } from "@/components/Logo";

const postHistory = () => {
  const insets = useSafeAreaInsets();

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }
  // Sample data — replace with data from your backend later
  const SAMPLE = Array.from({ length: 6 }, (_, i) => ({
    id: String(i + 1),
    username: "วอดล์1",
    location: "ต้นจามจุรี",
    image: `https://picsum.photos/seed/movetree${i}/800/600`,
    caption: "บรรยากาศดีมาก สงบร่มรื่น",
    time: "10 ต.ค. 10:00 น.",
  }));

  return (
    <Screen padBottom={false}>
      {/* header */}
      <View
        className="h-14 flex-row items-center px-5"
        style={{ justifyContent: "space-between" }}
      >
        <Pressable onPress={goBack} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#E8F5E9" />
        </Pressable>
        <Text style={styles.headerText}>ประวัติโพสต์</Text>
      </View>
      {/* end of header */}

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
      </View>
    </Screen>
  );
};

export default postHistory;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    lineHeight: 36,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "rgb(232, 245, 233)",
    position: "absolute",
    right: "50%",
    transform: "translateX(50%)",
  },
});
