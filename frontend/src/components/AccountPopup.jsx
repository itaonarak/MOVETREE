import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import { POPUP_SIZE } from "./popupSize";

export function AccountPopup({ action }) {
  return (
    <View style={styles.background}>
      <View style={styles.mainBox}>
        {action === "signOut" && (
          <Text style={[styles.text, styles.mainText]}>ออกจากระบบแล้ว</Text>
        )}
        {action === "deleteAccount" && (
          <Text style={[styles.text, styles.mainText]}>
            ลบบัญชีผู้ใช้สำเร็จ
          </Text>
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Pressable
            onPress={() => {
              router.push("/");
            }}
          >
            <View style={styles.smallBox}>
              <Text style={[styles.text, styles.smallText]}>เข้าสู่ระบบ</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("/register");
            }}
          >
            <View style={styles.smallBox}>
              <Text style={[styles.text, styles.smallText]}>
                สร้างบัญชีผู้ใช้
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
    marginBottom: 12,
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
});
