import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { CheckinCalendar } from "@/components/CheckinCalendar";

const checkinHistory = () => {
  const insets = useSafeAreaInsets();
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  //   for demonstration
  const [calendarDatabase, setCalendarDatabase] = useState({
    "2026-11-07": {
      checkedIn: true,
      image: require("assets/profile/demo.png"),
    },
  });

  const handleCheckin = (date /*YYYY-MM-DD*/, img) => {
    setCalendarDatabase((prevDatabase) => ({
      ...prevDatabase,
      [date]: {
        ...prevDatabase[date],
        checkedIn: true,
        image: img,
      },
    }));
  };

  return (
    <Screen>
      {/* header */}
      <View
        className="h-14 flex-row items-center px-5"
        style={{ justifyContent: "space-between" }}
      >
        <Pressable onPress={goBack} hitSlop={10}>
          <Image
            source={require("assets/icon/header/back_normal.svg")}
            style={styles.headerIcon}
          ></Image>
        </Pressable>
        <Text style={styles.headerText}>ประวัติเช็กอิน</Text>
      </View>
      {/* end of header */}

      <View className="flex-1 bg-sage-light">
        <CheckinCalendar customMarkedDates={calendarDatabase}></CheckinCalendar>
      </View>
    </Screen>
  );
};

export default checkinHistory;

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
    right: "50%",
    transform: "translateX(50%)",
  },
  calendar: {
    backgroundColor: "#E8F5E9",
    margin: "5%",
    marginTop: "10%",
    fontFamily: "BaiJamjuree_400Regular",
  },
  headerIcon: {
    tintColor: "#E8F5E9",
    width: 24,
    height: 24,
  },
});
