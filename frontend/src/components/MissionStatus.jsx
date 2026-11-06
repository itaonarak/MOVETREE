import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

export function MissionStatus({
  taskID,
  maxAttempts,
  completedAttempts,
  taskDetail,
  reward,
}) {
  const id = taskID;
  const max = maxAttempts;
  let done = completedAttempts;
  const task = taskDetail;
  const coin = reward;

  function didTask() {
    done++;
  }

  function getID() {
    return id;
  }

  return (
    <View style={styles.missionHistoryTabs}>
      <Image
        source={require("assets/icon/missionHistory/flower.png")}
        style={{
          marginLeft: "10%",
        }}
      ></Image>
      <Text style={[styles.missionHistoryTabsText, styles.text]}>{task}</Text>
      <View style={styles.missionReward}>
        <Image
          source={require("assets/icon/profile/coin.png")}
          style={{ height: "15px", width: "15px" }}
        ></Image>
        <Text style={[styles.text, { fontSize: "10px" }]}>{coin}</Text>
      </View>
      <View style={{ position: "absolute", right: "20%" }}>
        <Text style={[styles.missionCount, styles.text]}>
          {done}/{max}
        </Text>
      </View>
      <View style={styles.missionTick}>
        <Image
          source={require("assets/icon/missionHistory/tick.png")}
          style={{ opacity: done === max ? 1 : 0 }}
        ></Image>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "BaiJamjuree_400Regular",
  },
  missionHistoryTabs: {
    backgroundColor: "#e8f5e9",
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "left",
    flexDirection: "row",
    gap: "0.5rem",
    borderStyle: "solid",
    borderColor: "#d9d9d9",
    borderWidth: 1,
  },
  missionHistoryTabsText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1f2a1f",
  },
  missionReward: {
    height: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  missionCount: {
    fontSize: 16,
    lineHeight: 24,
  },
  missionTick: {
    height: 24,
    width: 24,
    position: "absolute",
    right: "10%",
    backgroundColor: "#e8f5e9",
  },
});
