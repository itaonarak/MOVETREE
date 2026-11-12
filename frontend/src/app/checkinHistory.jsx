
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { CheckinCalendar } from "@/components/CheckinCalendar";
import { IconComponent } from "@/components/IconComponent";
import { apiRequest } from "@/services/api";

const CheckinHistory = () => {
  const [calendarDatabase, setCalendarDatabase] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/profile");
    }
  }

  const loadCheckinHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/checkins/");

      const checkins = data.checkins ?? [];
      const calendarData = {};

      checkins.forEach((checkin) => {
        const dateValue =
          checkin.checked_in_at || checkin.created_at;

        if (!dateValue) return;

        // Convert timestamp to local YYYY-MM-DD.
        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) return;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const dateKey = `${year}-${month}-${day}`;

        // Keep the newest check-in image for each day.
        if (!calendarData[dateKey]) {
          calendarData[dateKey] = {
            checkedIn: true,
            image: checkin.photo_url
              ? { uri: checkin.photo_url }
              : null,
          };
        }
      });

      setCalendarDatabase(calendarData);
    } catch (err) {
      console.error("Load check-in history error:", err);
      setError(err.message || "ไม่สามารถโหลดประวัติเช็คอินได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCheckinHistory();
  }, [loadCheckinHistory]);

  return (
    <Screen>
      {/* Header */}
      <View
        className="h-14 flex-row items-center"
        style={{ justifyContent: "space-between" }}
      >
        <Pressable onPress={goBack} hitSlop={10}>
          <IconComponent
            source={require("assets/icon/header/back_normal.svg")}
            style={styles.headerIcon}
          />
        </Pressable>

        <Text style={styles.headerText}>ประวัติเช็คอิน</Text>

        <View style={styles.headerIcon} />
      </View>

      {/* Content */}
      <View className="flex-1 bg-sage-light">
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#526D50" />
            <Text style={styles.messageText}>
              กำลังโหลดประวัติเช็คอิน...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>

            <Pressable
              onPress={loadCheckinHistory}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>ลองอีกครั้ง</Text>
            </Pressable>
          </View>
        ) : (
          <CheckinCalendar
            customMarkedDates={calendarDatabase}
          />
        )}
      </View>
    </Screen>
  );
};

export default CheckinHistory;

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

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  messageText: {
    marginTop: 12,
    fontFamily: "BaiJamjuree_400Regular",
    color: "#526D50",
    fontSize: 14,
  },

  errorText: {
    fontFamily: "BaiJamjuree_400Regular",
    color: "#B91C1C",
    fontSize: 14,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 16,
    backgroundColor: "#526D50",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontFamily: "BaiJamjuree_600SemiBold",
  },
});
