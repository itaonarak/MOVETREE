
import { useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { AuthLayout } from "@/components/AuthLayout";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { apiRequest } from "@/services/api";
import { saveToken } from "@/services/token";
import { refreshOutfit } from "@/services/outfit";

const ICONS = {
  profile: require("../../assets/icon/login/profile.svg"),
  key: require("../../assets/icon/login/key.svg"),
};

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const next = {};

    if (!identifier.trim()) {
      next.identifier = "กรุณากรอกชื่อผู้ใช้";
    }

    if (!password) {
      next.password = "กรุณากรอกรหัสผ่าน";
    }

    setErrors(next);
    setLoginError("");

    if (Object.keys(next).length > 0 || loading) return;

    try {
      setLoading(true);

      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: identifier.trim(),
          password: password,
        }),
      });

      await saveToken(data.access_token);

      // Load coins, owned items and outfit for this account.
      await refreshOutfit();

      console.log("Login successful:", data);

router.replace("/feed");
      
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="เข้าสู่ระบบ"
      footerLink={{
        label: "สร้างบัญชีผู้ใช้ใหม่",
        onPress: () => router.push("/register"),
      }}
    >
      <TextField
        icon={ICONS.profile}
        placeholder="ชื่อผู้ใช้"
        value={identifier}
        onChangeText={(value) => {
          setIdentifier(value);
          setErrors((prev) => ({ ...prev, identifier: "" }));
          setLoginError("");
        }}
        error={errors.identifier}
      />

      <View className="mt-2">
        <TextField
          icon={ICONS.key}
          placeholder="รหัสผ่าน"
          secure
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setErrors((prev) => ({ ...prev, password: "" }));
            setLoginError("");
          }}
          error={errors.password}
        />
      </View>

      {loginError ? (
        <Text className="mt-2 text-center text-sm text-red-500">
          {loginError}
        </Text>
      ) : null}

      <View className="mt-4">
        <Button
          title={loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          onPress={handleLogin}
        />
      </View>
    </AuthLayout>
  );
}
