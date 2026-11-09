import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { IconComponent } from "@/components/IconComponent";
import activitiesDetails from "./activitiesDetails";

const map = () => {
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/feed");
  }

  const initialRegion = {
    latitude: 13.729904514961802,
    longitude: 100.53998733982104,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // State for user-dropped markers or selected locations
  // REPLACE WITH CURRENT LOCATION
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 13.729904514961802,
    longitude: 100.53998733982104,
  });

  // Example list of Custom POIs
  // PLACEHOLDER
  const [customPOIs] = useState([
    {
      id: "1",
      latitude: 13.73152709749645,
      longitude: 100.54174131154014,
      title: "สวนลุมพินี",
      description: "PLACEHOLDER",
      activities: ["สนามเด็กเล่น", "2", "3", "4"],
      activitiesImages: [""],
      activitiesDetails: [
        " สนามเด็กเล่นที่สวนลุมพินีมีมากมายเพื่อส่งเสริมพัฒนาการของเด็ก, เพื่อให้ผู้ปกครองได้ทำกิจกรรมร่วมกับลูกๆ และเพื่อให้เด็กได้ทำกิจกรรมร่วมกับเพื่อนวัยที่ใกล้เคียงกัน",
      ], //IN ORDER OF THE ABOVE
      images: [""], //REPLACE WITH ACTUAL VALUES
    },
  ]);

  // Handle tap anywhere on the map to place a pin
  const handleMapPress = (e) => {
    const coords = e.nativeEvent.coordinate;
    setSelectedLocation(coords);
  };

  return (
    <Screen>
      {/* header */}
      <View
        className="h-14 flex-row items-center"
        style={{ justifyContent: "space-between" }}
      >
        <Pressable onPress={goBack} hitSlop={10}>
          <IconComponent
            source={require("assets/icon/header/back_normal.svg")}
            style={styles.headerIcon}
          ></IconComponent>
        </Pressable>
        <Text style={styles.headerText}>แผนที่</Text>
      </View>
      {/* end of header */}

      <View className="flex-1 bg-sage-light">
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true} // Shows blue dot for user's current location (requires permission)
          showsPoi={false} // Optional: hides default cluttered Google/Apple POIs
          onPress={handleMapPress} // Listens to tap events to move selected pin
        >
          {/* Render pre-defined Custom POIs with custom styled markers */}
          {customPOIs.map((poi) => (
            <Marker
              key={poi.id}
              coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
              title={poi.title}
              description={poi.description}
              onPress={() => {
                router.push({
                  pathname: "/locationDetails",
                  params: {
                    id: poi.id,
                    title: poi.title,
                    latitude: poi.latitude,
                    longitude: poi.longitude,
                    description: poi.description,
                    // Stringify arrays and objects for route params
                    activities: JSON.stringify(poi.activities),
                    activitiesImages: JSON.stringify(poi.activitiesImages),
                    activitiesDetails: JSON.stringify(poi.activitiesDetails),
                    images: JSON.stringify(poi.images),
                  },
                });
              }}
            >
              <View style={styles.customPoiMarker}>
                <Image
                  source={require("assets/profile/demo.png")}
                  style={{ width: 25, height: 25 }}
                ></Image>
              </View>
            </Marker>
          ))}

          {/* Render a dynamic marker where the user tapped */}
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Selected Location"
              description={`Lat: ${selectedLocation.latitude.toFixed(4)}, Lng: ${selectedLocation.longitude.toFixed(4)}`}
              pinColor="blue" // Distinct color for user-selected pin
            />
          )}
        </MapView>
      </View>
    </Screen>
  );
};

export default map;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "center",
  },
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  poiEmoji: {
    fontSize: 14,
  },
  hudContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    alignItems: "center",
    width: "85%",
  },
  hudTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  hudText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
