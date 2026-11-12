
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { captureRef } from "react-native-view-shot";
import * as Location from "expo-location";

import { Screen } from "@/components/Screen";
import { POPUP_SIZE } from "@/components/popupSize";
import { Avatar } from "@/components/Avatar";
import { apiRequest } from "@/services/api";
import { clearDraftPost, getDraftPost } from "@/services/draftPost";

const icons = {
  back: require("assets/icon/upload/back_normal.svg"),
  location: require("assets/icon/upload/map1_normal.svg"),
  caption: require("assets/icon/upload/rename1_normal.svg"),
  visibility: require("assets/icon/upload/friends1_normal.svg"),
};

const VISIBILITY_OPTIONS = [
  { value: "public", label: "สาธารณะ" },
  { value: "friends", label: "เฉพาะเพื่อน" },
];

const shadow = {
  elevation: 4,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
};

const PLACEHOLDER_COLOR = "#6B7A68";

const inputStyle = {
  fontFamily: "BaiJamjuree_400Regular",
  fontSize: 13,
  color: "#1C1B1F",
  padding: 0,
};

function Pill({ icon, children }) {
  return (
    <View
      className="h-9 flex-row items-center rounded-full bg-paper px-3"
      style={shadow}
    >
      {icon && (
        <Image
          source={icon}
          style={{ width: 20, height: 20, marginRight: 6 }}
          contentFit="contain"
        />
      )}
      <View className="flex-1 justify-center">{children}</View>
    </View>
  );
}

function PillButton({ label, onPress, disabled, size = "lg" }) {
  const big = size === "lg";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center rounded-xl bg-brand ${
        big ? "h-11 px-6" : "h-8 px-5"
      }`}
      style={({ pressed }) => [
        shadow,
        { opacity: disabled ? 0.5 : pressed ? 0.8 : 1 },
      ]}
    >
      <Text
        className={`font-semibold text-paper ${
          big ? "text-base" : "text-sm"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Popup({ title, children, placement = "screen" }) {
  const onPhoto = placement === "photo";

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { zIndex: 50, elevation: 50 },
        onPhoto && { paddingBottom: 16 },
      ]}
      className={`items-center ${
        onPhoto ? "justify-end" : "justify-center"
      }`}
    >
      <View
        className="items-center justify-center rounded-2xl bg-paper px-5"
        style={[shadow, POPUP_SIZE]}
      >
        <Text className="mb-4 text-center text-base font-semibold text-ink">
          {title}
        </Text>
        <View className="w-full">{children}</View>
      </View>
    </View>
  );
}

