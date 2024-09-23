// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useDispatch, useSelector } from "react-redux";
// import { getBoughtCompanyTransaction } from "../../store/user/userSlice";

// const explore = () => {
//   const dispatch = useDispatch();
//   const [test, setTest] = useState(false);
//   const [userType, setUserType] = useState("company");
//   const [transaction, setTransaction] = useState("company");
//   useEffect(() => {
//     dispatch(getBoughtCompanyTransaction());
//   }, [dispatch, test]);

//   const { companyTransaction } = useSelector((state) => state.user);

// const handlePress = () => {
//   setTest(!test);
// };

// const handlePresss = () => {
//   console.log("company transaction: ", companyTransaction);
// };

//   const transactions = [
//     {
//       id: "1",
//       bankName: "Cbe",
//       shares: 10000,
//       price: 200,
//       date: "12-sep-2024",
//     },
//     {
//       id: "2",
//       bankName: "Abyssiniya Bank",
//       shares: 20000,
//       price: 300,
//       date: "14-sep-2024",
//     },
//     {
//       id: "3",
//       bankName: "Dashen Bank",
//       shares: 12000,
//       price: 3500,
//       date: "22-sep-2024",
//     },
//     {
//       id: "4",
//       bankName: "Awash Bank",
//       shares: 23222,
//       price: 2000,
//       date: "05-sep-2024",
//     },
//     {
//       id: "5",
//       bankName: "Awash Bank",
//       shares: 23222,
//       price: 2000,
//       date: "05-sep-2024",
//     },
//     {
//       id: "6",
//       bankName: "Awash Bank",
//       shares: 23222,
//       price: 2000,
//       date: "05-sep-2024",
//     },
//     {
//       id: "7",
//       bankName: "Awash Bank",
//       shares: 23222,
//       price: 2000,
//       date: "05-sep-2024",
//     },
//     {
//       id: "8",
//       bankName: "Awash Bank",
//       shares: 23222,
//       price: 2000,
//       date: "05-sep-2024",
//     },
//     {
//       id: "9",
//       bankName: "Awash Bank",
//       shares: 23222,
//       price: 2000,
//       date: "05-sep-2024",
//     },
//     {
//       id: "10",
//       bankName: "Awash Bank",
//       shares: 23222,
//       price: 2000,
//       date: "05-sep-2024",
//     },
//     {
//       id: "11",
//       bankName: "Awash Bank",
//       shares: 23222,
//       price: 2000,
//       date: "05-sep-2024",
//     },
//     // Add more transactions as needed
//   ];

//   const renderTransactionItem = ({ item }) => (
//     <View className="bg-white rounded-lg p-2  mr-5 my-1 w-full h-[70px] justify-between flex-row">
//       <View>
//         <Text className="text-gray-800">{item.bankName}</Text>
//         <Text className="text-gray-600">{item.date}</Text>
//       </View>
//       <View>
//         <Text className="text-gray-800">shares</Text>
//         <Text className="text-gray-600">{item.shares}</Text>
//       </View>
//       <View>
//         <Text className="text-gray-800">price</Text>
//         <Text className="text-gray-600">{item.price} Birr</Text>
//       </View>
//     </View>
//   );
//   return (
//     <SafeAreaView className="flex-1 bg-[#c3c3c3]">
//       <View className="bg-white rounded-lg p-5 m-7 h-[22%] justify-center">
//         <Text onPress={handlePress}>Personal Information</Text>
//         <Text onPress={handlePresss}>Name: John Doe</Text>
//         <Text>Email: john.doe@example.com</Text>
//       </View>

// <Text className="text-lg font-bold mb-2 ml-2">Transaction History</Text>
// <View className="flex-row justify-between my-2">
//   <TouchableOpacity
//     className={`flex-1 py-2 mx-1 rounded ${
//       userType === "company" ? "bg-blue-500" : "bg-gray-300"
//     }`}
//     onPress={() => setUserType("company")}
//   >
//     <Text
//       className={`${
//         userType === "company" ? "text-white" : "text-black"
//       } text-center`}
//     >
//       Company
//     </Text>
//   </TouchableOpacity>
//   <TouchableOpacity
//     className={`flex-1 p-2 mx-1 rounded ${
//       userType === "user" ? "bg-blue-500" : "bg-gray-300"
//     }`}
//     onPress={() => setUserType("user")}
//   >
//     <Text
//       className={`${
//         userType === "user" ? "text-white" : "text-black"
//       } text-center`}
//     >
//       User
//     </Text>
//   </TouchableOpacity>
// </View>
//       <FlatList
//         data={transactions}
//         renderItem={renderTransactionItem}
//         keyExtractor={(item) => item.id}
//         className="mx-3 mb-3"
//         // contentContainerStyle={{ paddingBottom: 20 }} // Add padding at the bottom if needed
//       />
//     </SafeAreaView>
//   );
// };

// export default explore;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
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
  const [transactionType, setTransactionType] = useState("bought");
  const [test, setTest] = useState(false);

  const { companyTransaction, userTransaction, soldTransaction } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getBoughtCompanyTransaction());
    dispatch(getBoughtUsersTransaction());
    dispatch(getSoldUsersTransaction());
  }, [dispatch, test]);

  const transactions =
    userType === "company"
      ? companyTransaction?.transaction
      : userTransaction?.transaction;
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
          {item.seller.fullname}
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
              transactionType === "bought" ? "bg-blue-500" : "bg-gray-300"
            }`}
            onPress={() => setTransactionType("bought")}
          >
            <Text
              className={`${
                transactionType === "bought" ? "text-white" : "text-black"
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
