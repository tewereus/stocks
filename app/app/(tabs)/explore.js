import React from "react";
import { View, Text, ScrollView, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const explore = () => {
  const transactions = [
    {
      id: "1",
      bankName: "Cbe",
      shares: 10000,
      price: 200,
      date: "12-sep-2024",
    },
    {
      id: "2",
      bankName: "Abyssiniya Bank",
      shares: 20000,
      price: 300,
      date: "14-sep-2024",
    },
    {
      id: "3",
      bankName: "Dashen Bank",
      shares: 12000,
      price: 3500,
      date: "22-sep-2024",
    },
    {
      id: "4",
      bankName: "Awash Bank",
      shares: 23222,
      price: 2000,
      date: "05-sep-2024",
    },
    {
      id: "5",
      bankName: "Awash Bank",
      shares: 23222,
      price: 2000,
      date: "05-sep-2024",
    },
    {
      id: "6",
      bankName: "Awash Bank",
      shares: 23222,
      price: 2000,
      date: "05-sep-2024",
    },
    {
      id: "7",
      bankName: "Awash Bank",
      shares: 23222,
      price: 2000,
      date: "05-sep-2024",
    },
    {
      id: "8",
      bankName: "Awash Bank",
      shares: 23222,
      price: 2000,
      date: "05-sep-2024",
    },
    {
      id: "9",
      bankName: "Awash Bank",
      shares: 23222,
      price: 2000,
      date: "05-sep-2024",
    },
    {
      id: "10",
      bankName: "Awash Bank",
      shares: 23222,
      price: 2000,
      date: "05-sep-2024",
    },
    {
      id: "11",
      bankName: "Awash Bank",
      shares: 23222,
      price: 2000,
      date: "05-sep-2024",
    },
    // Add more transactions as needed
  ];

  const renderTransactionItem = ({ item }) => (
    <View className="bg-white rounded-lg p-2  mr-5 my-1 w-full h-[70px] justify-between flex-row">
      <View>
        <Text className="text-gray-800">{item.bankName}</Text>
        <Text className="text-gray-600">{item.date}</Text>
      </View>
      <View>
        <Text className="text-gray-800">shares</Text>
        <Text className="text-gray-600">{item.shares}</Text>
      </View>
      <View>
        <Text className="text-gray-800">price</Text>
        <Text className="text-gray-600">{item.price} Birr</Text>
      </View>
    </View>
  );
  return (
    <SafeAreaView className="flex-1 bg-[#c3c3c3]">
      <View className="bg-white rounded-lg p-5 m-7 h-[22%] justify-center">
        <Text>Personal Information</Text>
        <Text>Name: John Doe</Text>
        <Text>Email: john.doe@example.com</Text>
      </View>
      <Text className="text-lg font-bold mb-2 ml-2">Transaction History</Text>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        className="mx-3 mb-3"
        // contentContainerStyle={{ paddingBottom: 20 }} // Add padding at the bottom if needed
      />
    </SafeAreaView>
  );
};

export default explore;
