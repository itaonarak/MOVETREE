// 2. CREATE ACCOUNT PAGE  (route: "/register")
import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { AuthLayout } from "@/components/AuthLayout";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";

const ICONS = {
  profile: require("../../assets/icon/register/profile.svg"),
  key: require("../../assets/icon/register/key.svg"),
  keyFilled: require("../../assets/icon/login/key.svg"),
};

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});

  function goToLogin() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  function handleCreate() {
    const next = {};
    if (!email.includes("@")) next.email = "กรุณากรอกอีเมลให้ถูกต้อง";
    if (!username.trim()) next.username = "กรุณาตั้งชื่อผู้ใช้";
    if (password.length < 6) next.password = "อย่างน้อย 6 ตัวอักษร";
    if (confirm !== password) next.confirm = "รหัสผ่านไม่ตรงกัน";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO: call your backend sign-up API here
    router.replace("/feed");
  }

  return (
    <AuthLayout
      title="สร้างบัญชีผู้ใช้"
      footerLink={{ label: "เข้าสู่ระบบ", onPress: goToLogin }}
    >
      <TextField
        icon={ICONS.profile}
        placeholder="อีเมล"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
      />
      <TextField
        icon={ICONS.profile}
        placeholder="ตั้งชื่อผู้ใช้"
        value={username}
        onChangeText={setUsername}
        error={errors.username}
      />
      <TextField
        icon={ICONS.key}
        placeholder="ตั้งรหัสผ่าน"
        secure
        value={password}
        onChangeText={setPassword}
        error={errors.password}
      />
      <TextField
        icon={ICONS.keyFilled}
        placeholder="ยืนยันรหัสผ่าน"
        secure
        value={confirm}
        onChangeText={setConfirm}
        error={errors.confirm}
      />

      <View className="mt-16">
        <Button title="สร้างบัญชี" onPress={handleCreate} />
      </View>
    </AuthLayout>
  );
}
