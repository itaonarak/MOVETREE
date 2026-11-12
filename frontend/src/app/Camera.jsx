
import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";

import { Screen } from "@/components/Screen";
import { Avatar } from "@/components/Avatar";
import { useOutfit } from "@/services/outfit";
import { BottomNav } from "@/components/BottomNav";
import { setDraftPost } from "@/services/draftPost";

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

  if (w / h > target) {
    w = Math.round(h * target);
  } else {
    h = Math.round(w / target);
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  canvas.getContext("2d").drawImage(
    img,
    (img.naturalWidth - w) / 2,
    (img.naturalHeight - h) / 2,
    w,
    h,
    0,
    0,
    w,
    h
  );

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

function IconButton({
  source,
  pressedSource,
  onPress,
  size = 24,
  disabled = false,
}) {
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
  const params = useLocalSearchParams();

  const isCheckin = params.mode === "checkin";

  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState(
    Platform.OS === "web" ? "front" : "back"
  );

  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true);
  const [cameraError, setCameraError] = useState("");

  const { equipped } = useOutfit();

  function handleTab(tab) {
    if (tab === "camera") return;
    if (tab === "home") router.replace("/feed");
    if (tab === "tasks") router.replace("/mission");
    if (tab === "profile") router.replace("/profile");
  }

  function openUpload(uri) {
  const placeName =
    params.title || params.placeName || params.name || "";

  const areaId = params.area_id || params.id || null;

  setDraftPost({
    uri,
    showAvatar,
    outfit: equipped,
    mode: "checkin",
    areaId,
    latitude: params.latitude || null,
    longitude: params.longitude || null,
    placeName,
  });

  // ถ้ามาจากแผนที่และมีสถานที่แล้ว ให้ไป Upload เลย
  // ถ้าเข้าจากแถบกล้อง ให้เลือกสถานที่ก่อน
  if (areaId && placeName) {
    router.push("/upload");
  } else {
    router.push("/selectPlace");
  }
}

  async function takePhoto() {
    if (!cameraRef.current || !ready || busy) return;

    setBusy(true);

    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (!result?.uri) {
        throw new Error("ไม่พบไฟล์รูปภาพที่ถ่ายได้");
      }

      const croppedUri = await cropTo3x4OnWeb(result.uri);
      openUpload(croppedUri);
    } catch (error) {
      console.error("TAKE PHOTO ERROR:", error);
      setCameraError("ถ่ายรูปไม่สำเร็จ กรุณาตรวจสอบกล้องแล้วลองอีกครั้ง");
    } finally {
      setBusy(false);
    }
  }

  async function pickFromGallery() {
    if (busy) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      const croppedUri = await cropTo3x4OnWeb(result.assets[0].uri);
      openUpload(croppedUri);
    } catch (error) {
      console.error("GALLERY ERROR:", error);
      setCameraError("เลือกรูปภาพไม่สำเร็จ กรุณาลองอีกครั้ง");
    }
  }

  function flipCamera() {
    setReady(false);
    setCameraError("");

    setFacing((current) =>
      current === "back" ? "front" : "back"
    );
  }

  function handleCameraReady() {
    console.log("CAMERA READY");
    setCameraError("");
    setReady(true);
  }

  function handleCameraError(event) {
    console.error("CAMERA ERROR:", event);
    setReady(false);
    setCameraError(
      "ไม่พบกล้องที่ใช้งานได้ กรุณาตรวจสอบการเชื่อมต่อกล้องและสิทธิ์ในเบราว์เซอร์"
    );
  }

  function renderFrameContent() {
    if (!permission) return null;

    if (!permission.granted) {
      return (
        <View style={styles.permissionBox}>
          <Text style={styles.permissionText}>
            ต้องการสิทธิ์เข้าถึงกล้องเพื่อถ่ายรูป
          </Text>

          <Pressable
            onPress={
              permission.canAskAgain || Platform.OS === "web"
                ? requestPermission
                : () => Linking.openSettings()
            }
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>
              {permission.canAskAgain || Platform.OS === "web"
                ? "อนุญาต"
                : "เปิดการตั้งค่า"}
            </Text>
          </Pressable>
        </View>
      );
    }

    return (
      <>
        <CameraView
          key={facing}
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          mirror={facing === "front"}
          onCameraReady={handleCameraReady}
          onMountError={handleCameraError}
        />

        {cameraError ? (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>{cameraError}</Text>

            <Pressable
              onPress={flipCamera}
              style={styles.retryButton}
            >
              <Text style={styles.permissionButtonText}>
                ลองใช้กล้องอีกด้าน
              </Text>
            </Pressable>
          </View>
        ) : null}
      </>
    );
  }

  return (
    <Screen bg="bg-sage-light">
      <View className="flex-1 px-6" style={{ paddingTop: 64 }}>
        {/* ปุ่มด้านบนตามโค้ดต้นฉบับ */}
        <View className="mb-2 flex-row items-center gap-3 px-2">
          <IconButton
            source={showAvatar ? icons.switchOn : icons.switchOff}
            onPress={() => setShowAvatar((value) => !value)}
          />

          <IconButton
            source={icons.dressOff}
            pressedSource={icons.dressOn}
            onPress={() => router.push("/get_dress")}
          />
        </View>

        {/* กรอบกล้อง */}
        <View style={styles.frame}>
          {renderFrameContent()}

          {showAvatar && permission?.granted && (
            <Avatar
              outfit={equipped}
              style={styles.avatar}
            />
          )}
        </View>

        {/* ปุ่มควบคุมตามโค้ดต้นฉบับ */}
        <View className="mt-8 flex-row items-center justify-between px-10">
          <IconButton
            source={icons.gallery}
            size={34}
            onPress={pickFromGallery}
            disabled={busy}
          />

          <Pressable
            onPress={takePhoto}
            disabled={!permission?.granted || !ready || busy}
            style={({ pressed }) => [
              styles.shutter,
              pressed && { transform: [{ scale: 0.94 }] },
              (!permission?.granted || !ready || busy) && {
                opacity: 0.5,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="ถ่ายรูป"
          />

          <IconButton
            source={icons.flip}
            size={30}
            onPress={flipCamera}
            disabled={!permission?.granted || busy}
          />
        </View>
      </View>

      {!isCheckin && (
        <BottomNav
          active="camera"
          onPress={handleTab}
        />
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

  permissionBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#E8F5E9",
  },

  permissionText: {
    textAlign: "center",
    color: "#1F2A1F",
    marginBottom: 16,
    fontWeight: "500",
  },

  permissionButton: {
    borderRadius: 12,
    backgroundColor: "#3E513B",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  permissionButtonText: {
    fontWeight: "600",
    color: "#FFFFFF",
  },

  avatar: {
    position: "absolute",
    left: "10%",
    bottom: "10%",
    height: "45%",
  },

  shutter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#3E513B",
  },

  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#1F2A1F",
  },

  errorText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },

  retryButton: {
    borderRadius: 12,
    backgroundColor: "#8A9E7A",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
