import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { usePillPal } from '@/context/PillPalContext';
import { useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { ProviderPatient, ClinicalAlert, ClinicInventoryItem } from '@/data/pndf-data';

type ProviderTab = 'dashboard' | 'patients' | 'alerts' | 'messages' | 'reports' | 'inventory';

export default function ProviderScreen() {
  const theme = useTheme();
  const router = useRouter();
  const {
    setRole,
    patients,
    alerts,
    inventory,
    messages,
    sendMessage,
    resolveAlert,
    dismissAlert,
    reorderInventory,
  } = usePillPal();

  const [activeTab, setActiveTab] = useState<ProviderTab>('dashboard');
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<'all' | 'critical' | 'consistent'>('all');
  const [activeAlertFilter, setActiveAlertFilter] = useState<'all' | 'critical'>('all');
  const [replyText, setReplyText] = useState('');
  const [selectedPatientModal, setSelectedPatientModal] = useState<ProviderPatient | null>(null);

  // New Prescription Modal
  const [showNewRxModal, setShowNewRxModal] = useState(false);
  const [rxPatientName, setRxPatientName] = useState('Arthur Morgan');
  const [rxDrugName, setRxDrugName] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxFrequency, setRxFrequency] = useState('Once daily');

  const filteredPatients = patients.filter(p => {
    const matches =
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.studentId.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.chronicCondition.toLowerCase().includes(patientSearch.toLowerCase());
    if (!matches) return false;

    if (selectedPatientFilter === 'critical') return p.status === 'Critical';
    if (selectedPatientFilter === 'consistent') return p.status === 'Consistent';
    return true;
  });

  const filteredAlerts = alerts.filter(a => {
    if (activeAlertFilter === 'critical') return a.priority === 'high' && !a.resolved;
    return !a.resolved;
  });

  const handleSwitchToStudent = () => {
    setRole('student');
    router.push('/(tabs)/home');
  };

  const handleSendProviderReply = () => {
    if (!replyText.trim()) return;
    sendMessage(replyText.trim());
    setReplyText('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Top Navigation Bar (Figure 3-8.2 B) */}
      <View style={[styles.topNavBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.navLeft}>
          <View style={[styles.portalBadge, { backgroundColor: '#0d9488' }]}>
            <MaterialCommunityIcons name="hospital-building" size={20} color="#ffffff" />
          </View>
          <View>
            <Text style={[styles.portalTitle, { color: theme.text }]}>PillPal Provider Portal</Text>
            <Text style={[styles.portalSubtitle, { color: theme.textSecondary }]}>
              CSU University Center for Health and Wellness
            </Text>
          </View>
        </View>

        <View style={styles.navRight}>
          <TouchableOpacity
            style={[styles.newRxBtn, { backgroundColor: theme.primary }]}
            onPress={() => setShowNewRxModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color="#ffffff" />
            <Text style={styles.newRxBtnText}>New Prescription</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchStudentBtn, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
            onPress={handleSwitchToStudent}
            activeOpacity={0.8}
          >
            <Ionicons name="phone-portrait-outline" size={14} color={theme.text} />
            <Text style={[styles.switchStudentText, { color: theme.text }]}>Student View</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Sub-Tabs (Dashboard, Patients, Alerts, Messages, Reports, Inventory) */}
      <View style={[styles.tabsHeader, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {[
            { key: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
            { key: 'patients', label: `Patients (${patients.length})`, icon: 'people-outline' },
            { key: 'alerts', label: `Alerts (${alerts.filter(a => !a.resolved).length})`, icon: 'alert-circle-outline' },
            { key: 'messages', label: 'Messages', icon: 'chatbubbles-outline' },
            { key: 'reports', label: 'Reports & Analytics', icon: 'bar-chart-outline' },
            { key: 'inventory', label: 'Clinic Inventory', icon: 'cube-outline' },
          ].map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabItem,
                  isActive && [styles.activeTabItem, { borderBottomColor: theme.primary }],
                ]}
                onPress={() => setActiveTab(tab.key as ProviderTab)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={isActive ? theme.primary : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.tabItemText,
                    {
                      color: isActive ? theme.primary : theme.textSecondary,
                      fontFamily: isActive ? 'Outfit_700Bold' : 'Outfit_500Medium',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.maxWidthWrapper}>
          {/* TAB 1: MAIN DASHBOARD (Figure 3-8.2 B) */}
          {activeTab === 'dashboard' && (
            <View style={styles.tabContent}>
              {/* 4 KPI Summary Cards */}
              <View style={styles.kpiGrid}>
                <View style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.kpiTop}>
                    <Text style={[styles.kpiNumber, { color: theme.text }]}>42</Text>
                    <Ionicons name="people" size={20} color={theme.secondary} />
                  </View>
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Active Monitored Patients
                  </Text>
                  <Text style={[styles.kpiSub, { color: theme.success }]}>+4 new this week</Text>
                </View>

                <View style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.kpiTop}>
                    <Text style={[styles.kpiNumber, { color: theme.text }]}>74%</Text>
                    <Ionicons name="trending-up" size={20} color={theme.primary} />
                  </View>
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Avg Campus Adherence
                  </Text>
                  <Text style={[styles.kpiSub, { color: theme.primary }]}>+2.4% vs last month</Text>
                </View>

                <View style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.kpiTop}>
                    <Text style={[styles.kpiNumber, { color: theme.danger }]}>
                      {alerts.filter(a => !a.resolved).length}
                    </Text>
                    <Ionicons name="warning" size={20} color={theme.danger} />
                  </View>
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Clinical Alerts Today
                  </Text>
                  <Text style={[styles.kpiSub, { color: theme.danger }]}>2 High Priority</Text>
                </View>

                <View style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.kpiTop}>
                    <Text style={[styles.kpiNumber, { color: theme.text }]}>3</Text>
                    <Ionicons name="mail-unread" size={20} color="#9333ea" />
                  </View>
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Student Inquiries
                  </Text>
                  <Text style={[styles.kpiSub, { color: '#9333ea' }]}>1 Refill pending</Text>
                </View>
              </View>

              {/* 7-Day Adherence Trend & Recent Alerts Row */}
              <View style={styles.twoColumnGrid}>
                {/* 7-Day Trend Chart Card */}
                <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.sectionCardTitle, { color: theme.text }]}>
                    Campus Adherence Trend (7 Days)
                  </Text>
                  <Text style={[styles.sectionCardSub, { color: theme.textSecondary }]}>
                    CSU student adherence percentage across all prescribed cohorts
                  </Text>

                  <View style={styles.trendBarsRow}>
                    {[
                      { day: 'Mon', val: 78 },
                      { day: 'Tue', val: 82 },
                      { day: 'Wed', val: 71 },
                      { day: 'Thu', val: 86 },
                      { day: 'Fri', val: 74 },
                      { day: 'Sat', val: 69 },
                      { day: 'Sun', val: 74 },
                    ].map((item, idx) => (
                      <View key={idx} style={styles.trendBarCol}>
                        <Text style={[styles.trendBarVal, { color: theme.textSecondary }]}>
                          {item.val}%
                        </Text>
                        <View style={[styles.trendBarTrack, { backgroundColor: theme.backgroundSelected }]}>
                          <View
                            style={[
                              styles.trendBarFill,
                              {
                                height: `${item.val}%`,
                                backgroundColor: item.val >= 75 ? theme.primary : theme.warning,
                              },
                            ]}
                          />
                        </View>
                        <Text style={[styles.trendBarDay, { color: theme.textSecondary }]}>
                          {item.day}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Recent Clinical Alerts Card */}
                <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={[styles.sectionCardTitle, { color: theme.text }]}>
                      Live Clinical Feed
                    </Text>
                    <View style={[styles.liveBadge, { backgroundColor: '#fee2e2' }]}>
                      <View style={styles.pulseDot} />
                      <Text style={styles.liveBadgeText}>LIVE</Text>
                    </View>
                  </View>

                  <View style={styles.recentAlertsList}>
                    {alerts.slice(0, 3).map(a => (
                      <View
                        key={a.id}
                        style={[
                          styles.feedAlertItem,
                          {
                            backgroundColor: theme.backgroundElement,
                            borderLeftColor: a.priority === 'high' ? theme.danger : theme.warning,
                          },
                        ]}
                      >
                        <View style={styles.feedAlertTop}>
                          <Text style={[styles.feedAlertTitle, { color: theme.text }]}>
                            {a.title}
                          </Text>
                          <Text style={[styles.feedAlertTime, { color: theme.textSecondary }]}>
                            {a.timestamp}
                          </Text>
                        </View>
                        <Text style={[styles.feedAlertSub, { color: theme.textSecondary }]}>
                          {a.subtitle}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Patient Adherence Overview Table (Figure 3-8.2 B) */}
              <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border, marginTop: Spacing.two }]}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[styles.sectionCardTitle, { color: theme.text }]}>
                    Patient Adherence Overview
                  </Text>
                  <TouchableOpacity onPress={() => setActiveTab('patients')}>
                    <Text style={[styles.viewAllLink, { color: theme.primary }]}>View All Patients →</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.patientOverviewList}>
                  {patients.slice(0, 4).map(p => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.patientOverviewRow, { borderBottomColor: theme.border }]}
                      onPress={() => setSelectedPatientModal(p)}
                    >
                      <View style={styles.pOverviewLeft}>
                        <View style={[styles.pInitialsBox, { backgroundColor: theme.primaryLight }]}>
                          <Text style={[styles.pInitialsText, { color: theme.primary }]}>
                            {p.avatarInitials}
                          </Text>
                        </View>
                        <View>
                          <Text style={[styles.pName, { color: theme.text }]}>{p.name}</Text>
                          <Text style={[styles.pMeta, { color: theme.textSecondary }]}>
                            {p.course} • {p.chronicCondition}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.pOverviewRight}>
                        <Text
                          style={[
                            styles.pRateText,
                            {
                              color:
                                p.status === 'Consistent'
                                  ? theme.success
                                  : p.status === 'Critical'
                                  ? theme.danger
                                  : theme.primary,
                            },
                          ]}
                        >
                          {p.adherenceRate}%
                        </Text>
                        <View
                          style={[
                            styles.pStatusBadge,
                            {
                              backgroundColor:
                                p.status === 'Consistent'
                                  ? theme.successLight
                                  : p.status === 'Critical'
                                  ? theme.dangerLight
                                  : theme.backgroundSelected,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.pStatusBadgeText,
                              {
                                color:
                                  p.status === 'Consistent'
                                    ? theme.success
                                    : p.status === 'Critical'
                                    ? theme.danger
                                    : theme.textSecondary,
                              },
                            ]}
                          >
                            {p.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* TAB 2: PATIENTS DIRECTORY (Figure 3-8.4 C) */}
          {activeTab === 'patients' && (
            <View style={styles.tabContent}>
              <View style={styles.directoryHeader}>
                <View>
                  <Text style={[styles.tabHeading, { color: theme.text }]}>Patient Directory</Text>
                  <Text style={[styles.tabSubheading, { color: theme.textSecondary }]}>
                    Active CSU student cohorts undergoing outpatient pharmacotherapy monitoring
                  </Text>
                </View>

                {/* Filter group */}
                <View style={styles.filterPillsRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterPill,
                      selectedPatientFilter === 'all' && { backgroundColor: theme.primary },
                      selectedPatientFilter !== 'all' && { backgroundColor: theme.backgroundSelected },
                    ]}
                    onPress={() => setSelectedPatientFilter('all')}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        { color: selectedPatientFilter === 'all' ? '#ffffff' : theme.textSecondary },
                      ]}
                    >
                      All ({patients.length})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterPill,
                      selectedPatientFilter === 'critical' && { backgroundColor: theme.danger },
                      selectedPatientFilter !== 'critical' && { backgroundColor: theme.backgroundSelected },
                    ]}
                    onPress={() => setSelectedPatientFilter('critical')}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        { color: selectedPatientFilter === 'critical' ? '#ffffff' : theme.textSecondary },
                      ]}
                    >
                      Critical Only
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Search input */}
              <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="search" size={18} color={theme.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: theme.text }]}
                  placeholder="Search by student name, ID, or condition..."
                  placeholderTextColor={theme.textSecondary}
                  value={patientSearch}
                  onChangeText={setPatientSearch}
                />
              </View>

              {/* Patients List Cards */}
              <View style={styles.patientCardsGrid}>
                {filteredPatients.map(pt => (
                  <View
                    key={pt.id}
                    style={[styles.patientCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                  >
                    <View style={styles.ptCardHeader}>
                      <View style={styles.ptCardLeft}>
                        <View style={[styles.ptAvatar, { backgroundColor: theme.primaryLight }]}>
                          <Text style={[styles.ptAvatarText, { color: theme.primary }]}>
                            {pt.avatarInitials}
                          </Text>
                        </View>
                        <View>
                          <Text style={[styles.ptName, { color: theme.text }]}>{pt.name}</Text>
                          <Text style={[styles.ptId, { color: theme.textSecondary }]}>
                            {pt.studentId} • {pt.course} {pt.yearLevel}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.ptStatusPill,
                          {
                            backgroundColor:
                              pt.status === 'Consistent'
                                ? theme.successLight
                                : pt.status === 'Critical'
                                ? theme.dangerLight
                                : theme.backgroundSelected,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.ptStatusPillText,
                            {
                              color:
                                pt.status === 'Consistent'
                                  ? theme.success
                                  : pt.status === 'Critical'
                                  ? theme.danger
                                  : theme.textSecondary,
                            },
                          ]}
                        >
                          {pt.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.ptConditionRow}>
                      <Ionicons name="pulse" size={14} color={theme.textSecondary} />
                      <Text style={[styles.ptConditionText, { color: theme.textSecondary }]}>
                        Condition: {pt.chronicCondition}
                      </Text>
                    </View>

                    <View style={styles.ptPrescriptionsRow}>
                      <Ionicons name="medkit-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.ptPrescriptionText, { color: theme.text }]}>
                        Rx: {pt.prescriptions.join(', ')}
                      </Text>
                    </View>

                    <View style={styles.ptFooterRow}>
                      <View>
                        <Text style={[styles.ptAdherenceLabel, { color: theme.textSecondary }]}>
                          Compliance Rate:
                        </Text>
                        <Text
                          style={[
                            styles.ptAdherenceValue,
                            {
                              color:
                                pt.adherenceRate >= 80
                                  ? theme.success
                                  : pt.adherenceRate >= 60
                                  ? theme.warning
                                  : theme.danger,
                            },
                          ]}
                        >
                          {pt.adherenceRate}%
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[styles.ptActionBtn, { backgroundColor: theme.primary }]}
                        onPress={() => setSelectedPatientModal(pt)}
                      >
                        <Text style={styles.ptActionBtnText}>Clinical Profile</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 3: CLINICAL ALERTS (Figure 3-8.4 D) */}
          {activeTab === 'alerts' && (
            <View style={styles.tabContent}>
              <View style={styles.directoryHeader}>
                <View>
                  <Text style={[styles.tabHeading, { color: theme.text }]}>Clinical Alerts</Text>
                  <Text style={[styles.tabSubheading, { color: theme.textSecondary }]}>
                    Automated threshold breaches, missed doses & biometric anomalies
                  </Text>
                </View>

                <View style={styles.filterPillsRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterPill,
                      activeAlertFilter === 'all' && { backgroundColor: theme.primary },
                      activeAlertFilter !== 'all' && { backgroundColor: theme.backgroundSelected },
                    ]}
                    onPress={() => setActiveAlertFilter('all')}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        { color: activeAlertFilter === 'all' ? '#ffffff' : theme.textSecondary },
                      ]}
                    >
                      All ({alerts.filter(a => !a.resolved).length})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterPill,
                      activeAlertFilter === 'critical' && { backgroundColor: theme.danger },
                      activeAlertFilter !== 'critical' && { backgroundColor: theme.backgroundSelected },
                    ]}
                    onPress={() => setActiveAlertFilter('critical')}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        { color: activeAlertFilter === 'critical' ? '#ffffff' : theme.textSecondary },
                      ]}
                    >
                      Critical Only
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.alertsList}>
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map(alert => (
                    <View
                      key={alert.id}
                      style={[
                        styles.alertItemCard,
                        {
                          backgroundColor: theme.card,
                          borderColor: alert.priority === 'high' ? theme.danger : theme.warning,
                        },
                      ]}
                    >
                      <View style={styles.alertCardHeader}>
                        <View style={styles.alertHeaderLeft}>
                          <View
                            style={[
                              styles.alertPriorityBadge,
                              {
                                backgroundColor:
                                  alert.priority === 'high' ? theme.dangerLight : theme.warningLight,
                              },
                            ]}
                          >
                            <Ionicons
                              name="warning"
                              size={14}
                              color={alert.priority === 'high' ? theme.danger : theme.warning}
                            />
                            <Text
                              style={[
                                styles.alertPriorityText,
                                {
                                  color: alert.priority === 'high' ? theme.danger : theme.warning,
                                },
                              ]}
                            >
                              {alert.priority.toUpperCase()} PRIORITY
                            </Text>
                          </View>
                          <Text style={[styles.alertTime, { color: theme.textSecondary }]}>
                            {alert.timestamp}
                          </Text>
                        </View>
                      </View>

                      <Text style={[styles.alertMainTitle, { color: theme.text }]}>
                        {alert.title}
                      </Text>
                      <Text style={[styles.alertMainSub, { color: theme.textSecondary }]}>
                        {alert.subtitle}
                      </Text>

                      <View style={styles.alertActionsRow}>
                        <TouchableOpacity
                          style={[styles.resolveBtn, { backgroundColor: theme.primary }]}
                          onPress={() => resolveAlert(alert.id)}
                        >
                          <Ionicons name="checkmark" size={16} color="#ffffff" />
                          <Text style={styles.resolveBtnText}>Resolve Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.nudgeBtn, { borderColor: theme.border }]}
                          onPress={() => {
                            sendMessage(
                              `[Clinical Notice to ${alert.patientName}]: Please confirm your scheduled dosage immediately or visit CSU UCHW.`
                            );
                            resolveAlert(alert.id);
                          }}
                        >
                          <Ionicons name="notifications-outline" size={15} color={theme.text} />
                          <Text style={[styles.nudgeBtnText, { color: theme.text }]}>
                            Send Nudge / SMS
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.dismissBtn, { borderColor: theme.border }]}
                          onPress={() => dismissAlert(alert.id)}
                        >
                          <Text style={[styles.dismissBtnText, { color: theme.textSecondary }]}>
                            Dismiss
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Ionicons name="shield-checkmark" size={40} color={theme.success} />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>
                      All Clinical Alerts Resolved
                    </Text>
                    <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                      No active threshold breaches. Student population is compliant.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* TAB 4: PROVIDER MESSAGES (Figure 3-8.3 E) */}
          {activeTab === 'messages' && (
            <View style={styles.tabContent}>
              <View style={styles.directoryHeader}>
                <View>
                  <Text style={[styles.tabHeading, { color: theme.text }]}>
                    Encrypted Tele-Consultations
                  </Text>
                  <Text style={[styles.tabSubheading, { color: theme.textSecondary }]}>
                    Active clinical message thread with students (DPA 2012 Certified)
                  </Text>
                </View>
              </View>

              <View style={[styles.chatContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <ScrollView style={styles.providerChatScroll}>
                  {messages.map(m => {
                    const isDoctor = m.sender === 'provider';
                    return (
                      <View
                        key={m.id}
                        style={[
                          styles.providerMsgRow,
                          isDoctor ? styles.pMsgMe : styles.pMsgOther,
                        ]}
                      >
                        <View
                          style={[
                            styles.pMsgBubble,
                            isDoctor
                              ? [styles.pMsgDoctor, { backgroundColor: theme.primary }]
                              : [styles.pMsgStudent, { backgroundColor: theme.backgroundElement, borderColor: theme.border }],
                          ]}
                        >
                          <Text
                            style={[
                              styles.pMsgSender,
                              { color: isDoctor ? 'rgba(255,255,255,0.7)' : theme.primary },
                            ]}
                          >
                            {m.senderName}
                          </Text>
                          <Text
                            style={[
                              styles.pMsgText,
                              { color: isDoctor ? '#ffffff' : theme.text },
                            ]}
                          >
                            {m.content}
                          </Text>
                          <Text
                            style={[
                              styles.pMsgTime,
                              { color: isDoctor ? 'rgba(255,255,255,0.7)' : theme.textSecondary },
                            ]}
                          >
                            {m.timestamp}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>

                <View style={[styles.pComposer, { borderTopColor: theme.border, backgroundColor: theme.backgroundElement }]}>
                  <TextInput
                    style={[styles.pInput, { color: theme.text }]}
                    placeholder="Type official clinical reply to student..."
                    placeholderTextColor={theme.textSecondary}
                    value={replyText}
                    onChangeText={setReplyText}
                  />
                  <TouchableOpacity
                    style={[styles.pSendBtn, { backgroundColor: theme.primary }]}
                    onPress={handleSendProviderReply}
                  >
                    <Ionicons name="send" size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* TAB 5: REPORTS & ANALYTICS (Figure 3-8.3 F) */}
          {activeTab === 'reports' && (
            <View style={styles.tabContent}>
              <View style={styles.directoryHeader}>
                <View>
                  <Text style={[styles.tabHeading, { color: theme.text }]}>
                    Reports & Analytics Engine
                  </Text>
                  <Text style={[styles.tabSubheading, { color: theme.textSecondary }]}>
                    Structured adherence analytics, exportable documentation & clinical audits
                  </Text>
                </View>
              </View>

              <View style={styles.kpiGrid}>
                <View style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.kpiNumber, { color: theme.primary }]}>94.2%</Text>
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Monthly Adherence Summary
                  </Text>
                  <Text style={[styles.kpiSub, { color: theme.success }]}>+1.4% improvement</Text>
                </View>

                <View style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.kpiNumber, { color: theme.secondary }]}>92%</Text>
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Refill Efficiency Rate
                  </Text>
                  <Text style={[styles.kpiSub, { color: theme.secondary }]}>On-schedule pickups</Text>
                </View>
              </View>

              {/* Data Export Cards */}
              <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 12 }]}>
                <Text style={[styles.sectionCardTitle, { color: theme.text }]}>
                  Advanced Data Export
                </Text>
                <Text style={[styles.sectionCardSub, { color: theme.textSecondary }]}>
                  Generate certified adherence extracts for institutional reporting, university clinics, and academic leaves
                </Text>

                <View style={styles.exportButtonsRow}>
                  <TouchableOpacity
                    style={[styles.exportActionBtn, { backgroundColor: theme.primary }]}
                    onPress={() => alert('Exporting CSU Adherence PDF...')}
                  >
                    <Ionicons name="document-text" size={16} color="#ffffff" />
                    <Text style={styles.exportActionText}>Export PDF Summary</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.exportActionBtn, { backgroundColor: theme.secondary }]}
                    onPress={() => alert('Exporting Dataset CSV...')}
                  >
                    <Ionicons name="download" size={16} color="#ffffff" />
                    <Text style={styles.exportActionText}>Export CSV Dataset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* TAB 6: CLINIC INVENTORY (Figure 3-8.4 G) */}
          {activeTab === 'inventory' && (
            <View style={styles.tabContent}>
              <View style={styles.directoryHeader}>
                <View>
                  <Text style={[styles.tabHeading, { color: theme.text }]}>
                    UCHW Pharmacy Inventory
                  </Text>
                  <Text style={[styles.tabSubheading, { color: theme.textSecondary }]}>
                    Pharma logistics, stock depletion alerts & supply chain management
                  </Text>
                </View>
              </View>

              {/* Inventory stats */}
              <View style={styles.kpiGrid}>
                <View style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.kpiNumber, { color: theme.text }]}>1,248</Text>
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Total Units in Stock
                  </Text>
                </View>

                <View style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.kpiNumber, { color: theme.warning }]}>14</Text>
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Low Stock Alerts
                  </Text>
                </View>

                <View style={[styles.kpiCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.kpiNumber, { color: theme.primary }]}>08</Text>
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Pending Inbound Orders
                  </Text>
                </View>
              </View>

              {/* Inventory Table Cards */}
              <View style={styles.inventoryList}>
                {inventory.map(item => {
                  const isLow = item.stockLevel <= 25;
                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.inventoryCard,
                        {
                          backgroundColor: theme.card,
                          borderColor: isLow ? theme.warning : theme.border,
                        },
                      ]}
                    >
                      <View style={styles.invLeft}>
                        <View style={[styles.invIcon, { backgroundColor: theme.primaryLight }]}>
                          <MaterialCommunityIcons name="pill" size={20} color={theme.primary} />
                        </View>
                        <View>
                          <Text style={[styles.invName, { color: theme.text }]}>{item.name}</Text>
                          <Text style={[styles.invSub, { color: theme.textSecondary }]}>
                            {item.category} • {item.dosage}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.invRight}>
                        <View style={styles.stockCol}>
                          <Text
                            style={[
                              styles.stockValue,
                              { color: isLow ? theme.danger : theme.text },
                            ]}
                          >
                            {item.stockLevel} {item.unit}
                          </Text>
                          <View
                            style={[
                              styles.stockStatusBadge,
                              {
                                backgroundColor: isLow ? theme.warningLight : theme.successLight,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.stockStatusText,
                                { color: isLow ? theme.warning : theme.success },
                              ]}
                            >
                              {item.status}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={[
                            styles.reorderBtn,
                            { backgroundColor: isLow ? theme.warning : theme.backgroundSelected },
                          ]}
                          onPress={() => reorderInventory(item.id, 100)}
                        >
                          <Text
                            style={[
                              styles.reorderBtnText,
                              { color: isLow ? '#ffffff' : theme.text },
                            ]}
                          >
                            Re-Order +100
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Patient Detail Modal */}
      {selectedPatientModal && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalSheet, { backgroundColor: theme.card }]}>
              <View style={styles.modalSheetHeader}>
                <View>
                  <Text style={[styles.mSheetTitle, { color: theme.text }]}>
                    {selectedPatientModal.name}
                  </Text>
                  <Text style={[styles.mSheetSub, { color: theme.textSecondary }]}>
                    {selectedPatientModal.studentId} • {selectedPatientModal.course}{' '}
                    {selectedPatientModal.yearLevel}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.closeModalBtn, { borderColor: theme.border }]}
                  onPress={() => setSelectedPatientModal(null)}
                >
                  <Ionicons name="close" size={20} color={theme.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.mSheetBody}>
                <View style={[styles.sheetSection, { backgroundColor: theme.backgroundElement }]}>
                  <Text style={[styles.sheetSectionHeading, { color: theme.textSecondary }]}>
                    CHRONIC HEALTH & COMPLIANCE
                  </Text>
                  <Text style={[styles.sheetInfoText, { color: theme.text }]}>
                    <Text style={{ fontFamily: 'Outfit_600SemiBold' }}>Primary Diagnosis:</Text>{' '}
                    {selectedPatientModal.chronicCondition}
                  </Text>
                  <Text style={[styles.sheetInfoText, { color: theme.text }]}>
                    <Text style={{ fontFamily: 'Outfit_600SemiBold' }}>Adherence Index:</Text>{' '}
                    {selectedPatientModal.adherenceRate}% ({selectedPatientModal.status})
                  </Text>
                  <Text style={[styles.sheetInfoText, { color: theme.text }]}>
                    <Text style={{ fontFamily: 'Outfit_600SemiBold' }}>Last Dose Sync:</Text>{' '}
                    {selectedPatientModal.lastDoseTime}
                  </Text>
                  <Text style={[styles.sheetInfoText, { color: theme.text }]}>
                    <Text style={{ fontFamily: 'Outfit_600SemiBold' }}>Emergency Contact:</Text>{' '}
                    {selectedPatientModal.contact}
                  </Text>
                </View>

                <View style={[styles.sheetSection, { backgroundColor: theme.backgroundElement }]}>
                  <Text style={[styles.sheetSectionHeading, { color: theme.textSecondary }]}>
                    ACTIVE REGIMEN
                  </Text>
                  {selectedPatientModal.prescriptions.map((rx, idx) => (
                    <Text key={idx} style={[styles.sheetInfoText, { color: theme.text }]}>
                      • {rx}
                    </Text>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.sheetNudgeBtn, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    sendMessage(
                      `[Dr. Santos]: Hello ${selectedPatientModal.name}, please confirm your adherence status today.`
                    );
                    setSelectedPatientModal(null);
                    setActiveTab('messages');
                  }}
                >
                  <Ionicons name="chatbubbles" size={16} color="#ffffff" />
                  <Text style={styles.sheetNudgeBtnText}>Direct Tele-Consult Message</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* New Prescription Modal */}
      <Modal visible={showNewRxModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: theme.card }]}>
            <View style={styles.modalSheetHeader}>
              <View>
                <Text style={[styles.mSheetTitle, { color: theme.text }]}>Issue Prescription</Text>
                <Text style={[styles.mSheetSub, { color: theme.textSecondary }]}>
                  Caraga State University Health Services
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.closeModalBtn, { borderColor: theme.border }]}
                onPress={() => setShowNewRxModal(false)}
              >
                <Ionicons name="close" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.mSheetBody}>
              <Text style={[styles.formLabel, { color: theme.textSecondary }]}>Student Patient</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                value={rxPatientName}
                onChangeText={setRxPatientName}
              />

              <Text style={[styles.formLabel, { color: theme.textSecondary }]}>Drug Name</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g. Metformin 500mg, Losartan 50mg"
                placeholderTextColor={theme.textSecondary}
                value={rxDrugName}
                onChangeText={setRxDrugName}
              />

              <Text style={[styles.formLabel, { color: theme.textSecondary }]}>Dosage & Strength</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g. 500 mg (1 tablet)"
                placeholderTextColor={theme.textSecondary}
                value={rxDosage}
                onChangeText={setRxDosage}
              />

              <Text style={[styles.formLabel, { color: theme.textSecondary }]}>Frequency</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                value={rxFrequency}
                onChangeText={setRxFrequency}
              />

              <TouchableOpacity
                style={[styles.sheetNudgeBtn, { backgroundColor: theme.primary, marginTop: 12 }]}
                onPress={() => {
                  setShowNewRxModal(false);
                  alert(`Prescription for ${rxDrugName || 'Medicine'} issued to ${rxPatientName}!`);
                }}
              >
                <Text style={styles.sheetNudgeBtnText}>Authorize & Transmit to Student App</Text>
              </TouchableOpacity>
            </ScrollView>
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
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  portalBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portalTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
  },
  portalSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newRxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
  },
  newRxBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
    color: '#ffffff',
  },
  switchStudentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
  },
  switchStudentText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  tabsHeader: {
    borderBottomWidth: 1,
  },
  tabsScroll: {
    paddingHorizontal: Spacing.two,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {},
  tabItemText: {
    fontSize: 13,
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
  tabContent: {
    marginTop: Spacing.two,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: Spacing.two,
  },
  kpiCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  kpiTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiNumber: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 26,
  },
  kpiLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
  },
  kpiSub: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 10,
  },
  twoColumnGrid: {
    gap: 12,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
  },
  sectionCardTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
  },
  sectionCardSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  trendBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginTop: 14,
  },
  trendBarCol: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  trendBarVal: {
    fontSize: 9,
  },
  trendBarTrack: {
    width: 20,
    height: 75,
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  trendBarFill: {
    width: '100%',
    borderRadius: 10,
  },
  trendBarDay: {
    fontSize: 10,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  liveBadgeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 9,
    color: '#ef4444',
  },
  recentAlertsList: {
    gap: 8,
    marginTop: 8,
  },
  feedAlertItem: {
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    gap: 2,
  },
  feedAlertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedAlertTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
  },
  feedAlertTime: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
  },
  feedAlertSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  viewAllLink: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  patientOverviewList: {
    marginTop: 6,
  },
  patientOverviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  pOverviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pInitialsBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pInitialsText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
  },
  pName: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
  },
  pMeta: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  pOverviewRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  pRateText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
  },
  pStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pStatusBadgeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 9,
  },
  directoryHeader: {
    marginBottom: Spacing.two,
    gap: 8,
  },
  tabHeading: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
  },
  tabSubheading: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  filterPillText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
  },
  patientCardsGrid: {
    gap: 10,
  },
  patientCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  ptCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ptCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ptAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ptAvatarText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
  },
  ptName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
  },
  ptId: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  ptStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  ptStatusPillText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 10,
  },
  ptConditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ptConditionText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
  },
  ptPrescriptionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ptPrescriptionText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
  },
  ptFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  ptAdherenceLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
  },
  ptAdherenceValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
  },
  ptActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ptActionBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
    color: '#ffffff',
  },
  alertsList: {
    gap: 10,
  },
  alertItemCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  alertCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertPriorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  alertPriorityText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 9,
  },
  alertTime: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
  },
  alertMainTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
  },
  alertMainSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
  },
  alertActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  resolveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resolveBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
    color: '#ffffff',
  },
  nudgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  nudgeBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  dismissBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  dismissBtnText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
  },
  emptySub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  chatContainer: {
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 400,
    overflow: 'hidden',
  },
  providerChatScroll: {
    padding: 14,
    maxHeight: 320,
  },
  providerMsgRow: {
    marginVertical: 4,
    maxWidth: '85%',
  },
  pMsgMe: {
    alignSelf: 'flex-end',
  },
  pMsgOther: {
    alignSelf: 'flex-start',
  },
  pMsgBubble: {
    borderRadius: 14,
    padding: 10,
    gap: 2,
  },
  pMsgDoctor: {
    borderBottomRightRadius: 2,
  },
  pMsgStudent: {
    borderBottomLeftRadius: 2,
    borderWidth: 1,
  },
  pMsgSender: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
  },
  pMsgText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
  },
  pMsgTime: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 9,
    alignSelf: 'flex-end',
  },
  pComposer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  pInput: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
  },
  pSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  exportActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 100,
  },
  exportActionText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
    color: '#ffffff',
  },
  inventoryList: {
    gap: 10,
  },
  inventoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  invLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  invIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
  },
  invSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  invRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  stockCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  stockValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
  },
  stockStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stockStatusText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 9,
  },
  reorderBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  reorderBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mSheetTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
  },
  mSheetSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
  },
  closeModalBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mSheetBody: {
    paddingBottom: 24,
  },
  sheetSection: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 4,
  },
  sheetSectionHeading: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  sheetInfoText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
  },
  sheetNudgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 100,
    marginTop: 8,
  },
  sheetNudgeBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: '#ffffff',
  },
  formLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  formInput: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
  },
});
