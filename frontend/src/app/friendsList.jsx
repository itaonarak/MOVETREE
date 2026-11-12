
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { Friend } from "@/components/Friend";
import { IconComponent } from "@/components/IconComponent";
import { apiRequest } from "@/services/api";

const FriendList = () => {
  const { tab } = useLocalSearchParams();

  const [filterType, setFilterType] = useState(
    tab === "pending" ? "pending" : "friend"
  );

  const [friendsData, setFriendsData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);
  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  const loadFriends = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [friendsResult, requestsResult] = await Promise.all([
        apiRequest("/friends/"),
        apiRequest("/friends/requests"),
      ]);

      setFriendsData(friendsResult.friends ?? []);
      setRequestsData(requestsResult.requests ?? []);
    } catch (err) {
      console.error("Load friends error:", err);
      setError(err.message || "ไม่สามารถโหลดข้อมูลเพื่อนได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const clearInput = () => {
    setSearch("");
    setSearchResults([]);
    setSearchMode(false);
    setError("");
  };

  // Search users from backend
  const handleSearchUsers = async () => {
    const keyword = search.trim();

    if (!keyword) {
      setSearchMode(false);
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setError("");

      const result = await apiRequest(
        `/friends/search?username=${encodeURIComponent(keyword)}`
      );

      setSearchResults(result.users ?? []);
      setSearchMode(true);
    } catch (err) {
      console.error("Search users error:", err);
      setError(err.message || "ค้นหาผู้ใช้ไม่สำเร็จ");
      setSearchMode(false);
    } finally {
      setSearching(false);
    }
  };

  // Send friend request
  const handleAddFriend = async (receiverId) => {
    try {
      setProcessingId(receiverId);
      setError("");

      await apiRequest("/friends/requests", {
        method: "POST",
        body: JSON.stringify({
          receiver_id: receiverId,
        }),
      });

      setSentRequests((prev) => [...prev, receiverId]);
    } catch (err) {
      console.error("Send friend request error:", err);
      setError(err.message || "ส่งคำขอเป็นเพื่อนไม่สำเร็จ");
    } finally {
      setProcessingId(null);
    }
  };

  const handleAccept = async (id) => {
    try {
      setProcessingId(id);
      setError("");

      await apiRequest(`/friends/requests/${id}/accept`, {
        method: "PATCH",
      });

      await loadFriends();
      clearInput();
    } catch (err) {
      console.error("Accept friend request error:", err);
      setError(err.message || "ไม่สามารถยอมรับคำขอได้");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setProcessingId(id);
      setError("");

      await apiRequest(`/friends/requests/${id}/reject`, {
        method: "PATCH",
      });

      await loadFriends();
      clearInput();
    } catch (err) {
      console.error("Reject friend request error:", err);
      setError(err.message || "ไม่สามารถปฏิเสธคำขอได้");
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnfriend = async (id) => {
    try {
      setProcessingId(id);
      setError("");

      await apiRequest(`/friends/${id}`, {
        method: "DELETE",
      });

      await loadFriends();
      clearInput();
    } catch (err) {
      console.error("Remove friend error:", err);
      setError(err.message || "ไม่สามารถลบเพื่อนได้");
    } finally {
      setProcessingId(null);
    }
  };

  const displayedFriend = useMemo(() => {
    const source = filterType === "friend" ? friendsData : requestsData;

    return source.filter((item) =>
      (item.username || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [filterType, friendsData, requestsData, search]);

  // Exclude existing friends and incoming requests from search results.
  const visibleSearchResults = useMemo(() => {
    const existingUserIds = new Set([
      ...friendsData.map((item) => item.user_id),
      ...requestsData.map((item) => item.user_id),
    ]);

    return searchResults.filter(
      (item) => !existingUserIds.has(item.user_id)
    );
  }, [searchResults, friendsData, requestsData]);

  const renderSearchResult = ({ item }) => {
    const alreadySent = sentRequests.includes(item.user_id);
    const isProcessing = processingId === item.user_id;

    return (
      <View style={styles.searchResultRow}>
        <IconComponent
          source={require("assets/icon/missionHistory/flower2_normal.svg")}
          style={styles.flowerIcon}
        />

        <Text style={styles.resultName}>
          {item.username}
        </Text>

        <Pressable
          style={[
            styles.addButton,
            alreadySent && styles.sentButton,
          ]}
          disabled={alreadySent || isProcessing}
          onPress={() => handleAddFriend(item.user_id)}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.addButtonText}>
              {alreadySent ? "ส่งแล้ว" : "เพิ่มเพื่อน"}
            </Text>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <Screen>
      {/* Header */}
      <View
        className="h-14 flex-row items-center"
        style={{ justifyContent: "space-between" }}
      >
        <Pressable onPress={goBack} hitSlop={10}>
          <IconComponent
            source={require("assets/icon/header/back_normal.svg")}
            style={styles.headerIcon}
          />
        </Pressable>

        <Text style={styles.headerText}>เพื่อน</Text>
      </View>

      {/* Tabs */}
      <View style={styles.extendedHeader}>
        <Pressable
          onPress={() => {
            clearInput();
            setFilterType("friend");
          }}
          style={[
            styles.extendedHeaderTab,
            filterType === "friend" && styles.activeTab,
          ]}
        >
          <Text
            style={
              filterType === "friend"
                ? styles.activeText
                : styles.inactiveText
            }
          >
            เพื่อนของคุณ
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            clearInput();
            setFilterType("pending");
          }}
          style={[
            styles.extendedHeaderTab,
            filterType === "pending" && styles.activeTab,
          ]}
        >
          <Text
            style={
              filterType === "pending"
                ? styles.activeText
                : styles.inactiveText
            }
          >
            คำขอ
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View className="flex-1 bg-sage-light">
        <View style={styles.searchArea}>
          <Pressable
            style={styles.searchButton}
            onPress={handleSearchUsers}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator size="small" color="#1F2A1F" />
            ) : (
              <IconComponent
                source={require("assets/icon/friendsList/search_normal.svg")}
                style={styles.bodyIcon}
              />
            )}
          </Pressable>

          <TextInput
            style={[
              styles.searchBar,
              { fontFamily: "BaiJamjuree_400Regular" },
            ]}
            placeholder={
              filterType === "friend"
                ? "ค้นหาหรือเพิ่มเพื่อน..."
                : "ค้นหาคำขอ..."
            }
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setSearchMode(false);
              setSearchResults([]);
              setError("");
            }}
            onSubmitEditing={
              filterType === "friend" ? handleSearchUsers : undefined
            }
            returnKeyType="search"
          />
        </View>

        {!!error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#526D50" />
            <Text style={styles.messageText}>
              กำลังโหลดข้อมูล...
            </Text>
          </View>
        ) : searchMode && filterType === "friend" ? (
          <FlatList
            data={visibleSearchResults}
            keyExtractor={(item) => item.user_id}
            renderItem={renderSearchResult}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.messageText}>
                  ไม่พบผู้ใช้ที่ค้นหา
                </Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={displayedFriend}
            keyExtractor={(item) => item.friendship_id}
            renderItem={({ item }) => (
              <Friend
                id={item.friendship_id}
                name={item.username || "Unknown"}
                isFriend={filterType === "friend"}
                isPending={filterType === "pending"}
                onAccept={handleAccept}
                onReject={handleReject}
                onUnfriend={handleUnfriend}
              />
            )}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.messageText}>
                  {filterType === "friend"
                    ? "ยังไม่มีเพื่อน ลองค้นหาผู้ใช้เพื่อเพิ่มเพื่อน"
                    : "ไม่มีคำขอเป็นเพื่อน"}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </Screen>
  );
};

