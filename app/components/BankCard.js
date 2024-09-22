// BankCard.js
import React from "react";
import { View, Text } from "react-native";

const BankCard = ({ bank }) => {
  return (
    <View className="bg-white rounded-[25px] p-3 mx-2 shadow-md w-[220px] h-[170px]">
      <Text className="text-lg font-bold">{bank.company.companyName}</Text>
      <Text className="text-sm text-gray-600">{bank.pricePerShare}</Text>
    </View>
  );
};

export default BankCard;
