import { Tabs } from 'expo-router';
import { RoundProvider } from './RoundContext';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';





export default function TabLayout() {
  return (
    <RoundProvider>
      <ThemeProvider value={DefaultTheme}>
        <Tabs>
        <Tabs.Screen name="index" options={{ title: 'Map' }} />
        <Tabs.Screen name="score" options={{ title: 'Scorecard' }} />
        </Tabs>
    </ThemeProvider>
    </RoundProvider>
  );
}
