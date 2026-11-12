
import React, { useState } from "react";
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

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/personalInfo");
  }

  async function handleChangePassword() {
    if (!newPassword || !confirmPassword) {
      setError("กรุณากรอกรหัสผ่านให้ครบทั้งสองช่อง");
      return;
    }

    if (newPassword.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiRequest("/users/me/password", {
        method: "PUT",
        body: JSON.stringify({ password: newPassword }),
      });

      setNewPassword("");
      setConfirmPassword("");

      Alert.alert("สำเร็จ", "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
      router.back();
    } catch (err) {
      setError(err.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
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
        <Text style={styles.headerText}>เปลี่ยนรหัสผ่าน</Text>
        <View style={styles.headerIcon} />
      </View>

      <View style={styles.content}>
        <View style={styles.changeArea}>
          <TextField
            icon={require("assets/icon/accountManagement/key1_normal.svg")}
            placeholder="ตั้งรหัสผ่านใหม่"
            value={newPassword}
            onChangeText={(value) => {
              setNewPassword(value);
              setError("");
            }}
            secure
            error={error}
          />

          <TextField
            icon={require("assets/icon/accountManagement/key2_active.svg")}
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setError("");
            }}
            secure
          />
        </View>

        <Pressable
          onPress={handleChangePassword}
          disabled={loading}
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>เปลี่ยนรหัสผ่าน</Text>
          )}
        </Pressable>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            ความรัดกุมของรหัสผ่าน: ใช้อักขระอย่างน้อย 8 ตัว
            อย่าใช้รหัสผ่านจากเว็บไซต์อื่นหรือคาดเดาง่าย เช่น ชื่อของสัตว์เลี้ยง
          </Text>
        </View>
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
  noticeBox: {
    backgroundColor: "#DCE6D8",
    borderRadius: 12,
    padding: 14,
    marginTop: 24,
  },
  noticeText: {
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 13,
    lineHeight: 21,
    color: "#526D50",
  },
});

export default ChangePassword;
