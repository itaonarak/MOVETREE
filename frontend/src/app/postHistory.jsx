import { useEffect, useState } from "react";
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
import { apiRequest } from "@/services/api";
import { IconComponent } from "@/components/IconComponent";

const PostHistory = () => {
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  async function fetchPosts(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await apiRequest("/posts/my-posts");

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
      setError(err.message || "Failed to load post history");
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

  return (
    <Screen padBottom={false}>
      {/* header */}
      <View
        className="h-14 flex-row items-center"
        style={{ justifyContent: "space-between" }}
      >
        <Pressable onPress={goBack} hitSlop={10}>
          <IconComponent
            source={require("assets/icon/header/back_normal.svg")}
            style={styles.headerIcon}
          ></IconComponent>
        </Pressable>
        <Text style={styles.headerText}>ประวัติโพสต์</Text>
      </View>
      {/* end of header */}

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
            keyExtractor={(post) => post.id}
            renderItem={({ item }) => <PostCard post={item} />}
            ListHeaderComponent={
              <View className="items-center pb-1">
                <Ionicons name="caret-down" size={14} color="#8A9E7A" />
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
      </View>
    </Screen>
  );
};

export default PostHistory;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    lineHeight: 36,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "rgb(232, 245, 233)",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
  headerIcon: {
    tintColor: "#E8F5E9",
    width: 24,
    height: 24,
    marginLeft: 20,
  },
});
