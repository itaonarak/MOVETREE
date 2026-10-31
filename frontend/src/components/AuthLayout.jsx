import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Logo } from "@/components/Logo";

// Shared shell for login / register: logo + title, form, bottom links.
export function AuthLayout({
  title,
  children,
  footerLink,
  onHelp = () => router.push("/assistance"),
}) {
  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-12 pt-12 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center">
          <Logo height={44} />
          <Text className="mt-2 text-2xl text-white font-semibold">
            {title}
          </Text>
        </View>

        <View className="mt-20">{children}</View>

        {/* Bottom links */}
        <View className="mt-auto flex-row justify-around pt-10">
          <Pressable onPress={onHelp} hitSlop={10}>
            <Text className="text-sm text-white font-normal">
              ศูนย์ช่วยเหลือ
            </Text>
          </Pressable>
          <Pressable onPress={footerLink.onPress} hitSlop={10}>
            <Text className="text-sm text-white font-normal">
              {footerLink.label}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}
