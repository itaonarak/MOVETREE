import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import React from "react";

export function Activities({ name, details, image }) {
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/activitiesDetails",
          params: {
            name,
            details,
            image,
          },
        });
      }}
    >
      <View style={styles.box}>
        <Text style={styles.text}>{name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    height: 40,
    backgroundColor: "#8FA07D",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "BaiJamjuree_400Regular",
    color: "#1F2A1F",
    marginLeft: 20,
  },
});
