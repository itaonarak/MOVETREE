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
import { IconComponent } from "@/components/IconComponent";

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
        className="h-14 flex-row items-center"
        style={{ justifyContent: "space-between" }}
      >
        <Pressable onPress={goBack} hitSlop={10}>
          <IconComponent
            source={require("assets/icon/header/back_normal.svg")}
            style={styles.headerIcon}
          ></IconComponent>
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
