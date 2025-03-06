import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../components/Avatar";
import { getAllShares, buyCompanyShare } from "../../store/user/userSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const Home = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShare, setSelectedShare] = useState(null); // State to hold selected share data
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    dispatch(getAllShares());
  }, [dispatch]);

  const avatarImages = {
    avatar1: require("../../assets/images/CBE.png"),
    avatar2: require("../../assets/images/dashen.jpg"),
    avatar3: require("../../assets/images/lo.png"),
    avatar4: require("../../assets/images/nib.png"),
    // avatar5: require("../../assets/images/images-logo.png"),
  };

  const avatars = [
    { id: "1", uri: avatarImages.avatar1 },
    { id: "2", uri: avatarImages.avatar2 },
    { id: "3", uri: avatarImages.avatar3 },
    { id: "4", uri: avatarImages.avatar4 },
    { id: "5", uri: avatarImages.avatar5 },
  ];

  const { shares, isLoading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const handleSharePress = (share) => {
    setSelectedShare(share); // Set selected share data
    setModalVisible(true); // Open modal for buying shares
  };

  const handleBuyShares = () => {
    if (!quantity || !selectedShare) {
      alert("Please enter quantity.");
      return;
    }
    const data = {
      shareId: selectedShare._id, // Use the ID of the selected share
      numberOfShares: Number(quantity), // Convert quantity to number
    };

    console.log(data);
    dispatch(buyCompanyShare(data));
    // .then(() => {
    //   // Reset form fields on successful purchase
    //   setQuantity("");
    //   setModalVisible(false); // Close modal after purchase
    // })
    // .catch((error) => {
    //   console.error("Error buying shares:", error);
    //   alert("Failed to buy shares. Please try again.");
    // });
  };

  const renderSaleCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleSharePress(item)} className="mx-2">
      <LinearGradient
        colors={["#ffffff", "#f8f9fa"]}
        className="rounded-2xl p-5 shadow-lg w-[280px] h-[200px] justify-between"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}
      >
        <View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-black-100">
              {item.company.companyName}
            </Text>
            <View className="bg-secondary/10 px-3 py-1 rounded-full">
              <Text className="text-secondary font-semibold">Active</Text>
            </View>
          </View>

          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Price per share</Text>
              <Text className="text-black font-semibold">
                ${item.pricePerShare}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-500">Minimum shares</Text>
              <Text className="text-black font-semibold">
                {item.minSharesToBuy}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-xs text-gray-400">
            Posted {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-5">
          {/* Header Section */}
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-gray-400 text-sm">Welcome back</Text>
              <Text className="text-2xl font-bold text-black-100">
                {user?.name}
              </Text>
            </View>
            <TouchableOpacity className="bg-black-100 p-2 rounded-full">
              <Text className="text-white">🔔</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View className="flex-row justify-between mb-8">
            <View className="bg-white p-4 rounded-2xl flex-1 mr-2 shadow-sm">
              <Text className="text-gray-500">Portfolio Value</Text>
              <Text className="text-xl font-bold text-black-100">$45,231</Text>
            </View>
            <View className="bg-white p-4 rounded-2xl flex-1 ml-2 shadow-sm">
              <Text className="text-gray-500">Total Shares</Text>
              <Text className="text-xl font-bold text-black-100">142</Text>
            </View>
          </View>

          {/* Companies Section */}
          <Text className="text-lg font-semibold mb-4">Popular Companies</Text>
          <FlatList
            data={avatars}
            renderItem={({ item }) => <Avatar uri={item.uri} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            className="mb-8"
          />

          {/* Available Shares Section */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Available Shares</Text>
            <TouchableOpacity>
              <Text className="text-secondary font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#FF9C01" />
          ) : (
            <FlatList
              data={shares}
              renderItem={renderSaleCard}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              snapToInterval={width - 40}
              decelerationRate="fast"
            />
          )}
        </View>
      </ScrollView>

      {/* Modal for Buying Shares */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="w-full bg-white rounded-t-lg p-5">
            <Text className="text-lg font-bold mb-4">Buy Shares</Text>
            <Text>Company: </Text>
            {/* Display company name */}
            <TextInput
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              className="bg-gray-200 p-2 rounded mb-3"
            />
            <TouchableOpacity
              onPress={handleBuyShares}
              className="bg-blue-500 p-2 rounded mb-2"
            >
              <Text className="text-white text-center">Confirm Purchase</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-red-500 p-2 rounded"
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Toast Message Component */}
      {/* Include the Toast component here if you are using it */}
    </SafeAreaView>
  );
};

export default Home;
