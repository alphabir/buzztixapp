import { router } from "expo-router";
import { Calendar, MapPin, Search as SearchIcon, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CATEGORIES } from "@/mocks/events";
import { trpc } from "@/lib/trpc";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch events from backend
  const { data: events = [], isLoading, isError } = trpc.events.getAll.useQuery();

  const filteredEvents = events.filter((event: any) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderEventCard = (event: any) => (
    <TouchableOpacity
      key={event.id}
      style={styles.eventCard}
      onPress={() => router.push(`/(tabs)/event/${event.id}` as any)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: event.image }} style={styles.eventImage} />
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
            <Calendar size={12} color="#999" />
            <Text style={styles.detailText}>
              {new Date(event.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={12} color="#999" />
            <Text style={styles.detailText}>{event.venue}</Text>
          </View>
        </View>
        <Text style={styles.price}>{event.price}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3366" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load events</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, artists, venues..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

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

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <SearchIcon size={48} color="#333" />
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          <View style={styles.resultsList}>
            <Text style={styles.resultsCount}>
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "event" : "events"} found
            </Text>
            {filteredEvents.map((event: any) => renderEventCard(event))}
          </View>
        )}
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
    padding: 20,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  header: {
    padding: 20,
    paddingBottom: 12,
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
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  categories: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
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
  resultsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
  },
  eventImage: {
    width: 120,
    height: 160,
    resizeMode: "cover",
  },
  eventInfo: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  eventCategory: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: "#FF3366",
    letterSpacing: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
    lineHeight: 20,
  },
  eventArtist: {
    fontSize: 14,
    color: "#ccc",
    fontWeight: "500" as const,
  },
  eventDetails: {
    marginTop: 4,
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#999",
  },
  price: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FF3366",
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#fff",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});