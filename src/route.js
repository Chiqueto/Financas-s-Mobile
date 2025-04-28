import { createStackNavigator } from "@react-navigation/stack";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();
const Routes = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user"); // Remove o usuário salvo
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }], // Volta para tela de Login
    });
  };
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          title: "Home",
          headerLeft: null,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 15 }}
            >
              <Text style={{ color: "#f87171", fontWeight: "bold" }}>Sair</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default Routes;
