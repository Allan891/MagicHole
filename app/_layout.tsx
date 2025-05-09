import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';


import { useColorScheme } from '@/hooks/useColorScheme';
import db from './db/db';
import { globalStateVar } from './state/globalStateVar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = 'light';
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

const setCurrentBag = globalStateVar((state) => state.setCurrentBag);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
  const loadDB = async () => {
    await db.initDb()
    const golfBag = await db.getGolfClubsInList()
    //console.log('Bag: ', golfBag)
    setCurrentBag(golfBag)
  }

  loadDB()

  }, []);


  if (!loaded) {
    return null;
  }
   // colorScheme === 'light' ? DarkTheme : DefaultTheme
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="screens" options={{ headerShown: false }}/>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
