//TELA INICIAL
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const TelaInicial = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Adicionar Medicamento")}
        >
          <Text style={styles.title}>Adicionar medicamento</Text>
          <Text style={styles.subtitle}>
            Cadastre novos lembretes de medicação
          </Text>
        </TouchableOpacity>
      </View>

      {/* Segundo card pode ter outro destino ou ser removido */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate("Historico")}>
          <Text style={styles.title}>Histórico de medicamentos</Text>
          <Text style={styles.subtitle}>
            Acompanhe os medicamentos e gerencie lembretes
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#555" },
});

export default TelaInicial;
