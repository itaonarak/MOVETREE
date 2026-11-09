import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { IconComponent } from "@/components/IconComponent";

const changePassword = () => {
  const insets = useSafeAreaInsets();
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/personalInfo");
  }
  const [identifier1, setIdentifier1] = useState("");
  const [identifier2, setIdentifier2] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

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
        <Text style={styles.headerText}>เปลี่ยนรหัสผ่าน</Text>
      </View>
      {/* end of header */}

      <View className="flex-1 bg-sage-light">
        <View style={styles.changeArea}>
          {/* ยืมของเนเน่มา */}
          <TextField
            icon={require("assets/icon/accountManagement/key1_normal.svg")}
            placeholder="ตั้งรหัสผ่านใหม่"
            value={identifier1}
            onChangeText={(value) => {
              setIdentifier1(value);
              setErrors((prev) => ({ ...prev, identifier: "" }));
              setLoginError("");
            }}
            error={errors.identifier}
          ></TextField>
          {/* ยืมของเนเน่มา */}
          <TextField
            icon={require("assets/icon/accountManagement/key2_active.svg")}
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={identifier2}
            onChangeText={(value) => {
              setIdentifier2(value);
              setErrors((prev) => ({ ...prev, identifier: "" }));
              setLoginError("");
            }}
            error={errors.identifier}
          ></TextField>
        </View>

        <Pressable>
          <View style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>เปลี่ยนรหัสผ่าน</Text>
          </View>
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

export default changePassword;

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
  changeArea: {
    marginTop: "20%",
    justifyContent: "space-around",
    width: 250,
    alignSelf: "center",
  },
  confirmButton: {
    width: 120,
    height: 40,
    backgroundColor: "#8FA07D",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "30%",
    borderRadius: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "#E8F5E9",
  },
  noticeBox: {
    marginTop: "20%",
    borderRadius: 10,
    backgroundColor: "rgba(143, 160, 125, 0.5)",
    width: "90%",
    height: "10%",
    alignSelf: "center",
    justifyContent: "center",
  },
  noticeText: {
    margin: "5%",
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "#1F2A1F",
  },
});
