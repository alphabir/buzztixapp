import { router } from "expo-router";
import { Calendar, MapPin, Search as SearchIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CATEGORIES, CITIES } from "@/mocks/events";
import { trpc } from "@/lib/trpc";
import type { Event } from "@/mocks/events";

export default function BrowseScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [backendResponse, setBackendResponse] = useState<string | null>(null);

  // Fetch events from backend
  const { data: events = [], isLoading, isError, error } = trpc.events.getAll.useQuery();
  
  // Log for debugging
  console.log('TRPC Query Status:', { isLoading, isError, error, eventsCount: events.length });
  
  // Test backend connection
  const hiMutation = trpc.example.hi.useMutation({
    onSuccess: (data) => {
      setBackendResponse(JSON.stringify(data, null, 2));
    },
  });

  const testBackendConnection = () => {
    hiMutation.mutate({ name: "BuzzTix User" });
  };

  const featuredEvents = events.filter((event: any) => event.isFeatured);
  const filteredEvents = events.filter((event: any) => {
    const matchesCity = event.location === selectedCity;
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    return matchesCity && matchesCategory;
  });

  const renderEventCard = (event: any, featured = false) => (
    <TouchableOpacity
      key={event.id}
      style={[styles.eventCard, featured && styles.featuredCard]}
      onPress={() => router.push(`/(tabs)/event/${event.id}` as any)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      <View style={styles.eventOverlay} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventCategory}>{event.category.toUpperCase()}</Text>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.eventArtist} numberOfLines={1}>
          {event.artist}
        </Text>
        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Calendar size={14} color="#fff" />
            <Text style={styles.detailText}>
              {new Date(event.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}{" "}
              • {event.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={14} color="#fff" />
            <Text style={styles.detailText}>{event.venue}</Text>
          </View>
        </View>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{event.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3366" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    console.log('TRPC Error Details:', error);
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load events</Text>
          <Text style={styles.errorDetail}>Error: {error?.message}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Discover Events</Text>
              <View style={styles.locationRow}>
                <MapPin size={16} color="#FF3366" />
                <Text style={styles.location}>{selectedCity}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.cityButton}
              onPress={() => {
                const currentIndex = CITIES.indexOf(selectedCity);
                const nextIndex = (currentIndex + 1) % CITIES.length;
                setSelectedCity(CITIES[nextIndex]);
              }}
            >
              <Text style={styles.cityButtonText}>Change City</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push("/(tabs)/search" as any)}
            activeOpacity={0.7}
          >
            <SearchIcon size={20} color="#999" />
            <Text style={styles.searchPlaceholder}>
              Search events, artists, venues...
            </Text>
          </TouchableOpacity>
          
          {/* Backend Connection Test */}
          <View style={styles.connectionTestContainer}>
            <TouchableOpacity 
              style={styles.testButton} 
              onPress={testBackendConnection}
              disabled={hiMutation.isPending}
            >
              <Text style={styles.testButtonText}>
                {hiMutation.isPending ? 'Testing...' : 'Test Backend Connection'}
              </Text>
            </TouchableOpacity>
            
            {backendResponse && (
              <View style={styles.responseContainer}>
                <Text style={styles.responseTitle}>Backend Response:</Text>
                <Text style={styles.responseText}>{backendResponse}</Text>
              </View>
            )}
          </View>
        </View>

        {featuredEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured This Week</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            >
              {featuredEvents.map((event: any) => renderEventCard(event, true))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "All" ? "All Events" : selectedCategory}
          </Text>
          <View style={styles.eventsList}>
            {filteredEvents.map((event: any) => renderEventCard(event))}
          </View>
        </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 20,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  errorDetail: {
    color: "#ff6666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: "#FF3366",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  connectionTestContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  testButton: {
    backgroundColor: "#FF3366",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  testButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  responseContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#222",
    borderRadius: 8,
  },
  responseTitle: {
    color: "#FF3366",
    fontWeight: "600",
    marginBottom: 8,
  },
  responseText: {
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: "#fff",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 16,
    color: "#FF3366",
    fontWeight: "600" as const,
  },
  cityButton: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  cityButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  searchPlaceholder: {
    flex: 1,
    color: "#999",
    fontSize: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#fff",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  featuredList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  categories: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
  },
  categoryChipActive: {
    backgroundColor: "#FF3366",
    borderColor: "#FF3366",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#999",
  },
  categoryTextActive: {
    color: "#fff",
  },
  eventsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  eventCard: {
    width: 320,
    height: 400,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  featuredCard: {
    width: 320,
    height: 420,
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  eventOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  eventInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 16,
    gap: 6,
  },
  eventCategory: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#FF3366",
    letterSpacing: 1,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#fff",
    lineHeight: 28,
  },
  eventArtist: {
    fontSize: 16,
    color: "#ccc",
    fontWeight: "500" as const,
  },
  eventDetails: {
    marginTop: 8,
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500" as const,
  },
  priceTag: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#FF3366",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700" as const,
  },
});