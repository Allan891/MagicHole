import { Tabs } from 'expo-router';
import { RoundProvider } from './RoundContext';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Import directly

import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";


export default function TabLayout() {
  return (
    <RoundProvider>
      <ThemeProvider value={DefaultTheme}>

        <Tabs initialRouteName="map">
        <Tabs.Screen name="index"
                    options={{
                      tabBarItemStyle: { title: 'no' ,display: "none" },
                    }}
                  />
        <Tabs.Screen name="map" options={{ title: 'Map',  tabBarIcon: ({ color }) => <MaterialIcons size={28} name="golf-course" color={color} />, }} />
        <Tabs.Screen name="score" options={{ title: 'Scorecard', tabBarIcon: ({ color }) => <MaterialIcons size={28} name="sports-score" color={color} />, // Change from "paperplane.fill"
 }} />
        </Tabs>
    </ThemeProvider>
    </RoundProvider>
  );
}
