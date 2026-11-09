import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { IconComponent } from "@/components/IconComponent";
import { useLocalSearchParams } from "expo-router";
import { Activities } from "@/components/Activities"; // Ensure you import your Activities component

const LocationDetails = () => {
  const insets = useSafeAreaInsets();
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }
  const params = useLocalSearchParams();

  // Parse stringified arrays safely from route params
  const activities = params.activities ? JSON.parse(params.activities) : [];
  const activitiesImages = params.activitiesImages
    ? JSON.parse(params.activitiesImages)
    : [];
  const activitiesDetails = params.activitiesDetails
    ? JSON.parse(params.activitiesDetails)
    : [];
  const images = params.images ? JSON.parse(params.images) : [];

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

      <View className="flex-1 bg-sage-light" style={{ gap: 20 }}>
        <View style={styles.mapArea}>
          <View style={styles.mapAreaDetails}>
            <IconComponent
              source={require("assets/icon/locationDetail/location_normal.svg")}
              style={styles.icon}
            ></IconComponent>
            <Text style={styles.mapAreaText}>{params.title}</Text>
          </View>
          {/* ขอเปลี่ยนเป็นรูปแทนนะ ตอนแรกใส่ Map แล้วแอพมัน crash เลย TT */}
          <Image
            style={styles.areaPicture}
            source={require("assets/profile/demo.png")}
          ></Image>
        </View>
        <View style={styles.boxDetail}>
          <View style={styles.boxTopic}>
            <Text style={styles.boxTopicText}>กิจกรรม</Text>
          </View>
          <FlatList
            data={activities}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Activities
                name={typeof item === "object" ? item.name : item}
                details={activitiesDetails[index] || ""}
                image={activitiesImages[index] || ""}
              />
            )}
          />
        </View>
      </View>
    </Screen>
  );
};

export default LocationDetails;

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
  mapArea: {
    marginTop: "10%",
    width: 300,
    height: 350,
    gap: 5,
    marginHorizontal: "auto",
    overflow: "hidden",
  },
  mapAreaText: {
    fontSize: 20,
    lineHeight: 30,
    color: "#1F2A1F",
    fontFamily: "BaiJamjuree_600SemiBold",
  },
  icon: {
    tintColor: "#1F2A1F",
    width: 24,
    height: 24,
  },
  mapAreaDetails: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-start",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  areaPicture: {
    width: 300,
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "white",
  },
  boxDetail: {
    width: 300,
    marginHorizontal: "auto",
    flex: 1,
  },
  boxTopic: {
    height: 30,
    width: 100,
    backgroundColor: "#3E513B",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  boxTopicText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#E8F5E9",
    fontFamily: "BaiJamjuree_600SemiBold",
  },
});
