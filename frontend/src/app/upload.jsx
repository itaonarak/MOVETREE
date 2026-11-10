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

// Values sent to the backend `posts.visibility` column
const VISIBILITY_OPTIONS = [
  { value: "public", label: "สาธารณะ" },
  { value: "friends", label: "เฉพาะเพื่อน" },
  { value: "private", label: "เฉพาะฉัน" },
];

const shadow = {
  elevation: 4,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
};

const PLACEHOLDER_COLOR = "#6B7A68";
// TextInput doesn't inherit fonts, so set Bai Jamjuree explicitly — the
// placeholder is drawn with the same font.
const inputStyle = {
  fontFamily: "BaiJamjuree_400Regular",
  fontSize: 13,
  color: "#1C1B1F",
  padding: 0,
};

// Rounded input pill. `icon` (optional) sits inside the pill on the left.
function Pill({ icon, children }) {
  return (
    <View className="h-9 flex-row items-center rounded-full bg-paper px-3" style={shadow}>
      {icon && (
        <Image source={icon} style={{ width: 20, height: 20, marginRight: 6 }} contentFit="contain" />
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
      className={`items-center justify-center rounded-xl bg-brand ${big ? "h-11 px-6" : "h-8 px-5"}`}
      style={({ pressed }) => [shadow, { opacity: pressed ? 0.8 : 1 }]}
    >
      <Text className={`font-semibold text-paper ${big ? "text-base" : "text-sm"}`}>{label}</Text>
    </Pressable>
  );
}


// placement: "screen" = centered on the screen, "photo" = over the bottom of the photo
function Popup({ title, children, placement = "screen" }) {
  const onPhoto = placement === "photo";
  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: 50, elevation: 50 }, onPhoto && { paddingBottom: 16 }]}
      className={`items-center ${onPhoto ? "justify-end" : "justify-center"}`}
    >
      <View
        className="items-center justify-center rounded-2xl bg-paper px-5"
        style={[shadow, POPUP_SIZE]}
      >
        <Text className="mb-4 text-center text-base font-semibold text-ink">{title}</Text>
        <View className="w-full">{children}</View>
      </View>
    </View>
  );
}

