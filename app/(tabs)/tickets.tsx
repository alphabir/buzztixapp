import { Calendar, MapPin, QrCode } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";

import { trpc } from "@/lib/trpc";

export default function TicketsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // Fetch bookings from backend - using a placeholder user ID for now
  // In a real app, this would come from authentication context
  const userId = "test-user-id";
  const { data: bookings = [], isLoading, isError } = trpc.bookings.getUserBookings.useQuery({ userId });

  const handleShowQR = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const handleCloseQR = () => {
    setSelectedTicket(null);
  };

  const handleShare = (ticket: any) => {
    Alert.alert("Share Ticket", `Share your ticket for ${ticket.event.title}!`);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3366" />
          <Text style={styles.loadingText}>Loading tickets...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load tickets</Text>
        </View>
      </View>
    );
  }

  const upcomingTickets = bookings.filter((ticket: any) => ticket.status === "confirmed");

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Tickets</Text>
          <Text style={styles.subtitle}>
            {upcomingTickets.length}{" "}
            {upcomingTickets.length === 1 ? "ticket" : "tickets"} booked
          </Text>
        </View>

        {upcomingTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <QrCode size={64} color="#333" />
            <Text style={styles.emptyTitle}>No tickets yet</Text>
            <Text style={styles.emptyText}>
              Book your first event and your tickets will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.ticketsList}>
            {upcomingTickets.map((ticket: any) => (
              <View key={ticket.id} style={styles.ticketCard}>
                <Image
                  source={{ uri: ticket.event.image }}
                  style={styles.ticketImage}
                />
                <View style={styles.ticketContent}>
                  <View style={styles.ticketHeader}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>CONFIRMED</Text>
                    </View>
                    <Text style={styles.bookingId}>#{ticket.id.slice(0, 8)}</Text>
                  </View>
                  <Text style={styles.eventTitle}>{ticket.event.title}</Text>

                  <View style={styles.eventDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={14} color="#999" />
                      <Text style={styles.detailText}>
                        {new Date(ticket.event.date).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        • {ticket.event.time}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin size={14} color="#999" />
                      <Text style={styles.detailText}>
                        {ticket.event.venue}, {ticket.event.location}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.ticketsInfo}>
                    {ticket.tickets.map((t: any, index: number) => (
                      <Text key={index} style={styles.ticketTypeText}>
                        • {t.type} x {t.quantity}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.qrButton}
                      onPress={() => handleShowQR(ticket)}
                      activeOpacity={0.7}
                    >
                      <QrCode size={20} color="#FF3366" />
                      <Text style={styles.qrButtonText}>Show QR Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.shareButton}
                      onPress={() => handleShare(ticket)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.shareButtonText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={selectedTicket !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCloseQR}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseQR}
        >
          <View style={styles.modalContent}>
            <View style={styles.qrContainer}>
              <Text style={styles.qrTitle}>Your Ticket</Text>
              <Text style={styles.qrSubtitle}>
                {selectedTicket?.event?.title}
              </Text>

              <View style={styles.qrCodeBox}>
                {selectedTicket && (
                  <QRCode
                    value={selectedTicket.qrCode || JSON.stringify({
                      bookingId: selectedTicket.id,
                      eventId: selectedTicket.eventId,
                      eventName: selectedTicket.event.title,
                      eventDate: selectedTicket.event.date,
                      venue: selectedTicket.event.venue,
                      totalAmount: selectedTicket.totalAmount,
                      timestamp: new Date().toISOString()
                    })}
                    size={200}
                    color="#000"
                    backgroundColor="#fff"
                  />
                )}
              </View>

              <Text style={styles.qrCode}>{selectedTicket?.id.slice(0, 8)}</Text>
              <Text style={styles.qrInstructions}>
                Show this QR code at the venue entrance
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseQR}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingTop: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
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
  ticketsList: {
    paddingHorizontal: 20,
    gap: 20,
  },
  ticketCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
  },
  ticketImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  ticketContent: {
    padding: 20,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: "rgba(0, 214, 143, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: "#00D68F",
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
  },
  bookingId: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600" as const,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#fff",
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#999",
    flex: 1,
  },
  ticketsInfo: {
    gap: 4,
    marginBottom: 12,
  },
  ticketTypeText: {
    fontSize: 13,
    color: "#ccc",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  qrButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0A0A",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FF3366",
  },
  qrButtonText: {
    color: "#FF3366",
    fontSize: 14,
    fontWeight: "700" as const,
  },
  shareButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
  },
  shareButtonText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
  },
  qrContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
  },
  qrTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  qrSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  qrCodeBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    marginBottom: 24,
  },
  qrCode: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#0A0A0A",
    marginBottom: 8,
  },
  qrInstructions: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: "#FF3366",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
  },
});