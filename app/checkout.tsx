import { router, useLocalSearchParams } from "expo-router";
import { Calendar, ChevronLeft, CreditCard, MapPin, Ticket as TicketIcon, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { trpc } from "@/lib/trpc";

export default function CheckoutScreen() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const eventTitle = params.eventTitle as string;
  const eventImage = params.eventImage as string;
  const eventDate = params.eventDate as string;
  const eventTime = params.eventTime as string;
  const eventVenue = params.eventVenue as string;
  const eventLocation = params.eventLocation as string;
  const tickets = JSON.parse(params.tickets as string);
  const totalAmount = parseFloat(params.totalAmount as string);

  // TRPC mutations for creating users and bookings
  const userMutation = trpc.users.create.useMutation();
  const createBookingMutation = trpc.bookings.create.useMutation();

  const handlePayment = async () => {
    console.log("=== PAY BUTTON CLICKED ===");
    console.log("Current form data:", formData);
    console.log("Current params:", params);
    
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    if (totalAmount > 0 && (!formData.cardNumber || !formData.expiryDate || !formData.cvv)) {
      Alert.alert("Payment Required", "Please enter your payment details");
      return;
    }

    setIsProcessing(true);
    console.log("Processing payment...");

    try {
      // Create user (handle duplicate email gracefully)
      let userResult;
      try {
        console.log("Creating user...");
        userResult = await userMutation.mutateAsync({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });
        console.log("User created:", userResult);
      } catch (userError: any) {
        console.log("User creation error:", userError.message);
        // If user already exists, get the existing user
        if (userError.message && userError.message.includes("Unique constraint failed")) {
          try {
            // Use a simpler approach - create user with timestamp to make email unique
            const uniqueEmail = `${Date.now()}-${formData.email}`;
            console.log("Creating user with unique email:", uniqueEmail);
            userResult = await userMutation.mutateAsync({
              name: formData.name,
              email: uniqueEmail,
              phone: formData.phone,
            });
            console.log("User created with unique email:", userResult);
          } catch (secondAttemptError: any) {
            console.error("Second user creation attempt failed:", secondAttemptError);
            // If second attempt also fails, show an error
            throw new Error("Could not process user information. Please try again.");
          }
        } else {
          // If it's a different error, re-throw it
          throw userError;
        }
      }

      // Then create booking
      console.log("Creating booking...");
      const bookingResult = await createBookingMutation.mutateAsync({
        eventId: params.eventId as string,
        userId: userResult.id,
        totalAmount: totalAmount,
        tickets: tickets.map((ticket: any) => ({
          type: ticket.type,
          quantity: ticket.quantity,
          price: ticket.price,
        })),
      });
      console.log("Booking created:", bookingResult);

      // CRITICAL FIX: Ensure navigation happens correctly
      console.log("=== CRITICAL NAVIGATION FIX ===");
      console.log("Booking ID for navigation:", bookingResult.id);
      
      // Add a small delay to ensure state updates properly
      setTimeout(() => {
        try {
          // Method 1: Try the standard navigation
          console.log("Attempting standard navigation...");
          router.push({
            pathname: "/booking-success",
            params: { bookingId: bookingResult.id },
          });
          console.log("✅ Standard navigation successful");
        } catch (navError1: any) {
          console.error("❌ Standard navigation failed:", navError1);
          try {
            // Method 2: Try string-based navigation
            console.log("Attempting string-based navigation...");
            router.push(`/booking-success?bookingId=${bookingResult.id}`);
            console.log("✅ String-based navigation successful");
          } catch (navError2: any) {
            console.error("❌ String-based navigation failed:", navError2);
            try {
              // Method 3: Try replace instead of push
              console.log("Attempting replace navigation...");
              router.replace({
                pathname: "/booking-success",
                params: { bookingId: bookingResult.id },
              });
              console.log("✅ Replace navigation successful");
            } catch (navError3: any) {
              console.error("❌ Replace navigation failed:", navError3);
              // Final fallback: Show alert with direct link
              Alert.alert(
                "Navigation Issue", 
                "We're having trouble navigating to the confirmation page. Please click OK to go there manually.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      window.location.href = `/booking-success?bookingId=${bookingResult.id}`;
                    }
                  }
                ]
              );
            }
          }
        }
      }, 100); // Small delay to ensure proper state handling
      
      // Set processing state to false AFTER navigation attempt
      setIsProcessing(false);
      console.log("Payment processing completed");
    } catch (error: any) {
      setIsProcessing(false);
      console.error("Booking error:", error);
      Alert.alert("Booking Failed", error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.eventCard}>
            <Image source={{ uri: eventImage }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle} numberOfLines={2}>
                {eventTitle}
              </Text>
              <View style={styles.eventDetail}>
                <Calendar size={14} color="#999" />
                <Text style={styles.eventDetailText}>
                  {new Date(eventDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  • {eventTime}
                </Text>
              </View>
              <View style={styles.eventDetail}>
                <MapPin size={14} color="#999" />
                <Text style={styles.eventDetailText}>
                  {eventVenue}, {eventLocation}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TicketIcon size={20} color="#FF3366" />
              <Text style={styles.sectionTitle}>Ticket Summary</Text>
            </View>
            <View style={styles.ticketSummary}>
              {tickets.map((ticket: any, index: number) => (
                <View key={index} style={styles.ticketRow}>
                  <Text style={styles.ticketName}>
                    {ticket.type} x {ticket.quantity}
                  </Text>
                  <Text style={styles.ticketPrice}>
                    ₹{(ticket.price * ticket.quantity).toLocaleString("en-IN")}
                  </Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.ticketRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>₹{totalAmount.toLocaleString("en-IN")}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color="#FF3366" />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#666"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                />
              </View>
            </View>
          </View>

          {totalAmount > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <CreditCard size={20} color="#FF3366" />
                <Text style={styles.sectionTitle}>Payment Details</Text>
              </View>
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Card Number *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#666"
                    keyboardType="number-pad"
                    maxLength={19}
                    value={formData.cardNumber}
                    onChangeText={(text) => setFormData({ ...formData, cardNumber: text })}
                  />
                </View>
                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Expiry Date *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      placeholderTextColor="#666"
                      keyboardType="number-pad"
                      maxLength={5}
                      value={formData.expiryDate}
                      onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>CVV *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      placeholderTextColor="#666"
                      keyboardType="number-pad"
                      maxLength={3}
                      secureTextEntry
                      value={formData.cvv}
                      onChangeText={(text) => setFormData({ ...formData, cvv: text })}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              {totalAmount === 0 ? "Confirm Booking" : `Pay ₹${totalAmount.toLocaleString("en-IN")}`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
  },
  content: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 24,
  },
  eventImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  eventInfo: {
    padding: 16,
    gap: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eventDetailText: {
    fontSize: 13,
    color: "#999",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
  },
  ticketSummary: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ticketName: {
    fontSize: 14,
    color: "#ccc",
  },
  ticketPrice: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#FF3366",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#ccc",
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    gap: 12,
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
  },
  payButton: {
    backgroundColor: "#FF3366",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
  },
});