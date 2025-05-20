//adicionarmed.jsx
// Importação de bibliotecas necessárias do React e React Native
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // (Importado, mas ainda não usado)
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
// Componente principal da tela
export default function AdicionarMed() {
  const navigation = useNavigation();
  // Estados para guardar as informações inseridas pelo usuário
  const [medicine, setMedicine] = useState(""); // Nome do remédio
  const [time1, setTime1] = useState(""); // Primeiro horário do remédio
  const [time2, setTime2] = useState(""); // Segundo horário do remédio

  // Estado para controle dos dias da semana
  const [days, setDays] = useState({
    Seg: false,
    Ter: false,
    Qua: false,
    Qui: false,
    Sex: false,
    Sab: false,
    Dom: false,
  });

  const [medications, setMedications] = useState([]); // Lista de medicamentos adicionados
  // Tela principal ou componente de nível superior

  // Alterna o estado de um dia (selecionado ou não)
  const toggleDay = (day) => {
    setDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day], // Inverte o valor atual do dia clicado
    }));
  };

  // Formata o horário digitado manualmente para o formato HH:MM
  const handleTimeChange = (input, setTime) => {
    let cleaned = input.replace(/[^0-9]/g, ""); // Remove tudo que não for número

    if (cleaned.length > 4) {
      cleaned = cleaned.slice(0, 4); // Limita a 4 dígitos
    }

    let formatted = "";
    if (cleaned.length > 0) {
      let hours = cleaned.slice(0, 2).padStart(2, "0"); // Pega as duas primeiras posições como horas
      let minutes =
        cleaned.length > 2 ? cleaned.slice(2, 4).padStart(2, "0") : "00"; // O resto como minutos

      // Corrige horas fora do intervalo válido
      const hourNum = parseInt(hours, 10);
      if (hourNum > 23) {
        hours = "23";
      } else if (hourNum < 0 || isNaN(hourNum)) {
        hours = "00";
      }

      // Corrige minutos fora do intervalo válido
      const minuteNum = parseInt(minutes, 10);
      if (minuteNum > 59) {
        minutes = "59";
      } else if (minuteNum < 0 || isNaN(minuteNum)) {
        minutes = "00";
      }

      // Monta o horário formatado
      formatted = `${hours}:${minutes}`;
      if (cleaned.length <= 2) {
        formatted = `${hours}:00`; // Exibe 00 minutos se só digitar horas
      } else if (cleaned.length === 3) {
        formatted = `${hours}:0${minutes.charAt(0)}`; // Exibe minuto parcial se tiver 3 números
      }
    }

    setTime(formatted); // Atualiza o estado
  };

  // Incrementa horas ou minutos
  const increaseTime = (type, time, setTime) => {
    let hours = parseInt(time.slice(0, 2), 10) || 0;
    let minutes = parseInt(time.slice(3, 5), 10) || 0;

    if (type === "hours") {
      hours = hours >= 23 ? 0 : hours + 1;
    } else if (type === "minutes") {
      minutes = minutes >= 59 ? 0 : minutes + 1;
    }

    // Atualiza com novo valor formatado
    setTime(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
  };

  // Decrementa horas ou minutos
  const decreaseTime = (type, time, setTime) => {
    let hours = parseInt(time.slice(0, 2), 10) || 0;
    let minutes = parseInt(time.slice(3, 5), 10) || 0;

    if (type === "hours") {
      hours = hours <= 0 ? 23 : hours - 1;
    } else if (type === "minutes") {
      minutes = minutes <= 0 ? 59 : minutes - 1;
    }

    // Atualiza com novo valor formatado
    setTime(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
  };
  const salvarMedicamento = async (novoRemedio) => {
    try {
      const dadosExistentes = await AsyncStorage.getItem("@medications");
      const medicamentosAntigos = dadosExistentes
        ? JSON.parse(dadosExistentes)
        : [];

      const novosMedicamentos = [...medicamentosAntigos, novoRemedio];

      await AsyncStorage.setItem(
        "@medications",
        JSON.stringify(novosMedicamentos)
      );
    } catch (error) {
      console.log("Erro ao salvar medicamento:", error);
    }
  };
  // Adiciona o medicamento à lista e reseta os campos
  const handleAddMedication = () => {
    if (!medicine || (!time1 && !time2)) return; // Impede adicionar se faltar nome ou horários

    const novoRemedio = {
      medicine,
      time1,
      time2,
      days,
      completed: false,
    };

    setMedications([...medications, novoRemedio]);
    salvarMedicamento(novoRemedio);

    // Limpa os campos
    setMedicine("");
    setTime1("");
    setTime2("");
    setDays({
      Seg: false,
      Ter: false,
      Qua: false,
      Qui: false,
      Sex: false,
      Sab: false,
      Dom: false,
    });
  };

  return (
    <View style={styles.innerContainer}>
      {/* Texto de instrução */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color={"#2b2b8a"} />
      </Pressable>
      <Text style={styles.subtitle}>
        Adicione à sua prescrição médica para receber lembretes de quando tomar
        seu medicamento
      </Text>

      {/* Formulário */}
      <View style={styles.form}>
        <Text style={styles.label}>Remédio</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do medicamento"
          value={medicine}
          onChangeText={setMedicine}
        />

        {/* Primeiro horário */}
        <Text style={styles.label}>Horário 1</Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={[styles.input, styles.timeInput]}
            placeholder="00:00"
            value={time1}
            onChangeText={(input) => handleTimeChange(input, setTime1)}
            keyboardType="numeric"
            maxLength={5}
          />
          {/* Botões para aumentar/diminuir hora/minuto */}
          <View style={styles.arrowContainer}>
            <View style={styles.arrowSection}>
              <TouchableOpacity
                onPress={() => increaseTime("hours", time1, setTime1)}
                style={styles.arrowButton}
              >
                <Text style={styles.arrowText}>🔼</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => decreaseTime("hours", time1, setTime1)}
                style={styles.arrowButton}
              >
                <Text style={styles.arrowText}>🔽</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.arrowSection}>
              <TouchableOpacity
                onPress={() => increaseTime("minutes", time1, setTime1)}
                style={styles.arrowButton}
              >
                <Text style={styles.arrowText}>🔼</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => decreaseTime("minutes", time1, setTime1)}
                style={styles.arrowButton}
              >
                <Text style={styles.arrowText}>🔽</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Segundo horário (mesma lógica do primeiro) */}
        <Text style={styles.label}>Horário 2</Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={[styles.input, styles.timeInput]}
            placeholder="00:00"
            value={time2}
            onChangeText={(input) => handleTimeChange(input, setTime2)}
            keyboardType="numeric"
            maxLength={5}
          />
          <View style={styles.arrowContainer}>
            <View style={styles.arrowSection}>
              <TouchableOpacity
                onPress={() => increaseTime("hours", time2, setTime2)}
                style={styles.arrowButton}
              >
                <Text style={styles.arrowText}>🔼</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => decreaseTime("hours", time2, setTime2)}
                style={styles.arrowButton}
              >
                <Text style={styles.arrowText}>🔽</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.arrowSection}>
              <TouchableOpacity
                onPress={() => increaseTime("minutes", time2, setTime2)}
                style={styles.arrowButton}
              >
                <Text style={styles.arrowText}>🔼</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => decreaseTime("minutes", time2, setTime2)}
                style={styles.arrowButton}
              >
                <Text style={styles.arrowText}>🔽</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Seleção de dias da semana */}
        <Text style={styles.label}>Dias da semana</Text>
        <View style={styles.daysContainer}>
          {Object.keys(days).map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayBox, days[day] && styles.dayBoxSelected]}
              onPress={() => toggleDay(day)}
            >
              <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista dos medicamentos já adicionados */}
        <ScrollView style={styles.medicationList}>
          {medications.map((med, index) => (
            <View key={index} style={styles.medicationBox}>
              <Text style={styles.medicationText}>
                Medicamento: {med.medicine}
              </Text>
              <Text style={styles.medicationText}>Horário 1: {med.time1}</Text>
              <Text style={styles.medicationText}>Horário 2: {med.time2}</Text>
              <Text style={styles.medicationText}>
                Dias:{" "}
                {Object.keys(med.days)
                  .filter((day) => med.days[day])
                  .join(", ") || "Nenhum dia selecionado"}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Botão para adicionar medicamento */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMedication}
        >
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#e2e9ff",
    margin: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  back: {
    fontSize: 24,
    marginRight: 10,
    color: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002572",
  },
  subtitle: {
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeInput: {
    flex: 1,
  },
  arrowContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
  arrowSection: {
    marginHorizontal: 5,
    alignItems: "center",
  },
  arrowButton: {
    padding: 5,
  },
  arrowText: {
    fontSize: 18,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  dayBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 5,
    margin: 5,
    backgroundColor: "#eee",
  },
  dayBoxSelected: {
    backgroundColor: "#a2d5f2",
  },
  dayText: {
    fontSize: 14,
  },
  medicationList: {
    marginTop: 10,
    maxHeight: 150,
  },
  medicationBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  medicationText: {
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#002572",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
