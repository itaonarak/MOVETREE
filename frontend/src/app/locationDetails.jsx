
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { IconComponent } from "@/components/IconComponent";
import { Activities } from "@/components/Activities";

const LocationDetails = () => {
  const params = useLocalSearchParams();

  const title = params.title || "สถานที่";
  const description = params.description || "";
  const address = params.address || "";
  const imageUrl = params.image_url || "";

  const parseArray = (value) => {
    try {
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  };

  const activities = parseArray(params.activities);
  const activitiesImages = parseArray(params.activitiesImages);
  const activitiesDetails = parseArray(params.activitiesDetails);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/map");
  }

  function goToCheckin() {
  const areaId = params.area_id || params.id;

  console.log("LOCATION DETAILS:", params);
  console.log("AREA ID:", areaId);
  console.log("PLACE NAME:", title);

  router.push({
    pathname: "/Camera",
    params: {
      mode: "checkin",
      area_id: areaId,
      title,
      latitude: params.latitude,
      longitude: params.longitude,
    },
  });
}

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={10}>
          <IconComponent
            source={require("assets/icon/header/back_normal.svg")}
            style={styles.headerIcon}
          />
        </Pressable>

        <Text style={styles.headerText}>รายละเอียดสถานที่</Text>
      </View>

      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Place information */}
          <View style={styles.mapArea}>
            <View style={styles.mapAreaDetails}>
              <IconComponent
                source={require("assets/icon/locationDetail/location_normal.svg")}
                style={styles.icon}
              />
              <Text style={styles.mapAreaText}>{title}</Text>
            </View>

            <Image
              style={styles.areaPicture}
              source={
                imageUrl
                  ? { uri: imageUrl }
                  : require("assets/profile/demo.png")
              }
              resizeMode="cover"
            />
          </View>

          {/* Description */}
          <View style={styles.boxDetail}>
            <Text style={styles.sectionTitle}>รายละเอียดสถานที่</Text>

            <Text style={styles.description}>
              {description || "ยังไม่มีรายละเอียดสถานที่"}
            </Text>

            {!!address && (
              <View style={styles.addressContainer}>
                <Text style={styles.addressLabel}>ที่อยู่</Text>
                <Text style={styles.description}>{address}</Text>
              </View>
            )}
          </View>

          {/* Activities */}
          {activities.length > 0 && (
            <View style={styles.boxDetail}>
              <Text style={styles.sectionTitle}>กิจกรรม</Text>

              {activities.map((item, index) => (
                <Activities
                  key={index}
                  name={typeof item === "object" ? item.name : item}
                  details={activitiesDetails[index] || ""}
                  image={activitiesImages[index] || ""}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Check-in button */}
        <Pressable
          style={styles.checkinButton}
          onPress={goToCheckin}
        >
          <Text style={styles.checkinButtonText}>Check-in</Text>
        </Pressable>
      </View>
    </Screen>
  );
};

export default LocationDetails;

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  content: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 20,
    gap: 24,
  },
  mapArea: {
    width: 300,
    gap: 8,
    alignSelf: "center",
  },
  mapAreaText: {
    flex: 1,
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
    alignItems: "center",
  },
  areaPicture: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    backgroundColor: "white",
  },
  boxDetail: {
    width: 300,
    alignSelf: "center",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#1F2A1F",
    fontFamily: "BaiJamjuree_600SemiBold",
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#1F2A1F",
    fontFamily: "BaiJamjuree_400Regular",
  },
  addressContainer: {
    gap: 4,
  },
  addressLabel: {
    fontSize: 15,
    color: "#3E513B",
    fontFamily: "BaiJamjuree_600SemiBold",
  },
  checkinButton: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
    height: 50,
    backgroundColor: "#3E513B",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkinButtonText: {
    fontSize: 18,
    color: "#E8F5E9",
    fontFamily: "BaiJamjuree_600SemiBold",
  },
});
