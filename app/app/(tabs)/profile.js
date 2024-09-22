import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  // Sample user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+123456789",
    profilePicture: "https://via.placeholder.com/150", // Placeholder image
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f5f5] p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Profile</Text>
          <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded">
            <Text className="text-white">Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: userData.profilePicture }}
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />
        </View>

        {/* User Information */}
        <View className="bg-white rounded-lg p-4 shadow-md mb-4">
          <Text className="text-lg font-bold mb-2">{userData.name}</Text>
          <Text className="text-gray-600">Email: {userData.email}</Text>
          <Text className="text-gray-600">Phone: {userData.phone}</Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-around">
          <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded flex-1 mr-2">
            <Text className="text-white text-center">Message</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-red-500 px-4 py-2 rounded flex-1 ml-2">
            <Text className="text-white text-center">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
