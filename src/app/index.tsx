import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { usePillPal } from '@/context/PillPalContext';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { setRole } = usePillPal();

  const handleQuickStudent = () => {
    setRole('student');
    router.push('/(tabs)/home');
  };

  const handleQuickDoctor = () => {
    setRole('provider');
    router.push('/provider');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Branding */}
          <View style={styles.brandContainer}>
            <Image 
              source={require('@/assets/images/pillpal-logo.svg')}
              style={styles.logo}
              contentFit="contain"
            />
            <View>
              <ThemedText style={styles.brandName}>PillPal</ThemedText>
              <ThemedText style={[styles.universityTag, { color: theme.primary }]}>
                Caraga State University • UCHW
              </ThemedText>
            </View>
          </View>

          {/* Hero Heading */}
          <View style={styles.heroSection}>
            <View style={[styles.capstoneBadge, { backgroundColor: theme.primaryLight }]}>
              <MaterialCommunityIcons name="school" size={14} color={theme.primary} />
              <ThemedText style={[styles.capstoneBadgeText, { color: theme.primary }]}>
                BSIT Capstone 2026 • Clinical Adherence Platform
              </ThemedText>
            </View>

            <ThemedText style={styles.title}>
              Manage your health{'\n'}
              <ThemedText style={[styles.title, { color: theme.primary }]}>
                with clinical care.
              </ThemedText>
            </ThemedText>

            <ThemedText style={styles.subtitle} themeColor="textSecondary">
              A clinical-integrated medication adherence platform linking CSU students with the
              University Center for Health and Wellness (UCHW).
            </ThemedText>
          </View>

          {/* Quick Demo Launch Cards */}
          <View style={styles.quickLaunchSection}>
            <ThemedText style={[styles.quickLaunchLabel, { color: theme.textSecondary }]}>
              INSTANT ACCESS DEMO PORTALS:
            </ThemedText>

            <TouchableOpacity 
              activeOpacity={0.85}
              style={[styles.portalCard, { backgroundColor: theme.card, borderColor: theme.primary }]}
              onPress={handleQuickStudent}
            >
              <View style={[styles.portalIconBox, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="phone-portrait" size={24} color={theme.primary} />
              </View>
              <View style={styles.portalInfo}>
                <ThemedText style={styles.portalTitle}>Student Mobile App</ThemedText>
                <ThemedText style={styles.portalSub} themeColor="textSecondary">
                  Home adherence ring, dose logs, ScanRx OCR, and clinic chat
                </ThemedText>
              </View>
              <Ionicons name="arrow-forward-circle" size={24} color={theme.primary} />
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.85}
              style={[styles.portalCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={handleQuickDoctor}
            >
              <View style={[styles.portalIconBox, { backgroundColor: theme.secondaryLight }]}>
                <MaterialCommunityIcons name="doctor" size={24} color={theme.secondary} />
              </View>
              <View style={styles.portalInfo}>
                <ThemedText style={styles.portalTitle}>Provider Web Dashboard</ThemedText>
                <ThemedText style={styles.portalSub} themeColor="textSecondary">
                  Clinical alerts, patient panel, reports & analytics, clinic pharmacy
                </ThemedText>
              </View>
              <Ionicons name="arrow-forward-circle" size={24} color={theme.secondary} />
            </TouchableOpacity>
          </View>

          {/* System Feature Highlights */}
          <View style={[styles.featuresBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <View style={styles.featureItem}>
              <Ionicons name="scan-outline" size={18} color={theme.primary} />
              <ThemedText style={styles.featureText}>OCR Prescription Digitization (Tesseract)</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark-outline" size={18} color={theme.primary} />
              <ThemedText style={styles.featureText}>Data Privacy Act 2012 (RA 10173) Compliant</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="book-outline" size={18} color={theme.primary} />
              <ThemedText style={styles.featureText}>Philippine National Drug Formulary (PNDF)</ThemedText>
            </View>
          </View>

          {/* Standard Authentication Options */}
          <View style={styles.actions}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.buttonPrimary, { backgroundColor: theme.primary }]}
              onPress={() => router.push('/register')}
            >
              <ThemedText style={[styles.buttonPrimaryText, { color: theme.primaryText }]}>
                Create Account
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
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  logo: {
    width: 44,
    height: 44,
  },
  brandName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
    letterSpacing: -0.5,
  },
  universityTag: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  heroSection: {
    gap: 8,
  },
  capstoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  capstoneBadgeText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 2,
  },
  quickLaunchSection: {
    gap: 10,
    marginTop: Spacing.two,
  },
  quickLaunchLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  portalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  portalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portalInfo: {
    flex: 1,
    gap: 2,
  },
  portalTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
  },
  portalSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  featuresBox: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginVertical: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  buttonPrimary: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.four,
    borderRadius: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
  },
  buttonSecondary: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.four,
    borderRadius: 100,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
  },
});
