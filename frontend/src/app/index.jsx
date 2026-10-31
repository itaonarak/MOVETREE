// 1. LOGIN PAGE  (route: "/")
import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { AuthLayout } from "@/components/AuthLayout";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";

const ICONS = {
  profile: require("../../assets/icon/login/profile.svg"),
  key: require("../../assets/icon/login/key.svg"),
};

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  function handleLogin() {
    const next = {};
    if (!identifier.trim()) next.identifier = "กรุณากรอกชื่อผู้ใช้";
    if (!password) next.password = "กรุณากรอกรหัสผ่าน";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO: call your backend login API here
    router.replace("/feed");
  }

  return (
    <AuthLayout
      title="เข้าสู่ระบบ"
      footerLink={{
        label: "สร้างบัญชีผู้ใช้",
        onPress: () => router.push("/register"),
      }}
    >
      <TextField
        icon={ICONS.profile}
        placeholder="ชื่อผู้ใช้"
        value={identifier}
        onChangeText={setIdentifier}
        error={errors.identifier}
      />
      <View className="mt-2">
        <TextField
          icon={ICONS.key}
          placeholder="รหัสผ่าน"
          secure
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
      </View>

      <View className="mt-4">
        <Button title="เข้าสู่ระบบ" onPress={handleLogin} />
      </View>
    </AuthLayout>
  );
}
