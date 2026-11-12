
import React from "react";
import { StyleSheet, Text, View } from "react-native";
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
  const done = completedAttempts;
  const task = taskDetail;
  const coin = reward;

  function getID() {
    return id;
  }

  return (
    <View style={styles.missionHistoryTabs}>
      {/* Mission icon */}
      <IconComponent
        source={require("assets/icon/missionHistory/flower2_normal.svg")}
        style={styles.flowerIcon}
      />

      {/* Mission name */}
      <Text style={[styles.missionHistoryTabsText, styles.text]}>
        {task}
      </Text>

      {/* Reward */}
      <View style={styles.missionReward}>
        <IconComponent
          source={require("assets/icon/missionHistory/coin_normal.svg")}
          style={styles.coinIcon}
        />

        <Text style={[styles.text, styles.rewardText]}>
          {coin}
        </Text>
      </View>

      {/* Completed attempts */}
      <View style={styles.missionCountContainer}>
        <Text style={[styles.missionCount, styles.text]}>
          {done}/{max}
        </Text>
      </View>

      {/* Completion tick */}
      <View style={styles.missionTick}>
        <IconComponent
          source={require("assets/icon/missionHistory/tick_normal.svg")}
          style={[
            styles.tickIcon,
            { opacity: done === max ? 1 : 0 },
          ]}
        />
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
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 8,
    borderStyle: "solid",
    borderColor: "#d9d9d9",
    borderWidth: 1,
  },

  flowerIcon: {
    width: 24,
    height: 24,
    marginLeft: "10%",
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

  coinIcon: {
    height: 15,
    width: 15,
  },

  rewardText: {
    fontSize: 10,
  },

  missionCountContainer: {
    position: "absolute",
    right: "20%",
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

  tickIcon: {
    width: 24,
    height: 24,
  },
});
