   import { Tabs } from 'expo-router';
   import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
   import { MaterialIcons } from '@expo/vector-icons'; // Import directly
   import React from "react";
   import FontAwesome from "@expo/vector-icons/FontAwesome";
   import Colors from "@/constants/Colors";
   import { useColorScheme } from "@/hooks/useColorScheme";
   import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
   import { Stack } from 'expo-router';

export default function ScreenLayout() {
  return (
    <Stack>
      <Stack.Screen name="roundsummary" options={{title: 'Round Summary'}} />
      <Stack.Screen name="historymap" options={{title: 'Historical Map'}}/>
      <Stack.Screen name="score" options={{title: 'Scorecard'}} />
    </Stack>


  );
}


/*
   export default function ScreenLayout() {
     return (

         <ThemeProvider value={DefaultTheme}>



           <Tabs.Screen name="historymap" options={{headerShown: false, title: 'Play',  tabBarIcon: ({ color }) => <MaterialIcons size={28} name="golf-course" color={color} />, }} />
           <Tabs.Screen name="score" options={{ title: 'Stats', tabBarIcon: ({ color }) => <MaterialIcons size={28} name="query-stats" color={color} />, }} />
          <Tabs.Screen name="roundsummary" options={{ title: 'Stats', }} />

       </ThemeProvider>

     );
   }
*/