//APP.JS
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native"; // Importando NavigationContainer
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Importando createNativeStackNavigator

import TelaInicial from "./pages/TelaInicial";
import AdicionarMed from "./pages/AdicionarMed";
import HistoricoMed from "./pages/HistoricoMed";

const Stack = createNativeStackNavigator();

export default function App() {
  const [medications, setMedications] = useState([]);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={TelaInicial} />
        <Stack.Screen name="Adicionar Medicamento" component={AdicionarMed} />
        <Stack.Screen name="Historico" component={HistoricoMed} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
