import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { s } from "./styles";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../service/api";
import { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    const user = await AsyncStorage.getItem("user");
    let response;
    if (!user) {
      if (!email || !senha) {
        ToastAndroid.show("Preencha todos os campos!", ToastAndroid.SHORT);
        setLoading(false);

        return;
      }
      try {
        response = await api.post("/usuarios/autenticar", {
          email,
          senha,
        });
      } catch (error) {
        ToastAndroid.show(
          "Erro ao realizar login, tente novamente.",
          ToastAndroid.SHORT
        );
        setLoading(false);

        return;
      }

      if (response.status == 200) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
      } else {
        ToastAndroid.show(
          "Erro ao realizar login, tente novamente.",
          ToastAndroid.SHORT
        );
        setLoading(false);

        return;
      }
    } else {
    }
    // console.log(user);
    ToastAndroid.show("Login realizado com sucesso!", ToastAndroid.SHORT);

    navigation.navigate("Home");
    setLoading(false);
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <View style={s.container}>
      <View>
        <Text style={s.title}>Bem vindo!</Text>
        <Text style={s.subtitle}>
          Acompanhe seus resultados financeiros aqui.
        </Text>
      </View>
      <View style={s.inputContainer}>
        <Text style={s.inputLabel}>Email</Text>
        <TextInput
          style={s.input}
          onChangeText={(text) => setEmail(text)}
          placeholder="seuemail@example.com"
        />
      </View>
      <View style={s.inputContainer}>
        <Text style={s.inputLabel}>Senha</Text>
        <TextInput
          style={s.input}
          onChangeText={(text) => setSenha(text)}
          isPassword={true}
        />
      </View>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <TouchableOpacity style={s.button} onPress={handleLogin}>
          <Text style={s.TextButton}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Login;
