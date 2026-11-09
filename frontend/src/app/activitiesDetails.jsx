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

const activitiesDetails = () => {
  const insets = useSafeAreaInsets();
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/locationDetails");
  }
  const params = useLocalSearchParams();

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
        <Text style={styles.headerText}>กิจกรรม</Text>
      </View>
      {/* end of header */}

      <View className="flex-1 bg-sage-light">
        <View style={styles.area}>
          <View style={styles.textArea}>
            <IconComponent
              source={require("assets/icon/locationDetail/location_normal.svg")}
              style={styles.icon}
            ></IconComponent>
            <Text style={styles.text}>{params.name}</Text>
          </View>
          <View style={styles.bottomArea}>
            <View style={styles.image}>{/* placeholder */}</View>
            <Text style={styles.detail}>{params.details}</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default activitiesDetails;

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
  area: {
    marginTop: "10%",
    width: 300,
    gap: 5,
    marginHorizontal: "auto",
  },
  textArea: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-start",
  },
  text: {
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
  image: {
    width: 300,
    height: 300,
    borderRadius: 20,
    borderColor: "#8FA07D",
    borderWidth: 5,
    backgroundColor: "#8FA07D",
    overflow: "hidden",
  },
  detail: {
    fontSize: 12,
    lineHeight: 18,
    color: "#1F2A1F",
    fontFamily: "BaiJamjuree_400Regular",
    padding: 5,
    marginHorizontal: 10,
  },
  bottomArea: {
    width: 300,
    backgroundColor: "rgba(143, 160, 125, 0.5)",
    borderRadius: 20,
  },
});
