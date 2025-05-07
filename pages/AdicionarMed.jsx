//adicionarmed.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdicionarMed() {
  const [medicine, setMedicine] = useState("");
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [days, setDays] = useState({
    Seg: false,
    Ter: false,
    Qua: false,
    Qui: false,
    Sex: false,
    Sab: false,
    Dom: false,
  });
  const [medications, setMedications] = useState([]);

  const toggleDay = (day) => {
    setDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  const handleTimeChange = (input, setTime) => {
    let cleaned = input.replace(/[^0-9]/g, "");

    if (cleaned.length > 4) {
      cleaned = cleaned.slice(0, 4);
    }

    let formatted = "";
    if (cleaned.length > 0) {
      let hours = cleaned.slice(0, 2).padStart(2, "0");
      let minutes =
        cleaned.length > 2 ? cleaned.slice(2, 4).padStart(2, "0") : "00";

      const hourNum = parseInt(hours, 10);
      if (hourNum > 23) {
        hours = "23";
      } else if (hourNum < 0 || isNaN(hourNum)) {
        hours = "00";
      }

      const minuteNum = parseInt(minutes, 10);
      if (minuteNum > 59) {
        minutes = "59";
      } else if (minuteNum < 0 || isNaN(minuteNum)) {
        minutes = "00";
      }

      formatted = `${hours}:${minutes}`;
      if (cleaned.length <= 2) {
        formatted = `${hours}:00`;
      } else if (cleaned.length === 3) {
        formatted = `${hours}:0${minutes.charAt(0)}`;
      }
    }

    setTime(formatted);
  };

  const increaseTime = (type, time, setTime) => {
    let hours = parseInt(time.slice(0, 2), 10) || 0;
    let minutes = parseInt(time.slice(3, 5), 10) || 0;

    if (type === "hours") {
      hours = hours >= 23 ? 0 : hours + 1;
    } else if (type === "minutes") {
      minutes = minutes >= 59 ? 0 : minutes + 1;
    }

    setTime(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
  };

  const decreaseTime = (type, time, setTime) => {
    let hours = parseInt(time.slice(0, 2), 10) || 0;
    let minutes = parseInt(time.slice(3, 5), 10) || 0;

    if (type === "hours") {
      hours = hours <= 0 ? 23 : hours - 1;
    } else if (type === "minutes") {
      minutes = minutes <= 0 ? 59 : minutes - 1;
    }

    setTime(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
  };

  const handleAddMedication = async () => {
    if (!medicine || (!time1 && !time2)) return;
    const newMedication = {
      medicine,
      time1: time1 || "Não definido",
      time2: time2 || "Não definido",
      days,
    };

    // Salvar no estado local
    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);

    // Salvar no AsyncStorage
    try {
      await AsyncStorage.setItem(
        "@medications",
        JSON.stringify(updatedMedications)
      );
    } catch (e) {
      console.error("Erro ao salvar no AsyncStorage", e);
    }

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

  async function salvarMedicamento(novoMed) {
    try {
      const armazenados = await AsyncStorage.getItem("@medications");
      const listaAtual = armazenados ? JSON.parse(armazenados) : [];

      listaAtual.push(novoMed); // adiciona o novo medicamento

      await AsyncStorage.setItem("@medications", JSON.stringify(listaAtual));
    } catch (e) {
      console.error("Erro ao salvar medicamento:", e);
    }
  }

  return (
    <View style={styles.innerContainer}>
      <Text style={styles.subtitle}>
        Adicione à sua prescrição médica para receber lembretes de quando tomar
        seu medicamento
      </Text>
      <View style={styles.form}>
        <Text style={styles.label}>Remédio</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do medicamento"
          value={medicine}
          onChangeText={setMedicine}
        />
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
    backgroundColor: "rgba(245, 245, 245, 0.8)",
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
