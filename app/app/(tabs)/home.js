import { View, Text, FlatList, ScrollView } from "react-native";
import React from "react";
import BankCard from "../../components/BankCard";
import Avatar from "../../components/Avatar";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  // Sample data for available shares (or banks)
  const banks = [
    { id: "1", name: "Bank A", details: "Available for all transactions" },
    { id: "2", name: "Bank B", details: "Low fees and great service" },
    { id: "3", name: "Bank C", details: "Best savings account rates" },
    { id: "4", name: "Bank D", details: "24/7 customer support" },
    { id: "5", name: "Bank E", details: "Great investment options" },
  ];

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
          <FlatList
            data={banks}
            renderItem={({ item }) => <BankCard bank={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={150} // Adjust based on card width for snapping effect
            decelerationRate="fast" // Smooth scrolling effect
            contentContainerStyle={{ paddingBottom: 20 }} // Padding at the bottom
          />

          {/* Additional Content */}
          <Text className="text-center text-gray-600 mt-10">hello</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
