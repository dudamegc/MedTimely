//HISTORICO
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Para ícones de relógio e lixeira
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HistoricoMed() {
  const navigation = useNavigation();
  const [medications, setMedications] = useState([]);

  const markAsCompleted = (index) => {
    const updated = [...medications];
    updated[index].completed = true;
    setMedications(updated);
  };

  const deleteMedication = (index) => {
    const updated = [...medications];
    updated.splice(index, 1);
    setMedications(updated);
  };

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const storedData = await AsyncStorage.getItem("@medications");
        if (storedData) {
          setMedications(JSON.parse(storedData));
        }
      } catch (e) {
        console.error("Erro ao buscar dados do AsyncStorage", e);
      }
    };

    fetchMedications();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas receitas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Adicionar Medicamento")}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>
        Acompanhe seus medicamentos cadastrados e gerencie lembretes
      </Text>

      <ScrollView style={{ padding: 20 }}>
        {medications.map((med, index) => (
          <View
            key={index}
            style={[
              styles.medBox,
              med.completed ? styles.completedBox : styles.pendingBox,
            ]}
          >
            <View style={styles.medHeader}>
              <Text style={styles.medName}>
                <Ionicons name="medkit" size={18} color="#2b2b8a" />{" "}
                {med.medicine}
              </Text>
              <TouchableOpacity onPress={() => deleteMedication(index)}>
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>

            <View style={styles.timeRow}>
              <Ionicons name="time" size={16} color="#555" />
              <Text style={styles.timeText}>Horário 1: {med.time1}</Text>
            </View>

            {med.time2 ? (
              <View style={styles.timeRow}>
                <Ionicons name="time" size={16} color="#555" />
                <Text style={styles.timeText}>Horário 2: {med.time2}</Text>
              </View>
            ) : null}

            <Text style={{ fontSize: 13, color: "#333", marginTop: 6 }}>
              Dias:{" "}
              {Object.keys(med.days)
                .filter((day) => med.days[day])
                .join(", ")}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

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
  listContainer: {
    flex: 1,
  },
  medBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  completedBox: {
    backgroundColor: "#a2d5f2",
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
