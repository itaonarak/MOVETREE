
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/Screen";
import { PostCard } from "@/components/PostCard";
import { BottomNav } from "@/components/BottomNav";
import { Logo } from "@/components/Logo";
import { apiRequest } from "@/services/api";

const HEADER_ICONS = {
  location: require("assets/icon/feed/menu2,_active.svg"),
  bell: require("assets/icon/feed/map2_active.svg"),
};

const HEADER_TINT = "#E8F5E9";

export default function FeedScreen() {
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function fetchPosts(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await apiRequest("/posts/feed");

      const formattedPosts = (data.posts || []).map((item) => ({
        id: item.post_id,
        username: item.users?.username ?? "Unknown user",
        location: item.collections?.green_areas?.name ?? "",
        image: item.collections?.image_url ?? null,
        caption: item.caption ?? "",
        time: item.created_at
          ? new Date(item.created_at).toLocaleString("th-TH")
          : "",
      }));

      setPosts(formattedPosts);
    } catch (err) {
      console.log("FETCH FEED ERROR:", err);
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  function handleRefresh() {
    fetchPosts(true);
  }

  function handleTab(tab) {
    if (tab === "home") return;

    if (tab === "camera") {
      router.push("/Camera");
      return;
    }

    if (tab === "tasks") {
      router.push("/mission");
      return;
    }

    if (tab === "profile") {
      router.push("/profile");
      return;
    }
  }

  return (
    <Screen padBottom={false}>
      {/* Header */}
      <View className="h-14 flex-row items-center justify-between px-5">
        <Pressable
          onPress={() => router.push("/map")}
          hitSlop={10}
          accessibilityLabel="location"
        >
          <Image
            source={HEADER_ICONS.location}
            style={{ width: 24, height: 24 }}
            tintColor={HEADER_TINT}
            contentFit="contain"
          />
        </Pressable>

        <Logo height={30} />

        <Pressable
          onPress={() => router.push("/notifications")}
          hitSlop={10}
          accessibilityLabel="notifications"
        >
          <Image
            source={HEADER_ICONS.bell}
            style={{ width: 24, height: 24 }}
            tintColor={HEADER_TINT}
            contentFit="contain"
          />
        </Pressable>
      </View>

      {/* Feed */}
      <View className="flex-1 bg-sage-light">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text>Loading posts...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-5">
            <Text className="text-center text-ink">{error}</Text>
            <Pressable onPress={() => fetchPosts()} className="mt-4">
              <Text className="font-semibold text-brand">ลองอีกครั้ง</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostCard post={item} />}
            ListHeaderComponent={
              <View className="items-center pb-1">
                <Ionicons
                  name="caret-down"
                  size={14}
                  color="#8A9E7A"
                />
              </View>
            }
            ListEmptyComponent={
              <View className="items-center py-10">
                <Text className="text-ink-soft">No posts yet</Text>
              </View>
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 96,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}

        <BottomNav active="home" onPress={handleTab} transparent />
      </View>
    </Screen>
  );
}
