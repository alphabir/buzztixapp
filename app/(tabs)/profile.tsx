import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  LogOut,
  Settings,
  User,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MenuItem = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const menuItems: MenuItem[] = [
    {
      icon: <User size={20} color="#fff" />,
      title: "Edit Profile",
      subtitle: "Update your personal information",
      onPress: () => console.log("Edit Profile"),
    },
    {
      icon: <Heart size={20} color="#fff" />,
      title: "Favorites",
      subtitle: "View your saved events",
      onPress: () => console.log("Favorites"),
    },
    {
      icon: <CreditCard size={20} color="#fff" />,
      title: "Payment Methods",
      subtitle: "Manage your payment cards",
      onPress: () => console.log("Payment Methods"),
    },
    {
      icon: <Bell size={20} color="#fff" />,
      title: "Notifications",
      subtitle: "Manage your notification preferences",
      onPress: () => console.log("Notifications"),
    },
    {
      icon: <Settings size={20} color="#fff" />,
      title: "Settings",
      subtitle: "App settings and preferences",
      onPress: () => console.log("Settings"),
    },
    {
      icon: <HelpCircle size={20} color="#fff" />,
      title: "Help & Support",
      subtitle: "Get help or contact us",
      onPress: () => console.log("Help"),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>John Doe</Text>
              <Text style={styles.email}>john.doe@example.com</Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Events</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>5</Text>
                  <Text style={styles.statLabel}>Upcoming</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>3</Text>
                  <Text style={styles.statLabel}>Favorites</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuIcon}>{item.icon}</View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
                <ChevronRight size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => console.log("Logout")}
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#FF3366" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF3366",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#fff",
  },
  profileInfo: {
    alignItems: "center",
    width: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#FF3366",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#333",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 12,
  },
  menuList: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#999",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FF3366",
  },
  logoutText: {
    color: "#FF3366",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  version: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 24,
  },
});
