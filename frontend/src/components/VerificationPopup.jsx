
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import { router } from "expo-router";
import { POPUP_SIZE } from "./popupSize";
import { apiRequest } from "@/services/api";

export function VerificationPopup({ action }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (!password.trim()) {
      setError("กรุณาป้อนรหัสผ่าน");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiRequest("/users/verify-password", {
        method: "POST",
        body: JSON.stringify({ password }),
      });

      if (action === "changeEmail") {
        router.push("/changeEmail");
      } else if (action === "changePassword") {
        router.push("/changePassword");
      } else {
        Alert.alert(
          "ยังไม่พร้อมใช้งาน",
          "ฟังก์ชันนี้ยังไม่ได้เชื่อมต่อ"
        );
      }
    } catch (err) {
      setError(
        err.message === "Incorrect password"
          ? "รหัสผ่านไม่ถูกต้อง"
          : err.message || "ไม่สามารถตรวจสอบรหัสผ่านได้"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.background}>
      <View style={styles.mainBox}>
        {action === "changeEmail" && (
          <Text style={[styles.text, styles.mainText]}>
            ยืนยันตัวก่อนเปลี่ยนอีเมล
          </Text>
        )}

        {action === "changePassword" && (
          <Text style={[styles.text, styles.mainText]}>
            ยืนยันตัวก่อนเปลี่ยนรหัส
          </Text>
        )}

        {action === "rename" && (
          <Text style={[styles.text, styles.mainText]}>
            เปลี่ยนชื่อผู้ใช้
          </Text>
        )}

        <View style={[styles.input, error && styles.inputError]}>
          <Image
            source={require("assets/icon/popup/key1_normal.svg")}
            style={{ width: 18, height: 18 }}
            contentFit="contain"
          />

          <TextInput
            style={styles.inputText}
            placeholder="ป้อนรหัสผ่าน"
            placeholderTextColor="#6B7A68"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            editable={!loading}
            onChangeText={(value) => {
              setPassword(value);
              setError("");
            }}
            onSubmitEditing={handleVerify}
          />
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <View style={styles.row}>
          <Pressable
            onPress={() => router.push("/assistance")}
            disabled={loading}
          >
            <Text style={[styles.text, styles.extraText]}>
              ลืมรหัสผ่าน
            </Text>
          </Pressable>

          <Pressable
            onPress={handleVerify}
            disabled={loading}
          >
            <View style={styles.smallBox}>
              <Text style={[styles.text, styles.smallText]}>
                {loading ? "กำลังตรวจสอบ..." : "ยืนยัน"}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    height: "100%",
    width: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  mainBox: {
    backgroundColor: "#3E513B",
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    ...POPUP_SIZE,
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  text: {
    fontFamily: "BaiJamjuree_600SemiBold",
    alignSelf: "center",
  },

  mainText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    color: "#E8F5E9",
  },

  smallBox: {
    backgroundColor: "#E8F5E9",
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    justifyContent: "center",
  },

  smallText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#3E513B",
  },

  input: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },

  inputError: {
    borderWidth: 2,
    borderColor: "#F87171",
  },

  inputText: {
    flex: 1,
    marginLeft: 6,
    padding: 0,
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 13,
    color: "#1C1B1F",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  extraText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#E8F5E9",
  },

  errorText: {
    fontFamily: "BaiJamjuree_400Regular",
    color: "#FCA5A5",
    fontSize: 12,
    marginBottom: 8,
  },
});
