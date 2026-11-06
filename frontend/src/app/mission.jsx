import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { BottomNav } from "@/components/BottomNav";

const ICONS = {
  daily: require("assets/icon/mission/flower2_normal.svg"),
  longTerm: require("assets/icon/mission/tree_normal.svg"),
  coin: require("assets/icon/mission/coin_normal.svg"),
};

// Sample data — replace with backend data once the missions API exists
const DAILY_MISSIONS = [
  { id: "d1", detail: "ถ่ายรูปต้นไม้", reward: 10, done: 0, max: 1 },
  { id: "d2", detail: "ถ่ายรูปต้นไม้", reward: 10, done: 0, max: 1 },
  { id: "d3", detail: "ถ่ายรูปต้นไม้", reward: 10, done: 0, max: 1 },
  { id: "d4", detail: "ถ่ายรูปต้นไม้", reward: 10, done: 0, max: 1 },
];

const LONG_TERM_MISSIONS = [
  { id: "l1", detail: "ถ่ายรูปต้นไม้", reward: 100, done: 0, max: 10 },
  { id: "l2", detail: "ถ่ายรูปต้นไม้", reward: 200, done: 0, max: 15 },
  { id: "l3", detail: "ถ่ายรูปต้นไม้", reward: 130, done: 0, max: 12 },
  { id: "l4", detail: "ถ่ายรูปต้นไม้", reward: 250, done: 0, max: 20 },
];

function MissionRow({ icon, mission }) {
  return (
    <View className="h-12 flex-row items-center px-4">
      <Image source={icon} style={{ width: 20, height: 20 }} contentFit="contain" />
      <Text className="ml-2 text-base font-normal text-ink">{mission.detail}</Text>
      <View className="ml-1 flex-row items-center">
        <Image
          source={ICONS.coin}
          style={{ width: 12, height: 12 }}
          contentFit="contain"
        />
        <Text className="text-[10px] font-normal text-ink-soft">{mission.reward}</Text>
      </View>
      <Text className="ml-auto text-base font-normal text-ink-soft">
        {mission.done}/{mission.max}
      </Text>
    </View>
  );
}

function MissionSection({ title, icon, missions }) {
  return (
    <View className="mx-5 mt-5">
      {/* Tab-shaped title that overlaps the card */}
      <View
        className="z-10 self-start rounded-t-2xl rounded-br-2xl bg-sage px-3 py-2"
        style={{ marginBottom: -12 }}
      >
        <Text className="text-base font-semibold text-paper">{title}</Text>
      </View>
      <View
        className="rounded-xl bg-paper py-2"
        style={{
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        {missions.map((m) => (
          <MissionRow key={m.id} icon={icon} mission={m} />
        ))}
      </View>
    </View>
  );
}

export default function MissionScreen() {
  const insets = useSafeAreaInsets();

  function handleTab(tab) {
    if (tab === "tasks") return;
    if (tab === "home") router.replace("/feed");
    if (tab === "camera") router.replace("/Camera");
    if (tab === "profile") router.replace("/profile");
  }

  return (
    <Screen padBottom={false}>
      <View className="h-14 items-center justify-center px-5">
        <Text className="text-2xl font-semibold text-paper">ภารกิจ</Text>
      </View>

      <View className="flex-1 bg-sage-light">
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
          showsVerticalScrollIndicator={false}
        >
          <MissionSection
            title="ภารกิจรายวัน"
            icon={ICONS.daily}
            missions={DAILY_MISSIONS}
          />
          <MissionSection
            title="ภารกิจระยะยาว"
            icon={ICONS.longTerm}
            missions={LONG_TERM_MISSIONS}
          />
        </ScrollView>

        <BottomNav active="tasks" onPress={handleTab} />
      </View>
    </Screen>
  );
}