export default function Upload() {
  // Read once on mount — the draft is set by the camera right before navigating here
  const [draft] = useState(getDraftPost);
  const frameRef = useRef(null);

  // checkin --เช็คอิน--> checkedIn (popup) --โพสต์--> post --โพสต์--> posted (popup)
  const [step, setStep] = useState("checkin");
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  function backToCamera() {
    clearDraftPost();
    if (router.canGoBack()) router.back();
    else router.replace("/Camera");
  }

  function handleBack() {
    if (step === "posted") router.replace("/feed");
    else if (step === "post") setStep("checkin"); // back to the check-in step first
    else backToCamera();
  }

  function checkIn() {
    if (!location.trim()) {
      setError("กรุณาระบุสถานที่");
      return;
    }
    setError("");
    setStep("checkedIn");
  }

  async function submitPost() {
    if (posting) return;
    setError("");
    setDropdownOpen(false);
    setPosting(true);
    try {
      // Snapshot the frame so the character (when shown) is baked into the photo
      const image = await captureRef(frameRef, {
        format: "jpg",
        quality: 0.8,
        result: "data-uri",
      });
      await apiRequest("/posts/", {
        method: "POST",
        body: JSON.stringify({
          image,
          caption: caption.trim(),
          location: location.trim(),
          visibility: visibility ?? "public",
        }),
      });
      clearDraftPost();
      setStep("posted");
    } catch (e) {
      setError(e.message || "โพสต์ไม่สำเร็จ");
    } finally {
      setPosting(false);
    }
  }

  if (!draft) {
    // Opened directly (e.g. page refresh) — nothing to upload
    return (
      <Screen bg="bg-sage-light">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-base font-normal text-ink">ไม่พบรูปภาพ</Text>
          <PillButton label="กลับไปถ่ายรูป" onPress={() => router.replace("/Camera")} />
        </View>
      </Screen>
    );
  }

  const isPostStep = step === "post" || step === "posted";
  const visibilityLabel = VISIBILITY_OPTIONS.find((o) => o.value === visibility)?.label;

  return (
    <Screen bg="bg-sage-light">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Same offset as the camera's toggle row (paddingTop 64 + 24px row + mb-2) so the photo frame doesn't move */}
          <View className="mb-2 h-6 flex-row items-center px-2" style={{ marginTop: 64 }}>
            <Pressable onPress={handleBack} hitSlop={10} accessibilityLabel="back" className="self-start">
              <Image source={icons.back} style={{ width: 24, height: 24 }} contentFit="contain" />
            </Pressable>
          </View>

          {/* Photo frame — the inner view is what gets captured and uploaded */}
          <View style={styles.frame}>
            <View ref={frameRef} collapsable={false} style={StyleSheet.absoluteFill}>
              <Image source={{ uri: draft.uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
              {draft.showAvatar && <Avatar outfit={draft.outfit} style={styles.avatar} />}
            </View>

            {/* Post-success popup — over the bottom of the photo */}
            {step === "posted" && (
              <Popup title="โพสต์สำเร็จ" placement="photo">
                <View className="items-center">
                  <PillButton label="ตรวจสอบ" size="sm" onPress={() => router.replace("/feed")} />
                </View>
              </Popup>
            )}

          </View>

          <View className="mt-7" style={{ zIndex: 20, elevation: 20 }}>
            {step === "checkin" && (
              // Location: icon outside, to the left of the pill
              <View className="flex-row items-center">
                <Image
                  source={icons.location}
                  style={{ width: 20, height: 20, marginRight: 6 }}
                  contentFit="contain"
                />
                <View className="flex-1">
                  <Pill>
                    <TextInput
                      value={location}
                      onChangeText={setLocation}
                      placeholder="สถานที่"
                      placeholderTextColor={PLACEHOLDER_COLOR}
                      style={inputStyle}
                    />
                  </Pill>
                </View>
              </View>
            )}

            {step === "checkedIn" && (
              // While the check-in popup is open: plain empty pill, no icon
              <View className="mx-2">
                <Pill />
              </View>
            )}

            {isPostStep && (
              <View className="mx-2">
                {/* Caption */}
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

                {/* Visibility dropdown — stays visible (locked) after posting, as in the design */}
                {isPostStep && (
                  <View className="mt-3" style={{ zIndex: 10 }}>
                    <Pressable disabled={step !== "post"} onPress={() => setDropdownOpen((v) => !v)}>
                      <Pill icon={icons.visibility}>
                        <Text style={[inputStyle, !visibilityLabel && { color: PLACEHOLDER_COLOR }]}>
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
                            className={`px-4 py-2 ${visibility === o.value ? "bg-line" : ""}`}
                          >
                            <Text style={inputStyle}>{o.label}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}

            {!!error && <Text className="mt-2 text-center text-sm font-normal text-red-600">{error}</Text>}
          </View>

          <View className="mt-auto items-center pt-10">
            {!isPostStep ? (
              <PillButton label="เช็คอิน" onPress={checkIn} disabled={step !== "checkin"} />
            ) : posting ? (
              <ActivityIndicator color="#3E513B" />
            ) : (
              <PillButton label="โพสต์" onPress={submitPost} disabled={step === "posted"} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Check-in popup — centered on the screen */}
      {step === "checkedIn" && (
        <Popup title="เช็คอินสำเร็จ!">
          <View className="flex-row justify-between px-2">
            <PillButton label="กลับ" size="sm" onPress={backToCamera} />
            <PillButton label="โพสต์" size="sm" onPress={() => setStep("post")} />
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
  // Same placement as the camera overlay so the photo looks identical
  avatar: {
    position: "absolute",
    left: "10%",
    bottom: "10%",
    height: "45%",
  },
});
