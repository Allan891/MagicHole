import { Tabs } from 'expo-router';

import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Import directly

import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";


export default function TabLayout() {
  return (
    
    <ThemeProvider value={DefaultTheme}>
      {/* Tabs Collection */}
      <Tabs initialRouteName="map">
        
        {/* Index Tab */}
        <Tabs.Screen name="index"options={{headerShown: false,tabBarItemStyle: { title: 'no' ,display: "none" },}}/>
        {/* Map Tab */}
        <Tabs.Screen name="map" options={{headerShown: false, title: 'Map',  tabBarIcon: ({ color }) => <MaterialIcons size={28} name="golf-course" color={color} />, }} />
        {/* Scorecard Tab */}
        <Tabs.Screen name="score" options={{ title: 'Scorecard', tabBarIcon: ({ color }) => <MaterialIcons size={28} name="sports-score" color={color} />, // Change from "paperplane.fill"
<<<<<<< HEAD
        }} />
        {/* SettingsTab */}
        <Tabs.Screen name="settings" options={{headerShown: false, title: 'Settings',  tabBarIcon: ({ color }) => <MaterialIcons size={28} name="settings" color={color} />, }} />
      
      </Tabs>
=======
 }} />
        <Tabs.Screen name="history" options={{headerShown: false, title: 'History',  tabBarIcon: ({ color }) => <MaterialIcons size={28} name="list" color={color} />, }} />
        </Tabs>
>>>>>>> origin/main
    </ThemeProvider>
    
  );
}
