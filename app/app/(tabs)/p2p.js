import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSales,
  getCompaniesShare,
  sellShare,
  buyUsersShare,
} from "../../store/user/userSlice";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const P2P = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const [companyDropdownVisible, setCompanyDropdownVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  // Form state
  // const [companyId, setCompanyId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerShare, setPricePerShare] = useState("");
  const [minSharesToBuy, setMinSharesToBuy] = useState("");
  const [test, setTest] = useState(false);
  useEffect(() => {
    dispatch(getAllSales());
    dispatch(getCompaniesShare());
  }, [test]);

  const { sales, companies } = useSelector((state) => state.user);
  const salesData = sales?.sales || [];

  const handlePress = () => {
    setTest(!test);
  };

  const handlePresss = () => {
    console.log("sales: ", sales);
    console.log("companies: ", companies);
  };

  // Handle company selection
  const handleCompanySelect = (company) => {
    setSelectedCompanyId(company);
    setCompanyDropdownVisible(false); // Close dropdown after selection
  };

  const handleSalePress = (sale) => {
    setSelectedSale(sale); // Set selected sale data
    setSaleModalVisible(true); // Open modal for buying shares
  };

  const handleBuyShares = () => {
    if (!quantity || !selectedSale) {
      alert("Please enter quantity.");
      return;
    }

    console.log(quantity);
    console.log(selectedSale);

    const data = {
      quantity: Number(quantity),
      saleId: selectedSale._id, // Assuming sale ID is stored in selectedSale
    };

    dispatch(buyUsersShare(data));
    // dispatch(buyUsersShare(data)).then(() => {
    //   // Reset form fields on successful purchase
    //   setQuantity("");
    //   setModalVisible(false); // Close modal after purchase
    // }).catch((error) => {
    //   console.error("Error buying shares:", error);
    //   alert("Failed to buy shares. Please try again.");
    // });
  };

  const handleSubmit = () => {
    // console.log("quantity", quantity);
    // console.log("per share", pricePerShare);
    // console.log("min share", minSharesToBuy);
    // console.log("company", selectedCompanyId);

    const data = {
      company: selectedCompanyId,
      pricePerShare,
      minSharesToBuy,
      quantity,
    };
    // Dispatch action to post share
    dispatch(sellShare(data)).then(() => {
      setModalVisible(false);
    });
  };

  const renderSaleCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleSalePress(item)} className="mb-4">
      <LinearGradient
        colors={["#ffffff", "#f8f9fa"]}
        className="rounded-xl p-5 shadow-lg"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-xl font-bold text-black-100 mb-1">
              {item?.company_name?.companyName}
            </Text>
            <View className="flex-row items-center">
              <Ionicons
                name="person-circle-outline"
                size={16}
                color="#6B7280"
              />
              <Text className="text-gray-500 ml-1">{item?.user?.fullname}</Text>
            </View>
          </View>
          <View className="bg-secondary/10 px-3 py-1 rounded-full">
            <Text className="text-secondary font-semibold">Available</Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-4">
          <View className="bg-gray-50 p-3 rounded-lg flex-1 mr-2">
            <Text className="text-gray-500 text-sm">Shares</Text>
            <Text className="text-lg font-semibold">{item?.quantity}</Text>
          </View>
          <View className="bg-gray-50 p-3 rounded-lg flex-1 mx-2">
            <Text className="text-gray-500 text-sm">Price/Share</Text>
            <Text className="text-lg font-semibold">
              ${item?.pricePerShare}
            </Text>
          </View>
          <View className="bg-gray-50 p-3 rounded-lg flex-1 ml-2">
            <Text className="text-gray-500 text-sm">Min Shares</Text>
            <Text className="text-lg font-semibold">
              {item?.minSharesToBuy}
            </Text>
          </View>
        </View>

        <Text className="text-gray-400 text-xs mt-4">
          Posted {new Date(item?.createdAt).toLocaleDateString()}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <View className="p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-bold text-black-100">Trade</Text>
            <Text className="text-gray-500">Buy and sell shares</Text>
          </View>
          <TouchableOpacity
            className="bg-secondary px-4 py-3 rounded-xl"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white font-semibold">Post Share</Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filter Section */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center flex-1 bg-white rounded-xl p-3 mr-3 shadow-sm">
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <TextInput
              placeholder="Search shares..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-2 text-black-100"
            />
          </View>
          <TouchableOpacity
            className="bg-black-100 p-3 rounded-xl"
            onPress={handlePresss}
          >
            <Ionicons name="filter" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Sales List */}
        <FlatList
          data={salesData}
          renderItem={renderSaleCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Buy Shares Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={saleModalVisible}
        onRequestClose={() => setSaleModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold">Buy Shares</Text>
              <TouchableOpacity onPress={() => setSaleModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="bg-gray-50 rounded-xl p-4 mb-6">
              <TextInput
                placeholder="Enter quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                className="text-lg"
              />
            </View>

            <TouchableOpacity
              onPress={handleBuyShares}
              className="bg-secondary rounded-xl p-4 mb-3"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Confirm Purchase
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Post Share Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold">Post Share</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setCompanyDropdownVisible(true)}
              className="bg-gray-50 p-4 rounded-xl mb-4"
            >
              <Text className="text-lg">
                {selectedCompanyId ? selectedCompanyId : "Select Company"}
              </Text>
            </TouchableOpacity>

            {companyDropdownVisible && (
              <View className="absolute bg-white rounded-xl shadow-lg z-10 w-full left-6 right-6 max-h-60">
                <FlatList
                  data={companies.companies}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleCompanySelect(item)}
                      className="p-4 border-b border-gray-100"
                    >
                      <Text className="text-lg">{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            <View className="space-y-4 mb-6">
              <TextInput
                placeholder="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                className="bg-gray-50 p-4 rounded-xl text-lg"
              />
              <TextInput
                placeholder="Price Per Share"
                value={pricePerShare}
                onChangeText={setPricePerShare}
                keyboardType="numeric"
                className="bg-gray-50 p-4 rounded-xl text-lg"
              />
              <TextInput
                placeholder="Minimum Shares To Buy"
                value={minSharesToBuy}
                onChangeText={setMinSharesToBuy}
                keyboardType="numeric"
                className="bg-gray-50 p-4 rounded-xl text-lg"
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-secondary rounded-xl p-4"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Post Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default P2P;

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Modal,
//   TouchableOpacity,
//   FlatList,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllSales, getCompaniesShare } from "../../store/user/userSlice";

// const P2P = () => {
//   const dispatch = useDispatch();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [companyDropdownVisible, setCompanyDropdownVisible] = useState(false);

//   // Form state
//   const [selectedCompanyId, setSelectedCompanyId] = useState(null); // Store selected company object
//   const [quantity, setQuantity] = useState("");
//   const [pricePerShare, setPricePerShare] = useState("");
//   const [minSharesToBuy, setMinSharesToBuy] = useState("");
//   const [enteredName, setEnteredName] = useState(null);
//   const [enteredId, setEnteredId] = useState(null);

//   const handlePresss = () => {
//     console.log("sales: ", sales);
//     console.log("companies: ", companies);
//     console.log("Companies Data:", companies.companies);

//     const companyNamesArray = companies.companies
//       .map((company) => company.name)
//       .filter((name) => name); // Filter out any undefined or null names
//     setEnteredName(companyNamesArray); // Assuming setEnteredName is a state updater function

//     const companyIdArray = companies.companies
//       .map((company) => company._id)
//       .filter((_id) => _id); // Filter out any undefined or null names
//     setEnteredId(companyIdArray);

//     console.log("Extracted Company Names:", companyNamesArray);
//     console.log("Extracted Company Id:", companyIdArray);
//   };

//   useEffect(() => {
//     dispatch(getAllSales());
//     dispatch(getCompaniesShare());
//   }, []);

//   const { sales, companies } = useSelector((state) => state.user);
//   const salesData = sales?.sales || [];

//   // Handle company selection
//   const handleCompanySelect = (company) => {
//     setSelectedCompanyId(company); // Set selected company object
//     setCompanyDropdownVisible(false); // Close dropdown after selection
//   };

//   const handleSubmit = () => {
//     if (!selectedCompanyId || !quantity || !pricePerShare || !minSharesToBuy) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     // Prepare share data to be sent to backend
//     const shareData = {
//       companyId: selectedCompanyId._id, // Use the company ID for submission
//       quantity: Number(quantity),
//       pricePerShare: Number(pricePerShare),
//       minSharesToBuy: Number(minSharesToBuy),
//     };

//     // // Dispatch action to post share
//     // dispatch(postShare(shareData))
//     //   .then(() => {
//     //     // Reset form fields on successful submission
//     //     setSelectedCompanyId(null);
//     //     setQuantity("");
//     //     setPricePerShare("");
//     //     setMinSharesToBuy("");
//     //     setModalVisible(false); // Close modal after submission
//     //   })
//     //   .catch((error) => {
//     //     console.error("Error posting share:", error);
//     //     alert("Failed to post share. Please try again."); // Show error message
//     //   });
//   };

//   const renderSaleCard = ({ item }) => (
//     <View className="bg-white rounded-lg p-4 mb-4 w-full flex-row justify-between shadow-md">
//       <View className="flex">
//         <Text className="font-semibold">{item.company_name.companyName}</Text>
//         <Text className="text-sm font-normal text-gray-600">
//           {item.user.fullname}
//         </Text>
//         <Text className="text-gray-600">
//           posted: {new Date(item.createdAt).toLocaleDateString()}
//         </Text>
//       </View>
//       <View>
//         <Text className="text-gray-600">Shares: {item.quantity}</Text>
//         <Text className="text-gray-800">per Share: {item.pricePerShare}$</Text>
//         <Text className="text-gray-800">Min Share: {item.minSharesToBuy}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-[#09092B] p-4">
//       <View className="flex-row justify-between items-center mb-4">
//         <Text className="text-white text-xl font-bold">Trade</Text>
//         <TouchableOpacity
//           className="bg-blue-500 px-4 py-2 rounded"
//           onPress={() => setModalVisible(true)}
//         >
//           <Text className="text-white">Post Share</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Search and Filter Section */}
//       <View className="flex-row justify-between items-center mb-4">
//         <TextInput
//           placeholder="Search..."
//           placeholderTextColor="#aaa"
//           className="bg-white rounded-lg p-2 flex-1 mr-2"
//         />
//         <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded">
//           <Text className="text-white" onPress={handlePresss}>
//             Filter
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Dynamic Cards Section */}
//       <FlatList
//         data={salesData}
//         renderItem={renderSaleCard}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={{ paddingBottom: 20 }} // Optional padding at the bottom
//         showsVerticalScrollIndicator={false} // Optional to hide scroll indicator
//       />

//       {/* Bottom Sheet for Posting Shares */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <View className="flex-1 justify-end bg-black bg-opacity-50">
//           <View className="w-full bg-white rounded-t-lg p-5">
//             <Text className="text-lg font-bold mb-4">Post Share</Text>

//             {/* Company Selection Dropdown */}
//             <TouchableOpacity
//               onPress={() => setCompanyDropdownVisible(true)}
//               className="bg-gray-200 p-2 rounded mb-3"
//             >
//               <Text>
//                 {selectedCompanyId
//                   ? selectedCompanyId.companyName
//                   : "Select Company"}
//               </Text>
//             </TouchableOpacity>

//             {/* Dropdown for Companies */}
//             {companyDropdownVisible && (
//               <View className="absolute bg-white rounded-lg shadow-lg z-10 w-full max-h-60 overflow-y-auto">
//                 <FlatList
//                   data={companies.companies} // Assuming companies is an array of objects with _id and companyName properties
//                   keyExtractor={(item) => console.log(item._id)} // Assuming each company has a unique _id
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       onPress={() => handleCompanySelect(item)}
//                       className="p-2 border-b border-gray-200"
//                     >
//                       <Text>{item.companyName}</Text>{" "}
//                       {/* Displaying company name */}
//                     </TouchableOpacity>
//                   )}
//                 />
//               </View>
//             )}

//             {/* Other Input Fields */}
//             <TextInput
//               placeholder="Quantity"
//               value={quantity}
//               onChangeText={setQuantity}
//               keyboardType="numeric"
//               className="bg-gray-200 p-2 rounded mb-3"
//             />
//             <TextInput
//               placeholder="Price Per Share"
//               value={pricePerShare}
//               onChangeText={setPricePerShare}
//               keyboardType="numeric"
//               className="bg-gray-200 p-2 rounded mb-3"
//             />
//             <TextInput
//               placeholder="Minimum Shares To Buy"
//               value={minSharesToBuy}
//               onChangeText={setMinSharesToBuy}
//               keyboardType="numeric"
//               className="bg-gray-200 p-2 rounded mb-4"
//             />

//             <TouchableOpacity
//               onPress={handleSubmit}
//               className="bg-blue-500 p-2 rounded mb-2"
//             >
//               <Text className="text-white text-center">Submit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => setModalVisible(false)}
//               className="bg-red-500 p-2 rounded"
//             >
//               <Text className="text-white text-center">Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default P2P;
