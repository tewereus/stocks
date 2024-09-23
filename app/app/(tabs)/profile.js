// Profile.js
import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { logout } from "../../store/auth/authSlice"; // Adjust path as necessary
import { useRouter } from "expo-router"; // Use expo-router for navigation

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Sample user data (you may want to retrieve this from Redux store)
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+123456789",
    profilePicture: "https://via.placeholder.com/150", // Placeholder image
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    router.push("index"); // Navigate to sign-in screen after logout
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
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 px-4 py-2 rounded flex-1 ml-2"
          >
            <Text className="text-white text-center">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
