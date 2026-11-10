
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Screen } from "@/components/Screen";
import { IconComponent } from "@/components/IconComponent";
import { apiRequest } from "@/services/api";

const initialPosition = [13.729904514961802, 100.53998733982104];

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });

  return null;
}

const MapWeb = () => {
  const [places, setPlaces] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await apiRequest("/places/");
        setPlaces(data.places || []);
      } catch (err) {
        console.error("FETCH PLACES ERROR:", err);
        setError(err.message || "ไม่สามารถโหลดสถานที่ได้");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/feed");
  }

  function handlePlacePress(place) {
    router.push({
      pathname: "/locationDetails",
      params: {
        id: place.area_id,
        title: place.name,
        latitude: String(place.latitude),
        longitude: String(place.longitude),
        description: place.description || "",
        address: place.address || "",
        image_url: place.image_url || "",
        activities: JSON.stringify([]),
        activitiesImages: JSON.stringify([]),
        activitiesDetails: JSON.stringify([]),
        images: JSON.stringify(
          place.image_url ? [place.image_url] : []
        ),
      },
    });
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={10}>
          <IconComponent
            source={require("assets/icon/header/back_normal.svg")}
            style={styles.headerIcon}
          />
        </Pressable>
        <Text style={styles.headerText}>แผนที่</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapContainer
          center={initialPosition}
          zoom={14}
          style={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onMapClick={setSelectedLocation} />

          {places.map((place) => (
            <CircleMarker
              key={place.area_id}
              center={[
                Number(place.latitude),
                Number(place.longitude),
              ]}
              radius={10}
              pathOptions={{
                color: "#ff5252",
                fillColor: "#ff5252",
                fillOpacity: 1,
              }}
              eventHandlers={{
                click: () => handlePlacePress(place),
              }}
            >
              <Popup>
                <strong>{place.name}</strong>
                <br />
                {place.address || place.description || ""}
                <br />
                <button onClick={() => handlePlacePress(place)}>
                  ดูรายละเอียด
                </button>
              </Popup>
            </CircleMarker>
          ))}

          {selectedLocation && (
            <CircleMarker
              center={[
                selectedLocation.latitude,
                selectedLocation.longitude,
              ]}
              radius={8}
              pathOptions={{
                color: "#1565c0",
                fillColor: "#2196f3",
                fillOpacity: 1,
              }}
            >
              <Popup>ตำแหน่งที่เลือก</Popup>
            </CircleMarker>
          )}
        </MapContainer>

        {loading && (
          <View style={styles.status}>
            <ActivityIndicator size="large" />
            <Text>กำลังโหลดสถานที่...</Text>
          </View>
        )}

        {!!error && (
          <View style={styles.status}>
            <Text style={{ color: "red" }}>{error}</Text>
          </View>
        )}
      </View>
    </Screen>
  );
};

export default MapWeb;

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 24,
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
  mapContainer: {
    flex: 1,
    minHeight: 400,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  status: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
  },
});
