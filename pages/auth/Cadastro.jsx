import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";

import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Cadastro() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!name || !email || !password) {
      Alert.alert("Preencha todos os campos.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Digite um email válido.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.68.110:3000/api/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(data.message);
        // Redirecionar para a tela de login após o cadastro
        navigation.navigate("Login");
      } else {
        Alert.alert("Erro", data.message || "Erro ao cadastrar.");
      }
    } catch (error) {
      Alert.alert("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          backgroundColor: "#A4BFF7",
        }}
        keyboardShouldPersistTaps="handled" // opcional para fechar teclado ao clicar fora
      >
        <View style={styles.container}>
          <Animatable.View
            animation="fadeInLeft"
            delay={500}
            style={styles.containerHeader}
          >
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={30} color={"#2b2b8a"} />
            </Pressable>
            <View style={styles.logo}>
              <Animatable.Image source={require("../../assets/icon.png")} />
            </View>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" style={styles.containerForm}>
            <Text style={styles.message}>Crie uma conta</Text>
            <Text style={styles.title}>Nome Completo</Text>
            <TextInput
              placeholder="Nome Completo..."
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
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

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
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
    marginBottom: 5,
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

  backButton: {
    padding: 8,
    paddingStart: "3%",
    alignSelf: "flex-start",
  },
});
