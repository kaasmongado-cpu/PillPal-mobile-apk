import React, { useState } from 'react';
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
import { usePillPal } from '@/context/PillPalContext';
import { useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function AnalyticsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { studentProfile, overallAdherence, streakDays, susScore, medications } = usePillPal();

  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState<'7days' | '30days'>('7days');

  // Simulated 7-day adherence breakdown (Mon - Sun)
  const weekData = [
    { day: 'Mon', rate: 100, taken: 4, total: 4 },
    { day: 'Tue', rate: 100, taken: 4, total: 4 },
    { day: 'Wed', rate: 75, taken: 3, total: 4 },
    { day: 'Thu', rate: 100, taken: 4, total: 4 },
    { day: 'Fri', rate: 100, taken: 4, total: 4 },
    { day: 'Sat', rate: 100, taken: 4, total: 4 },
    { day: 'Sun', rate: Math.min(100, overallAdherence), taken: 4, total: 4 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <HeaderBar title="Analytics" subtitle="Adherence Analytics & Compliance" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.maxWidthWrapper}>
          {/* Header Title & Date Range Toggle */}
          <View style={styles.topRow}>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>Adherence Overview</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Behavioral compliance & academic wellness metrics
              </Text>
            </View>

            <View style={[styles.rangeToggle, { backgroundColor: theme.backgroundSelected }]}>
              <TouchableOpacity
                style={[
                  styles.rangeBtn,
                  selectedRange === '7days' && { backgroundColor: theme.primary },
                ]}
                onPress={() => setSelectedRange('7days')}
              >
                <Text
                  style={[
                    styles.rangeBtnText,
                    { color: selectedRange === '7days' ? '#ffffff' : theme.textSecondary },
                  ]}
                >
                  7 Days
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.rangeBtn,
                  selectedRange === '30days' && { backgroundColor: theme.primary },
                ]}
                onPress={() => setSelectedRange('30days')}
              >
                <Text
                  style={[
                    styles.rangeBtnText,
                    { color: selectedRange === '30days' ? '#ffffff' : theme.textSecondary },
                  ]}
                >
                  30 Days
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary Score Hero Card */}
          <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.heroRow}>
              <View style={styles.heroTextCol}>
                <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>
                  OVERALL COMPLIANCE RATE
                </Text>
                <Text style={[styles.heroScore, { color: theme.text }]}>
                  {overallAdherence}%
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: theme.successLight }]}>
                  <Ionicons name="checkmark-circle" size={14} color={theme.success} />
                  <Text style={[styles.statusBadgeText, { color: theme.success }]}>
                    Optimal Clinical Adherence
                  </Text>
                </View>
              </View>

              <View style={[styles.streakCircle, { backgroundColor: '#fef3c7', borderColor: '#fde68a' }]}>
                <FontAwesome5 name="fire" size={24} color="#d97706" />
                <Text style={styles.streakCount}>{streakDays}</Text>
                <Text style={styles.streakSub}>Days Streak</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Sub Metrics */}
            <View style={styles.subMetricsRow}>
              <View style={styles.subMetric}>
                <Text style={[styles.subMetricValue, { color: theme.primary }]}>96.4%</Text>
                <Text style={[styles.subMetricLabel, { color: theme.textSecondary }]}>
                  On-Time Timing
                </Text>
              </View>
              <View style={styles.subMetric}>
                <Text style={[styles.subMetricValue, { color: theme.secondary }]}>28 / 30</Text>
                <Text style={[styles.subMetricLabel, { color: theme.textSecondary }]}>
                  Doses Verified
                </Text>
              </View>
              <View style={styles.subMetric}>
                <Text style={[styles.subMetricValue, { color: theme.success }]}>0 Missed</Text>
                <Text style={[styles.subMetricLabel, { color: theme.textSecondary }]}>
                  Past 48 Hours
                </Text>
              </View>
            </View>
          </View>

          {/* 7-Day Adherence Trend Chart (Wireframe B & Thesis Figure 3-8.2) */}
          <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={[styles.chartTitle, { color: theme.text }]}>
                  Adherence Trend (Past 7 Days)
                </Text>
                <Text style={[styles.chartSub, { color: theme.textSecondary }]}>
                  Daily dosage intake completion rate
                </Text>
              </View>
              <View style={[styles.legendPill, { backgroundColor: theme.primaryLight }]}>
                <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
                <Text style={[styles.legendText, { color: theme.primary }]}>Logged Doses</Text>
              </View>
            </View>

            {/* Bar Chart Visualization */}
            <View style={styles.barChartContainer}>
              {weekData.map((d, idx) => (
                <View key={idx} style={styles.barCol}>
                  <Text style={[styles.barValueText, { color: theme.textSecondary }]}>
                    {d.rate}%
                  </Text>
                  <View style={[styles.barTrack, { backgroundColor: theme.backgroundSelected }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${d.rate}%`,
                          backgroundColor: d.rate >= 80 ? theme.primary : theme.warning,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.barDayText,
                      {
                        color: idx === weekData.length - 1 ? theme.primary : theme.textSecondary,
                        fontFamily:
                          idx === weekData.length - 1 ? 'Outfit_700Bold' : 'Outfit_500Medium',
                      },
                    ]}
                  >
                    {d.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* System Usability Scale (SUS) Highlight Card (Chapter 3.3) */}
          <TouchableOpacity
            style={[styles.susCard, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}
            onPress={() => router.push('/sus-survey' as any)}
            activeOpacity={0.8}
          >
            <View style={styles.susHeader}>
              <View style={styles.susLeft}>
                <View style={styles.susStarCircle}>
                  <Ionicons name="star" size={20} color="#15803d" />
                </View>
                <View>
                  <Text style={styles.susTitle}>System Usability Scale (SUS)</Text>
                  <Text style={styles.susSubtitle}>
                    Current Score:{' '}
                    <Text style={{ fontFamily: 'Outfit_700Bold' }}>
                      {susScore !== null ? `${susScore}/100` : 'Not evaluated yet'}
                    </Text>{' '}
                    (Benchmark: &gt;70 Acceptable)
                  </Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={18} color="#15803d" />
            </View>
            <Text style={styles.susDesc}>
              Tap to complete the 10-item standard SUS evaluation survey for this capstone study.
            </Text>
          </TouchableOpacity>

          {/* Export Adherence Report Button (Thesis 1.5.1 Reports Engine) */}
          <TouchableOpacity
            style={[styles.exportCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => setShowExportModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.exportLeft}>
              <View style={[styles.exportIconBox, { backgroundColor: theme.secondaryLight }]}>
                <Ionicons name="document-text" size={22} color={theme.secondary} />
              </View>
              <View>
                <Text style={[styles.exportTitle, { color: theme.text }]}>
                  Generate Official Adherence Report
                </Text>
                <Text style={[styles.exportSub, { color: theme.textSecondary }]}>
                  Export PDF / CSV summary for CSU UCHW clinical clearance
                </Text>
              </View>
            </View>
            <Ionicons name="download-outline" size={20} color={theme.secondary} />
          </TouchableOpacity>

          {/* Gamification / Milestones Section */}
          <View style={[styles.milestonesCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.milestonesTitle, { color: theme.text }]}>
              Compliance Milestones & Badges
            </Text>
            <View style={styles.badgesRow}>
              <View style={[styles.badgeItem, { backgroundColor: theme.backgroundElement }]}>
                <MaterialCommunityIcons name="trophy-award" size={26} color="#eab308" />
                <Text style={[styles.badgeName, { color: theme.text }]}>14-Day Streak</Text>
                <Text style={[styles.badgeSub, { color: theme.textSecondary }]}>Unlocked</Text>
              </View>

              <View style={[styles.badgeItem, { backgroundColor: theme.backgroundElement }]}>
                <MaterialCommunityIcons name="clock-check" size={26} color="#0d9488" />
                <Text style={[styles.badgeName, { color: theme.text }]}>Punctual Intake</Text>
                <Text style={[styles.badgeSub, { color: theme.textSecondary }]}>96% on-time</Text>
              </View>

              <View style={[styles.badgeItem, { backgroundColor: theme.backgroundElement }]}>
                <MaterialCommunityIcons name="shield-check" size={26} color="#6366f1" />
                <Text style={[styles.badgeName, { color: theme.text }]}>CSU Healthy</Text>
                <Text style={[styles.badgeSub, { color: theme.textSecondary }]}>Active Care</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Export Report Preview Modal */}
      <Modal visible={showExportModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.exportModalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Clinical Adherence Report
                </Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                  Official Record • Caraga State University UCHW
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.closeIconBtn, { borderColor: theme.border }]}
                onPress={() => setShowExportModal(false)}
              >
                <Ionicons name="close" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.reportSheet}>
              {/* Report Header */}
              <View style={[styles.sheetSection, { backgroundColor: theme.backgroundElement }]}>
                <Text style={styles.sheetClinicName}>
                  CARAGA STATE UNIVERSITY – MAIN CAMPUS
                </Text>
                <Text style={styles.sheetSubHeader}>
                  UNIVERSITY CENTER FOR HEALTH AND WELLNESS (UCHW)
                </Text>
                <Text style={styles.sheetDocTitle}>STUDENT MEDICATION ADHERENCE CERTIFICATE</Text>

                <View style={styles.sheetMetaRow}>
                  <Text style={styles.sheetMeta}>Student: {studentProfile.name}</Text>
                  <Text style={styles.sheetMeta}>ID: {studentProfile.studentId}</Text>
                </View>
                <View style={styles.sheetMetaRow}>
                  <Text style={styles.sheetMeta}>Program: {studentProfile.course}</Text>
                  <Text style={styles.sheetMeta}>Date: {new Date().toLocaleDateString()}</Text>
                </View>
              </View>

              {/* Statistics Summary */}
              <View style={[styles.sheetSection, { backgroundColor: theme.backgroundElement }]}>
                <Text style={styles.sheetSectionTitle}>ADHERENCE EVALUATION SUMMARY</Text>
                <Text style={styles.sheetStatLine}>
                  • Overall Adherence Index: <Text style={{ fontFamily: 'Outfit_700Bold' }}>{overallAdherence}%</Text> (Optimal)
                </Text>
                <Text style={styles.sheetStatLine}>
                  • Continuous Streak: <Text style={{ fontFamily: 'Outfit_700Bold' }}>{streakDays} Days</Text>
                </Text>
                <Text style={styles.sheetStatLine}>
                  • Active Chronic Conditions: {studentProfile.chronicConditions.join(', ')}
                </Text>
                <Text style={styles.sheetStatLine}>
                  • Monitored Medications: {medications.map(m => m.name).join(', ')}
                </Text>
              </View>

              {/* Physician Certification Sign-off */}
              <View style={[styles.sheetSection, { backgroundColor: theme.backgroundElement }]}>
                <Text style={styles.sheetSectionTitle}>CLINICAL VERIFICATION</Text>
                <Text style={styles.sheetLegalText}>
                  This report certifies that the above-named student has consistently adhered to
                  prescribed pharmacotherapy under UCHW tele-monitoring protocols, compliant with RA 10173.
                </Text>
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureName}>Dr. Mary Rose Santos, MD</Text>
                  <Text style={styles.signatureRole}>University Physician, License #0129841</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={[styles.downloadBtn, { backgroundColor: theme.primary }]}
                onPress={() => setShowExportModal(false)}
              >
                <Ionicons name="download" size={16} color="#ffffff" />
                <Text style={styles.downloadBtnText}>Export PDF Document</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.downloadBtn, { backgroundColor: theme.secondary }]}
                onPress={() => setShowExportModal(false)}
              >
                <Ionicons name="grid" size={16} color="#ffffff" />
                <Text style={styles.downloadBtnText}>Export CSV Data</Text>
              </TouchableOpacity>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  rangeToggle: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 100,
  },
  rangeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  rangeBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextCol: {
    gap: 4,
  },
  heroLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  heroScore: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 38,
    lineHeight: 44,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  streakCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  streakCount: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#b45309',
  },
  streakSub: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 9,
    color: '#92400e',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 14,
  },
  subMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  subMetric: {
    alignItems: 'center',
    gap: 2,
  },
  subMetricValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
  },
  subMetricLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  chartCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
  },
  chartSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 10,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  barValueText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 10,
  },
  barTrack: {
    width: 24,
    height: 90,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 12,
  },
  barDayText: {
    fontSize: 11,
  },
  susCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    gap: 6,
  },
  susHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  susLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  susStarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  susTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: '#166534',
  },
  susSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: '#15803d',
  },
  susDesc: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: '#166534',
  },
  exportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.two,
  },
  exportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  exportIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
  },
  exportSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  milestonesCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    gap: 12,
    marginBottom: Spacing.two,
  },
  milestonesTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badgeItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    gap: 4,
  },
  badgeName: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
    textAlign: 'center',
  },
  badgeSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 9,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  exportModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
  },
  modalSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
  },
  closeIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportSheet: {
    maxHeight: 400,
  },
  sheetSection: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    gap: 4,
  },
  sheetClinicName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    textAlign: 'center',
    color: '#0f172a',
  },
  sheetSubHeader: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 10,
    textAlign: 'center',
    color: '#64748b',
  },
  sheetDocTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    textAlign: 'center',
    color: '#0d9488',
    marginVertical: 4,
  },
  sheetMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  sheetMeta: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: '#334155',
  },
  sheetSectionTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  sheetStatLine: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: '#334155',
  },
  sheetLegalText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  signatureBox: {
    marginTop: 14,
    borderTopWidth: 1,
    borderColor: '#cbd5e1',
    paddingTop: 6,
    alignItems: 'flex-end',
  },
  signatureName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: '#0f172a',
  },
  signatureRole: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
    color: '#64748b',
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 100,
  },
  downloadBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
    color: '#ffffff',
  },
});
