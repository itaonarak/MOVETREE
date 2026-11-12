
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { IconComponent } from "@/components/IconComponent";
import { apiRequest } from "@/services/api";

const Map = () => {
  const initialRegion = {
    latitude: 13.729904514961802,
    longitude: 100.53998733982104,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/feed");
  }

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await apiRequest("/places/");

        console.log("PLACES RESPONSE:", data);

        const validPlaces = (data.places || []).filter(
          (place) =>
            place.area_id &&
            Number.isFinite(Number(place.latitude)) &&
            Number.isFinite(Number(place.longitude))
        );

        console.log("VALID PLACES:", validPlaces);

        setPlaces(validPlaces);
      } catch (err) {
        console.error("FETCH PLACES ERROR:", err);
        setError(err.message || "ไม่สามารถโหลดสถานที่ได้");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handlePlacePress = (place) => {
    router.push({
      pathname: "/locationDetails",
      params: {
        id: place.area_id,
        area_id: place.area_id,
        title: place.name,
        latitude: String(place.latitude),
        longitude: String(place.longitude),
        description: place.description || "",
        address: place.address || "",
        image_url: place.image_url || "",
        activities: JSON.stringify([]),
        activitiesImages: JSON.stringify([]),
        activitiesDetails: JSON.stringify([]),
      },
    });
  };

  return (
    <Screen>
      <View
        className="h-14 flex-row items-center"
        style={{ justifyContent: "space-between" }}
      >
        <Pressable onPress={goBack} hitSlop={10}>
          <IconComponent
            source={require("assets/icon/header/back_normal.svg")}
            style={styles.headerIcon}
          />
        </Pressable>

        <Text style={styles.headerText}>แผนที่</Text>
      </View>

      <View className="flex-1 bg-sage-light">
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={false}
          showsPoi={false}
        >
          {places.map((place) => (
            <Marker
              key={place.area_id}
              coordinate={{
                latitude: Number(place.latitude),
                longitude: Number(place.longitude),
              }}
              title={place.name}
              description={place.address || place.description || ""}
              onPress={() => handlePlacePress(place)}
              pinColor="red"
            >
              <View style={styles.customPoiMarker}>
                <Image
                  source={require("assets/profile/demo.png")}
                  style={{ width: 25, height: 25 }}
                />
              </View>
            </Marker>
          ))}
        </MapView>

        {loading && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" />
            <Text>กำลังโหลดสถานที่...</Text>
          </View>
        )}

        {!!error && (
          <View style={styles.statusContainer}>
            <Text style={{ color: "red" }}>{error}</Text>
          </View>
        )}

        {!loading && !error && places.length === 0 && (
          <View style={styles.statusContainer}>
            <Text>ไม่พบข้อมูลสถานที่</Text>
          </View>
        )}
      </View>
    </Screen>
  );
};

export default Map;

const styles = StyleSheet.create({
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
  map: {
    width: "100%",
    height: "100%",
  },
  customPoiMarker: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "#ff5252",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusContainer: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    elevation: 4,
  },
});
