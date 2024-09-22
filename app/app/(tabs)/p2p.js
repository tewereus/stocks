import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const P2P = () => {
  // Sample data for shares
  const sharesData = [
    {
      id: "1",
      Company: "Cbe",
      fullname: "Abebe Tesfaye",
      totalShares: 100,
      pricePerShare: "$10",
      minShareToBuy: 100,
    },
    {
      id: "2",
      Company: "Dashen",
      fullname: "Aselefech Sewnet",
      totalShares: 5000,
      pricePerShare: "$150",
      minShareToBuy: 500,
    },
    {
      id: "3",
      Company: "Ayat Real State",
      fullname: "Kebede chala",
      totalShares: 2000000,
      pricePerShare: "$8",
      minShareToBuy: 50,
    },
    {
      id: "4",
      Company: "Ayat Real State",
      fullname: "Kebede chala",
      totalShares: 2000000,
      pricePerShare: "$8",
      minShareToBuy: 50,
    },
    {
      id: "5",
      Company: "Ayat Real State",
      fullname: "Kebede chala",
      totalShares: 2000000,
      pricePerShare: "$8",
      minShareToBuy: 50,
    },
    {
      id: "6",
      Company: "Ayat Real State",
      fullname: "Kebede chala",
      totalShares: 2000000,
      pricePerShare: "$8",
      minShareToBuy: 50,
    },
    {
      id: "7",
      Company: "Ayat Real State",
      fullname: "Kebede chala",
      totalShares: 2000000,
      pricePerShare: "$8",
      minShareToBuy: 50,
    },
    // Add more shares as needed
  ];

  const renderShareCard = ({ item }) => (
    <View className="bg-white rounded-lg p-4 mb-4 w-full flex-row justify-between shadow-md">
      <View className="flex">
        <Text className="text-lg font-bold ">{item.Company}</Text>
        <Text className="text-sm font-normal text-gray-600">
          {item.fullname}
        </Text>
      </View>
      <View>
        <Text className="text-gray-600">Shares: {item.totalShares}</Text>
        <Text className="text-gray-800">per Share: {item.pricePerShare}</Text>
        <Text className="text-gray-800">
          Minimum Share: {item.minShareToBuy}
        </Text>
      </View>
    </View>
  );

  return (
    // #c3c3c3
    <SafeAreaView className="flex-1 bg-[#09092B] p-4">
      {/* Header Section */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-xl font-bold">Trade</Text>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded">
          <Text className="text-white">Post Share</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter Section */}
      <View className="flex-row justify-between items-center mb-4">
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#aaa"
          className="bg-white rounded-lg p-2 flex-1 mr-2"
        />
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded">
          <Text className="text-white">Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Cards Section */}
      <FlatList
        data={sharesData}
        renderItem={renderShareCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }} // Optional padding at the bottom
        showsVerticalScrollIndicator={false} // Optional to hide scroll indicator
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // You can add additional styles here if needed
});

export default P2P;
