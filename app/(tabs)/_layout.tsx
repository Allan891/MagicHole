import { Tabs } from 'expo-router';
import { RoundProvider } from './RoundContext';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Import directly




export default function TabLayout() {
  return (
    <RoundProvider>
      <ThemeProvider value={DefaultTheme}>
        <Tabs>
        <Tabs.Screen name="map" options={{ title: 'Map',  tabBarIcon: ({ color }) => <MaterialIcons size={28} name="golf-course" color={color} />, }} />
        <Tabs.Screen name="score" options={{ title: 'Scorecard', tabBarIcon: ({ color }) => <MaterialIcons size={28} name="sports-score" color={color} />, // Change from "paperplane.fill"
 }} />
        </Tabs>
    </ThemeProvider>
    </RoundProvider>
  );
}
