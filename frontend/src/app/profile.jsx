
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/Screen";
import { BottomNav } from "@/components/BottomNav";
import { IconComponent } from "@/components/IconComponent";
import { useOutfit } from "@/services/outfit";
import { Avatar } from "@/components/Avatar";
import { apiRequest } from "@/services/api";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const { coins, equipped } = useOutfit();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiRequest("/users/me");
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setProfileLoading(false);
      }
    }

    fetchProfile();
  }, []);

  function handleTab(tab) {
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
      {/* Header */}
      <View
        className="h-14 flex-row items-center px-5"
        style={{ justifyContent: "space-between" }}
      >
        <View style={styles.headerIcon} />

        <Text style={styles.headerText}>โปรไฟล์</Text>

        <Pressable
          onPress={() => handleProfilePages("friendsList")}
          hitSlop={10}
        >
          <IconComponent
            source={require("assets/icon/header/friends1_normal.svg")}
            style={styles.headerIcon}
          />
        </Pressable>
      </View>

      {/* Profile content */}
      <View className="flex-1 bg-sage-light">
        {/* Avatar preview */}
        <View style={styles.avatarPreviewZone}>
          <View style={styles.avatarPreview}>
            <View style={styles.avatarImage}>
              <Avatar
                outfit={equipped}
                style={{ width: "100%", height: "100%" }}
              />
            </View>

            <Pressable
              onPress={() => router.push("/get_dress")}
              hitSlop={10}
              style={styles.dressIcon}
            >
              <IconComponent
                source={require("assets/icon/profile/dress1_normal.svg")}
                style={styles.bodyIcon}
              />
            </Pressable>

            <Text style={styles.profileUsernameText}>
              {profileLoading
                ? "กำลังโหลด..."
                : profile?.username ?? "ไม่สามารถโหลดข้อมูลได้"}
            </Text>

            {/* Coins */}
            <View style={styles.currentCoin}>
              <IconComponent
                source={require("assets/icon/profile/coin_normal.svg")}
                style={styles.bodyIcon}
              />

              <Text style={styles.currentCoinText}>
                {coins}
              </Text>
            </View>
          </View>
        </View>

        {/* Profile menu */}
        <View>
          {/* Personal information */}
          <Pressable
            onPress={() => handleProfilePages("personalInfo")}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/profile/information_normal.svg")}
                  style={styles.bodyIcon}
                />
                <Text style={styles.profileTabsText}>
                  ข้อมูลส่วนตัว
                </Text>
              </View>

              <IconComponent
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              />
            </View>
          </Pressable>

          {/* Post history */}
          <Pressable
            onPress={() => handleProfilePages("postHistory")}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/profile/postHistory_normal.svg")}
                  style={styles.bodyIcon}
                />
                <Text style={styles.profileTabsText}>
                  ประวัติโพสต์
                </Text>
              </View>

              <IconComponent
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              />
            </View>
          </Pressable>

          {/* Check-in history */}
          <Pressable
            onPress={() => handleProfilePages("checkinHistory")}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/profile/checkinHistory_normal.svg")}
                  style={styles.bodyIcon}
                />
                <Text style={styles.profileTabsText}>
                  ประวัติเช็กอิน
                </Text>
              </View>

              <IconComponent
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              />
            </View>
          </Pressable>

          {/* Mission history */}
          <Pressable
            onPress={() => handleProfilePages("missionHistory")}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/profile/missionHistory_normal.svg")}
                  style={styles.bodyIcon}
                />
                <Text style={styles.profileTabsText}>
                  ประวัติภารกิจ
                </Text>
              </View>

              <IconComponent
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              />
            </View>
          </Pressable>
        </View>
      </View>

      {/* Bottom navigation */}
      <BottomNav active="profile" onPress={handleTab} />
    </Screen>
  );
};

export default Profile;

const styles = StyleSheet.create({
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

  avatarImage: {
    width: 120,
    aspectRatio: 600 / 1490,
  },

  dressIcon: {
    top: "10%",
    right: "-10%",
    position: "absolute",
    zIndex: 10,
    elevation: 10,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
