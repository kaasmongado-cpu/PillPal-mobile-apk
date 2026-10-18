import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { HeaderBar } from '@/components/HeaderBar';
import { AdherenceRing } from '@/components/AdherenceRing';
import { DoseCard } from '@/components/DoseCard';
import { usePillPal } from '@/context/PillPalContext';
import { useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const {
    studentProfile,
    scheduledDoses,
    medications,
    streakDays,
    overallAdherence,
    confirmDose,
    snoozeDose,
    lastConfirmedDoseTime,
  } = usePillPal();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'taken'>('all');
  const [showCelebration, setShowCelebration] = useState(false);

  const takenCount = scheduledDoses.filter(d => d.status === 'taken').length;
  const nextPendingDose = scheduledDoses.find(d => d.status === 'pending');

  // Low supply warning check
  const lowSupplyMeds = medications.filter(m => m.pillsRemaining <= m.refillThreshold);

  const handleConfirm = (id: string) => {
    confirmDose(id);
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 2000);
  };

  const filteredDoses = scheduledDoses.filter(d => {
    if (activeFilter === 'pending') return d.status === 'pending' || d.status === 'snoozed';
    if (activeFilter === 'taken') return d.status === 'taken';
    return true;
  });

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <HeaderBar title="PillPal" subtitle="CSU UCHW Student Portal" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.maxWidthWrapper}>
          {/* Greeting Banner */}
          <View style={styles.greetingSection}>
            <View>
              <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                {currentDateFormatted} • CSU Ampayon
              </Text>
              <Text style={[styles.greetingTitle, { color: theme.text }]}>
                Hello, {studentProfile.name.split(' ')[0]} 👋
              </Text>
              <Text style={[styles.greetingSub, { color: theme.textSecondary }]}>
                {studentProfile.course} • ID: {studentProfile.studentId}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.profileBadge, { backgroundColor: theme.primaryLight }]}
              onPress={() => router.push('/(tabs)/analytics' as any)}
            >
              <MaterialCommunityIcons name="shield-check" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* Refill Alert Banner if applicable */}
          {lowSupplyMeds.length > 0 && (
            <TouchableOpacity
              style={[styles.refillAlert, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}
              onPress={() => router.push('/(tabs)/medications' as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="warning" size={20} color="#d97706" />
              <View style={styles.refillContent}>
                <Text style={styles.refillTitle}>Prescription Refill Reminder</Text>
                <Text style={styles.refillSubtitle}>
                  {lowSupplyMeds.map(m => `${m.name} (${m.pillsRemaining} left)`).join(', ')}.
                  Tap to request refill from CSU Clinic.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#d97706" />
            </TouchableOpacity>
          )}

          {/* Adherence Summary Circular Gauge (Wireframe B) */}
          <AdherenceRing
            score={overallAdherence}
            streak={streakDays}
            dosesTaken={takenCount}
            totalDoses={scheduledDoses.length}
          />

          {/* Quick Action Shortcuts */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/(tabs)/scan' as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="camera" size={20} color={theme.primary} />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.text }]}>Scan Rx</Text>
              <Text style={[styles.quickActionSub, { color: theme.textSecondary }]}>OCR Import</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/(tabs)/medications' as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: theme.secondaryLight }]}>
                <MaterialCommunityIcons name="pill-multiple" size={20} color={theme.secondary} />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.text }]}>Medicines</Text>
              <Text style={[styles.quickActionSub, { color: theme.textSecondary }]}>
                {medications.length} Active
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/(tabs)/messages' as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: '#f3e8ff' }]}>
                <Ionicons name="chatbubbles" size={20} color="#9333ea" />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.text }]}>UCHW Clinic</Text>
              <Text style={[styles.quickActionSub, { color: theme.textSecondary }]}>Direct Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/sus-survey' as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="clipboard" size={20} color="#059669" />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.text }]}>SUS Test</Text>
              <Text style={[styles.quickActionSub, { color: theme.textSecondary }]}>Usability</Text>
            </TouchableOpacity>
          </View>

          {/* Today's Schedule Section */}
          <View style={styles.scheduleHeaderRow}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Schedule</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                {takenCount} of {scheduledDoses.length} doses logged
                {lastConfirmedDoseTime && ` • Last dose: ${lastConfirmedDoseTime}`}
              </Text>
            </View>

            {/* Filter Pills */}
            <View style={styles.filterGroup}>
              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  activeFilter === 'all' && { backgroundColor: theme.primary },
                  activeFilter !== 'all' && { backgroundColor: theme.backgroundSelected },
                ]}
                onPress={() => setActiveFilter('all')}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    { color: activeFilter === 'all' ? '#ffffff' : theme.textSecondary },
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  activeFilter === 'pending' && { backgroundColor: theme.primary },
                  activeFilter !== 'pending' && { backgroundColor: theme.backgroundSelected },
                ]}
                onPress={() => setActiveFilter('pending')}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    { color: activeFilter === 'pending' ? '#ffffff' : theme.textSecondary },
                  ]}
                >
                  Due
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  activeFilter === 'taken' && { backgroundColor: theme.primary },
                  activeFilter !== 'taken' && { backgroundColor: theme.backgroundSelected },
                ]}
                onPress={() => setActiveFilter('taken')}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    { color: activeFilter === 'taken' ? '#ffffff' : theme.textSecondary },
                  ]}
                >
                  Taken
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dose List */}
          <View style={styles.dosesList}>
            {filteredDoses.length > 0 ? (
              filteredDoses.map(dose => (
                <DoseCard
                  key={dose.id}
                  dose={dose}
                  onConfirm={handleConfirm}
                  onSnooze={snoozeDose}
                  isNext={dose.id === nextPendingDose?.id}
                />
              ))
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="checkmark-circle-outline" size={36} color={theme.success} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>All Caught Up!</Text>
                <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  No doses pending in this category. Excellent adherence!
                </Text>
              </View>
            )}
          </View>

          {/* Clinical Support Footer Card */}
          <View style={[styles.clinicFooterCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <View style={styles.clinicFooterRow}>
              <Ionicons name="business" size={24} color={theme.primary} />
              <View style={styles.clinicFooterTextCol}>
                <Text style={[styles.clinicFooterTitle, { color: theme.text }]}>
                  CSU University Center for Health and Wellness
                </Text>
                <Text style={[styles.clinicFooterSub, { color: theme.textSecondary }]}>
                  Open Monday – Friday, 8:00 AM – 5:00 PM • Ampayon Campus
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.clinicCallBtn, { borderColor: theme.border }]}
              onPress={() => router.push('/(tabs)/messages')}
            >
              <Text style={[styles.clinicCallBtnText, { color: theme.primary }]}>
                Message UCHW Clinical Staff
              </Text>
              <Ionicons name="arrow-forward" size={14} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Celebration Modal / Toast */}
      <Modal visible={showCelebration} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.celebrationBox, { backgroundColor: theme.card }]}>
            <View style={[styles.checkCircle, { backgroundColor: theme.successLight }]}>
              <Ionicons name="checkmark" size={36} color={theme.success} />
            </View>
            <Text style={[styles.celebrationTitle, { color: theme.text }]}>Dose Confirmed!</Text>
            <Text style={[styles.celebrationSub, { color: theme.textSecondary }]}>
              Intake recorded at {lastConfirmedDoseTime}. Adherence streak maintained! 🔥
            </Text>
            <View style={styles.badgePill}>
              <FontAwesome5 name="shield-alt" size={12} color="#0d9488" />
              <Text style={styles.badgePillText}>Synced with CSU Clinical Dashboard</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  maxWidthWrapper: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  dateText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 26,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  greetingSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
  },
  profileBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refillAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    borderRadius: 14,
    borderWidth: 1,
    marginVertical: Spacing.one,
    gap: Spacing.two,
  },
  refillContent: {
    flex: 1,
  },
  refillTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: '#92400e',
  },
  refillSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: '#b45309',
    marginTop: 2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: Spacing.two,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  quickActionSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
    marginTop: 1,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
  },
  sectionTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 19,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  filterBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  dosesList: {
    marginTop: Spacing.one,
  },
  emptyCard: {
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.two,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
  },
  emptySubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    textAlign: 'center',
  },
  clinicFooterCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    marginTop: Spacing.four,
    gap: 12,
  },
  clinicFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clinicFooterTextCol: {
    flex: 1,
  },
  clinicFooterTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
  },
  clinicFooterSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  clinicCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  clinicCallBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  celebrationBox: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    gap: 10,
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  celebrationTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
  },
  celebrationSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginTop: 4,
  },
  badgePillText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
    color: '#0f766e',
  },
});
