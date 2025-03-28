import { Tabs } from 'expo-router';
import { RoundProvider } from './RoundContext';

export default function TabLayout() {
  return (
    <RoundProvider>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: 'Karta' }} />
        <Tabs.Screen name="score" options={{ title: 'Scorekort' }} />
      </Tabs>
    </RoundProvider>
  );
}
