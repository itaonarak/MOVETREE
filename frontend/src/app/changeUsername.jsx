
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { IconComponent } from "@/components/IconComponent";
import { apiRequest } from "@/services/api";

export default function ChangeUsername() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    const newUsername = username.trim();

    if (newUsername.length < 3 || newUsername.length > 50) {
      Alert.alert(
        "ชื่อผู้ใช้ไม่ถูกต้อง",
        "ชื่อผู้ใช้ต้องมีความยาว 3-50 ตัวอักษร"
      );
      return;
    }

    try {
      setLoading(true);

      await apiRequest("/users/me/username", {
        method: "PATCH",
        body: JSON.stringify({
          new_username: newUsername,
        }),
      });

      Alert.alert(
        "สำเร็จ",
        "เปลี่ยนชื่อผู้ใช้เรียบร้อยแล้ว",
        [
          {
            text: "ตกลง",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      const message = String(error?.message || "").toLowerCase();

      if (
        message.includes("username already exists") ||
        message.includes("already exists") ||
        message.includes("duplicate key") ||
        message.includes("unique constraint")
      ) {
        Alert.alert(
          "เปลี่ยนชื่อผู้ใช้ไม่ได้",
          "ชื่อผู้ใช้นี้มีคนใช้แล้ว กรุณาใช้ชื่ออื่น"
        );
      } else {
        Alert.alert(
          "เกิดข้อผิดพลาด",
          error?.message || "ไม่สามารถเปลี่ยนชื่อผู้ใช้ได้ กรุณาลองอีกครั้ง"
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          disabled={loading}
        >
          <IconComponent
            source={require("assets/icon/header/back_normal.svg")}
            style={styles.headerIcon}
          />
        </Pressable>

        <Text style={styles.headerText}>เปลี่ยนชื่อผู้ใช้</Text>

        <View style={styles.headerIcon} />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>ชื่อผู้ใช้ใหม่</Text>

        <Text style={styles.description}>
          กรอกชื่อผู้ใช้ที่ต้องการเปลี่ยน
        </Text>

        <TextInput
          style={styles.input}
          placeholder="ป้อนชื่อผู้ใช้ใหม่"
          placeholderTextColor="#8A9587"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={50}
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        <Text style={styles.hint}>
          ชื่อผู้ใช้ต้องมีความยาว 3-50 ตัวอักษร
        </Text>

        <Pressable
          style={[
            styles.button,
            loading && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#E8F5E9" />
          ) : (
            <Text style={styles.buttonText}>บันทึก</Text>
          )}
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  headerIcon: {
    width: 24,
    height: 24,
    tintColor: "#E8F5E9",
  },

  headerText: {
    fontSize: 22,
    lineHeight: 32,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "#E8F5E9",
  },

  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#E8F5E9",
  },

  title: {
    fontFamily: "BaiJamjuree_600SemiBold",
    fontSize: 18,
    color: "#3E513B",
    marginBottom: 6,
  },

  description: {
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 14,
    color: "#6B7A68",
    marginBottom: 20,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#A5B5A1",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 16,
    color: "#1F2A1F",
    backgroundColor: "#FFFFFF",
  },

  hint: {
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 12,
    color: "#6B7A68",
    marginTop: 8,
    marginBottom: 24,
  },

  button: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#3E513B",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    fontFamily: "BaiJamjuree_600SemiBold",
    fontSize: 16,
    color: "#E8F5E9",
  },
});
