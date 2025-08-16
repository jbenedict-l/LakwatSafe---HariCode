import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Define the Route type (or import it if defined elsewhere)
interface Route {
  id: string;
  origin?: string;
  destination?: string;
  safetyRating: number;
  [key: string]: any;
}

interface RouteCardProps {
  route: Route;
}

const RouteCard: React.FC<RouteCardProps> = ({ route }) => (
  <View style={styles.card}>
    <Text style={styles.title}>
      {route.origin} → {route.destination}
    </Text>
    <Text style={styles.rating}>Safety Rating: {route.safetyRating}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  rating: {
    fontSize: 14,
    color: "#4A90E2",
    marginTop: 4,
  },
});

export default RouteCard;
