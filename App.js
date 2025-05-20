//APP.JS
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native"; // Importando NavigationContainer
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Importando createNativeStackNavigator

const Stack = createNativeStackNavigator();

import TelaInicial from "./pages/panel/TelaInicial";
import AdicionarMed from "./pages/panel/AdicionarMed";
import HistoricoMed from "./pages/panel/HistoricoMed";
import Welcome from "./pages/auth/Welcome";
import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";

export default function App() {
  const [medications, setMedications] = useState([]);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
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
