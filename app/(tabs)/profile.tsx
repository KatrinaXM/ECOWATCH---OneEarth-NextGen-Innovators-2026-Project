import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "../../context/auth";
import { checkSupabaseConnection } from "../../lib/supabase";
import { getOpenRouterApiKey, OPENROUTER_MODEL } from "../../lib/openrouter";

export default function ProfileScreen() {
  const { user, isGuest, signOut } = useAuth();
  const [supabaseStatus, setSupabaseStatus] = useState<string>("Checking...");
  const [supabaseOk, setSupabaseOk] = useState<boolean | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    checkServices();
  }, []);

  async function checkServices() {
    const res = await checkSupabaseConnection();
    setSupabaseOk(res.ok);
    setSupabaseStatus(res.ok ? "Connected & Healthy" : res.message);

    const key = await getOpenRouterApiKey();
    setHasApiKey(!!key);
  }

  async function handleLogout() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await signOut();
            router.replace("/login");
          } catch {
            router.replace("/login");
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.header}>Student Profile</Text>

        {/* User Card */}
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email ? user.email.charAt(0).toUpperCase() : "G"}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.email ? user.email.split("@")[0] : "Guest Student"}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || "Demo / Offline Guest Session"}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {isGuest ? "Demo Mode" : "Authenticated"}
              </Text>
            </View>
          </View>
        </View>

        {/* Services & Integrations */}
        <Text style={styles.sectionTitle}>Cloud & AI Services</Text>

        <View style={styles.serviceCard}>
          <View style={styles.serviceRow}>
            <View>
              <Text style={styles.serviceName}>Supabase Auth & Database</Text>
              <Text style={styles.serviceDetail}>{supabaseStatus}</Text>
            </View>
            <View
              style={[
                styles.dot,
                supabaseOk === true
                  ? styles.dotGreen
                  : supabaseOk === false
                  ? styles.dotRed
                  : styles.dotYellow,
              ]}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.serviceRow}>
            <View>
              <Text style={styles.serviceName}>OpenRouter Intelligence</Text>
              <Text style={styles.serviceDetail}>
                Model: {OPENROUTER_MODEL}
              </Text>
              <Text style={styles.serviceSubDetail}>
                {hasApiKey ? "Custom API Key Active" : "Built-in Research Engine Active"}
              </Text>
            </View>
            <View style={[styles.dot, hasApiKey ? styles.dotGreen : styles.dotBlue]} />
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <Pressable
          style={styles.actionButton}
          onPress={() => router.push("/ai")}
        >
          <Text style={styles.actionText}>🤖 Open EcoWatch AI Research</Text>
          <Text style={styles.actionArrow}>›</Text>
        </Pressable>

        <Pressable
          style={styles.refreshButton}
          onPress={checkServices}
        >
          <Text style={styles.refreshText}>🔄 Refresh Connection Diagnostics</Text>
        </Pressable>

        {/* Logout Button */}
        <Pressable
          style={[styles.logoutButton, loggingOut && styles.buttonDisabled]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.logoutText}>Log Out</Text>
          )}
        </Pressable>
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
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2D4C3",
    marginBottom: 24,
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F07B2E",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2320",
  },
  userEmail: {
    fontSize: 13,
    color: "#706053",
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EDE2D4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B3F35",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#706053",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 8,
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2D4C3",
    marginBottom: 24,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2B2320",
  },
  serviceDetail: {
    fontSize: 13,
    color: "#706053",
    marginTop: 2,
  },
  serviceSubDetail: {
    fontSize: 12,
    color: "#F07B2E",
    marginTop: 2,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#EDE2D4",
    marginVertical: 14,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotGreen: {
    backgroundColor: "#2E9E7E",
  },
  dotRed: {
    backgroundColor: "#E0533D",
  },
  dotYellow: {
    backgroundColor: "#F0A52E",
  },
  dotBlue: {
    backgroundColor: "#3F87D9",
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#F07B2E",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2B2320",
  },
  actionArrow: {
    fontSize: 18,
    color: "#F07B2E",
    fontWeight: "700",
  },
  refreshButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2D4C3",
    marginBottom: 24,
  },
  refreshText: {
    color: "#706053",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#E0533D",
    borderRadius: 14,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});