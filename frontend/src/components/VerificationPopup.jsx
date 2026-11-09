import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { TextField } from "./TextField";

export function VerificationPopup({ action }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
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
        <View style={{ marginHorizontal: "10%" }}>
          {/* ยืมมาจาก หน้า login ของเนเน่ */}
          <TextField
            icon={require("assets/icon/popup/key1_normal.svg")}
            placeholder="ป้อนรหัสผ่าน"
            value={identifier}
            onChangeText={(value) => {
              setIdentifier(value);
              setErrors((prev) => ({ ...prev, identifier: "" }));
              setLoginError("");
            }}
            error={errors.identifier}
          ></TextField>
          <Pressable
            onPress={() => {
              router.push("assistance");
            }}
          >
            <Text style={[styles.text, styles.extraText]}>ลืมรหัสผ่าน</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Pressable
            onPress={() => {
              if (action === "changeEmail") router.push("/changeEmail");
              if (action === "changePassword") router.push("/changePassword");
            }}
          >
            <View style={styles.smallBox}>
              <Text style={[styles.text, styles.smallText]}>ยืนยัน</Text>
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
    height: 250,
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
  extraText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#E8F5E9",
    alignSelf: "flex-end",
  },
});
