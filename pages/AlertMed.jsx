//ALERT
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TextInput,
  Platform,
  StyleSheet,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import DateTimePicker from "@react-native-community/datetimepicker";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeRemedio, setNomeRemedio] = useState("");
  const [hora, setHora] = useState(new Date());
  const notificationListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current =
      Notifications.addNotificationReceivedListener(() => {
        setModalVisible(true);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, []);

  async function agendarNotificacao() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora do remédio",
        body: `É hora de tomar: ${nomeRemedio}`,
      },
      trigger: hora,
    });
    alert("Notificação agendada!");
  }

  const confirmar = () => {
    alert(`${nomeRemedio} tomado com sucesso!`);
    setModalVisible(false);
  };

  const adiar = async () => {
    const novoHorario = new Date();
    novoHorario.setMinutes(novoHorario.getMinutes() + 10);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete adiado",
        body: `Hora de tomar: ${nomeRemedio}`,
      },
      trigger: novoHorario,
    });

    setModalVisible(false);
    alert("Adiado por 10 minutos.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MedTimely</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do remédio"
        value={nomeRemedio}
        onChangeText={setNomeRemedio}
      />
      <DateTimePicker
        value={hora}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={(event, selectedDate) => setHora(selectedDate || hora)}
      />
      <Button title="Agendar Lembrete" onPress={agendarNotificacao} />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Hora do remédio!</Text>
          <Text>{nomeRemedio}</Text>
          <View style={styles.buttons}>
            <Button title="Confirmar" onPress={confirmar} />
            <Button title="Adiar" onPress={adiar} color="#5555ff" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Permissão para notificação negada!");
      return;
    }
  } else {
    alert("Notificações só funcionam em dispositivos reais!");
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 26, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  modal: {
    marginTop: "50%",
    padding: 20,
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  modalTitle: { fontSize: 20, marginBottom: 10 },
  buttons: { flexDirection: "row", gap: 10, marginTop: 20 },
});
