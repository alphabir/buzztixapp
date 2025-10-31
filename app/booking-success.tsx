import { router, useLocalSearchParams } from "expo-router";
import { CheckCircle, Download, Home, FileText, Share, Calendar, MapPin, Ticket } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Share as RNShare,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";

import { trpc } from "@/lib/trpc";

export default function BookingSuccessScreen() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const qrCodeRef = useRef<any>(null);

  // Fetch booking from backend
  const { data: booking, isLoading, isError } = trpc.bookings.getById.useQuery({ id: params.bookingId as string });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3366" />
          <Text style={styles.loadingText}>Loading booking details...</Text>
        </View>
      </View>
    );
  }

  if (isError || !booking) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  const handleDownload = () => {
    Alert.alert("Download Ticket", "Your e-ticket has been downloaded!");
  };

  const handleDownloadEbill = () => {
    Alert.alert("Download E-Bill", "Your e-bill has been downloaded!");
  };

  const handleShare = async () => {
    try {
      await RNShare.share({
        message: `My ticket for ${booking.event.title} on ${new Date(booking.event.date).toLocaleDateString()}`,
        url: `buzztix://booking/${booking.id}`,
      });
    } catch (error) {
      console.error("Error sharing ticket:", error);
    }
  };

  const handleGoHome = () => {
    router.replace("/(tabs)/browse");
  };

  const handleViewTickets = () => {
    router.replace("/(tabs)/tickets");
  };

  // Use QR code data from backend
  const qrCodeData = booking.qrCode || JSON.stringify({
    bookingId: booking.id,
    eventId: booking.eventId,
    eventName: booking.event.title,
    eventDate: booking.event.date,
    venue: booking.event.venue,
    totalAmount: booking.totalAmount,
    timestamp: new Date().toISOString()
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.successIcon}>
            <CheckCircle size={80} color="#00D68F" strokeWidth={2} />
          </View>

          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>
            Your tickets for {booking.event.title} are ready
          </Text>

          {/* QR Code Section - Enhanced */}
          <View style={styles.qrContainer}>
            <View style={styles.qrCard}>
              <Text style={styles.qrTitle}>ENTRY TICKET</Text>
              <View style={styles.qrCodeWrapper}>
                <QRCode
                  value={qrCodeData}
                  size={240}
                  color="#000"
                  backgroundColor="#fff"
                  getRef={(c) => (qrCodeRef.current = c)}
                />
              </View>
              <Text style={styles.bookingId}>Booking ID: {booking.id.slice(0, 8)}</Text>
              <Text style={styles.qrInfo}>Show this QR code at the venue entrance</Text>
              
              <View style={styles.qrActions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleShare} activeOpacity={0.8}>
                  <Share size={20} color="#FF3366" />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleDownload} activeOpacity={0.8}>
                  <Download size={20} color="#FF3366" />
                  <Text style={styles.actionButtonText}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Event Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.eventImageContainer}>
              <View style={styles.imagePlaceholder} />
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{booking.event.title}</Text>
              
              <View style={styles.eventInfo}>
                <View style={styles.infoRow}>
                  <Calendar size={16} color="#FF3366" />
                  <Text style={styles.infoText}>
                    {new Date(booking.event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })} at {booking.event.time}
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <MapPin size={16} color="#FF3366" />
                  <Text style={styles.infoText}>
                    {booking.event.venue}, {booking.event.location}
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Ticket size={16} color="#FF3366" />
                  <Text style={styles.infoText}>
                    {booking.tickets.map((t: any) => `${t.type} x ${t.quantity}`).join(", ")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* E-Bill Section */}
          <View style={styles.ebillCard}>
            <View style={styles.ebillHeader}>
              <FileText size={24} color="#FF3366" />
              <Text style={styles.ebillTitle}>Payment Receipt</Text>
            </View>
            
            <View style={styles.ebillDetails}>
              <View style={styles.ebillRow}>
                <Text style={styles.ebillLabel}>Booking ID</Text>
                <Text style={styles.ebillValue}>{booking.id.slice(0, 8)}</Text>
              </View>
              
              <View style={styles.ebillRow}>
                <Text style={styles.ebillLabel}>Booking Date</Text>
                <Text style={styles.ebillValue}>
                  {new Date(booking.createdAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Text>
              </View>
              
              <View style={styles.ebillRow}>
                <Text style={styles.ebillLabel}>Customer</Text>
                <Text style={styles.ebillValue}>{booking.user?.name || "N/A"}</Text>
              </View>
              
              <View style={styles.ebillRow}>
                <Text style={styles.ebillLabel}>Email</Text>
                <Text style={styles.ebillValue}>{booking.user?.email || "N/A"}</Text>
              </View>
              
              <View style={styles.divider} />
              
              {/* Ticket Details */}
              <Text style={styles.ticketsTitle}>Ticket Details</Text>
              {booking.tickets.map((ticket: any, index: number) => (
                <View key={index} style={styles.ticketRow}>
                  <Text style={styles.ticketName}>{ticket.type}</Text>
                  <Text style={styles.ticketQuantity}>x {ticket.quantity}</Text>
                  <Text style={styles.ticketPrice}>₹{(ticket.price * ticket.quantity).toLocaleString("en-IN")}</Text>
                </View>
              ))}
              
              <View style={styles.divider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount Paid</Text>
                <Text style={styles.totalValue}>₹{booking.totalAmount.toLocaleString("en-IN")}</Text>
              </View>
              
              <View style={styles.paymentStatusRow}>
                <Text style={styles.paymentStatusLabel}>Payment Status</Text>
                <Text style={styles.paymentStatusValue}>CONFIRMED</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Next Steps</Text>
            <Text style={styles.infoDescription}>
              • A confirmation email has been sent to {booking.user?.email || "your email"}
            </Text>
            <Text style={styles.infoDescription}>
              • Save this QR code - you'll need it for entry
            </Text>
            <Text style={styles.infoDescription}>
              • Arrive at least 30 minutes before the event starts
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownloadEbill}
              activeOpacity={0.8}
            >
              <FileText size={20} color="#fff" />
              <Text style={styles.downloadButtonText}>Download Receipt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ticketsButton}
              onPress={handleViewTickets}
              activeOpacity={0.8}
            >
              <Text style={styles.ticketsButtonText}>View All My Tickets</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleGoHome}
              activeOpacity={0.8}
            >
              <Home size={20} color="#999" />
              <Text style={styles.homeButtonText}>Browse More Events</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 32,
  },
  qrContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  qrCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  qrTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: "#000",
    marginBottom: 20,
    letterSpacing: 1,
  },
  qrCodeWrapper: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  bookingId: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#333",
    marginBottom: 8,
  },
  qrInfo: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  qrActions: {
    flexDirection: "row",
    gap: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FF3366",
  },
  detailsCard: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 24,
  },
  eventImageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#555",
  },
  eventContent: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: "#fff",
    marginBottom: 16,
  },
  eventInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#ccc",
    flex: 1,
  },
  ebillCard: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 24,
  },
  ebillHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  ebillTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#fff",
  },
  ebillDetails: {
    gap: 12,
  },
  ebillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ebillLabel: {
    fontSize: 14,
    color: "#999",
  },
  ebillValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#fff",
    textAlign: "right",
  },
  ticketsTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
    marginTop: 8,
    marginBottom: 8,
  },
  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  ticketName: {
    fontSize: 14,
    color: "#ccc",
    flex: 2,
  },
  ticketQuantity: {
    fontSize: 14,
    color: "#999",
    flex: 1,
    textAlign: "center",
  },
  ticketPrice: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#fff",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#FF3366",
  },
  paymentStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  paymentStatusLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
  },
  paymentStatusValue: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "#00D68F",
  },
  infoBox: {
    width: "100%",
    backgroundColor: "rgba(0, 214, 143, 0.1)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 214, 143, 0.3)",
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#00D68F",
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 22,
    marginBottom: 6,
  },
  actions: {
    width: "100%",
    gap: 16,
    marginBottom: 40,
  },
  downloadButton: {
    backgroundColor: "#FF3366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 12,
    gap: 10,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
  },
  ebillButton: {
    backgroundColor: "#0A0A0A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FF3366",
  },
  ebillButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FF3366",
  },
  ticketsButton: {
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF3366",
  },
  ticketsButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FF3366",
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 10,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#999",
  },
  errorText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginTop: 100,
  },
});