import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

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
  },
  mainBox: {
    backgroundColor: "#3E513B",
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "90%",
    height: 200,
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  text: {
    fontFamily: "BaiJamjuree_600SemiBold",
    alignSelf: "center",
  },
  mainText: {
    fontSize: 24,
    lineHeight: 36,
    color: "#E8F5E9",
  },
  smallBox: {
    backgroundColor: "#E8F5E9",
    width: 100,
    height: 40,
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
