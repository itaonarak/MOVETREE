// 3. NOTIFICATION PAGE  (route: "/notifications")
// Unread rows are darker. Tapping a row marks it as read (brighter row, faded
// content) and opens: mission -> /Camera, friend request -> /friendsList (request tab)
import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";

const ICONS = {
  back: require("assets/icon/notification/back_normal.svg"),
  mission: require("assets/icon/notification/task1_normal.svg"),
  friend: require("assets/icon/notification/friends1_normal.svg"),
};

// Kept outside the component so read state survives leaving and re-opening the page.
// LATER: load from the backend; keep the same shape.
let notificationStore = [
  { id: "1", type: "mission", read: false },
  { id: "2", type: "mission", read: false },
  { id: "3", type: "mission", read: false },
  { id: "4", type: "friend", from: "วอดส์", read: false },
  { id: "5", type: "friend", from: "วอดส์", read: false },
  { id: "6", type: "mission", read: false },
  { id: "7", type: "friend", from: "วอดส์", read: false },
  { id: "8", type: "mission", read: true },
  { id: "9", type: "mission", read: true },
  { id: "10", type: "mission", read: true },
  { id: "11", type: "friend", from: "วอดส์", read: true },
  { id: "12", type: "friend", from: "วอดส์", read: true },
  { id: "13", type: "mission", read: true },
  { id: "14", type: "friend", from: "วอดส์", read: true },
];

function messageFor(item) {
  if (item.type === "friend") return `${item.from} ได้ส่งคำขอเป็นเพื่อนถึงคุณ`;
  return "ภารกิจใหม่มาแล้ว!";
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(notificationStore);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/feed");
  }

  function openNotification(item) {
    notificationStore = notificationStore.map((n) =>
      n.id === item.id ? { ...n, read: true } : n,
    );
    setNotifications(notificationStore);

    if (item.type === "friend") {
      router.push({ pathname: "/friendsList", params: { tab: "pending" } });
    } else {
      router.push("/Camera");
    }
  }

  return (
    <Screen>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={10} style={styles.backButton}>
          <Image source={ICONS.back} style={styles.headerIcon} />
        </Pressable>
        <Text style={styles.headerText}>การแจ้งเตือน</Text>
      </View>
      {/* end of header */}

      <FlatList
        style={styles.list}
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openNotification(item)}
            style={[styles.row, item.read ? styles.rowRead : styles.rowUnread]}
          >
            <View style={[styles.rowContent, item.read && styles.contentRead]}>
              <Image source={ICONS[item.type]} style={styles.rowIcon} />
              <Text style={styles.rowText} numberOfLines={1}>
                {messageFor(item)}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 24,
    zIndex: 1,
  },
  headerIcon: {
    tintColor: "#E8F5E9",
    width: 24,
    height: 24,
  },
  headerText: {
    fontSize: 24,
    lineHeight: 36,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "#E8F5E9",
  },
  list: {
    flex: 1,
    backgroundColor: "#A9B99B",
  },
  row: {
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 32,
    borderBottomWidth: 2,
    borderBottomColor: "#B5C4A8",
  },
  // not yet visited: darker
  rowUnread: {
    backgroundColor: "#8A9E7A",
  },
  // clicked/visited: brighter
  rowRead: {
    backgroundColor: "#A9B99B",
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contentRead: {
    opacity: 0.45,
  },
  rowIcon: {
    tintColor: "#1F2A1F",
    width: 24,
    height: 24,
  },
  rowText: {
    flexShrink: 1,
    fontSize: 17,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "#1F2A1F",
  },
});
