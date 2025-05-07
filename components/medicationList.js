import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function MedicationList({ meds, onMarkAsTaken }) {
  return (
    <View>
      {meds.map((med, idx) => (
        <View key={idx} style={[styles.item, med.taken && styles.taken]}>
          <Text style={{ flex: 1 }}>
            {med.name} às {med.time}
          </Text>
          <TouchableOpacity onPress={() => onMarkAsTaken(idx)}>
            <Image
              source={require("../assets/check.png")}
              style={[styles.image, med.taken && { tintColor: "green" }]}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  taken: {
    backgroundColor: "#b2f2bb", // caixa fica verde se marcado como tomado
  },
  image: {
    width: 30,
    height: 30,
  },
});
