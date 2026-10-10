import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import SkyBackground from "../../components/SkyBackground";
import CitySearch from "../../components/citySearch";
import { emergency } from "../../components/emergencyNumbers";
import { CityHeat, HeatBand, fetchCityHeat } from "../../lib/heat";
import { useCity } from "../../components/CityContext";

const BAND_COLOURS: Record<HeatBand, string> = {
  Low: "#2E9E7E",
  Moderate: "#F0A52E",
  High: "#E0533D",
};

type CardProps = { band: HeatBand; country: string };

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function WarningSigns({ number }: { number: string }) {
  return (
    <View style={styles.warningBox}>
      <Text style={styles.cardSub}>⚠️ Warning signs</Text>
      <Text style={styles.text}>
        Get help if someone has dizziness, headache, nausea, cramps, heavy sweating or weakness.
        Move them somewhere cool, give water and cool their skin.
      </Text>
      <Text style={styles.text}>
        If someone is confused, faints, or has hot skin and stops sweating, call{" "}
        <Text style={styles.bold}>{number}</Text> right away.
      </Text>
    </View>
  );
}

function WhatToDoCard({ band, country }: CardProps) {
  const found = emergency.find((e) => e.country === country);
  const number = found ? String(found.no) : "your local emergency number";

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeading}>WHAT TO DO NOW</Text>

      {band === "Low" && (
        <View style={styles.lowcard}>
          <Text style={styles.cardTitle}>🟢 Low heat stress</Text>
          <Text style={styles.text}>Normal outdoor activities are OK.</Text>
          <Bullet>Drink water regularly, even if you’re not thirsty.</Bullet>
          <Bullet>Wear light, loose clothing.</Bullet>
          <Bullet>Rest in the shade if you feel tired.</Bullet>

          <Text style={styles.cardSub}>For older adults</Text>
          <Text style={styles.text}>Keep a water bottle with you when you go out.</Text>
        </View>
      )}

      {band === "Moderate" && (
        <View style={styles.medcard}>
          <Text style={styles.cardTitle}>🟠 Moderate heat stress</Text>
          <Text style={styles.text}>
            Heat can start to affect your body. Cut down on long or hard outdoor activity.
          </Text>
          <Bullet>Take breaks in the shade or indoors.</Bullet>
          <Bullet>Drink water at least every hour.</Bullet>
          <Bullet>Do outdoor chores and exercise in the early morning or evening.</Bullet>

          <Text style={styles.cardSub}>For older adults</Text>
          <Text style={styles.text}>
            Avoid going outdoors in the hottest part of the day. Stay somewhere cool if you can.
          </Text>

          <Text style={styles.cardSub}>For family</Text>
          <Text style={styles.text}>
            Call or message an elderly relative to check they’re drinking water and staying cool.
          </Text>

          <WarningSigns number={number} />
        </View>
      )}

      {band === "High" && (
        <View style={styles.highcard}>
          <Text style={styles.cardTitle}>🔴 High heat stress</Text>
          <Text style={styles.text}>
            Heat illness is likely. Stay out of the heat as much as possible.
          </Text>
          <Bullet>Stay indoors or in the shade during the hottest hours.</Bullet>
          <Bullet>Postpone exercise and heavy outdoor activities.</Bullet>
          <Bullet>Drink water regularly, and use a fan or air-conditioning to cool down.</Bullet>

          <Text style={styles.cardSub}>For older adults</Text>
          <Text style={styles.text}>
            Stay indoors in a cool place. Don’t wait until you feel thirsty to drink.
          </Text>

          <Text style={styles.cardSub}>For family</Text>
          <Text style={styles.text}>
            Check on elderly relatives today, ideally in person or by video call.
          </Text>

          <WarningSigns number={number} />
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const { city, setCity } = useCity();
  const [heat, setHeat] = useState<CityHeat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCityHeat(city.lat, city.lon)
      .then((h) => {
        if (!cancelled) setHeat(h);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load heat data. Check your connection.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city]);

  return (
    <SkyBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          indicatorStyle="white"
        >
          <CitySearch onSelect={setCity} />

          <View style={styles.box}>
            <Text style={styles.place}>{city.name}</Text>
            <Text style={styles.country}>{city.country}</Text>

            {loading && <ActivityIndicator color="#FFFFFF" style={{ marginTop: 40 }} />}

            {!loading && error && <Text style={styles.error}>{error}</Text>}

            {!loading && !error && heat && (
              <>
                <Text style={styles.temp}>{Math.round(heat.temperature)}°</Text>
                <Text style={styles.detail}>Humidity {heat.humidity}%</Text>

                <View style={[styles.bandPill, { backgroundColor: BAND_COLOURS[heat.band] }]}>
                  <Text style={styles.bandText}>
                    WBGT {heat.wbgt}° · {heat.band} heat stress
                  </Text>
                </View>
                <Text style={styles.note}>Estimated from temperature and humidity</Text>
              </>
            )}
          </View>

          {/* AI Research Quick Access Card */}
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/ai",
                params: {
                  query: `Analyze heat stress and microclimate in ${city.name}, ${city.country}`,
                },
              })
            }
            style={styles.aiCard}
          >
            <View style={styles.aiHeaderRow}>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>🤖 ECOWATCH AI</Text>
              </View>
              <Text style={styles.aiArrow}>Ask Assistant ›</Text>
            </View>
            <Text style={styles.aiTitle}>Research Heat for {city.name}</Text>
            <Text style={styles.aiDesc}>
              Consult DeepSeek AI on WBGT thresholds, urban island effects, and hydration advice.
            </Text>
          </Pressable>

          {!loading && !error && heat && (
            <WhatToDoCard band={heat.band} country={city.country} />
          )}
        </ScrollView>
      </SafeAreaView>
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", paddingTop: 16, paddingBottom: 120 },
  card: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 16,
  },
  aiCard: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(251, 241, 228, 0.92)",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#F07B2E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  aiHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  aiBadge: {
    backgroundColor: "#F07B2E",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  aiBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  aiArrow: {
    color: "#F07B2E",
    fontSize: 14,
    fontWeight: "700",
  },
  aiTitle: {
    color: "#2B2320",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 4,
  },
  aiDesc: {
    color: "#5C4F46",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  text: { color: "#FFFFFF", fontSize: 15, lineHeight: 22, marginTop: 6 },
  lowcard: { alignSelf: "stretch" },
  medcard: { alignSelf: "stretch" },
  highcard: { alignSelf: "stretch" },
  cardHeading: { color: "#FFFFFF", fontSize: 12, letterSpacing: 1, opacity: 0.8 },
  cardTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "600", marginTop: 6 },
  cardSub: { color: "#FFFFFF", fontSize: 15, fontWeight: "600", marginTop: 14 },
  bulletRow: { flexDirection: "row", marginTop: 6 },
  bulletDot: { color: "#FFFFFF", fontSize: 15, lineHeight: 22, width: 16 },
  bulletText: { color: "#FFFFFF", fontSize: 15, lineHeight: 22, flex: 1 },
  warningBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(224, 83, 61, 0.25)",
  },
  bold: { fontWeight: "700" },
  box: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 16,
  },
  place: { color: "#FFFFFF", fontSize: 30, fontWeight: "600", textAlign: "center" },
  country: { color: "#FFFFFF", fontSize: 16, opacity: 0.85, marginTop: 2 },
  temp: { color: "#FFFFFF", fontSize: 96, fontWeight: "200", marginTop: 8 },
  detail: { color: "#FFFFFF", fontSize: 16, opacity: 0.9 },
  bandPill: { marginTop: 16, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  bandText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  note: { color: "#FFFFFF", fontSize: 12, opacity: 0.75, marginTop: 8 },
  error: { color: "#FFFFFF", marginTop: 40, textAlign: "center", paddingHorizontal: 32 },
});