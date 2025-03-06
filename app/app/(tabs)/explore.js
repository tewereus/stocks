import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  getBoughtCompanyTransaction,
  getBoughtUsersTransaction,
  getSoldUsersTransaction,
} from "../../store/user/userSlice";

const Explore = () => {
  const dispatch = useDispatch();
  const [userType, setUserType] = useState("company");
  const [transactionType, setTransactionType] = useState("buy");
  const [test, setTest] = useState(false);

  const { companyTransaction, userTransaction, soldTransaction } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getBoughtCompanyTransaction());
    dispatch(getBoughtUsersTransaction());
    dispatch(getSoldUsersTransaction());
  }, [dispatch, test]);

  const transactions = (() => {
    if (userType === "company") {
      return companyTransaction?.transaction || [];
    } else if (transactionType === "buy") {
      return userTransaction?.transaction || [];
    } else {
      return soldTransaction?.transaction || [];
    }
  })();
  const handlePress = () => {
    setTest(!test);
  };

  const handlePresss = () => {
    console.log("company transaction: ", companyTransaction);
    console.log("user transaction: ", userTransaction);
    console.log("sold user transaction: ", soldTransaction);
  };
  const renderCompanyTransactionItem = ({ item }) => (
    <LinearGradient
      colors={["#ffffff", "#f8f9fa"]}
      className="rounded-xl mb-4 shadow-lg overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Ionicons name="business" size={24} color="#4B5563" />
              <Text className="text-xl font-bold text-gray-800 ml-2">
                {item?.company.companyName}
              </Text>
            </View>
            <Text className="text-gray-500 mt-1">
              {new Date(item?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View className="bg-blue-500/10 px-3 py-1 rounded-full">
            <Text className="text-blue-500 font-semibold">Company</Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-4">
          <View className="bg-gray-50 p-3 rounded-lg flex-1 mr-2">
            <Text className="text-gray-500 text-sm">Shares</Text>
            <Text className="text-lg font-semibold">{item?.shares}</Text>
          </View>
          <View className="bg-gray-50 p-3 rounded-lg flex-1 ml-2">
            <Text className="text-gray-500 text-sm">Price</Text>
            <Text className="text-lg font-semibold">{item?.price} Birr</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderUserTransactionItem = ({ item }) => (
    <LinearGradient
      colors={["#ffffff", "#f8f9fa"]}
      className="rounded-xl mb-4 shadow-lg overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Ionicons name="business" size={24} color="#4B5563" />
              <Text className="text-xl font-bold text-gray-800 ml-2">
                {item?.company?.companyName}
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Ionicons name="person" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1">
                {transactionType === "buy"
                  ? item?.seller?.fullname
                  : item?.buyer?.fullname}
              </Text>
            </View>
            <Text className="text-gray-500 mt-1">
              {new Date(item?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View
            className={`px-3 py-1 rounded-full ${
              transactionType === "buy" ? "bg-green-500/10" : "bg-orange-500/10"
            }`}
          >
            <Text
              className={`font-semibold ${
                transactionType === "buy" ? "text-green-500" : "text-orange-500"
              }`}
            >
              {transactionType === "buy" ? "Bought" : "Sold"}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-4">
          <View className="bg-gray-50 p-3 rounded-lg flex-1 mr-2">
            <Text className="text-gray-500 text-sm">Shares</Text>
            <Text className="text-lg font-semibold">{item?.shares}</Text>
          </View>
          <View className="bg-gray-50 p-3 rounded-lg flex-1 ml-2">
            <Text className="text-gray-500 text-sm">Price</Text>
            <Text className="text-lg font-semibold">{item?.price} Birr</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <View className="p-4">
        {/* Profile Card */}
        <LinearGradient
          colors={["#4F46E5", "#4338CA"]}
          className="rounded-2xl p-6 mb-6"
        >
          <View className="flex-row items-center mb-4">
            <View className="bg-white/20 rounded-full p-3">
              <Ionicons name="person" size={24} color="white" />
            </View>
            <View className="ml-3">
              <Text className="text-white text-xl font-bold">Abebe Kebede</Text>
              <Text className="text-white/80">Abebe.kebede@example.com</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handlePresss}
            className="bg-white/20 rounded-lg p-2 mt-2"
          >
            <Text className="text-white text-center">View Details</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Transaction History Section */}
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Transaction History
        </Text>

        {/* Filter Buttons */}
        <View className="bg-gray-100 rounded-xl p-2 mb-4">
          <View className="flex-row justify-between mb-2">
            <TouchableOpacity
              className={`flex-1 py-3 mx-1 rounded-lg ${
                userType === "company" ? "bg-blue-500" : "bg-transparent"
              }`}
              onPress={() => setUserType("company")}
            >
              <Text
                className={`text-center font-semibold ${
                  userType === "company" ? "text-white" : "text-gray-600"
                }`}
              >
                Company
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 mx-1 rounded-lg ${
                userType === "user" ? "bg-blue-500" : "bg-transparent"
              }`}
              onPress={() => setUserType("user")}
            >
              <Text
                className={`text-center font-semibold ${
                  userType === "user" ? "text-white" : "text-gray-600"
                }`}
              >
                User
              </Text>
            </TouchableOpacity>
          </View>

          {userType === "user" && (
            <View className="flex-row justify-between">
              <TouchableOpacity
                className={`flex-1 py-3 mx-1 rounded-lg ${
                  transactionType === "buy" ? "bg-blue-500" : "bg-transparent"
                }`}
                onPress={() => setTransactionType("buy")}
              >
                <Text
                  className={`text-center font-semibold ${
                    transactionType === "buy" ? "text-white" : "text-gray-600"
                  }`}
                >
                  Bought
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 mx-1 rounded-lg ${
                  transactionType === "sold" ? "bg-blue-500" : "bg-transparent"
                }`}
                onPress={() => setTransactionType("sold")}
              >
                <Text
                  className={`text-center font-semibold ${
                    transactionType === "sold" ? "text-white" : "text-gray-600"
                  }`}
                >
                  Sold
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Transaction List */}
        {userType === "company" ? (
          <FlatList
            data={transactions}
            renderItem={
              userType === "company"
                ? renderCompanyTransactionItem
                : renderUserTransactionItem
            }
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderUserTransactionItem}
            keyExtractor={(item) => item._id} // Use _id as key for each transaction
            contentContainerStyle={{ paddingBottom: 20 }} // Add padding at the bottom if needed
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Explore;
