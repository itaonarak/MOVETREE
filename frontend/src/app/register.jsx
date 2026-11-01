
import { useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { AuthLayout } from "@/components/AuthLayout";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { apiRequest } from "@/services/api";

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
  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function goToLogin() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  async function handleCreate() {
    const next = {};

    if (!email.includes("@")) {
      next.email = "กรุณากรอกอีเมลให้ถูกต้อง";
    }

    if (!username.trim()) {
      next.username = "กรุณาตั้งชื่อผู้ใช้";
    }

    if (password.length < 6) {
      next.password = "อย่างน้อย 6 ตัวอักษร";
    }

    if (confirm !== password) {
      next.confirm = "รหัสผ่านไม่ตรงกัน";
    }

    setErrors(next);
    setRegisterError("");
    setSuccessMessage("");

    if (Object.keys(next).length > 0 || loading) return;

    try {
      setLoading(true);

      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          username: username.trim(),
          password: password,
          confirm_password: confirm,
        }),
      });

      console.log("Registration successful:", data);

      setSuccessMessage(
        "สมัครสมาชิกสำเร็จ สามารถเข้าสู่ระบบได้แล้ว"
      );
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="สร้างบัญชีผู้ใช้ใหม่"
      footerLink={{
        label: "เข้าสู่ระบบ",
        onPress: goToLogin,
      }}
    >
      <TextField
        icon={ICONS.profile}
        placeholder="อีเมล"
        keyboardType="email-address"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setErrors((prev) => ({ ...prev, email: "" }));
          setRegisterError("");
          setSuccessMessage("");
        }}
        error={errors.email}
      />

      <TextField
        icon={ICONS.profile}
        placeholder="ตั้งชื่อผู้ใช้"
        value={username}
        onChangeText={(value) => {
          setUsername(value);
          setErrors((prev) => ({ ...prev, username: "" }));
          setRegisterError("");
          setSuccessMessage("");
        }}
        error={errors.username}
      />

      <TextField
        icon={ICONS.key}
        placeholder="ตั้งรหัสผ่าน"
        secure
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setErrors((prev) => ({ ...prev, password: "" }));
          setRegisterError("");
          setSuccessMessage("");
        }}
        error={errors.password}
      />

      <TextField
        icon={ICONS.keyFilled}
        placeholder="ยืนยันรหัสผ่าน"
        secure
        value={confirm}
        onChangeText={(value) => {
          setConfirm(value);
          setErrors((prev) => ({ ...prev, confirm: "" }));
          setRegisterError("");
          setSuccessMessage("");
        }}
        error={errors.confirm}
      />

      {registerError ? (
        <Text className="mt-2 text-center text-sm text-red-500">
          {registerError}
        </Text>
      ) : null}

      {successMessage ? (
        <Text className="mt-2 text-center text-sm text-green-700">
          {successMessage}
        </Text>
      ) : null}

      <View className="mt-16">
        <Button
          title={loading ? "กำลังสมัครสมาชิก..." : "สร้างบัญชี"}
          onPress={handleCreate}
        />
      </View>
    </AuthLayout>
  );
}
