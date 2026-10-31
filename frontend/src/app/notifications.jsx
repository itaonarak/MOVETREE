// 3. NOTIFICATION PAGE  (route: "/notifications")
import { useMemo, useState } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";

// Sample data — replace with data from your backend later
const SAMPLE = [
  {
    id: "1",
    icon: "person-add",
    color: "bg-brand",
    title: "Welcome aboard!",
    body: "Your account was created successfully.",
    time: "2m",
    day: "Today",
    read: false,
  },
  {
    id: "2",
    icon: "chatbubble-ellipses",
    color: "bg-accent",
    title: "New message",
    body: 'Ploy sent you a message: "Are we meeting at 3?"',
    time: "1h",
    day: "Today",
    read: false,
  },
  {
    id: "3",
    icon: "calendar",
    color: "bg-sky-600",
    title: "Reminder",
    body: "Project meeting starts in 30 minutes.",
    time: "3h",
    day: "Today",
    read: true,
  },
  {
    id: "4",
    icon: "heart",
    color: "bg-rose-500",
    title: "Someone liked your post",
    body: "Nat and 4 others liked your update.",
    time: "Yesterday",
    day: "Earlier",
    read: false,
  },
  {
    id: "5",
    icon: "shield-checkmark",
    color: "bg-ink-soft",
    title: "Security alert",
    body: "New login from Chrome on Windows.",
    time: "2d",
    day: "Earlier",
    read: true,
  },
  {
    id: "6",
    icon: "gift",
    color: "bg-amber-500",
    title: "You earned a badge",
    body: "Thanks for completing your profile!",
    time: "5d",
    day: "Earlier",
    read: true,
  },
];

export default function NotificationsScreen() {
  const [items, setItems] = useState(SAMPLE);
  const [tab, setTab] = useState("all");

  const unreadCount = items.filter((n) => !n.read).length;

  const sections = useMemo(() => {
    const visible = tab === "all" ? items : items.filter((n) => !n.read);
    return ["Today", "Earlier"]
      .map((day) => ({
        title: day,
        data: visible.filter((n) => n.day === day),
      }))
      .filter((s) => s.data.length > 0);
  }, [items, tab]);

  const markRead = (id) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-2 pt-4">
        <Pressable
          onPress={() => router.replace("/")}
          className="h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <Ionicons name="log-out-outline" size={20} color="#1C1B1F" />
        </Pressable>
        <Pressable onPress={markAllRead} disabled={unreadCount === 0}>
          <Text
            className={`text-sm font-semibold ${unreadCount ? "text-brand" : "text-ink-faint"}`}
          >
            Mark all read
          </Text>
        </Pressable>
      </View>

      <View className="px-6">
        <Text className="text-3xl text-ink font-bold">Notifications</Text>

        {/* Tabs */}
        <View className="mb-2 mt-5 flex-row rounded-2xl bg-white p-1">
          {["all", "unread"].map((t) => {
            const active = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                className={`h-10 flex-1 flex-row items-center justify-center rounded-xl ${active ? "bg-brand" : ""}`}
              >
                <Text
                  className={`font-semibold ${active ? "text-white" : "text-ink-soft"}`}
                >
                  {t === "all" ? "All" : "Unread"}
                </Text>
                {t === "unread" && unreadCount > 0 && (
                  <View className="ml-2 h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5">
                    <Text className="text-xs text-white font-bold">
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text className="mb-2 mt-5 text-xs uppercase tracking-widest text-ink-faint font-bold">
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => markRead(item.id)}
            className={`mb-2 flex-row rounded-2xl p-4 active:opacity-80 ${item.read ? "bg-white/60" : "bg-white"}`}
          >
            <View
              className={`h-11 w-11 items-center justify-center rounded-full ${item.color}`}
            >
              <Ionicons name={item.icon} size={20} color="#fff" />
            </View>
            <View className="ml-3 flex-1">
              <View className="flex-row items-center justify-between">
                <Text
                  className={`flex-1 text-base ${item.read ? "text-ink-soft font-medium" : "text-ink font-bold"}`}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text className="ml-2 text-xs text-ink-faint font-normal">
                  {item.time}
                </Text>
              </View>
              <Text
                className="mt-0.5 text-sm leading-5 text-ink-soft font-normal"
                numberOfLines={2}
              >
                {item.body}
              </Text>
            </View>
            {!item.read && (
              <View className="ml-2 mt-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="mt-20 items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-brand-light">
              <Ionicons
                name="notifications-off-outline"
                size={28}
                color="#3E513B"
              />
            </View>
            <Text className="text-lg text-ink font-semibold">
              You're all caught up
            </Text>
            <Text className="mt-1 text-sm text-ink-soft font-normal">
              No unread notifications
            </Text>
          </View>
        }
      />
    </Screen>
  );
}
