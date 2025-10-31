import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function TestNavigation() {
  const testNavigation = () => {
    console.log("Testing navigation to booking success page");
    const testBookingId = "8f7ea5cf-271d-4145-a1e5-ffd9b927656a"; // Use a known working booking ID
    
    try {
      // Method 1: Object-based navigation
      router.push({
        pathname: "/booking-success",
        params: { bookingId: testBookingId },
      });
      console.log("Navigation successful with object method");
    } catch (error) {
      console.error("Object-based navigation failed:", error);
      
      // Method 2: String-based navigation
      try {
        router.push(`/booking-success?bookingId=${testBookingId}`);
        console.log("Navigation successful with string method");
      } catch (error2) {
        console.error("String-based navigation failed:", error2);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Test Navigation Component</Text>
      <Button title="Test Navigation" onPress={testNavigation} />
      <Text style={{ marginTop: 20, textAlign: "center" }}>
        This button should navigate to the booking success page
      </Text>
    </View>
  );
}