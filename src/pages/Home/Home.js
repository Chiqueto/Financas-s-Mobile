import { View, Text, ToastAndroid } from "react-native";
import { s } from "./styles";
import { useEffect, useState } from "react";
import api from "../../service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GraficoFinanceiroAnual from "../../components/GraficoLinhas";

const Home = () => {
  const [lancamentos, setLancamentos] = useState([]);
  const [user, setUser] = useState({});

  const fetchLancamentos = async () => {
    try {
      const response = await api.get(`/lancamentos?usuario=${user.id}`);
      console.log(response.data);

      if (response.status == 200) {
        setLancamentos(response.data);
      } else {
        ToastAndroid("Erro ao buscar lançamentos", ToastAndroid.SHORT);
        return;
      }
    } catch (error) {
      ToastAndroid("Erro ao buscar lançamentos", ToastAndroid.SHORT);
      return;
    }
  };

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        setUser(JSON.parse(user));
      } else {
        ToastAndroid("Erro ao buscar usuário", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid("Erro ao buscar usuário", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    getUser();
    fetchLancamentos();
  }, []);

  const getTotalReceitas = () => {
    const total = lancamentos.reduce((total, lancamento) => {
      if (lancamento.tipo === "RECEITA") {
        return total + lancamento.valor;
      }
      return total;
    }, 0);

    return total;
  };

  const getTotalDespesas = () => {
    const total = lancamentos.reduce((total, lancamento) => {
      if (lancamento.tipo === "DESPESA") {
        return total + lancamento.valor;
      }
      return total;
    }, 0);

    return total;
  };

  const getSaldo = () => {
    const saldo = getTotalReceitas() - getTotalDespesas();
    return saldo;
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Bem vindo, {user.nome}!</Text>
      <View style={s.cardContainer}>
        <View style={s.card}>
          <Text style={[s.cardTitle, { color: "green" }]}>Receitas</Text>
          <Text style={s.cardText}>
            {getTotalReceitas().toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
        <View style={s.card}>
          <Text style={[s.cardTitle, { color: "red" }]}>Despesas</Text>
          <Text style={s.cardText}>
            {getTotalDespesas().toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
        <View style={s.card}>
          <Text style={s.cardTitle}>Total</Text>
          <Text style={s.cardText}>
            {getSaldo().toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
      </View>
      <View>
        <Text style={s.cardTitle}>Acompanhamento financeiro</Text>
        <GraficoFinanceiroAnual dados={lancamentos} />
      </View>
    </View>
  );
};

export default Home;
