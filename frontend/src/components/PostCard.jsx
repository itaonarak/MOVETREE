import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

// assets/icon/feed file names don't match their drawings — mapped by content.
const icons = {
  author: require("assets/icon/feed/profile2_active.svg"), // outline person circle
  public: require("assets/icon/feed/bell2_active.svg"), // globe = public post
  heart: require("assets/icon/feed/location_normal.svg"), // outline heart
  heartFilled: require("assets/icon/feed/profile2_active (1).svg"), // filled heart
};

export function PostCard({ post }) {
  const [liked, setLiked] = useState(false);

  return (
    <View className="mb-4">
      {/* Author */}
      <View className="mb-1 flex-row items-center px-3">
        <Image source={icons.author} style={{ width: 26, height: 26 }} contentFit="contain" />
        <View className="ml-1">
          <View className="flex-row items-center">
            <Text className="text-base leading-5 text-ink font-bold">{post.username}</Text>
            <Image
              source={icons.public}
              style={{ width: 12, height: 12, marginLeft: 4 }}
              contentFit="contain"
            />
          </View>
          {!!post.location && (
            <Text className="text-[10px] leading-3 text-ink-soft font-normal">
              {post.location}
            </Text>
          )}
        </View>
      </View>

      <Image
        source={post.image ? { uri: post.image } : null}
        style={{ width: "100%", aspectRatio: 4 / 3, backgroundColor: "#D3E3D4" }}
        contentFit="cover"
        transition={150}
      />

      {/* Actions + caption */}
      <View className="px-3 pt-2">
        <Pressable
          onPress={() => setLiked((v) => !v)}
          hitSlop={10}
          className="self-start"
          accessibilityRole="button"
          accessibilityState={{ selected: liked }}
          accessibilityLabel="like"
        >
          <Image
            source={liked ? icons.heartFilled : icons.heart}
            style={{ width: 26, height: 26 }}
            contentFit="contain"
            tintColor={liked ? "#E0533F" : undefined}
          />
        </Pressable>
        {!!post.caption && (
          <Text className="mt-1 text-sm text-ink font-normal">{post.caption}</Text>
        )}
        <Text className="text-[10px] text-ink-soft font-normal">{post.time}</Text>
      </View>
    </View>
  );
}
