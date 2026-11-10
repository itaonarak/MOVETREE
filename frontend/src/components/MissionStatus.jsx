import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { IconComponent } from "@/components/IconComponent";

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
<<<<<<< HEAD
      <Image
        source={require("assets/icon/missionHistory/flower.png")}
=======
      <IconComponent
        source={require("assets/icon/missionHistory/flower2_normal.svg")}
>>>>>>> 3a97de51a9c46dd9a9811599bc93f00105e04160
        style={{
          width: 24,
          height: 24,
          marginLeft: "10%",
        }}
      ></IconComponent>
      <Text style={[styles.missionHistoryTabsText, styles.text]}>{task}</Text>
      <View style={styles.missionReward}>
<<<<<<< HEAD
        <Image
          source={require("assets/icon/profile/coin_normal.svg")}
          style={{ height: "15px", width: "15px" }}
        ></Image>
        <Text style={[styles.text, { fontSize: "10px" }]}>{coin}</Text>
=======
        <IconComponent
          source={require("assets/icon/missionHistory/coin_normal.svg")}
          style={{ height: 15, width: 15 }}
        ></IconComponent>
        <Text style={[styles.text, { fontSize: 10 }]}>{coin}</Text>
>>>>>>> 3a97de51a9c46dd9a9811599bc93f00105e04160
      </View>
      <View style={{ position: "absolute", right: "20%" }}>
        <Text style={[styles.missionCount, styles.text]}>
          {done}/{max}
        </Text>
      </View>
      <View style={styles.missionTick}>
<<<<<<< HEAD
        <Image
          source={require("assets/icon/missionHistory/tick.png")}
          style={{ opacity: done === max ? 1 : 0 }}
        ></Image>
=======
        <IconComponent
          source={require("assets/icon/missionHistory/tick_normal.svg")}
          style={{ opacity: done === max ? 1 : 0, width: 24, height: 24 }}
        ></IconComponent>
>>>>>>> 3a97de51a9c46dd9a9811599bc93f00105e04160
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
