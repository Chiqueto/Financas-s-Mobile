import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const GraficoFinanceiroAnual = ({ dados }) => {
  const processarDados = () => {
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const receitas = Array(12).fill(0);
    const despesas = Array(12).fill(0);

    if (dados && Array.isArray(dados)) {
      dados.forEach((item) => {
        try {
          const mesIndex =
            item.mes && !isNaN(item.mes)
              ? Math.max(0, Math.min(11, item.mes - 1))
              : 0;
          const valor = parseFloat(item.valor) || 0;
          if (item.tipo === "RECEITA") receitas[mesIndex] += valor;
          else despesas[mesIndex] += valor;
        } catch (e) {
          console.warn("Erro ao processar item:", item, e);
        }
      });
    }

    // Pegando o maior valor
    const maiorValor = Math.max(...receitas, ...despesas);

    // Se maior que 1000, vamos dividir todos por 1000 para representar em k
    const precisaNormalizar = maiorValor >= 1000;

    return {
      labels: meses,
      datasets: [
        {
          data: precisaNormalizar ? receitas.map((r) => r / 1000) : receitas,
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
          strokeWidth: 3,
        },
        {
          data: precisaNormalizar ? despesas.map((d) => d / 1000) : despesas,
          color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
          strokeWidth: 3,
        },
      ],
      legend: ["Receitas", "Despesas"],
      precisaNormalizar, // Retornamos essa informação para o gráfico saber
    };
  };

  const chartData = processarDados();

  const hasValidData = chartData.datasets.some((dataset) =>
    dataset.data.some((val) => val > 0)
  );

  if (!hasValidData) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>
          Adicione lançamentos para visualizar o gráfico
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Resumo Financeiro</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width * 0.9}
        height={250}
        yAxisLabel={chartData.precisaNormalizar ? "R$ " : "R$ "}
        yAxisSuffix={chartData.precisaNormalizar ? "k" : ""}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(51, 65, 85, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#2563eb",
          },
          propsForBackgroundLines: {
            stroke: "#e5e7eb",
            strokeDasharray: "",
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  placeholderContainer: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  chart: {
    marginTop: 10,
    borderRadius: 8,
  },
});

export default GraficoFinanceiroAnual;
