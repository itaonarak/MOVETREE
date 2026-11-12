
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Screen } from "@/components/Screen";
import { apiRequest } from "@/services/api";

const ICONS = {
  back: require("assets/icon/notification/back_normal.svg"),
  mission: require("assets/icon/notification/task1_normal.svg"),
  friend: require("assets/icon/notification/friends1_normal.svg"),
};

function getNotificationIcon(type) {
  if (type === "friend_request" || type === "friend_accepted" || type === "friend") {
    return ICONS.friend;
  }

  return ICONS.mission;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter(
    (item) => !item.is_read,
  ).length;

  // Load notifications from backend.
  const loadNotifications = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await apiRequest("/notifications/");

      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Load notifications error:", err);
      setError(err.message || "ไม่สามารถโหลดการแจ้งเตือนได้");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload whenever this screen becomes active.
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications]),
  );

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/feed");
    }
  }

  // Open notification and mark it as read.
  async function openNotification(item) {
    if (!item.is_read) {
      try {
        await apiRequest(
          `/notifications/${item.notification_id}/read`,
          { method: "PATCH" },
        );

        setNotifications((previous) =>
          previous.map((notification) =>
            notification.notification_id === item.notification_id
              ? { ...notification, is_read: true }
              : notification,
          ),
        );
      } catch (err) {
        console.error("Mark notification as read error:", err);
        setError(err.message || "ไม่สามารถอัปเดตการแจ้งเตือนได้");
        return;
      }
    }

    if (item.type === "friend_request") {
      router.push({
        pathname: "/friendsList",
        params: { tab: "pending" },
      });
    } else if (item.type === "friend_accepted") {
      router.push("/friendsList");
    } else {
      router.push("/Camera");
    }
  }

  // Mark all notifications as read.
  async function markAllAsRead() {
    if (unreadCount === 0 || markingAll) return;

    try {
      setMarkingAll(true);

      await apiRequest("/notifications/read-all", {
        method: "PATCH",
      });

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          is_read: true,
        })),
      );
    } catch (err) {
      console.error("Mark all notifications as read error:", err);
      setError(err.message || "ไม่สามารถอ่านการแจ้งเตือนทั้งหมดได้");
    } finally {
      setMarkingAll(false);
    }
  }

  function renderNotification({ item }) {
    return (
      <Pressable
        onPress={() => openNotification(item)}
        style={[
          styles.row,
          item.is_read ? styles.rowRead : styles.rowUnread,
        ]}
      >
        <View
          style={[
            styles.rowContent,
            item.is_read && styles.contentRead,
          ]}
        >
          <Image
            source={getNotificationIcon(item.type)}
            style={styles.rowIcon}
          />

          <View style={styles.messageContainer}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {item.title}
            </Text>

            <Text style={styles.rowText} numberOfLines={2}>
              {item.message}
            </Text>
          </View>

          {!item.is_read && <View style={styles.unreadDot} />}
        </View>
      </Pressable>
    );
  }

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          hitSlop={10}
          style={styles.backButton}
        >
          <Image source={ICONS.back} style={styles.headerIcon} />
        </Pressable>

        <Text style={styles.headerText}>การแจ้งเตือน</Text>
      </View>

      {/* Unread count and mark all */}
      <View style={styles.actionRow}>
        <Text style={styles.unreadLabel}>
          ยังไม่อ่าน {unreadCount} รายการ
        </Text>

        <Pressable
          onPress={markAllAsRead}
          disabled={unreadCount === 0 || markingAll}
        >
          <Text
            style={[
              styles.markAllText,
              unreadCount === 0 && styles.disabledText,
            ]}
          >
            {markingAll ? "กำลังอัปเดต..." : "อ่านทั้งหมด"}
          </Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable onPress={() => loadNotifications()}>
            <Text style={styles.retryText}>ลองอีกครั้ง</Text>
          </Pressable>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E8F5E9" />
          <Text style={styles.statusText}>กำลังโหลดการแจ้งเตือน...</Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={notifications}
          keyExtractor={(item) => item.notification_id}
          renderItem={renderNotification}
          refreshing={refreshing}
          onRefresh={() => loadNotifications(true)}
          contentContainerStyle={
            notifications.length === 0 ? styles.emptyList : undefined
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                ยังไม่มีการแจ้งเตือน
              </Text>
            </View>
          }
        />
      )}
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
  actionRow: {
    height: 42,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#A9B99B",
  },
  unreadLabel: {
    fontSize: 14,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "#1F2A1F",
  },
  markAllText: {
    fontSize: 14,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "#315C35",
  },
  disabledText: {
    opacity: 0.4,
  },
  list: {
    flex: 1,
    backgroundColor: "#A9B99B",
  },
  row: {
    minHeight: 68,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#B5C4A8",
  },
  rowUnread: {
    backgroundColor: "#8A9E7A",
  },
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
  messageContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "#1F2A1F",
  },
  rowText: {
    fontSize: 14,
    fontFamily: "BaiJamjuree_500Medium",
    color: "#1F2A1F",
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#315C35",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: "BaiJamjuree_500Medium",
    color: "#E8F5E9",
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "#1F2A1F",
  },
  errorContainer: {
    padding: 10,
    backgroundColor: "#F5D6D6",
    alignItems: "center",
  },
  errorText: {
    fontSize: 13,
    color: "#8B2020",
    fontFamily: "BaiJamjuree_500Medium",
  },
  retryText: {
    marginTop: 4,
    color: "#315C35",
    fontFamily: "BaiJamjuree_600SemiBold",
  },
});
