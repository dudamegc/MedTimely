import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

export default function Welcome() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY"
          source={require("../../assets/favicon.png")}
          style={{ width: "100%" }}
          resizeMode="contain"
        />
      </View>

      <Animatable.View
        delay={600}
        animation="fadeInUp"
        style={styles.containerForm}
      >
        <Text style={styles.title}>
          MedTimely: o lembrete do seu remédio na hora certa.
        </Text>
        <Text style={styles.text}>Faça o Login para começar</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //pegar todo o tamanho da tela
    backgroundColor: "#e2e9ff",
  },
  containerLogo: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e2e9ff",
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
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 28,
    textAlign: "center",
  },
  title2: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
  },
  text: {
    color: "#5d6577",
    textAlign: "center",
  },

  button: {
    position: "absolute",
    backgroundColor: "#e2e9ff",
    borderRadius: 50,
    paddingVertical: 8,
    width: "60%",
    alignSelf: "center",
    bottom: "35%",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
