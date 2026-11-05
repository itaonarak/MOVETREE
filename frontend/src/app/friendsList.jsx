import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/Screen";
import { Friend } from "@/components/Friend";

const friendList = () => {
  const insets = useSafeAreaInsets();
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  const [friendsData, setFriendsData] = useState([
    { id: "1", name: "วอดส์1", isFriend: true, isPending: false },
    { id: "2", name: "วอดส์2", isFriend: false, isPending: true },
    { id: "3", name: "วอดส์3", isFriend: false, isPending: true },
    { id: "4", name: "วอดส์4", isFriend: true, isPending: false },
  ]);

  const handleAccept = (id) => {
    clearInput();
    setFriendsData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isFriend: true, isPending: false } : item,
      ),
    );
  };

  const handleReject = (id) => {
    clearInput();
    setFriendsData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isPending: false } : item,
      ),
    );
  };

  const handleUnfriend = (id) => {
    clearInput();
    setFriendsData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isFriend: false } : item,
      ),
    );
  };

  // choose between "friend" and "pending"
  const [filterType, setFilterType] = useState("friend");

  const displayedFriend = friendsData.filter((friendsData) => {
    if (filterType === "friend") return friendsData.isFriend;
    if (filterType === "pending") return friendsData.isPending;
  });

  // for searching
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(displayedFriend);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = displayedFriend.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  function clearInput() {
    setSearch("");
  }

  return (
    <Screen>
      {/* header */}
      <View
        className="h-14 flex-row items-center px-5"
        style={{ justifyContent: "space-between" }}
      >
        <Pressable onPress={goBack} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#E8F5E9" />
        </Pressable>
        <Text style={styles.headerText}>เพื่อน</Text>
      </View>
      {/* end of header */}

      {/* Extended Header */}
      <View style={styles.extendedHeader}>
        <Pressable
          onPress={() => {
            setFilterType("friend");
          }}
          style={[
            styles.extendedHeaderTab,
            filterType === "friend" ? styles.activeTab : [],
          ]}
        >
          <Text
            style={
              filterType === "friend" ? styles.activeText : styles.inactiveText
            }
          >
            เพื่อนของคุณ
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setFilterType("pending");
          }}
          style={[
            styles.extendedHeaderTab,
            filterType === "pending" ? styles.activeTab : [],
          ]}
        >
          <Text
            style={
              filterType === "pending" ? styles.activeText : styles.inactiveText
            }
          >
            คำขอ
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 bg-sage-light">
        <View style={styles.searchArea}>
          <View style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color="#1F2A1F" />
          </View>
          {/* Search Bar */}
          <TextInput
            style={styles.searchBar}
            placeholder="Search here..."
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        <FlatList
          data={search === "" ? displayedFriend : filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Friend
              id={item.id}
              name={item.name}
              isFriend={item.isFriend}
              isPending={item.isPending}
              onAccept={handleAccept}
              onReject={handleReject}
              onUnfriend={handleUnfriend}
            />
          )}
        />
      </View>
    </Screen>
  );
};

export default friendList;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    lineHeight: 36,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "rgb(232, 245, 233)",
    position: "absolute",
    right: "50%",
    transform: "translateX(50%)",
  },
  extendedHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "2.5rem",
  },
  extendedHeaderTab: {
    width: "50%",
    height: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  searchArea: {
    margin: "5%",
    flexDirection: "row",
    alignItems: "center",
  },
  searchButton: {
    backgroundColor: "#e8f5e9",
    height: 35,
    width: 50,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    backgroundColor: "#e8f5e9",
    height: 35,
    flex: 1,
    paddingHorizontal: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: "#e8f5e9",
  },
  activeTab: {
    backgroundColor: "rgba(31, 42, 31, 0.5)",
    borderRadius: 20,
  },
  activeText: {
    fontSize: 24,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "rgb(232, 245, 233)",
  },
  inactiveText: {
    fontSize: 16,
    fontFamily: "BaiJamjuree_400Regular",
    color: "rgb(232, 245, 233)",
  },
});
