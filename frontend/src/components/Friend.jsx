
import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { IconComponent } from "./IconComponent";

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
      {/* Friend icon */}
      <IconComponent
        source={require("assets/icon/missionHistory/flower2_normal.svg")}
        style={styles.flowerIcon}
      />

      {/* Friend name */}
      <Text style={[styles.friendsListText, styles.text]}>
        {name}
      </Text>

      {/* Unfriend button */}
      {isFriend && !isPending && (
        <Pressable
          onPress={() => onUnfriend(id)}
          style={styles.unfriendButton}
        >
          <IconComponent
            source={require("assets/icon/friendsList/X_normal.svg")}
            style={styles.bodyIcon}
          />
        </Pressable>
      )}

      {/* Accept / Reject buttons */}
      {isPending && (
        <View style={styles.decisionBox}>
          <Pressable
            onPress={() => onAccept(id)}
            style={styles.decisionBoxY}
          >
            <Text style={[styles.text, styles.decisionBoxText]}>
              ยอมรับ
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onReject(id)}
            style={styles.decisionBoxN}
          >
            <Text style={[styles.text, styles.decisionBoxText]}>
              ปฏิเสธ
            </Text>
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
    gap: 5,
    borderStyle: "solid",
    borderColor: "#d9d9d9",
    borderWidth: 1,
  },

  flowerIcon: {
    width: 24,
    height: 24,
    marginLeft: 20,
    tintColor: "#5F6B5F",
  },

  bodyIcon: {
    width: 24,
    height: 24,
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
    right: 20,
    backgroundColor: "#e8f5e9",
  },

  decisionBox: {
    width: 80,
    height: 20,
    right: 20,
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
