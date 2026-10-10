import { Tabs } from "expo-router";

// Web only: puts the tab bar at the bottom.
// iPhone/Android still use _layout.tsx (Liquid Glass NativeTabs).
export default function WebTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F07B2E",
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="heatmap" options={{ title: "Heat map" }} />
      <Tabs.Screen name="alerts" options={{ title: "Alerts", tabBarBadge: 1 }} />
      <Tabs.Screen name="family" options={{ title: "Family" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
