import { router } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Button, Text, View } from "react-native";

export default function TestNavigationFix() {
  useEffect(() => {
    // Test if router is properly imported and working
    console.log("TestNavigationFix mounted");
    console.log("Router object:", router);
  }, []);

  const testDirectNavigation = () => {
    try {
      console.log("Attempting direct navigation test");
      // Use a known working booking ID from our previous tests
      const testBookingId = "8f7ea5cf-271d-4145-a1e5-ffd9b927656a";
      router.push(`/booking-success?bookingId=${testBookingId}`);
      console.log("Direct navigation successful");
    } catch (error: any) {
      console.error("Direct navigation failed:", error);
      Alert.alert("Navigation Error", "Failed to navigate: " + error.message);
    }
  };

  const testObjectNavigation = () => {
    try {
      console.log("Attempting object navigation test");
      const testBookingId = "8f7ea5cf-271d-4145-a1e5-ffd9b927656a";
      router.push({
        pathname: "/booking-success",
        params: { bookingId: testBookingId },
      });
      console.log("Object navigation successful");
    } catch (error: any) {
      console.error("Object navigation failed:", error);
      Alert.alert("Navigation Error", "Failed to navigate: " + error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#0A0A0A" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 }}>
        Navigation Test
      </Text>
      
      <View style={{ width: "100%", gap: 15 }}>
        <Button 
          title="Test Direct Navigation" 
          onPress={testDirectNavigation}
          color="#FF3366"
        />
        
        <Button 
          title="Test Object Navigation" 
          onPress={testObjectNavigation}
          color="#FF3366"
        />
        
        <Button 
          title="Go Back" 
          onPress={() => router.back()}
          color="#666"
        />
      </View>
      
      <Text style={{ marginTop: 30, textAlign: "center", color: "#999", lineHeight: 22 }}>
        This test helps verify if navigation is working properly. 
        If buttons work but the Pay button doesn't, the issue is in the checkout flow.
      </Text>
    </View>
  );
}