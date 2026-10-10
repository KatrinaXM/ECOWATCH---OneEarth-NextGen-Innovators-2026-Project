import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCity } from "../../components/CityContext";
import { CITY_MAPS } from "../../components/cityMaps";

export default function HeatmapScreen() {
  const { city } = useCity();
  const map = CITY_MAPS[city.country];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Heat Stress Map</Text>
        <Text style={styles.subtitle}>
          Regional thermal distribution for {city.country}
        </Text>

        <View style={styles.mapCard}>
          <Text style={styles.countryLabel}>{city.country}</Text>
          {map ? (
            <Image source={map} style={styles.map} resizeMode="contain" />
          ) : (
            <View style={styles.emptyMap}>
              <Text style={styles.emptyText}>Map not available for this country yet</Text>
            </View>
          )}

          <View style={styles.legend}>
            <Text style={styles.legendTitle}>WBGT Hazard Scale</Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: "#2E9E7E" }]} />
                <Text style={styles.legendText}>&lt; 31.0° Low</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: "#F0A52E" }]} />
                <Text style={styles.legendText}>31.0°–32.9° Mod</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: "#E0533D" }]} />
                <Text style={styles.legendText}>≥ 33.0° High</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FBF1E4",
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2B2320",
  },
  subtitle: {
    fontSize: 14,
    color: "#706053",
    marginTop: 4,
    marginBottom: 20,
  },
  mapCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2D4C3",
    alignItems: "center",
  },
  countryLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2320",
    marginBottom: 12,
  },
  map: {
    width: "100%",
    height: 340,
    borderRadius: 8,
  },
  emptyMap: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#706053",
    fontSize: 14,
  },
  legend: {
    width: "100%",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#EDE2D4",
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#706053",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    color: "#2B2320",
    fontWeight: "600",
  },
});