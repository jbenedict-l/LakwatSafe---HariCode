import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Define the Update type (or import it if defined elsewhere)
interface Update {
  id: string;
  timestamp: Date;
  content?: string;
  [key: string]: any;
}

interface UpdateCardProps {
  update: Update;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => (
  <View style={styles.card}>
    <Text style={styles.timestamp}>
      {update.timestamp instanceof Date
        ? update.timestamp.toLocaleString()
        : String(update.timestamp)}
    </Text>
    <Text style={styles.content}>
      {update.content || "No details provided."}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: "#2c3e50",
  },
});

export default UpdateCard;
