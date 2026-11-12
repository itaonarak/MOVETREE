
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { MissionStatus } from "@/components/MissionStatus";
import { IconComponent } from "@/components/IconComponent";
import { apiRequest } from "@/services/api";

const MissionHistory = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  const fetchMissions = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const result = await apiRequest("/missions/progress");

      setMissions(result?.missions || []);
    } catch (e) {
      console.log("FETCH MISSION PROGRESS ERROR:", e);
      setError(e.message || "ไม่สามารถโหลดข้อมูลภารกิจได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const completedMissions = missions.filter(
    (item) => item.completed === true
  );

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

        <Text style={styles.headerText}>ประวัติภารกิจ</Text>
      </View>

      {/* Mission history */}
      <View className="flex-1 bg-sage-light">
        {loading ? (
          <Text style={styles.messageText}>
            กำลังโหลดภารกิจ...
          </Text>
        ) : error ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{error}</Text>

            <Pressable onPress={fetchMissions}>
              <Text style={styles.retryText}>ลองอีกครั้ง</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={completedMissions}
            keyExtractor={(item) => item.mission_id}
            renderItem={({ item }) => (
              <MissionStatus
                taskID={item.mission_id}
                maxAttempts={item.required_count}
                completedAttempts={item.completed_attempts}
                taskDetail={item.title}
                reward={item.points}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.messageText}>
                ยังไม่มีภารกิจที่ทำสำเร็จ
              </Text>
            }
          />
        )}
      </View>
    </Screen>
  );
};

export default MissionHistory;

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
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
  headerIcon: {
    tintColor: "#E8F5E9",
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  messageContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  messageText: {
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
  },
  retryText: {
    fontFamily: "BaiJamjuree_600SemiBold",
    fontSize: 16,
    marginTop: 12,
    color: "#477A52",
  },
});