export default function Upload() {
  const [draft] = useState(getDraftPost);
  const frameRef = useRef(null);

  const [step, setStep] = useState("checkin");
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [checkingIn, setCheckingIn] = useState(false);
  const [posting, setPosting] = useState(false);

  const [checkinId, setCheckinId] = useState(null);
  const [error, setError] = useState("");

  const locationName = draft?.placeName || "";

  function backToCamera() {
    clearDraftPost();

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/Camera");
    }
  }

  function handleBack() {
    if (step === "posted") {
      router.replace("/feed");
    } else if (step === "post") {
      setStep("checkin");
    } else {
      backToCamera();
    }
  }

  async function checkIn() {
    if (checkingIn) return;

    setError("");

    if (!draft?.areaId) {
      setError("ไม่พบข้อมูลสถานที่ กรุณาเลือกสถานที่ใหม่");
      return;
    }

    if (!draft?.uri) {
      setError("ไม่พบรูปภาพ กรุณาถ่ายรูปใหม่");
      return;
    }

    setCheckingIn(true);

    try {
      // 1. Request GPS permission
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        throw new Error("กรุณาอนุญาตให้เข้าถึงตำแหน่ง GPS");
      }

      // 2. Get current GPS coordinates
      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const { latitude, longitude } = currentLocation.coords;

      // 3. Capture the photo as Base64
      const image = await captureRef(frameRef, {
        format: "jpg",
        quality: 0.8,
        result: "data-uri",
      });

      // 4. Send image and GPS to backend Check-in API
      const result = await apiRequest("/checkins/", {
        method: "POST",
        body: JSON.stringify({
          area_id: draft.areaId,
          latitude,
          longitude,
          image,
        }),
      });

      // Support the RPC response containing a checkin object
      const checkin =
        result?.checkin ??
        result?.[0]?.checkin ??
        result?.[0] ??
        result;

      if (checkin?.status !== "success") {
        throw new Error(
          "เช็คอินไม่สำเร็จ คุณอาจอยู่ห่างจากสถานที่เกิน 100 เมตร"
        );
      }

      if (!checkin?.check_in_id) {
        throw new Error("ไม่พบข้อมูล Check-in กรุณาลองใหม่");
      }

      // 5. Save successful Check-in ID
      setCheckinId(checkin.check_in_id);
      setStep("checkedIn");
    } catch (e) {
      console.log("CHECK-IN ERROR:", e);
      setError(e.message || "เช็คอินไม่สำเร็จ");
    } finally {
      setCheckingIn(false);
    }
  }

  async function submitPost() {
    if (posting) return;

    if (!checkinId) {
      setError("กรุณาเช็คอินให้สำเร็จก่อนโพสต์");
      return;
    }

    setError("");
    setDropdownOpen(false);
    setPosting(true);

    try {
      // Create a post linked to the successful Check-in
      await apiRequest("/posts/", {
        method: "POST",
        body: JSON.stringify({
          check_in_id: checkinId,
          caption: caption.trim(),
          visibility,
        }),
      });

      clearDraftPost();
      setStep("posted");
    } catch (e) {
      console.log("CREATE POST ERROR:", e);
      setError(e.message || "โพสต์ไม่สำเร็จ");
    } finally {
      setPosting(false);
    }
  }

  if (!draft) {
    return (
      <Screen bg="bg-sage-light">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-base font-normal text-ink">
            ไม่พบรูปภาพ
          </Text>
          <PillButton
            label="กลับไปถ่ายรูป"
            onPress={() => router.replace("/Camera")}
          />
        </View>
      </Screen>
    );
  }

  const isPostStep = step === "post" || step === "posted";

  const visibilityLabel =
    VISIBILITY_OPTIONS.find((o) => o.value === visibility)?.label;

  return (
    <Screen bg="bg-sage-light">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="mb-2 h-6 flex-row items-center px-2"
            style={{ marginTop: 64 }}
          >
            <Pressable
              onPress={handleBack}
              hitSlop={10}
              accessibilityLabel="back"
              className="self-start"
            >
              <Image
                source={icons.back}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />
            </Pressable>
          </View>

          {/* Photo frame */}
          <View style={styles.frame}>
            <View
              ref={frameRef}
              collapsable={false}
              style={StyleSheet.absoluteFill}
            >
              <Image
                source={{ uri: draft.uri }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />

              {draft.showAvatar && (
                <Avatar outfit={draft.outfit} style={styles.avatar} />
              )}
            </View>

            {step === "posted" && (
              <Popup title="โพสต์สำเร็จ" placement="photo">
                <View className="items-center">
                  <PillButton
                    label="ตรวจสอบ"
                    size="sm"
                    onPress={() => router.replace("/feed")}
                  />
                </View>
              </Popup>
            )}
          </View>

          <View className="mt-7" style={{ zIndex: 20, elevation: 20 }}>
            {step === "checkin" && (
              <View className="flex-row items-center">
                <Image
                  source={icons.location}
                  style={{ width: 20, height: 20, marginRight: 6 }}
                  contentFit="contain"
                />

                <View className="flex-1">
                  <Pill>
                    <Text
                      style={inputStyle}
                      numberOfLines={1}
                    >
                      {locationName || "ไม่พบชื่อสถานที่"}
                    </Text>
                  </Pill>
                </View>
              </View>
            )}

            {step === "checkedIn" && (
              <View className="mx-2">
                <Pill />
              </View>
            )}

            {isPostStep && (
              <View className="mx-2">
                <Pill icon={icons.caption}>
                  <TextInput
                    value={caption}
                    onChangeText={setCaption}
                    placeholder="คำบรรยาย"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    style={inputStyle}
                    editable={step === "post"}
                  />
                </Pill>

                <View className="mt-3" style={{ zIndex: 10 }}>
                  <Pressable
                    disabled={step !== "post"}
                    onPress={() => setDropdownOpen((v) => !v)}
                  >
                    <Pill icon={icons.visibility}>
                      <Text
                        style={[
                          inputStyle,
                          !visibilityLabel && {
                            color: PLACEHOLDER_COLOR,
                          },
                        ]}
                      >
                        {visibilityLabel ?? "ระดับการเข้าถึง"}
                      </Text>
                    </Pill>
                  </Pressable>

                  {dropdownOpen && (
                    <View
                      className="absolute left-0 right-0 overflow-hidden rounded-2xl bg-paper"
                      style={[shadow, { top: 40, elevation: 8 }]}
                    >
                      {VISIBILITY_OPTIONS.map((o) => (
                        <Pressable
                          key={o.value}
                          onPress={() => {
                            setVisibility(o.value);
                            setDropdownOpen(false);
                          }}
                          className={`px-4 py-2 ${
                            visibility === o.value ? "bg-line" : ""
                          }`}
                        >
                          <Text style={inputStyle}>{o.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}

            {!!error && (
              <Text className="mt-2 text-center text-sm font-normal text-red-600">
                {error}
              </Text>
            )}
          </View>

          <View className="mt-auto items-center pt-10">
            {step === "checkin" ? (
              checkingIn ? (
                <ActivityIndicator color="#3E513B" />
              ) : (
                <PillButton
                  label="เช็คอิน"
                  onPress={checkIn}
                />
              )
            ) : step === "checkedIn" ? (
              <View />
            ) : posting ? (
              <ActivityIndicator color="#3E513B" />
            ) : (
              <PillButton
                label="โพสต์"
                onPress={submitPost}
                disabled={step === "posted"}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {step === "checkedIn" && (
        <Popup title="เช็คอินสำเร็จ!">
          <View className="flex-row justify-between px-2">
            <PillButton
              label="กลับ"
              size="sm"
              onPress={backToCamera}
            />
            <PillButton
              label="โพสต์"
              size="sm"
              onPress={() => {
                setError("");
                setStep("post");
              }}
            />
          </View>
        </Popup>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 24,
    borderWidth: 5,
    borderColor: "#8A9E7A",
    overflow: "hidden",
    backgroundColor: "#1F2A1F",
  },
  avatar: {
    position: "absolute",
    left: "10%",
    bottom: "10%",
    height: "45%",
  },
});
