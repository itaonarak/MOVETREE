
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

import { Screen } from "@/components/Screen";
import { apiRequest } from "@/services/api";
import { getDraftPost, setDraftPost } from "@/services/draftPost";

export default function SelectPlace() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const data = await apiRequest("/places/");
        setPlaces(data.places || []);
      } catch (e) {
        console.error("FETCH PLACES ERROR:", e);
        setError("โหลดรายชื่อสถานที่ไม่สำเร็จ กรุณาลองใหม่");
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  function choosePlace(place) {
    const draft = getDraftPost();

    if (!draft?.uri) {
      setError("ไม่พบรูปภาพ กรุณากลับไปเลือกรูปใหม่");
      return;
    }

    setDraftPost({
      ...draft,
      areaId: place.area_id,
      placeName: place.name,
      latitude: String(place.latitude),
      longitude: String(place.longitude),
      mode: "checkin",
    });

    router.replace("/upload");
  }

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/Camera");
    }
  }

  return (
    <Screen bg="bg-sage-light">
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={goBack} hitSlop={10}>
            <Text style={styles.back}>‹</Text>
          </Pressable>

          <Text style={styles.title}>เลือกสถานที่</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>
          เลือกสถานที่ที่คุณต้องการเช็คอิน
        </Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#3E513B" />
            <Text style={styles.message}>กำลังโหลดสถานที่...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>

            <Pressable
              onPress={() => {
                setLoading(true);
                setError("");
                apiRequest("/places/")
                  .then((data) => setPlaces(data.places || []))
                  .catch(() =>
                    setError("โหลดรายชื่อสถานที่ไม่สำเร็จ กรุณาลองใหม่")
                  )
                  .finally(() => setLoading(false));
              }}
              style={styles.retry}
            >
              <Text style={styles.retryText}>ลองอีกครั้ง</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {places.map((place) => (
              <Pressable
                key={place.area_id}
                onPress={() => choosePlace(place)}
                style={({ pressed }) => [
                  styles.place,
                  pressed && { opacity: 0.7 },
                ]}
              >
                {place.image_url ? (
                  <Image
                    source={{ uri: place.image_url }}
                    style={styles.image}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}

                <View style={styles.placeInfo}>
                  <Text style={styles.placeName}>
                    {place.name}
                  </Text>

                  <Text style={styles.address}>
                    {place.address || place.description || ""}
                  </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
              </Pressable>
            ))}

            {places.length === 0 && (
              <Text style={styles.message}>
                ยังไม่มีสถานที่ให้เลือก
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 36,
    color: "#3E513B",
    lineHeight: 40,
  },
  title: {
    fontFamily: "BaiJamjuree_600SemiBold",
    fontSize: 22,
    color: "#3E513B",
  },
  subtitle: {
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 14,
    color: "#6B7A68",
    marginTop: 12,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 32,
    gap: 12,
  },
  place: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    gap: 12,
    elevation: 2,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: "#DDE5D8",
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontFamily: "BaiJamjuree_600SemiBold",
    fontSize: 15,
    color: "#1F2A1F",
  },
  address: {
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 12,
    color: "#6B7A68",
    marginTop: 5,
  },
  arrow: {
    fontFamily: "BaiJamjuree_400Regular",
    fontSize: 26,
    color: "#3E513B",
    paddingHorizontal: 4,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontFamily: "BaiJamjuree_400Regular",
    color: "#6B7A68",
    marginTop: 12,
    textAlign: "center",
  },
  error: {
    fontFamily: "BaiJamjuree_400Regular",
    color: "#C62828",
    textAlign: "center",
  },
  retry: {
    marginTop: 16,
    backgroundColor: "#3E513B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "#FFFFFF",
  },
});