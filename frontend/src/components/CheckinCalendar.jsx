import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";

export function CheckinCalendar({ customMarkedDates }) {
  return (
    <View style={styles.calendar}>
      <Calendar
        markedDates={customMarkedDates}
        style={{
          borderRadius: 20,
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          overflow: "hidden",
        }}
        theme={{
          calendarBackground: "#E8F5E9",
          textDayFontFamily: "BaiJamjuree_400Regular",
          textMonthFontFamily: "BaiJamjuree_400Regular",
          textDayHeaderFontFamily: "BaiJamjuree_400Regular",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
          arrowColor: "#1F2A1F",
        }}
        dayComponent={({ date, state, marking }) => {
          const isCheckedIn = marking?.checkedIn;
          const checkinImage = marking?.image;
          return (
            <View>
              {!isCheckedIn && (
                <Text
                  style={[
                    styles.dayComponent,
                    {
                      color: state === "disabled" ? "gray" : "black",
                    },
                  ]}
                >
                  {date.day}
                </Text>
              )}
              {isCheckedIn && (
                <Image
                  source={checkinImage}
                  style={styles.dayComponent}
                ></Image>
              )}
            </View>
          );
        }}
      ></Calendar>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    margin: "5%",
    marginTop: "15%",
  },
  dayComponent: {
    textAlign: "center",
    alignContent: "center",
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
