// Tela de histórico de medicamentos

import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Alert } from "react-native";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ícones para elementos visuais
import { useNavigation } from "@react-navigation/native"; // Navegação entre telas
import AsyncStorage from "@react-native-async-storage/async-storage"; // Armazenamento local

export default function HistoricoMed() {
  const navigation = useNavigation(); // Hook de navegação
  const [medications, setMedications] = useState([]); // Lista de medicamentos

  // Marca um medicamento como concluído (não usado diretamente no código atual)
  const toggleCompleted = async (index) => {
    const updated = [...medications];
    updated[index].completed = !updated[index].completed; // Alterna entre true/false
    setMedications(updated);
    await AsyncStorage.setItem("@medications", JSON.stringify(updated));
  };

  // Exclui um medicamento da lista
  const deleteMedication = async (index) => {
    const updated = [...medications];
    updated.splice(index, 1); // Remove o item da posição "index"
    setMedications(updated);
    await AsyncStorage.setItem("@medications", JSON.stringify(updated)); // Atualiza no armazenamento
  };

  // Verifica se algum medicamento tem horário a ser lembrado
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      console.log(`Verificando horários: ${currentHour}:${currentMinute}`); // Debugging

      medications.forEach((med) => {
        console.log(`Verificando medicamento: ${med.medicine}`); // Debugging

        if (med.time1) {
          const [hour1, minute1] = med.time1.split(":").map(Number);
          if (hour1 === currentHour && minute1 === currentMinute) {
            console.log(
              `Alerta: Hora de tomar ${med.medicine} às ${med.time1}`
            ); // Debugging
            Alert.alert(
              "Lembrete",
              `Hora de tomar ${med.medicine} às ${med.time1}!`
            );
          }
        }

        if (med.time2) {
          const [hour2, minute2] = med.time2.split(":").map(Number);
          if (hour2 === currentHour && minute2 === currentMinute) {
            console.log(
              `Alerta: Hora de tomar ${med.medicine} às ${med.time2}`
            ); // Debugging
            Alert.alert(
              "Lembrete",
              `Hora de tomar ${med.medicine} às ${med.time2}!`
            );
          }
        }
      });
    }, 60000); // Verifica a cada minuto

    return () => clearInterval(interval);
  }, [medications]);
  // Busca medicamentos salvos ao iniciar a tela
  useFocusEffect(
    useCallback(() => {
      const fetchMedications = async () => {
        try {
          const storedData = await AsyncStorage.getItem("@medications");
          if (storedData) {
            setMedications(JSON.parse(storedData));
          } else {
            setMedications([]); // Garante que zera se não houver dados
          }
        } catch (e) {
          console.error("Erro ao buscar dados do AsyncStorage", e);
        }
      };

      fetchMedications();
    }, [])
  );
  return (
    <View style={styles.container}>
      {/* Cabeçalho com botão de adicionar */}
      <View style={styles.header}>
        <Text style={styles.title}>Minhas receitas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Adicionar Medicamento")}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Subtítulo de instrução */}
      <Text style={styles.subtitle}>
        Acompanhe seus medicamentos cadastrados e gerencie lembretes
      </Text>

      {/* Lista de medicamentos */}
      <ScrollView style={{ padding: 20 }}>
        {medications.map((med, index) => (
          <View
            key={index}
            style={[
              styles.medBox,
              med.completed ? styles.completedBox : styles.pendingBox,
            ]}
          >
            {/* Cabeçalho do medicamento (nome + botão de excluir) */}
            <View style={styles.medHeader}>
              <Text style={styles.medName}>
                <Ionicons name="medkit" size={18} color="#2b2b8a" />{" "}
                {med.medicine}
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity onPress={() => toggleCompleted(index)}>
                  <Ionicons
                    name={
                      med.completed
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={22}
                    color={med.completed ? "green" : "#999"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMedication(index)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Exibe o primeiro horário */}
            <View style={styles.timeRow}>
              <Ionicons name="time" size={16} color="#555" />
              <Text style={styles.timeText}>Horário 1: {med.time1}</Text>
            </View>

            {/* Se houver um segundo horário, exibe também */}
            {med.time2 ? (
              <View style={styles.timeRow}>
                <Ionicons name="time" size={16} color="#555" />
                <Text style={styles.timeText}>Horário 2: {med.time2}</Text>
              </View>
            ) : null}

            {/* Exibe os dias selecionados */}
            <Text style={{ fontSize: 13, color: "#333", marginTop: 6 }}>
              Dias:{" "}
              {Object.keys(med.days)
                .filter((day) => med.days[day]) // Filtra apenas os dias marcados como true
                .join(", ")}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e2e9ff",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2b2b8a",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#2b2b8a",
    borderRadius: 50,
    padding: 8,
  },
  medBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  completedBox: {
    backgroundColor: "#a2d5f2", // Fundo azul claro para medicamentos concluídos
  },
  pendingBox: {
    backgroundColor: "#f0f4ff",
    borderWidth: 1,
    borderColor: "#c0d3ff",
  },
  medHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  medName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: "#333",
  },
});
