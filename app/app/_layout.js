import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";
import ToastProvider from "react-native-toast-message";
const _layout = () => {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <ToastProvider />
    </Provider>
  );
};

export default _layout;
