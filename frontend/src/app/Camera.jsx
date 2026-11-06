import { useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Linking, Platform } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Screen } from "@/components/Screen";
import { Avatar } from "@/components/Avatar";
import { useOutfit } from "@/services/outfit";
import { BottomNav } from "@/components/BottomNav";
import { setDraftPost } from "@/services/draftPost";

// expo-camera's CameraView is backed by CameraX on Android.
// ratio="4:3" locks the sensor output to 4:3; the frame below is 3:4 (portrait),
// so the preview fills it exactly and captured photos match what the user sees.
const RATIO = "4:3";

// On web the `ratio` prop is ignored: the webcam usually streams 16:9 and the
// preview is only cover-cropped visually, so takePictureAsync returns the full
// frame. Center-crop the result to 3:4 (portrait 4:3) so web photos match too.
async function cropTo3x4OnWeb(uri) {
  if (Platform.OS !== "web") return uri;
  const img = await new Promise((resolve, reject) => {
    const el = new window.Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = uri;
  });
  const target = 3 / 4;
  let w = img.naturalWidth;
  let h = img.naturalHeight;
  if (w / h > target) w = Math.round(h * target);
  else h = Math.round(w / target);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas
    .getContext("2d")
    .drawImage(img, (img.naturalWidth - w) / 2, (img.naturalHeight - h) / 2, w, h, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.8);
}

const icons = {
  switchOff: require("assets/icon/camera/switch1_normal.svg"),
  switchOn: require("assets/icon/camera/switch2_active.svg"),
  dressOff: require("assets/icon/camera/dress1_normal.svg"),
  dressOn: require("assets/icon/camera/dress2_active.svg"),
  gallery: require("assets/icon/camera/gallery_normal.svg"),
  flip: require("assets/icon/camera/camera-switch_default.svg"),
};

// `pressedSource` (optional) swaps to the "active" icon while the finger is down.
function IconButton({ source, pressedSource, onPress, size = 24, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      style={({ pressed }) => ({
        opacity: disabled ? 0.4 : pressed && !pressedSource ? 0.6 : 1,
      })}
    >
      {({ pressed }) => (
        <Image
          source={pressed && pressedSource ? pressedSource : source}
          style={{ width: size, height: size }}
          contentFit="contain"
        />
      )}
    </Pressable>
  );
}

export default function Camera() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true); // toggle switch
  const { equipped } = useOutfit(); // outfit chosen on the get_dress screen

  function handleTab(tab) {
    if (tab === "camera") return;
    if (tab === "home") router.replace("/feed");
    if (tab === "tasks") router.replace("/mission");
    if (tab === "profile") router.replace("/profile");
  }

  // Hand the photo (plus whether the character is shown) to the upload page
  function openUpload(uri) {
    setDraftPost({ uri, showAvatar, outfit: equipped });
    router.push("/upload");
  }

  async function takePhoto() {
    if (!cameraRef.current || !ready || busy) return;
    setBusy(true);
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      openUpload(await cropTo3x4OnWeb(result.uri));
    } catch (e) {
      console.warn("takePictureAsync failed", e);
    } finally {
      setBusy(false);
    }
  }

  async function pickFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4], // keep gallery photos in the same 4:3 frame
      quality: 0.8,
    });
    if (!result.canceled) openUpload(await cropTo3x4OnWeb(result.assets[0].uri));
  }

  function flipCamera() {
    setReady(false);
    setFacing((f) => (f === "back" ? "front" : "back"));
  }

  function renderFrameContent() {
    if (!permission) return null; // still loading permission state

    if (!permission.granted) {
      return (
        <View style={styles.permissionBox}>
          <Text className="mb-4 text-center font-medium text-ink">
            ต้องการสิทธิ์เข้าถึงกล้องเพื่อถ่ายรูป
          </Text>
          <Pressable
            onPress={permission.canAskAgain || Platform.OS === "web" ? requestPermission : () => Linking.openSettings()}
            className="rounded-xl bg-brand px-5 py-2"
          >
            <Text className="font-semibold text-white">
              {permission.canAskAgain || Platform.OS === "web" ? "อนุญาต" : "เปิดการตั้งค่า"}
            </Text>
          </Pressable>
        </View>
      );
    }

    return (
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        ratio={RATIO}
        mirror={facing === "front"}
        onCameraReady={() => setReady(true)}
      />
    );
  }

  return (
    <Screen bg="bg-sage-light">
      <View className="flex-1 px-6" style={{ paddingTop: 64 }}>
        {/* top toggles */}
        <View className="mb-2 flex-row items-center gap-3 px-2">
          <IconButton
            source={showAvatar ? icons.switchOn : icons.switchOff}
            onPress={() => setShowAvatar((v) => !v)}
          />
          <IconButton
            source={icons.dressOff}
            pressedSource={icons.dressOn}
            onPress={() => router.push("/get_dress")}
          />
        </View>

        {/* 4:3 preview frame (portrait => width:height = 3:4) */}
        <View style={styles.frame}>
          {renderFrameContent()}
          {showAvatar && permission?.granted && (
            <Avatar outfit={equipped} style={styles.avatar} />
          )}
        </View>

        {/* controls */}
        <View className="mt-8 flex-row items-center justify-between px-10">
          <IconButton source={icons.gallery} size={34} onPress={pickFromGallery} />
          <Pressable
            onPress={takePhoto}
            disabled={!permission?.granted || !ready || busy}
            style={({ pressed }) => [styles.shutter, pressed && { transform: [{ scale: 0.94 }] }]}
            accessibilityRole="button"
            accessibilityLabel="ถ่ายรูป"
          />
          <IconButton
            source={icons.flip}
            size={30}
            onPress={flipCamera}
            disabled={!permission?.granted}
          />
        </View>
      </View>

      <BottomNav active="camera" onPress={handleTab} />
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
  permissionBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#E8F5E9",
  },
  avatar: {
    position: "absolute",
    left: "10%",
    bottom: "10%",
    height: "45%", // width follows the avatar's aspect ratio
  },
  shutter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#3E513B",
  },
});
