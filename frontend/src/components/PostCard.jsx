import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function PostCard({ post }) {
  const [liked, setLiked] = useState(false);

  return (
    <View className="mb-4">
      {/* Author */}
      <View className="mb-1 flex-row items-center px-4">
        <Ionicons name="person-circle" size={28} color="#1C1B1F" />
        <View className="ml-1">
          <Text className="text-base leading-5 text-ink font-bold">
            {post.username}
          </Text>
          <Text className="text-[10px] leading-3 text-ink-soft font-normal">
            {post.location}
          </Text>
        </View>
      </View>

      <Image
        source={{ uri: post.image }}
        className="aspect-[4/3] w-full bg-line"
        resizeMode="cover"
      />

      {/* Actions + caption */}
      <View className="px-4 pt-2">
        <Pressable
          onPress={() => setLiked(!liked)}
          hitSlop={10}
          className="self-start"
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={26}
            color={liked ? "#E0533F" : "#1C1B1F"}
          />
        </Pressable>
        <Text className="mt-1 text-sm text-ink font-normal">
          {post.caption}
        </Text>
        <Text className="text-[10px] text-ink-soft font-normal">
          {post.time}
        </Text>
      </View>
    </View>
  );
}
