// import {
//   View,
//   Text,
//   FlatList,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import BankCard from "../../components/BankCard";
// import Avatar from "../../components/Avatar";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { getAllShares } from "../../store/user/userSlice";
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// const Home = () => {
//   const dispatch = useDispatch();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedShare, setSelectedShare] = useState(null);
//   const [quantity, setQuantity] = useState("");

//   useEffect(() => {
//     dispatch(getAllShares());
//   }, [dispatch]);

//   const { shares, isLoading } = useSelector((state) => state.user);
//   const { user } = useSelector((state) => state.auth);

//   const handleSharePress = (share) => {
//     setSelectedShare(share); // Set selected share data
//     setModalVisible(true); // Open modal for buying shares
//   };

// const avatarImages = {
//   avatar1: require("../../assets/images/CBE.png"),
//   avatar2: require("../../assets/images/path.png"),
//   avatar3: require("../../assets/images/profile.png"),
//   avatar4: require("../../assets/images/logo.png"),
//   avatar5: require("../../assets/images/empty.png"),
// };

// const avatars = [
//   { id: "1", uri: avatarImages.avatar1 },
//   { id: "2", uri: avatarImages.avatar2 },
//   { id: "3", uri: avatarImages.avatar3 },
//   { id: "4", uri: avatarImages.avatar4 },
//   { id: "5", uri: avatarImages.avatar5 },
// ];

// const handlepress = async () => {
//   console.log("pressed");
//   setTest(!test);
//   // const data = await AsyncStorage.getItem("user");
//   // console.log("data: ", data);
//   // console.log("user: ", user);
//   // console.log("pres");
//   // console.log(shares);
// };

//   const handleBuyShares = () => {
//     if (!quantity || !selectedShare) {
//       alert("Please enter quantity.");
//       return;
//     }

//     const data = {
//       shareId: selectedShare._id, // Use the ID of the selected share
//       numberOfShares: Number(quantity), // Convert quantity to number
//     };

//     console.log(data);

//     // dispatch(buyCompanyShare(data)).then(() => {
//     //   // Reset form fields on successful purchase
//     //   setQuantity("");
//     //   setModalVisible(false); // Close modal after purchase
//     // }).catch((error) => {
//     //   console.error("Error buying shares:", error);
//     //   alert("Failed to buy shares. Please try again.");
//     // });
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-[#f5f5f5]">
//       <ScrollView>
//         <View className="w-full p-4">
//           <View className="flex-row justify-between items-center mb-6">
//             <Text className="text-black text-2xl font-bold">Trade</Text>
//             <Text className="text-black text-xl" onPress={handlepress}>
//               {user.name}
//             </Text>
//           </View>

//           {/* Avatars Section */}
// <FlatList
//   data={avatars}
//   renderItem={({ item }) => <Avatar uri={item.uri} />}
//   keyExtractor={(item) => item.id}
//   horizontal
//   showsHorizontalScrollIndicator={false}
//   contentContainerStyle={{ paddingVertical: 10 }}
//   style={{ marginBottom: 20 }} // Add margin below the avatars
// />

// <Text className="text-black text-lg font-bold mb-4 mt-5">
//   Available Shares
// </Text>

//           {/* Loading State */}
//           {isLoading ? (
//             <ActivityIndicator size="large" color="#0000ff" />
//           ) : (
//             <FlatList
//               data={shares} // Use shares data here
//               renderItem={({ item }) => <BankCard bank={item} />} // Render each share as a BankCard
//               keyExtractor={(item) => item._id}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               snapToInterval={150} // Adjust based on card width for snapping effect
//               decelerationRate="fast" // Smooth scrolling effect
//               contentContainerStyle={{ paddingBottom: 20 }} // Padding at the bottom
//             />
//           )}

//           {/* Additional Content */}
//           <Text className="text-center text-gray-600 mt-10">hello</Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Home;

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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../components/Avatar";
import { getAllShares, buyCompanyShare } from "../../store/user/userSlice"; // Import necessary actions
import { SafeAreaView } from "react-native-safe-area-context";

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
    avatar5: require("../../assets/images/images-logo.png"),
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
    <TouchableOpacity onPress={() => handleSharePress(item)}>
      <View className="rounded-lg p-4 mb-4 w-full flex-row justify-between shadow-md">
        <View className="flex">
          <View className="bg-white rounded-[25px] p-3 mx-2 shadow-md w-[220px] h-[170px]">
            <Text className="text-lg font-bold">
              {item.company.companyName}
            </Text>
            <Text className="text-sm text-gray-600">
              Per share: {item.pricePerShare}
            </Text>
            <Text className="text-sm text-gray-600">
              min share: {item.minSharesToBuy}
            </Text>
            <Text className="text-gray-600">
              posted: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      <ScrollView>
        <View className="w-full p-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-black text-2xl font-bold">Trade</Text>
            <Text className="text-black text-xl">{user.name}</Text>
          </View>
          <FlatList
            data={avatars}
            renderItem={({ item }) => <Avatar uri={item.uri} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            style={{ marginBottom: 20 }} // Add margin below the avatars
          />

          <Text className="text-black text-lg font-bold mb-4 mt-5">
            Available Shares
          </Text>

          {/* Loading State */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={shares} // Use shares data here
              renderItem={renderSaleCard} // Render each share as a Sale Card
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }} // Padding at the bottom
            />
          )}

          {/* Additional Content */}
          <Text className="text-center text-gray-600 mt-10">hello</Text>
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
