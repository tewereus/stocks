import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  buyUsersShare,
  getAllSales,
  getCompaniesShare,
  resetAuthState,
  sellShare,
} from "../../store/user/userSlice";

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

  // const renderSaleCard = ({ item }) => (
  //   <View className="bg-white rounded-lg p-4 mb-4 w-full flex-row justify-between shadow-md">
  //     <View className="flex">
  //       <Text className="font-semibold ">{item.company_name.companyName}</Text>
  //       <Text className="text-sm font-normal text-gray-600">
  //         {item.user.fullname}
  //       </Text>
  //       <Text className="text-gray-600">
  //         posted: {new Date(item.createdAt).toLocaleDateString()}
  //       </Text>
  //     </View>
  //     <View>
  //       <Text className="text-gray-600">Shares: {item.quantity}</Text>
  //       <Text className="text-gray-800">per Share: {item.pricePerShare}$</Text>
  //       <Text className="text-gray-800">Min Share: {item.minSharesToBuy}</Text>
  //     </View>
  //   </View>
  // );

  const renderSaleCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleSalePress(item)}>
      <View className="bg-white rounded-lg p-4 mb-4 w-full flex-row justify-between shadow-md">
        <View className="flex">
          <Text className="font-semibold">{item.company_name.companyName}</Text>
          <Text className="text-sm font-normal text-gray-600">
            {item.user.fullname}
          </Text>
          <Text className="text-gray-600">
            posted: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View>
          <Text className="text-gray-600">Shares: {item.quantity}</Text>
          <Text className="text-gray-800">
            per Share: {item.pricePerShare}$
          </Text>
          <Text className="text-gray-800">
            Min Share: {item.minSharesToBuy}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    // #c3c3c3
    <SafeAreaView className="flex-1 bg-[#09092B] p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-xl font-bold" onPress={handlePress}>
          Trade
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white">Post Share</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter Section */}
      <View className="flex-row justify-between items-center mb-4">
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#aaa"
          className="bg-white rounded-lg p-2 flex-1 mr-2"
        />
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded">
          <Text className="text-white" onPress={handlePresss}>
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Cards Section
      <FlatList
        data={salesData}
        renderItem={renderSaleCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }} // Optional padding at the bottom
        showsVerticalScrollIndicator={false} // Optional to hide scroll indicator
      /> */}

      <FlatList
        data={salesData}
        renderItem={renderSaleCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }} // Optional padding at the bottom
        showsVerticalScrollIndicator={false} // Optional to hide scroll indicator
      />

      {/* Modal for Buying Shares */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={saleModalVisible}
        onRequestClose={() => {
          setModalVisible(!saleModalVisible);
        }}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="w-full bg-white rounded-t-lg p-5">
            <Text className="text-lg font-bold mb-4">Buy Shares</Text>

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
              onPress={() => setSaleModalVisible(false)}
              className="bg-red-500 p-2 rounded"
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
            <Text className="text-lg font-bold mb-4">Post Share</Text>

            <TouchableOpacity
              onPress={() => setCompanyDropdownVisible(true)}
              className="bg-gray-200 p-2 rounded mb-3"
            >
              <Text>
                {selectedCompanyId ? selectedCompanyId : "Select Company"}
              </Text>
            </TouchableOpacity>

            {/* Dropdown for Companies */}
            {companyDropdownVisible && (
              <View className="absolute bg-white rounded-lg shadow-lg z-10 w-full">
                <FlatList
                  data={companies.companies} // Assuming companies is an array of company names
                  keyExtractor={(item) => item} // Assuming each company name is unique
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleCompanySelect(item)}
                      className="p-2 border-b border-gray-200"
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {/* <TextInput
              placeholder="Company ID"
              value={companyId}
              onChangeText={setCompanyId}
              className="bg-gray-200 p-2 rounded mb-3"
            /> */}
            <TextInput
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              className="bg-gray-200 p-2 rounded mb-3"
            />
            <TextInput
              placeholder="Price Per Share"
              value={pricePerShare}
              onChangeText={setPricePerShare}
              keyboardType="numeric"
              className="bg-gray-200 p-2 rounded mb-3"
            />
            <TextInput
              placeholder="Minimum Shares To Buy"
              value={minSharesToBuy}
              onChangeText={setMinSharesToBuy}
              keyboardType="numeric"
              className="bg-gray-200 p-2 rounded mb-4"
            />

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-blue-500 p-2 rounded mb-2"
            >
              <Text className="text-white text-center">Submit</Text>
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
