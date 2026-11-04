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
import { MissionStatus } from "@/components/MissionStatus";

const missionHistory = () => {
  const insets = useSafeAreaInsets();
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  return (
    <Screen>
      {/* header */}
      <View
        className="h-14 flex-row items-center px-5"
        style={{ justifyContent: "space-between" }}
      >
        <Pressable onPress={goBack} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#E8F5E9" />
        </Pressable>
        <Text style={styles.headerText}>ประวัติภารกิจ</Text>
      </View>
      {/* end of header */}

      <View className="flex-1 bg-sage-light">
        {/* SAMPLE1 */}
        <MissionStatus
          taskID={1}
          maxAttempts={1}
          completedAttempts={1}
          taskDetail="ถ่ายรูปต้นไม้"
          reward={10}
        />
        {/* SAMPLE2 */}
        <MissionStatus
          taskID={1}
          maxAttempts={1}
          completedAttempts={0}
          taskDetail="ถ่ายรูปต้นไม้"
          reward={10}
        />
      </View>
    </Screen>
  );
};

export default missionHistory;

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
    right: "50%",
    transform: "translateX(50%)",
  },
  avatarPreviewZone: {
    width: "100%",
    flexDirection: "column",
  },
  avatarPreview: {
    marginTop: "10%",
    alignItems: "center",
    marginHorizontal: "auto",
  },
  profileUsernameText: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "BaiJamjuree_600SemiBold",
  },
  profileTabs: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileTabsText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "BaiJamjuree_400Regular",
  },
  profileTabsInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "3%",
    gap: "1%",
    flex: 1,
  },

  profileBackground: {
    backgroundColor: "rgb(232, 245, 233)",
    width: "150px",
    height: "150px",
    overflow: "hidden",
    alignItems: "center",
  },

  profileNameArea: {
    marginHorizontal: "auto",
    flexDirection: "row",
    gap: "5px",
    marginTop: "2.5%",
    marginBottom: "20%",
  },
});
