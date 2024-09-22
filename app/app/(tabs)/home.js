import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BankCard from "../../components/BankCard";
import Avatar from "../../components/Avatar";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllShares } from "../../store/user/userSlice";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllShares());
  }, [dispatch]);

  const { shares, isLoading } = useSelector((state) => state.user);

  const avatarImages = {
    avatar1: require("../../assets/images/CBE.png"),
    avatar2: require("../../assets/images/path.png"),
    avatar3: require("../../assets/images/profile.png"),
    avatar4: require("../../assets/images/logo.png"),
    avatar5: require("../../assets/images/empty.png"),
  };

  const avatars = [
    { id: "1", uri: avatarImages.avatar1 },
    { id: "2", uri: avatarImages.avatar2 },
    { id: "3", uri: avatarImages.avatar3 },
    { id: "4", uri: avatarImages.avatar4 },
    { id: "5", uri: avatarImages.avatar5 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      <ScrollView>
        <View className="w-full p-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-black text-2xl font-bold">Trade</Text>
            <Text className="text-black text-xl">userName</Text>
          </View>

          {/* Avatars Section */}
          <FlatList
            data={avatars}
            renderItem={({ item }) => <Avatar uri={item.uri} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            style={{ marginBottom: 20 }} // Add margin below the avatars
          />

          <Text className="text-black text-lg font-bold mb-4 mt-5">
            Available Shares
          </Text>

          {/* Loading State */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={shares} // Use shares data here
              renderItem={({ item }) => <BankCard bank={item} />} // Render each share as a BankCard
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={150} // Adjust based on card width for snapping effect
              decelerationRate="fast" // Smooth scrolling effect
              contentContainerStyle={{ paddingBottom: 20 }} // Padding at the bottom
            />
          )}

          {/* Additional Content */}
          <Text className="text-center text-gray-600 mt-10">hello</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
