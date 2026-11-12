
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { BottomNav } from "@/components/BottomNav";
import { apiRequest } from "@/services/api";

const ICONS = {
  daily: require("assets/icon/mission/flower2_normal.svg"),
  longTerm: require("assets/icon/mission/tree_normal.svg"),
  coin: require("assets/icon/mission/coin_normal.svg"),
};

function MissionRow({ icon, mission }) {
  return (
    <View className="h-12 flex-row items-center px-4">
      <Image source={icon} style={{ width: 20, height: 20 }} contentFit="contain" />

      <Text className="ml-2 text-base font-normal text-ink">
        {mission.title}
      </Text>

      <View className="ml-1 flex-row items-center">
        <Image
          source={ICONS.coin}
          style={{ width: 12, height: 12 }}
          contentFit="contain"
        />
        <Text className="text-[10px] font-normal text-ink-soft">
          {mission.points}
        </Text>
      </View>

      <Text className="ml-auto text-base font-normal text-ink-soft">
        {mission.completed_attempts}/{mission.required_count}
      </Text>
    </View>
  );
}

function MissionSection({ title, icon, missions }) {
  return (
    <View className="mx-5 mt-5">
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
        {missions.length > 0 ? (
          missions.map((m) => (
            <MissionRow
              key={m.mission_id}
              icon={icon}
              mission={m}
            />
          ))
        ) : (
          <Text className="px-4 py-3 text-sm text-ink-soft">
            ไม่มีภารกิจ
          </Text>
        )}
      </View>
    </View>
  );
}

export default function MissionScreen() {
  const insets = useSafeAreaInsets();

  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMissions = useCallback(async () => {
    try {
      setError("");
      const result = await apiRequest("/missions/progress");
      setMissions(result?.missions || []);
    } catch (e) {
      console.log("FETCH MISSIONS ERROR:", e);
      setError(e.message || "ไม่สามารถโหลดภารกิจได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const dailyMissions = missions.filter(
  (mission) =>
    mission.mission_type === "daily" &&
    mission.completed !== true
);

const longTermMissions = missions.filter(
  (mission) =>
    mission.mission_type === "permanent" &&
    mission.completed !== true
);

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
        {loading ? (
          <Text className="mt-8 text-center text-ink">
            กำลังโหลดภารกิจ...
          </Text>
        ) : error ? (
          <View className="mt-8 items-center">
            <Text className="text-center text-ink">{error}</Text>
            <Pressable onPress={fetchMissions}>
              <Text className="mt-3 text-sage">ลองอีกครั้ง</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
            showsVerticalScrollIndicator={false}
          >
            <MissionSection
              title="ภารกิจรายวัน"
              icon={ICONS.daily}
              missions={dailyMissions}
            />

            <MissionSection
              title="ภารกิจระยะยาว"
              icon={ICONS.longTerm}
              missions={longTermMissions}
            />
          </ScrollView>
        )}

        <BottomNav active="tasks" onPress={handleTab} />
      </View>
    </Screen>
  );
}
