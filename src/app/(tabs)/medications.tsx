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
import { HeaderBar } from '@/components/HeaderBar';
import { usePillPal } from '@/context/PillPalContext';
import { useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { PNDF_MEDICATIONS, MedicationItem, PNDFMedication } from '@/data/pndf-data';

export default function MedicationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { medications, addMedication, deleteMedication, sendMessage } = usePillPal();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'daily' | 'prn'>('all');
  const [selectedMed, setSelectedMed] = useState<MedicationItem | null>(null);

  // Add Medication Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [pndfSearch, setPndfSearch] = useState('');
  const [selectedPndf, setSelectedPndf] = useState<PNDFMedication | null>(null);
  const [customName, setCustomName] = useState('');
  const [customDosage, setCustomDosage] = useState('');
  const [customFrequency, setCustomFrequency] = useState('Once daily');
  const [customInstructions, setCustomInstructions] = useState('Take with food');
  const [customPills, setCustomPills] = useState('30');

  // Filtered meds
  const filteredMeds = medications.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedFilter === 'daily') return !m.isPRN;
    if (selectedFilter === 'prn') return m.isPRN;
    return true;
  });

  // Filtered PNDF suggestions for modal
  const pndfSuggestions = PNDF_MEDICATIONS.filter(p =>
    p.genericName.toLowerCase().includes(pndfSearch.toLowerCase()) ||
    p.brandNames.some(b => b.toLowerCase().includes(pndfSearch.toLowerCase()))
  );

  const handleSelectPndf = (p: PNDFMedication) => {
    setSelectedPndf(p);
    setCustomName(p.genericName);
    setCustomDosage(p.standardDose);
    setCustomFrequency(p.commonFrequency);
    setCustomInstructions(p.instructions);
  };

  const handleSaveMedication = () => {
    if (!customName.trim()) return;

    addMedication({
      name: customName,
      genericName: selectedPndf?.genericName || customName,
      brandName: selectedPndf?.brandNames[0],
      dosage: customDosage || '500 mg',
      frequency: customFrequency || 'Once daily',
      instructions: customInstructions || 'Take with water',
      pillsRemaining: parseInt(customPills, 10) || 30,
      totalPills: parseInt(customPills, 10) || 30,
      prescribingDoctor: 'CSU UCHW Healthcare Provider',
      color: '#0d9488',
      isPRN: customFrequency.toLowerCase().includes('prn') || customFrequency.toLowerCase().includes('as needed'),
    });

    // Reset and close
    setShowAddModal(false);
    setSelectedPndf(null);
    setPndfSearch('');
    setCustomName('');
    setCustomDosage('');
  };

  const handleRequestRefill = (med: MedicationItem) => {
    sendMessage(
      `Hello CSU Clinic, I would like to request a prescription refill for my medication: ${med.name}. Currently I have only ${med.pillsRemaining} doses left.`,
      'refill'
    );
    setSelectedMed(null);
    router.push('/(tabs)/messages');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <HeaderBar title="Medications" subtitle="Prescription & Formulary Registry" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.maxWidthWrapper}>
          {/* Header Action Bar */}
          <View style={styles.topActionRow}>
            <View>
              <Text style={[styles.pageTitle, { color: theme.text }]}>Active Prescriptions</Text>
              <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
                {medications.length} medications monitored by CSU Health Services
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: theme.primary }]}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color="#ffffff" />
              <Text style={styles.addBtnText}>Add Med</Text>
            </TouchableOpacity>
          </View>

          {/* Search & PNDF Pre-seeded Badge */}
          <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="search" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search by drug name or generic..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Philippine National Drug Formulary (PNDF) Seeding Info Tag */}
          <View style={[styles.pndfBanner, { backgroundColor: theme.primaryLight }]}>
            <MaterialCommunityIcons name="book-check-outline" size={18} color={theme.primary} />
            <Text style={[styles.pndfBannerText, { color: theme.primary }]}>
              Pre-seeded with Philippine National Drug Formulary (PNDF) 2026
            </Text>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedFilter === 'all' && { backgroundColor: theme.primary },
                selectedFilter !== 'all' && { backgroundColor: theme.backgroundSelected },
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: selectedFilter === 'all' ? '#ffffff' : theme.textSecondary },
                ]}
              >
                All ({medications.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedFilter === 'daily' && { backgroundColor: theme.primary },
                selectedFilter !== 'daily' && { backgroundColor: theme.backgroundSelected },
              ]}
              onPress={() => setSelectedFilter('daily')}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: selectedFilter === 'daily' ? '#ffffff' : theme.textSecondary },
                ]}
              >
                Chronic / Daily
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedFilter === 'prn' && { backgroundColor: theme.primary },
                selectedFilter !== 'prn' && { backgroundColor: theme.backgroundSelected },
              ]}
              onPress={() => setSelectedFilter('prn')}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: selectedFilter === 'prn' ? '#ffffff' : theme.textSecondary },
                ]}
              >
                As Needed (PRN)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Medication Cards List */}
          <View style={styles.medsList}>
            {filteredMeds.map(med => {
              const pillRatio = Math.min(1, med.pillsRemaining / med.totalPills);
              const isLowSupply = med.pillsRemaining <= med.refillThreshold;

              return (
                <TouchableOpacity
                  key={med.id}
                  style={[
                    styles.medCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: isLowSupply ? theme.warning : theme.cardBorder,
                    },
                  ]}
                  onPress={() => setSelectedMed(med)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View
                        style={[
                          styles.medIconBox,
                          { backgroundColor: med.color + '20' },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={med.shape === 'inhaler' ? 'spray' : 'pill'}
                          size={22}
                          color={med.color}
                        />
                      </View>
                      <View style={styles.medTitles}>
                        <Text style={[styles.medCardTitle, { color: theme.text }]}>
                          {med.name}
                        </Text>
                        <Text style={[styles.medGenericText, { color: theme.textSecondary }]}>
                          {med.genericName}
                          {med.brandName ? ` • (${med.brandName})` : ''}
                        </Text>
                      </View>
                    </View>

                    {/* Adherence Rate Mini Badge */}
                    <View
                      style={[
                        styles.adherenceMiniBadge,
                        {
                          backgroundColor:
                            med.adherenceRate >= 85 ? theme.successLight : theme.warningLight,
                        },
                      ]}
                    >
                      <Ionicons
                        name="ribbon"
                        size={12}
                        color={med.adherenceRate >= 85 ? theme.success : theme.warning}
                      />
                      <Text
                        style={[
                          styles.adherenceMiniText,
                          {
                            color: med.adherenceRate >= 85 ? theme.success : theme.warning,
                          },
                        ]}
                      >
                        {med.adherenceRate}% Adherence
                      </Text>
                    </View>
                  </View>

                  {/* Schedule & Dosage Meta */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="medical" size={14} color={theme.textSecondary} />
                      <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                        {med.dosage}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="repeat" size={14} color={theme.textSecondary} />
                      <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                        {med.frequency}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                        {med.times.join(', ')}
                      </Text>
                    </View>
                  </View>

                  {/* Instructions snippet */}
                  <Text style={[styles.instructionsSnippet, { color: theme.textSecondary }]}>
                    Instructions: {med.instructions}
                  </Text>

                  {/* Pill Supply Progress Bar */}
                  <View style={styles.supplyContainer}>
                    <View style={styles.supplyLabelRow}>
                      <Text style={[styles.supplyLabel, { color: theme.textSecondary }]}>
                        Supply Remaining:
                      </Text>
                      <Text
                        style={[
                          styles.supplyCount,
                          { color: isLowSupply ? theme.danger : theme.text },
                        ]}
                      >
                        {med.pillsRemaining} of {med.totalPills}{' '}
                        {med.shape === 'inhaler' ? 'doses' : 'pills'}
                        {isLowSupply ? ' (Low Stock!)' : ''}
                      </Text>
                    </View>
                    <View style={[styles.progressBarTrack, { backgroundColor: theme.backgroundSelected }]}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${pillRatio * 100}%`,
                            backgroundColor: isLowSupply ? theme.warning : theme.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Medication Detail Modal */}
      {selectedMed && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={[styles.detailModalContent, { backgroundColor: theme.card }]}>
              <View style={styles.detailHeader}>
                <View>
                  <Text style={[styles.detailTitle, { color: theme.text }]}>
                    {selectedMed.name}
                  </Text>
                  <Text style={[styles.detailSub, { color: theme.textSecondary }]}>
                    {selectedMed.genericName}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.closeIconBtn, { borderColor: theme.border }]}
                  onPress={() => setSelectedMed(null)}
                >
                  <Ionicons name="close" size={20} color={theme.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.detailBody}>
                <View style={[styles.detailSection, { backgroundColor: theme.backgroundElement }]}>
                  <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
                    CLINICAL REGIMEN
                  </Text>
                  <Text style={[styles.detailItemText, { color: theme.text }]}>
                    <Text style={{ fontFamily: 'Outfit_600SemiBold' }}>Dosage:</Text>{' '}
                    {selectedMed.dosage}
                  </Text>
                  <Text style={[styles.detailItemText, { color: theme.text }]}>
                    <Text style={{ fontFamily: 'Outfit_600SemiBold' }}>Frequency:</Text>{' '}
                    {selectedMed.frequency}
                  </Text>
                  <Text style={[styles.detailItemText, { color: theme.text }]}>
                    <Text style={{ fontFamily: 'Outfit_600SemiBold' }}>Scheduled Times:</Text>{' '}
                    {selectedMed.times.join(', ')}
                  </Text>
                  <Text style={[styles.detailItemText, { color: theme.text }]}>
                    <Text style={{ fontFamily: 'Outfit_600SemiBold' }}>Instructions:</Text>{' '}
                    {selectedMed.instructions}
                  </Text>
                  <Text style={[styles.detailItemText, { color: theme.text }]}>
                    <Text style={{ fontFamily: 'Outfit_600SemiBold' }}>Prescribing Clinician:</Text>{' '}
                    {selectedMed.prescribingDoctor}
                  </Text>
                </View>

                {/* Supply Status */}
                <View style={[styles.detailSection, { backgroundColor: theme.backgroundElement }]}>
                  <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
                    SUPPLY & REFILL STATUS
                  </Text>
                  <Text style={[styles.detailItemText, { color: theme.text }]}>
                    {selectedMed.pillsRemaining} units remaining out of {selectedMed.totalPills}.
                  </Text>
                  <TouchableOpacity
                    style={[styles.refillActionBtn, { backgroundColor: theme.secondary }]}
                    onPress={() => handleRequestRefill(selectedMed)}
                  >
                    <Ionicons name="refresh" size={16} color="#ffffff" />
                    <Text style={styles.refillActionBtnText}>
                      Request Refill from CSU UCHW Pharmacy
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Actions */}
                <View style={styles.detailActionsRow}>
                  <TouchableOpacity
                    style={[styles.deleteMedBtn, { borderColor: theme.danger }]}
                    onPress={() => {
                      deleteMedication(selectedMed.id);
                      setSelectedMed(null);
                    }}
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.danger} />
                    <Text style={[styles.deleteMedBtnText, { color: theme.danger }]}>
                      Archive / Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Add Medication Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.addModalContent, { backgroundColor: theme.card }]}>
            <View style={styles.detailHeader}>
              <View>
                <Text style={[styles.detailTitle, { color: theme.text }]}>Add Medication</Text>
                <Text style={[styles.detailSub, { color: theme.textSecondary }]}>
                  PNDF Formulary Search or Manual Entry
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.closeIconBtn, { borderColor: theme.border }]}
                onPress={() => setShowAddModal(false)}
              >
                <Ionicons name="close" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.addModalBody}>
              {/* Scan prescription shortcut */}
              <TouchableOpacity
                style={[styles.scanShortcutCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
                onPress={() => {
                  setShowAddModal(false);
                  router.push('/(tabs)/scan');
                }}
              >
                <Ionicons name="camera" size={22} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.scanShortcutTitle, { color: theme.primary }]}>
                    Scan Prescription Label (OCR)
                  </Text>
                  <Text style={[styles.scanShortcutSub, { color: theme.textSecondary }]}>
                    Automatically read medicine, dose & instructions with camera
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color={theme.primary} />
              </TouchableOpacity>

              <Text style={[styles.orDivider, { color: theme.textSecondary }]}>
                — OR SEARCH PNDF FORMULARY —
              </Text>

              {/* PNDF Search box */}
              <View style={[styles.pndfSearchInputBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <Ionicons name="search" size={16} color={theme.textSecondary} />
                <TextInput
                  style={[styles.pndfTextInput, { color: theme.text }]}
                  placeholder="Type drug name (e.g., Metformin, Losartan, Amoxicillin)..."
                  placeholderTextColor={theme.textSecondary}
                  value={pndfSearch}
                  onChangeText={setPndfSearch}
                />
              </View>

              {/* PNDF Suggestions Chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pndfChipsScroll}>
                {pndfSuggestions.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.pndfChip,
                      {
                        backgroundColor:
                          selectedPndf?.id === p.id ? theme.primary : theme.backgroundSelected,
                      },
                    ]}
                    onPress={() => handleSelectPndf(p)}
                  >
                    <Text
                      style={[
                        styles.pndfChipText,
                        { color: selectedPndf?.id === p.id ? '#ffffff' : theme.text },
                      ]}
                    >
                      {p.genericName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Input Fields */}
              <View style={styles.inputsSection}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Medication / Generic Name</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                  placeholder="e.g., Metformin HCl"
                  placeholderTextColor={theme.textSecondary}
                  value={customName}
                  onChangeText={setCustomName}
                />

                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Dosage & Strength</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                  placeholder="e.g., 500 mg (1 tablet)"
                  placeholderTextColor={theme.textSecondary}
                  value={customDosage}
                  onChangeText={setCustomDosage}
                />

                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Frequency</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                  placeholder="e.g., Twice daily, Every 8 hours, As needed"
                  placeholderTextColor={theme.textSecondary}
                  value={customFrequency}
                  onChangeText={setCustomFrequency}
                />

                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Instructions</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                  placeholder="e.g., Take with or after meals"
                  placeholderTextColor={theme.textSecondary}
                  value={customInstructions}
                  onChangeText={setCustomInstructions}
                />

                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Initial Pill Supply Count</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                  placeholder="30"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  value={customPills}
                  onChangeText={setCustomPills}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitSaveMedBtn, { backgroundColor: theme.primary }]}
                onPress={handleSaveMedication}
              >
                <Text style={styles.submitSaveMedBtnText}>Save to Active Prescriptions</Text>
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
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  maxWidthWrapper: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  topActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  pageTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
  },
  addBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: '#ffffff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: Spacing.one,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
  },
  pndfBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: 4,
  },
  pndfBannerText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: Spacing.one,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  filterText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  medsList: {
    marginTop: Spacing.one,
    gap: 12,
  },
  medCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  medIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medTitles: {
    flex: 1,
  },
  medCardTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
  },
  medGenericText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
  },
  adherenceMiniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  adherenceMiniText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
  },
  instructionsSnippet: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    fontStyle: 'italic',
  },
  supplyContainer: {
    marginTop: 4,
  },
  supplyLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  supplyLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  supplyCount: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  detailModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
  },
  detailSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
  },
  closeIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBody: {
    paddingBottom: 24,
  },
  detailSection: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    gap: 6,
  },
  sectionHeading: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  detailItemText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
  },
  refillActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  refillActionBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
    color: '#ffffff',
  },
  detailActionsRow: {
    marginTop: 8,
  },
  deleteMedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  deleteMedBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  addModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  addModalBody: {
    paddingBottom: 24,
  },
  scanShortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  scanShortcutTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
  },
  scanShortcutSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  orDivider: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
    textAlign: 'center',
    marginVertical: 6,
  },
  pndfSearchInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 6,
  },
  pndfTextInput: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
  },
  pndfChipsScroll: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  pndfChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginRight: 6,
  },
  pndfChipText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  inputsSection: {
    gap: 6,
    marginTop: 8,
  },
  fieldLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  modalInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    marginBottom: 8,
  },
  submitSaveMedBtn: {
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  submitSaveMedBtnText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: '#ffffff',
  },
});
