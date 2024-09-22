import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { images } from "../../constants";
// import { createUser } from "../../lib/appwrite";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { register, resetAuthState } from "../../store/auth/authSlice";

// import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const dispatch = useDispatch();
  //   const { setUser, setIsLogged } = useGlobalContext();

  const { isLoading, isSuccess, isError } = useSelector((state) => state.auth);

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    mobile: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    setSubmitting(true);
    try {
      const data = {
        fullname: form.fullname,
        username: form.username,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      };
      dispatch(register(data));
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "User created successfully",
      });
      router.push("/sign-in");
      dispatch(resetAuthState()); // Dispatch resetAuthState after navigation
    }
    if (isError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred during registration.",
      });
      dispatch(resetAuthState()); // Dispatch resetAuthState on error
    }
  }, [isSuccess, isError, dispatch, router]);

  return (
    <SafeAreaView className="bg-[#09092B] h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-5"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="w-full flex justify-center items-center">
            <Image
              source={images.logoSmall2}
              resizeMode="contain"
              className="w-[215px] h-[75px]"
            />
          </View>

          <Text className="text-2xl font-semibold text-white mt-7">
            Sign Up to Prime
          </Text>

          <FormField
            title="username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-6"
          />
          <FormField
            title="fullname"
            value={form.fullname}
            handleChangeText={(e) => setForm({ ...form, fullname: e })}
            otherStyles="mt-6"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Mobile"
            value={form.mobile}
            handleChangeText={(e) => setForm({ ...form, mobile: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-normal">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-semibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
