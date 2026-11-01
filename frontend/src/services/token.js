import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "movetree_access_token";

// Save access token
export async function saveToken(token) {
  if (Platform.OS === "web") {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

// Get access token
export async function getToken() {
  if (Platform.OS === "web") {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  return await SecureStore.getItemAsync(TOKEN_KEY);
}

// Remove access token
export async function removeToken() {
  if (Platform.OS === "web") {
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}