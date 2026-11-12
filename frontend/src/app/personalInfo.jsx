
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Avatar } from "@/components/Avatar";
import { useOutfit } from "@/services/outfit";
import { Screen } from "@/components/Screen";
import { IconComponent } from "@/components/IconComponent";
import { AccountPopup } from "@/components/AccountPopup";
import { VerificationPopup } from "@/components/VerificationPopup";
import { apiRequest } from "@/services/api";
import { removeToken } from "@/services/token";

const PersonalInfo = () => {
  const { equipped } = useOutfit();

  const [popupType, setPopupType] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/profile");
    }
  }

  function handlePopup(type) {
    setPopupType(type);
  }

  function closePopup() {
    if (deleting) return;
    setPopupType(null);
  }

  async function handleSignOut() {
    try {
      await removeToken();
      setPopupType("signOutSuccess");
    } catch (error) {
      Alert.alert(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถออกจากระบบได้"
      );
    }
  }

  

  async function handleDeleteAccount() {
    if (deleting) return;

    try {
      setDeleting(true);

      // Delete account and related application data on backend.
      await apiRequest("/users/me", {
        method: "DELETE",
      });

      // Remove the saved access token after successful deletion.
      await removeToken();

      setPopupType("deleteAccountSuccess");
    } catch (error) {
      console.error("Delete account error:", error);

      Alert.alert(
        "ลบบัญชีไม่สำเร็จ",
        error.message || "กรุณาลองใหม่อีกครั้ง"
      );

      setPopupType(null);
    } finally {
      setDeleting(false);
    }
  }

  function handlePopupAction() {
    const type = popupType;

    if (type === "changeEmail") {
      closePopup();
      router.push("/changeEmail");
    } else if (type === "changePassword") {
      closePopup();
      router.push("/changePassword");
    } else if (type === "signOut") {
       handleSignOut();
      }
     else if (type === "deleteAccount") {
      handleDeleteAccount();
    }
  }

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

        <Text style={styles.headerText}>ข้อมูลส่วนตัว</Text>

        <View style={styles.headerIcon} />
      </View>

      <View className="flex-1 bg-sage-light">
        {/* Avatar */}
        <View style={styles.avatarPreviewZone}>
          <View style={styles.avatarPreview}>
            <View style={styles.profileBackground}>
              <Avatar
                outfit={equipped}
                style={styles.avatarImage}
              />
            </View>
          </View>

          <View style={styles.profileNameArea}>
            <Text style={styles.profileUsernameText}>
              {profileLoading
                ? "กำลังโหลด..."
                : profile?.username ?? "ไม่สามารถโหลดข้อมูลได้"}
            </Text>

            <Pressable
              onPress={() => handlePopup("rename")}
              hitSlop={10}
            >
              <IconComponent
                source={require("assets/icon/personalInfo/rename1_normal.svg")}
                style={styles.bodyIcon}
              />
            </Pressable>
          </View>
        </View>

        {/* Account settings */}
        <View>
          {/* Email */}
          <Pressable
            onPress={() => handlePopup("changeEmail")}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/personalInfo/userEmail_normal.svg")}
                  style={styles.bodyIcon}
                />
                <Text style={styles.profileTabsText}>
                  อีเมล
                </Text>
              </View>

              <IconComponent
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              />
            </View>
          </Pressable>

          {/* Password */}
          <Pressable
            onPress={() => handlePopup("changePassword")}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/personalInfo/keyEdit_normal.svg")}
                  style={styles.bodyIcon}
                />
                <Text style={styles.profileTabsText}>
                  เปลี่ยนรหัสผ่าน
                </Text>
              </View>

              <IconComponent
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              />
            </View>
          </Pressable>

          {/* Sign out */}
          <Pressable
            onPress={() => handlePopup("signOut")}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/personalInfo/signOut_normal.svg")}
                  style={styles.bodyIcon}
                />
                <Text style={styles.profileTabsText}>
                  ออกจากระบบ
                </Text>
              </View>

              <IconComponent
                source={require("assets/icon/profile/more_normal.svg")}
                style={[styles.bodyIcon, styles.moreIcon]}
              />
            </View>
          </Pressable>

          {/* Delete account */}
          <Pressable
            onPress={() => handlePopup("deleteAccount")}
          >
            <View style={styles.profileTabs}>
              <View style={styles.profileTabsInfo}>
                <IconComponent
                  source={require("assets/icon/personalInfo/deleteAccount_normal.svg")}
                  style={styles.bodyIcon}
                />
                <Text style={styles.profileTabsText}>
                  ลบบัญชีผู้ใช้
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

      {/* Email / Password verification */}
      {popupType === "changeEmail" ||
      popupType === "changePassword" ? (
        <VerificationPopup action={popupType} />
      ) : null}

      {/* Sign out confirmation */}
      {popupType === "signOut" ? (
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>
              ต้องการออกจากระบบหรือไม่?
            </Text>

            <View style={styles.popupButtons}>
              <Pressable onPress={closePopup}>
                <Text style={styles.cancelText}>
                  ยกเลิก
                </Text>
              </Pressable>

              <Pressable onPress={handlePopupAction}>
                <Text style={styles.confirmText}>
                  ยืนยัน
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}

      {/* Delete account confirmation */}
      {popupType === "deleteAccount" ? (
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>
              ต้องการลบบัญชีผู้ใช้หรือไม่?
            </Text>

            <Text style={styles.deleteWarning}>
              การลบบัญชีจะไม่สามารถกู้คืนข้อมูลได้
            </Text>

            <View style={styles.popupButtons}>
              <Pressable
                onPress={closePopup}
                disabled={deleting}
              >
                <Text style={styles.cancelText}>
                  ยกเลิก
                </Text>
              </Pressable>

              <Pressable
                onPress={handlePopupAction}
                disabled={deleting}
              >
                <Text style={styles.confirmText}>
                  {deleting ? "กำลังลบ..." : "ยืนยัน"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}

      {/* Rename verification */}
      {popupType === "rename" ? (
        <VerificationPopup action="rename" />
      ) : null}

      {/* Sign out success */}
      {popupType === "signOutSuccess" ? (
        <AccountPopup action="signOut" />
      ) : null}

      {/* Delete account success */}
      {popupType === "deleteAccountSuccess" ? (
        <AccountPopup action="deleteAccount" />
      ) : null}
    </Screen>
  );
};

export default PersonalInfo;

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
  },

  bodyIcon: {
    tintColor: "#1F2A1F",
    width: 24,
    height: 24,
    alignSelf: "center",
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
    width: 150,
    aspectRatio: 600 / 1490,
  },

  profileUsernameText: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "BaiJamjuree_600SemiBold",
  },

  profileNameArea: {
    marginHorizontal: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: "2.5%",
    marginBottom: "20%",
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
    aspectRatio: 600 / 1490,
    overflow: "hidden",
    alignItems: "center",
  },

  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  popupBox: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 24,
  },

  popupTitle: {
    fontFamily: "BaiJamjuree_600SemiBold",
    fontSize: 16,
    color: "#3E513B",
    textAlign: "center",
  },

  deleteWarning: {
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 13,
    color: "#B91C1C",
    textAlign: "center",
  },

  popupButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  cancelText: {
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "#526D50",
  },

  confirmText: {
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "#B91C1C",
  },
});
