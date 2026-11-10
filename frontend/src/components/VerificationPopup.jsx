import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import { router } from "expo-router";
import { POPUP_SIZE } from "./popupSize";

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
        {/* compact password field (TextField is too tall for the popup size) */}
        <View style={[styles.input, errors.identifier && styles.inputError]}>
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
            value={identifier}
            onChangeText={(value) => {
              setIdentifier(value);
              setErrors((prev) => ({ ...prev, identifier: "" }));
              setLoginError("");
            }}
          />
        </View>
        <View style={styles.row}>
          <Pressable
            onPress={() => {
              router.push("assistance");
            }}
          >
            <Text style={[styles.text, styles.extraText]}>ลืมรหัสผ่าน</Text>
          </Pressable>
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
});
