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
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="assistance" />
        <Stack.Screen name="feed" />
        <Stack.Screen name="notifications" />
      </Stack>
    </>
  );
}
