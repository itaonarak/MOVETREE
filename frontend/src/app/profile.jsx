import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { BottomNav } from "@/components/BottomNav";

const profile = () => {
  const insets = useSafeAreaInsets();
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/feed");
  }

  function handleTab(tab) {
    // TODO: navigate to camera / tasks / profile pages once they exist
    if (tab === "home") router.push("/feed");
    if (tab === "camera") router.push("/Camera");
    if (tab === "tasks") router.push("/mission");
    if (tab === "profile") return;
  }

  function handleProfilePages(page) {
    switch (page) {
      case "personalInfo":
        router.push("/personalInfo");
        break;
      case "postHistory":
        router.push("/postHistory");
        break;
      case "missionHistory":
        router.push("/missionHistory");
        break;
      case "checkinHistory":
        router.push("/checkinHistory");
        break;
      case "friendsList":
        router.push("/friendsList");
        break;

      default:
        break;
    }
  }
  return (
    <Screen>
      {/* header */}
      <View
        className="h-14 flex-row items-center px-5"
        style={{ justifyContent: "space-between" }}
      >
        <Image
          source={require("assets/icon/header/forest_normal.svg")}
          style={styles.headerIcon}
        ></Image>
        <Text style={styles.headerText}>โปรไฟล์</Text>
        {/* FRIEND BUTTON IS NOT READY YET THIS IS JUST A PLACEHOLDER */}
        <Pressable
          onPress={() => {
            handleProfilePages("friendsList");
          }}
          hitSlop={10}
        >
          <Image
            source={require("assets/icon/header/friends1_normal.svg")}
            style={styles.headerIcon}
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
              source={require("assets/icon/profile/dress1_normal.svg")}
              style={[styles.dressIcon, styles.bodyIcon]}
            ></Image>
            <Text style={styles.profileUsernameText}>วอดส์</Text>
            <View style={styles.currentCoin}>
              <Image
                source={require("assets/icon/profile/coin_normal.svg")}
              ></Image>
              <Text style={styles.currentCoinText}>999</Text>
            </View>
          </View>
        </View>
        {/* end of an area for the avatar */}

        {/* to other 4 pages */}
        <View>
          {/* ข้อมูลส่วนตัว */}
          <Pressable
            onPress={() => {
              handleProfilePages("personalInfo");
            }}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <Image
                  source={require("assets/icon/profile/information_normal.svg")}
                  style={styles.bodyIcon}
                ></Image>
                <Text style={styles.profileTabsText}>ข้อมูลส่วนตัว</Text>
              </View>
              <Image
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              ></Image>
            </View>
          </Pressable>

          {/* ประวัติโพสต์ */}
          <Pressable
            onPress={() => {
              handleProfilePages("postHistory");
            }}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <Image
                  source={require("assets/icon/profile/postHistory_normal.svg")}
                  style={styles.bodyIcon}
                ></Image>
                <Text style={styles.profileTabsText}>ประวัติโพสต์</Text>
              </View>
              <Image
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              ></Image>
            </View>
          </Pressable>

          {/* ประวัติเช็กอิน */}
          <Pressable
            onPress={() => {
              handleProfilePages("checkinHistory");
            }}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <Image
                  source={require("assets/icon/profile/checkinHistory_normal.svg")}
                  style={styles.bodyIcon}
                ></Image>
                <Text style={styles.profileTabsText}>ประวัติเช็กอิน</Text>
              </View>
              <Image
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              ></Image>
            </View>
          </Pressable>

          {/* ประวัติภารกิจ */}
          <Pressable
            onPress={() => {
              handleProfilePages("missionHistory");
            }}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <Image
                  source={require("assets/icon/profile/missionHistory_normal.svg")}
                  style={styles.bodyIcon}
                ></Image>
                <Text style={styles.profileTabsText}>ประวัติภารกิจ</Text>
              </View>
              <Image
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              ></Image>
            </View>
          </Pressable>
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
  headerIcon: {
    tintColor: "#E8F5E9",
    width: 24,
    height: 24,
  },
  bodyIcon: {
    tintColor: "#1F2A1F",
    width: 24,
    height: 24,
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
  moreIcon: {
    alignSelf: "center",
    marginRight: "5%",
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
