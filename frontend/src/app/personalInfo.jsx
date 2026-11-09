import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React, { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { AccountPopup } from "@/components/AccountPopup";
import { VerificationPopup } from "@/components/VerificationPopup";
import { IconComponent } from "@/components/IconComponent";

const personalInfo = () => {
  const insets = useSafeAreaInsets();
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  const [popupState, setPopupState] = useState("none");

  useFocusEffect(
    useCallback(() => {
      // This part runs when the screen comes into focus
      return () => {
        // This clean-up function runs automatically the exact instant the user navigates AWAY from this page
        setPopupState("none");
      };
    }, []),
  );

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  const handlePopup = (action) => {
    setPopupState(action);
  };

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
        <Text style={styles.headerText}>จัดการบัญชี</Text>
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
            <IconComponent
              source={require("assets/icon/personalInfo/rename1_normal.svg")}
              style={styles.bodyIcon}
            ></IconComponent>
          </View>
        </View>
        {/* end of an area for the avatar */}

        {/* to other 4 pages */}
        <View>
          {/* อีเมล */}
          <Pressable
            onPress={() => {
              handlePopup("changeEmail");
            }}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/personalInfo/userEmail_normal.svg")}
                  style={styles.bodyIcon}
                ></IconComponent>
                <Text style={styles.profileTabsText}>อีเมล</Text>
              </View>
              <IconComponent
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              ></IconComponent>
            </View>
          </Pressable>

          {/* รหัสผ่าน */}
          <Pressable
            onPress={() => {
              handlePopup("changePassword");
            }}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/personalInfo/keyEdit_normal.svg")}
                  style={styles.bodyIcon}
                ></IconComponent>
                <Text style={styles.profileTabsText}>เปลี่ยนรหัสผ่าน</Text>
              </View>
              <IconComponent
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              ></IconComponent>
            </View>
          </Pressable>

          {/* Sign Out */}
          <Pressable
            onPress={() => {
              handlePopup("signOut");
            }}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/personalInfo/signOut_normal.svg")}
                  style={styles.bodyIcon}
                ></IconComponent>
                <Text style={styles.profileTabsText}>ออกจากระบบ</Text>
              </View>
              <IconComponent
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              ></IconComponent>
            </View>
          </Pressable>

          {/* Delete Account */}
          <Pressable
            onPress={() => {
              handlePopup("deleteAccount");
            }}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/personalInfo/deleteAccount_normal.svg")}
                  style={styles.bodyIcon}
                ></IconComponent>
                <Text style={styles.profileTabsText}>ลบบัญชีผู้ใช้</Text>
              </View>
              <IconComponent
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              ></IconComponent>
            </View>
          </Pressable>
        </View>
        {/* end of to other 4 pages */}
      </View>
      {!(popupState === "none") &&
        !(popupState === "changeEmail") &&
        !(popupState === "changePassword") && (
          <AccountPopup action={popupState}></AccountPopup>
        )}

      {!(popupState === "none") &&
        !(popupState === "signOut") &&
        !(popupState === "deleteAccount") && (
          <VerificationPopup action={popupState}></VerificationPopup>
        )}
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
    left: "50%",
    transform: [{ translateX: "-50%" }],
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
  headerIcon: {
    tintColor: "#E8F5E9",
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  bodyIcon: {
    tintColor: "#1F2A1F",
    width: 24,
    height: 24,
    alignSelf: "center",
  },
  moreIcon: {
    alignSelf: "center",
    marginRight: "5%",
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
    width: 150,
    height: 150,
    overflow: "hidden",
    alignItems: "center",
  },

  profileNameArea: {
    marginHorizontal: "auto",
    flexDirection: "row",
    gap: 5,
    marginTop: "2.5%",
    marginBottom: "20%",
  },
});
