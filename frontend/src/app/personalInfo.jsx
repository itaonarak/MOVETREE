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

const personalInfo = () => {
  const insets = useSafeAreaInsets();
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  function handleTab(tab) {
    // TODO: navigate to camera / tasks / profile pages once they exist
    if (tab === "home") router.push("/feed");
    if (tab === "profile") return;
  }

  function handleProfilePages(page) {
    switch (page) {
      case "personalInfo":
        router.push("/personalInfo");
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
        <Pressable onPress={goBack} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#E8F5E9" />
        </Pressable>
        <Text style={styles.headerText}>ข้อมูลส่วนตัว</Text>
      </View>
      {/* end of header */}

      <View className="flex-1 bg-sage-light">
        {/* presumably an area for the avatar */}
        <View style={styles.avatarPreviewZone}>
          <View style={styles.avatarPreview}>
            <View style={styles.profileBackground}>
              <Image source={require("assets/profile/demo.png")}></Image>
            </View>
          </View>
          <View style={styles.profileNameArea}>
            <Text style={styles.profileUsernameText}>วอดส์</Text>
            <Image
              source={require("assets/icon/personalInfo/rename.png")}
              style={{ alignSelf: "center" }}
            ></Image>
          </View>
        </View>
        {/* end of an area for the avatar */}

        {/* to other 4 pages */}
        <View>
          {/* ข้อมูลส่วนตัว */}
          <View style={styles.profileTabs}>
            <View style={styles.profileTabsInfo}>
              <Image
                source={require("assets/icon/personalInfo/userEmail.png")}
              ></Image>
              <Text style={styles.profileTabsText}>อีเมล</Text>
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
                source={require("assets/icon/personalInfo/keyEdit.png")}
              ></Image>
              <Text style={styles.profileTabsText}>เปลี่ยนรหัสผ่าน</Text>
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
                source={require("assets/icon/personalInfo/signOut.png")}
              ></Image>
              <Text style={styles.profileTabsText}>ออกจากระบบ</Text>
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
                source={require("assets/icon/personalInfo/deleteAccount.png")}
              ></Image>
              <Text style={styles.profileTabsText}>ลบบัญชีผู้ใช้</Text>
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
    </Screen>
  );
};

export default personalInfo;

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
