import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { 
  useFonts, 
  Outfit_300Light, 
  Outfit_400Regular, 
  Outfit_500Medium, 
  Outfit_600SemiBold, 
  Outfit_700Bold 
} from '@expo-google-fonts/outfit';
import { PillPalProvider } from '@/context/PillPalContext';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Hide the splash screen once fonts are loaded
  SplashScreen.hideAsync();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PillPalProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="provider" />
          <Stack.Screen name="sus-survey" options={{ presentation: 'modal' }} />
        </Stack>
      </PillPalProvider>
    </ThemeProvider>
  );
}
