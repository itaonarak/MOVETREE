
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { PostCard } from "@/components/PostCard";
import { BottomNav } from "@/components/BottomNav";
import { Logo } from "@/components/Logo";
import { apiRequest } from "@/services/api";

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

    if (tab === "profile") {
      router.push("/profile");
      return;
    }
  }

  return (
    <Screen padBottom={false}>
      <View className="h-14 flex-row items-center justify-between px-5">
        <Pressable hitSlop={10}>
          <Ionicons name="location-outline" size={24} color="#E8F5E9" />
        </Pressable>

        <Logo height={30} />

        <Pressable
          onPress={() => router.push("/notifications")}
          hitSlop={10}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color="#E8F5E9"
          />
        </Pressable>
      </View>

      <View className="flex-1 bg-sage-light">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text>Loading posts...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-5">
            <Text className="text-center text-ink">{error}</Text>
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
                <Text className="text-ink-soft">
                  No posts yet
                </Text>
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

        <BottomNav active="home" onPress={handleTab} />
      </View>
    </Screen>
  );
}
