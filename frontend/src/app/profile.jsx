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
import { BottomNav } from "@/components/BottomNav";
import { Logo } from "@/components/Logo";

const profile = () => {
  const insets = useSafeAreaInsets();
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/feed");
  }

  function handleTab(tab) {
    // TODO: navigate to camera / tasks / profile pages once they exist
    if (tab === "home") router.push("/feed");
    if (tab === "profile") return;
  }
  return (
    <Screen>
      {/* header */}
      <View
        className="h-14 flex-row items-center px-5"
        style={{ justifyContent: "space-between" }}
      >
        <Image
          source={require("assets/icon/profile/plantBox.png")}
          style={{ size: 24 }}
        ></Image>
        <Text style={styles.headerText}>โปรไฟล์</Text>
        {/* FRIEND BUTTON IS NOT READY YET THIS IS JUST A PLACEHOLDER */}
        <Pressable onPress={handleTab} hitSlop={10}>
          <Image
            source={require("assets/icon/profile/friend1.png")}
            style={{ size: 24 }}
          ></Image>
        </Pressable>
      </View>
      {/* end of header */}

      <View className="flex-1 bg-sage-light">
        {/* presumably an area for the avatar */}
        <View style={styles.avatarPreviewZone}>
          <View style={styles.avatarPreview}>
            <Image source={require("assets/profile/demo.png")}></Image>
            <Image
              source={require("assets/icon/profile/dress.png")}
              style={styles.dressIcon}
            ></Image>
            <Text style={styles.profileUsernameText}>วอดส์</Text>
            <View style={styles.currentCoin}>
              <Image source={require("assets/icon/profile/coin.png")}></Image>
              <Text style={styles.currentCoinText}>999</Text>
            </View>
          </View>
        </View>
        {/* end of an area for the avatar */}

        {/* to other 4 pages */}
        <View>
          {/* ข้อมูลส่วนตัว */}
          <View style={styles.profileTabs}>
            <View style={styles.profileTabsInfo}>
              <Image source={require("assets/icon/profile/info.png")}></Image>
              <Text style={styles.profileTabsText}>ข้อมูลส่วนตัว</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="rgb(31, 42, 31)"
              style={{ alignSelf: "center", marginRight: "5%" }}
            />
          </View>

          {/* ประวัติโพสต์ */}
          <View style={styles.profileTabs}>
            <View style={styles.profileTabsInfo}>
              <Image
                source={require("assets/icon/profile/postHistory.png")}
              ></Image>
              <Text style={styles.profileTabsText}>ประวัติโพสต์</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="rgb(31, 42, 31)"
              style={{ alignSelf: "center", marginRight: "5%" }}
            />
          </View>

          {/* ประวัติเช็กอิน */}
          <View style={styles.profileTabs}>
            <View style={styles.profileTabsInfo}>
              <Image
                source={require("assets/icon/profile/checkinHistory.png")}
              ></Image>
              <Text style={styles.profileTabsText}>ประวัติเช็กอิน</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="rgb(31, 42, 31)"
              style={{ alignSelf: "center", marginRight: "5%" }}
            />
          </View>

          {/* ประวัติภารกิจ */}
          <View style={styles.profileTabs}>
            <View style={styles.profileTabsInfo}>
              <Image
                source={require("assets/icon/profile/missionHistory.png")}
              ></Image>
              <Text style={styles.profileTabsText}>ประวัติภารกิจ</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="rgb(31, 42, 31)"
              style={{ alignSelf: "center", marginRight: "5%" }}
            />
          </View>
        </View>
        {/* end of to other 4 pages */}
      </View>
      {/* bottom nav bar */}
      <BottomNav active="profile" onPress={handleTab} />
    </Screen>
  );
};

export default profile;

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
  dressIcon: {
    top: "10%",
    right: "5%",
    position: "absolute",
  },
  profileUsernameText: {
    fontSize: 24,
    lineHeight: 36,
    fontFamily: "BaiJamjuree_600SemiBold",
  },
  currentCoin: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  currentCoinText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "BaiJamjuree_400Regular",
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
});
