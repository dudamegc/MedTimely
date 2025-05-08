//TELA
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const TelaInicial = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Image
          source={require("../assets/icon.png")}
          style={{ width: 200, height: 100 }}
        />
      </View>
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
      <View style={styles.imagem}>
        <Image
          source={require("../assets/image1.png")}
          style={{ width: 300, height: 150 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#A4BFF7" },
  logo: {
    alignItems: "center",
    margin: 10,
  },
  imagem: {
    alignItems: "center",
    margin: 150,
  },
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
