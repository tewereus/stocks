// Avatar.js
import React from "react";
import { View, Image, StyleSheet } from "react-native";

const Avatar = ({ uri }) => {
  return (
    <View className="mx-[20px]">
      <Image
        source={uri}
        className="w-[80] h-[80] rounded-[50px] border-4 border-red-500"
      />
    </View>
  );
};

export default Avatar;
