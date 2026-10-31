// 3. HELP CENTER PAGE  (route: "/assistance")
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { Screen } from "@/components/Screen";

const ICONS = {
  advice: require("../../assets/icon/assistance/advice.svg"),
  question: require("../../assets/icon/assistance/question.svg"),
  more: require("../../assets/icon/assistance/more.svg"),
};

const SUPPORT_EMAIL = "film2148@gmail.com";

const FAQS = [
  {
    question: "ลืมรหัสผ่าน?",
    answers: [`ติดต่อทีมผู้พัฒนาผ่านอีเมล ${SUPPORT_EMAIL}`],
  },
  {
    question: "ข้อความแจ้งเตือนข้อผิดพลาดขณะเข้าสู่ระบบ",
    answers: ["รหัสผ่านหรือชื่อบัญชีผู้ใช้อาจไม่ถูกต้อง"],
  },
  {
    question: "ข้อความแจ้งเตือนข้อผิดพลาดขณะสร้างบัญชีผู้ใช้",
    answers: ["อีเมลของคุณอาจถูกใช้สร้างบัญชีไปแล้ว", "รหัสผ่านไม่ตรงกัน"],
  },
];

export default function AssistanceScreen() {
  return (
    <Screen bg="bg-sage-light">
      <StatusBar style="dark" />
      <ScrollView contentContainerClassName="px-6 pt-10 pb-10">
        <Text className="mb-8 text-center text-3xl text-ink font-bold">
          ศูนย์ช่วยเหลือ
        </Text>

        {/* Contact */}
        <View className="flex-row items-center">
          <Image source={ICONS.advice} style={{ width: 24, height: 24 }} />
          <Text className="ml-2 text-xl text-ink font-semibold">
            ติดต่อขอความช่วยเหลือ
          </Text>
        </View>
        <Text className="mt-2 text-sm text-ink font-normal">
          พบปัญหา เช่น ลืมชื่อผู้ใช้ ลืมรหัสผ่าน แจ้งบัค ฯลฯ
        </Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-ink font-normal">โปรดติดต่อ : </Text>
          <Pressable
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
            hitSlop={8}
          >
            <Text className="text-sm text-ink-soft underline font-normal">
              {SUPPORT_EMAIL}
            </Text>
          </Pressable>
        </View>

        {/* FAQ */}
        <View className="mt-10 flex-row items-center">
          <Image source={ICONS.question} style={{ width: 26, height: 26 }} />
          <Text className="ml-2 text-xl text-ink font-semibold">
            คำถามที่พบบ่อย
          </Text>
        </View>
        {FAQS.map((faq) => (
          <View key={faq.question} className="mt-5 pl-1">
            <Text className="text-sm text-ink font-medium">{faq.question}</Text>
            {faq.answers.map((answer) => (
              <View key={answer} className="mt-1 flex-row items-center pl-2">
                <Image source={ICONS.more} style={{ width: 16, height: 16 }} />
                <Text className="ml-1 flex-1 text-sm text-ink-soft font-normal">
                  {answer}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
