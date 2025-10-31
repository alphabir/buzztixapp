import { router, useLocalSearchParams } from "expo-router";
import {
  Calendar,
  ChevronLeft,
  Heart,
  MapPin,
  Minus,
  Plus,
  Share2,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { trpc } from "@/lib/trpc";

type TicketSelection = {
  [ticketId: string]: number;
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [ticketSelection, setTicketSelection] = useState<TicketSelection>({});

  // Fetch event from backend
  const { data: event, isLoading, isError } = trpc.events.getById.useQuery({ id: id as string });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3366" />
          <Text style={styles.loadingText}>Loading event details...</Text>
        </View>
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  const updateTicketQuantity = (ticketId: string, change: number) => {
    const currentQty = ticketSelection[ticketId] || 0;
    const newQty = Math.max(0, Math.min(10, currentQty + change));
    
    setTicketSelection((prev) => ({
      ...prev,
      [ticketId]: newQty,
    }));
  };

  const getTotalAmount = () => {
    return event.ticketTypes.reduce((sum, ticket) => {
      const qty = ticketSelection[ticket.id] || 0;
      return sum + ticket.price * qty;
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(ticketSelection).reduce((sum, qty) => sum + qty, 0);
  };

  const handleBooking = () => {
    const totalTickets = getTotalTickets();
    if (totalTickets === 0) {
      Alert.alert("No tickets selected", "Please select at least one ticket to continue");
      return;
    }

    const selectedTickets = event.ticketTypes
      .filter((ticket) => (ticketSelection[ticket.id] || 0) > 0)
      .map((ticket) => ({
        type: ticket.name,
        quantity: ticketSelection[ticket.id],
        price: ticket.price,
      }));

    router.push({
      pathname: "/checkout" as any,
      params: {
        eventId: event.id,
        eventTitle: event.title,
        eventImage: event.image,
        eventDate: event.date,
        eventTime: event.time,
        eventVenue: event.venue,
        eventLocation: event.location,
        tickets: JSON.stringify(selectedTickets),
        totalAmount: getTotalAmount().toString(),
      },
    });
  };

  const handleShare = () => {
    Alert.alert("Share Event", `Share ${event.title} with your friends!`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.heroImage} />
          <View style={styles.imageOverlay} />

          <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsFavorite(!isFavorite)}
                activeOpacity={0.7}
              >
                <Heart
                  size={24}
                  color={isFavorite ? "#FF3366" : "#fff"}
                  fill={isFavorite ? "#FF3366" : "none"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Share2 size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroCategory}>{event.category.toUpperCase()}</Text>
            <Text style={styles.heroTitle}>{event.title}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Calendar size={20} color="#FF3366" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>
                  {new Date(event.date).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <Text style={styles.infoSubvalue}>{event.time}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <MapPin size={20} color="#FF3366" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Venue</Text>
                <Text style={styles.infoValue}>{event.venue}</Text>
                <Text style={styles.infoSubvalue}>{event.location}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Users size={20} color="#FF3366" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Artist</Text>
                <Text style={styles.infoValue}>{event.artist}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {event.lineup && event.lineup.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lineup</Text>
              {event.lineup.map((artist, index) => (
                <View key={index} style={styles.lineupItem}>
                  <View style={styles.lineupDot} />
                  <Text style={styles.lineupText}>{artist}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Tickets</Text>
            <View style={styles.ticketsList}>
              {event.ticketTypes.map((ticket: any) => {
                const quantity = ticketSelection[ticket.id] || 0;
                return (
                  <View key={ticket.id} style={styles.ticketCard}>
                    <View style={styles.ticketCardLeft}>
                      <Text style={styles.ticketName}>{ticket.name}</Text>
                      <Text style={styles.ticketDescription}>{ticket.description}</Text>
                      <Text style={styles.ticketPrice}>
                        {ticket.price === 0 ? "Free" : `₹${ticket.price.toLocaleString("en-IN")}`}
                      </Text>
                      <Text style={styles.ticketAvailable}>{ticket.available} available</Text>
                    </View>
                    <View style={styles.ticketCardRight}>
                      {quantity === 0 ? (
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => updateTicketQuantity(ticket.id, 1)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.quantityControls}>
                          <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => updateTicketQuantity(ticket.id, -1)}
                            activeOpacity={0.7}
                          >
                            <Minus size={16} color="#fff" />
                          </TouchableOpacity>
                          <Text style={styles.quantityText}>{quantity}</Text>
                          <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => updateTicketQuantity(ticket.id, 1)}
                            activeOpacity={0.7}
                          >
                            <Plus size={16} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {getTotalTickets() > 0 && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.priceInfo}>
            <View>
              <Text style={styles.totalLabel}>
                {getTotalTickets()} {getTotalTickets() === 1 ? "ticket" : "tickets"}
              </Text>
              <Text style={styles.totalPrice}>₹{getTotalAmount().toLocaleString("en-IN")}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBooking}
            activeOpacity={0.8}
          >
            <Text style={styles.bookButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
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
  imageContainer: {
    height: 450,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  topActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  heroCategory: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#FF3366",
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: "#fff",
    lineHeight: 42,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
    marginBottom: 2,
  },
  infoSubvalue: {
    fontSize: 14,
    color: "#ccc",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#ccc",
    lineHeight: 24,
  },
  lineupItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  lineupDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF3366",
  },
  lineupText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500" as const,
  },
  ticketsList: {
    gap: 12,
  },
  ticketCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#222",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketCardLeft: {
    flex: 1,
    gap: 4,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
  },
  ticketDescription: {
    fontSize: 13,
    color: "#999",
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FF3366",
    marginTop: 4,
  },
  ticketAvailable: {
    fontSize: 11,
    color: "#666",
  },
  ticketCardRight: {
    marginLeft: 12,
  },
  addButton: {
    backgroundColor: "#FF3366",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700" as const,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#0A0A0A",
    borderRadius: 20,
    padding: 4,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF3366",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
    minWidth: 24,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#222",
    padding: 20,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  priceInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#fff",
  },
  bookButton: {
    backgroundColor: "#FF3366",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginTop: 100,
  },
});