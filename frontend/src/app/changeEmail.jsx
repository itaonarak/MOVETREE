
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { IconComponent } from "@/components/IconComponent";
import { apiRequest } from "@/services/api";

const ChangeEmail = () => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/personalInfo");
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiRequest("/users/me");
        setCurrentEmail(data.email || "");
      } catch (err) {
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดอีเมลปัจจุบันได้");
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleChangeEmail() {
    const email = newEmail.trim();

    if (!email) {
      setError("กรุณากรอกอีเมลใหม่");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }

    if (email.toLowerCase() === currentEmail.toLowerCase()) {
      setError("อีเมลใหม่ต้องไม่ซ้ำกับอีเมลปัจจุบัน");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiRequest("/users/me/email", {
        method: "PUT",
        body: JSON.stringify({ email }),
      });

      Alert.alert(
        "ส่งคำขอเปลี่ยนอีเมลแล้ว",
        "กรุณาตรวจสอบอีเมลใหม่และยืนยันตามลิงก์ที่ได้รับ"
      );

      router.back();
    } catch (err) {
      setError(err.message || "ไม่สามารถเปลี่ยนอีเมลได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={10}>
          <IconComponent
            source={require("assets/icon/header/back_normal.svg")}
            style={styles.headerIcon}
          />
        </Pressable>
        <Text style={styles.headerText}>อีเมล</Text>
        <View style={styles.headerIcon} />
      </View>

      <View style={styles.content}>
        <View style={styles.changeArea}>
          <TextField
            icon={require("assets/icon/accountManagement/profile1_normal.svg")}
            placeholder="อีเมลของคุณ"
            value={loadingProfile ? "กำลังโหลด..." : currentEmail}
            editable={false}
          />

          <TextField
            icon={require("assets/icon/accountManagement/profile2_active.svg")}
            placeholder="เปลี่ยนอีเมล"
            value={newEmail}
            onChangeText={(value) => {
              setNewEmail(value);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />
        </View>

        <Pressable
          onPress={handleChangeEmail}
          disabled={loading || loadingProfile}
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.buttonPressed,
            (loading || loadingProfile) && styles.buttonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>ยืนยันบัญชี</Text>
          )}
        </Pressable>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    fontFamily: "BaiJamjuree_600SemiBold",
    fontSize: 18,
    color: "#354B3A",
  },
  content: {
    flex: 1,
    backgroundColor: "#E8EEE5",
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  changeArea: {
    gap: 12,
  },
  confirmButton: {
    height: 52,
    backgroundColor: "#526D50",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  confirmButtonText: {
    fontFamily: "BaiJamjuree_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default ChangeEmail;
