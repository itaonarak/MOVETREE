import { Text, TextInput, View } from "react-native";
import { Image } from "expo-image";

export function TextField({ icon, error, secure, ...inputProps }) {
  return (
    <View className="mb-3">
      <View
        className={`h-14 flex-row items-center rounded-xl bg-paper px-3 ${error ? "border-2 border-red-400" : ""}`}
        style={{ elevation: 4 }}
      >
        <Image source={icon} style={{ width: 24, height: 24 }} />
        <TextInput
          className="ml-2 flex-1 text-base text-ink font-normal"
          placeholderTextColor="#6B7A68"
          secureTextEntry={secure}
          autoCapitalize="none"
          {...inputProps}
        />
      </View>
      {error ? (
        <Text className="ml-1 mt-1 text-xs text-red-300 font-normal">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
