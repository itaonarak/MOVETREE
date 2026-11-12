
import "../../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  BaiJamjuree_400Regular,
  BaiJamjuree_500Medium,
  BaiJamjuree_600SemiBold,
  BaiJamjuree_700Bold,
} from "@expo-google-fonts/bai-jamjuree";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BaiJamjuree_400Regular,
    BaiJamjuree_500Medium,
    BaiJamjuree_600SemiBold,
    BaiJamjuree_700Bold,
  });

  // Wait for Bai Jamjuree so text doesn't flash in the system font
  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="assistance" />

        {/* Main pages */}
        <Stack.Screen name="feed" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="profile" />

        {/* Profile pages */}
        <Stack.Screen name="personalInfo" />
        <Stack.Screen name="postHistory" />
        <Stack.Screen name="missionHistory" />
        <Stack.Screen name="friendsList" />
        <Stack.Screen name="checkinHistory" />
        <Stack.Screen name="changeEmail" />
        <Stack.Screen name="changePassword" />

        {/* Camera and upload */}
        <Stack.Screen name="Camera" />
        <Stack.Screen name="upload" />
        <Stack.Screen name="get_dress" />

        {/* Mission pages */}
        <Stack.Screen name="mission" />

        {/* Map and location pages */}
        <Stack.Screen name="map" />
        <Stack.Screen name="locationDetails" />
        <Stack.Screen name="activitiesDetails" />
      </Stack>
    </>
  );
}
