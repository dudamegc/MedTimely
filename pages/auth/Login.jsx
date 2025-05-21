import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("false");

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://192.168.68.110:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Login realizado com sucesso!");
        navigation.navigate("Home");
      } else {
        Alert.alert("Erro", data.message || "Erro ao fazer login.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInLeft"
        delay={500}
        style={styles.containerHeader}
      >
        <View style={styles.logo}>
          <Animatable.Image source={require("../../assets/icon.png")} />
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.message}>Bem-vindo(a)</Text>
        <Text style={styles.title}>Email</Text>
        <TextInput
          placeholder="Digite um email..."
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.title}>Senha</Text>
        <TextInput
          placeholder="Digite sua senha..."
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={styles.registerText}>
            Não possui uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 34,
    backgroundColor: "#e2e9ff",
  },

  logo: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "20",
  },
  containerForm: {
    flex: 1,
    backgroundColor: "#A4BFF7",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%", //nocomeço
    paddingEnd: "5%", //nofinal
  },
  title: {
    fontSize: 17,
    marginTop: 20,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#e2e9ff",
    width: "100%",
    borderRadius: 4,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  buttonRegister: {
    marginTop: 14,
    alignSelf: "center",
  },

  registerText: {
    fontSize: 14,
    color: "#5d6577",
    textDecorationLine: "underline",
  },
});