export default FriendList;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    lineHeight: 36,
    fontFamily: "BaiJamjuree_600SemiBold",
    color: "rgb(232, 245, 233)",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
  headerIcon: {
    tintColor: "#E8F5E9",
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  bodyIcon: {
    tintColor: "#1F2A1F",
    width: 24,
    height: 24,
    alignSelf: "center",
  },
  flowerIcon: {
    width: 24,
    height: 24,
    marginLeft: 20,
    tintColor: "#5F6B5F",
  },
  extendedHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "5%",
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  messageText: {
    marginTop: 12,
    fontFamily: "BaiJamjuree_400Regular",
    color: "#526D50",
    fontSize: 14,
    textAlign: "center",
  },
  errorText: {
    marginHorizontal: 20,
    marginBottom: 8,
    fontFamily: "BaiJamjuree_400Regular",
    color: "#B91C1C",
    fontSize: 13,
    textAlign: "center",
  },
  searchResultRow: {
    backgroundColor: "#e8f5e9",
    height: 55,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#d9d9d9",
    borderWidth: 1,
  },
  resultName: {
    flex: 1,
    marginLeft: 5,
    fontSize: 16,
    color: "#1f2a1f",
    fontFamily: "BaiJamjuree_400Regular",
  },
  addButton: {
    backgroundColor: "rgb(62, 81, 59)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 15,
  },
  sentButton: {
    backgroundColor: "#8A9888",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "BaiJamjuree_600SemiBold",
  },
});
