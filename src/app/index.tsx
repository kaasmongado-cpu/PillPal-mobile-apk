import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.brandContainer}>
            <Image 
              source={require('@/assets/images/pillpal-logo.svg')}
              style={styles.logo}
              contentFit="contain"
            />
            <ThemedText style={styles.brandName}>PillPal</ThemedText>
          </View>

          <ThemedText style={styles.title}>
            Manage your health{'\n'}
            <ThemedText style={[styles.title, { color: theme.textSecondary }]}>
              with precision.
            </ThemedText>
          </ThemedText>

          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            The elegant way to track your medications, schedules, and health routines without the clutter.
          </ThemedText>

          <View style={styles.actions}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.buttonPrimary, { backgroundColor: theme.primary }]}
              onPress={() => router.push('/register')}
            >
              <ThemedText style={[styles.buttonPrimaryText, { color: theme.primaryText }]}>
                Get Started
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.buttonSecondary, { borderColor: theme.border, backgroundColor: theme.background }]}
              onPress={() => router.push('/login')}
            >
              <ThemedText style={[styles.buttonSecondaryText, { color: theme.text }]}>
                Sign In
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  logo: {
    width: 48,
    height: 48,
  },
  brandName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 18,
    lineHeight: 28,
    marginTop: Spacing.one,
    marginBottom: Spacing.three,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  buttonPrimary: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: 100, // Fully rounded
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
  },
  buttonSecondary: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: 100, // Fully rounded
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
  },
});
