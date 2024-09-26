import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
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
      return companyTransaction?.transaction || []; // Return company transactions
    } else if (transactionType === "buy") {
      return userTransaction?.transaction || []; // Return buy user transactions
    } else {
      return soldTransaction?.transaction || []; // Return sold user transactions
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
    <View className="bg-white rounded-lg p-4 mb-2 shadow-md flex-row justify-between items-center">
      <View>
        <Text className="text-gray-800 font-semibold">
          {item.company.companyName}
        </Text>
        <Text className="text-gray-600">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View>
        <View className="flex-row">
          <Text className="text-gray-800">Shares:</Text>
          <Text className="text-gray-600">{item.shares}</Text>
        </View>
        <View>
          <Text className="text-gray-600">{item.price} Birr</Text>
        </View>
      </View>
    </View>
  );

  const renderUserTransactionItem = ({ item }) => (
    <View className="bg-white rounded-lg p-4 mb-2 shadow-md flex-row justify-between items-center">
      <View>
        <Text className="text-gray-800 font-semibold">
          {item.company.companyName}
        </Text>
        <Text className="text-gray-700 font-normal">
          {transactionType === "buy"
            ? item.seller.fullname
            : item.buyer.fullname}
        </Text>
        <Text className="text-gray-600">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View>
        <View className="flex-row">
          <Text className="text-gray-800">Shares:</Text>
          <Text className="text-gray-600">{item.shares}</Text>
        </View>
        <View>
          <Text className="text-gray-600">{item.price} Birr</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#c3c3c3] p-4">
      {/* Header Section */}
      <View className="bg-white rounded-lg p-5 m-7 h-[22%] justify-center">
        <Text onPress={handlePress}>Personal Information</Text>
        <Text onPress={handlePresss}>Name: Abebe Kebede</Text>
        <Text>Email: Abebe.kebede@example.com</Text>
      </View>
      <Text className="text-lg font-bold mb-2 ml-2">Transaction History</Text>
      <View className="flex-row justify-between my-2">
        <TouchableOpacity
          className={`flex-1 py-2 mx-1 rounded ${
            userType === "company" ? "bg-blue-500" : "bg-gray-300"
          }`}
          onPress={() => setUserType("company")}
        >
          <Text
            className={`${
              userType === "company" ? "text-white" : "text-black"
            } text-center`}
          >
            Company
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 p-2 mx-1 rounded ${
            userType === "user" ? "bg-blue-500" : "bg-gray-300"
          }`}
          onPress={() => setUserType("user")}
        >
          <Text
            className={`${
              userType === "user" ? "text-white" : "text-black"
            } text-center`}
          >
            User
          </Text>
        </TouchableOpacity>
      </View>

      {userType === "user" && (
        <View className="flex-row justify-between my-2">
          <TouchableOpacity
            className={`flex-1 py-2 mx-1 rounded ${
              transactionType === "buy" ? "bg-blue-500" : "bg-gray-300"
            }`}
            onPress={() => setTransactionType("buy")}
          >
            <Text
              className={`${
                transactionType === "buy" ? "text-white" : "text-black"
              } text-center`}
            >
              Bought
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-2 mx-1 rounded ${
              transactionType === "sold" ? "bg-blue-500" : "bg-gray-300"
            }`}
            onPress={() => setTransactionType("sold")}
          >
            <Text
              className={`${
                transactionType === "sold" ? "text-white" : "text-black"
              } text-center`}
            >
              Sold
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Transaction List */}
      {userType === "company" ? (
        <FlatList
          data={transactions}
          renderItem={renderCompanyTransactionItem}
          keyExtractor={(item) => item._id} // Use _id as key for each transaction
          contentContainerStyle={{ paddingBottom: 20 }} // Add padding at the bottom if needed
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
    </SafeAreaView>
  );
};

export default Explore;
