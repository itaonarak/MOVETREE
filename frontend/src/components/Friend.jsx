import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export function Friend({
  id,
  name,
  isFriend,
  isPending,
  onAccept,
  onReject,
  onUnfriend,
}) {
  return (
    <View style={styles.friendsList}>
      <Image
        source={require("assets/icon/missionHistory/flower.png")}
        style={{
          marginLeft: "1rem",
        }}
      ></Image>

      <Text style={[styles.friendsListText, styles.text]}>{name}</Text>

      {/* Show unfriend button only if they are currently a friend */}
      {isFriend && !isPending && (
        <Pressable onPress={() => onUnfriend(id)} style={styles.unfriendButton}>
          <Ionicons name="close-outline" size={24} color="#1F2A1F" />
        </Pressable>
      )}

      {/* Show decision box buttons only if friendship is pending */}
      {isPending && (
        <View style={styles.decisionBox}>
          <Pressable onPress={() => onAccept(id)} style={styles.decisionBoxY}>
            <Text style={[styles.text, styles.decisionBoxText]}>ยอมรับ</Text>
          </Pressable>
          <Pressable onPress={() => onReject(id)} style={styles.decisionBoxN}>
            <Text style={[styles.text, styles.decisionBoxText]}>ปฏิเสธ</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "BaiJamjuree_400Regular",
  },
  friendsList: {
    backgroundColor: "#e8f5e9",
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: "0.5rem",
    borderStyle: "solid",
    borderColor: "#d9d9d9",
    borderWidth: 1,
  },
  friendsListText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1f2a1f",
  },
  unfriendButton: {
    height: 24,
    width: 24,
    position: "absolute",
    right: "1rem",
    backgroundColor: "#e8f5e9",
  },
  decisionBox: {
    width: 80,
    height: 20,
    right: "1rem",
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    position: "absolute",
  },
  decisionBoxText: {
    fontSize: 10,
    color: "#e8f5e9",
    alignSelf: "center",
  },
  decisionBoxY: {
    backgroundColor: "rgb(62, 81, 59)",
    width: "50%",
    justifyContent: "center",
    alignContent: "center",
  },
  decisionBoxN: {
    backgroundColor: "#5f6b5f",
    width: "50%",
    justifyContent: "center",
    alignContent: "center",
  },
});
