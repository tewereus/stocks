// BankCard.js
import React from "react";
import { View, Text } from "react-native";

const BankCard = ({ bank }) => {
  return (
    <View className="bg-white rounded-lg p-12 mx-2 shadow-md w-[220px]">
      <Text className="text-lg font-bold">{bank.name}</Text>
      <Text className="text-sm text-gray-600">{bank.details}</Text>
    </View>
  );
};

export default BankCard;
