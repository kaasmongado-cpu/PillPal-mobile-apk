import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { HeaderBar } from '@/components/HeaderBar';
import { usePillPal } from '@/context/PillPalContext';
import { useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { SAMPLE_PRESCRIPTIONS, SamplePrescription } from '@/data/pndf-data';

export default function ScanScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { addMedication } = usePillPal();

  const [flashlightOn, setFlashlightOn] = useState(false);
  const [selectedSample, setSelectedSample] = useState<SamplePrescription>(SAMPLE_PRESCRIPTIONS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  // Extracted fields (editable fallback)
  const [extractedName, setExtractedName] = useState('');
  const [extractedDosage, setExtractedDosage] = useState('');
  const [extractedFrequency, setExtractedFrequency] = useState('');
  const [extractedInstructions, setExtractedInstructions] = useState('');
  const [extractedDoctor, setExtractedDoctor] = useState('');
  const [showRawOcr, setShowRawOcr] = useState(false);

  useEffect(() => {
    // When selected sample changes, preload the extraction
    if (selectedSample) {
      setExtractedName(selectedSample.medicationName);
      setExtractedDosage(selectedSample.dosage);
      setExtractedFrequency(selectedSample.frequency);
      setExtractedInstructions(selectedSample.instructions);
      setExtractedDoctor(selectedSample.doctor);
    }
  }, [selectedSample]);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(10);
    setScanComplete(false);

    // Simulate OCR processing steps
    setTimeout(() => setScanProgress(35), 400);
    setTimeout(() => setScanProgress(70), 800);
    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setScanComplete(true);
    }, 1200);
  };

  const handleSaveToMedications = () => {
    addMedication({
      name: extractedName,
      genericName: selectedSample.genericName || extractedName,
      dosage: extractedDosage,
      frequency: extractedFrequency,
      instructions: extractedInstructions,
      prescribingDoctor: extractedDoctor,
      color: '#0d9488',
      pillsRemaining: 30,
      totalPills: 30,
      isPRN: extractedFrequency.toLowerCase().includes('prn') || extractedFrequency.toLowerCase().includes('as needed'),
    });

    router.push('/(tabs)/medications');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <HeaderBar title="ScanRx OCR" subtitle="Prescription Label Digitizer" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.maxWidthWrapper}>
          {/* Instructions Header */}
          <View style={styles.topBanner}>
            <Text style={[styles.title, { color: theme.text }]}>Optical Prescription Scanner</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Position the printed prescription label or medicine package inside the viewfinder box.
            </Text>
          </View>

          {/* Quick Preset Selector for Live Demonstration */}
          <View style={[styles.sampleSelectorBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.sampleSelectorHeader}>
              <Ionicons name="document-text-outline" size={16} color={theme.primary} />
              <Text style={[styles.sampleSelectorTitle, { color: theme.text }]}>
                Demo Prescription Presets (CSU Clinic)
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sampleChipsRow}>
              {SAMPLE_PRESCRIPTIONS.map(s => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.sampleChip,
                    {
                      backgroundColor:
                        selectedSample.id === s.id ? theme.primary : theme.backgroundSelected,
                    },
                  ]}
                  onPress={() => {
                    setSelectedSample(s);
                    setScanComplete(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sampleChipText,
                      { color: selectedSample.id === s.id ? '#ffffff' : theme.text },
                    ]}
                  >
                    {s.medicationName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Viewfinder Simulator (Wireframe C, Figure 3-8) */}
          <View style={[styles.viewfinderContainer, { backgroundColor: '#0f172a' }]}>
            {/* Viewfinder Header Controls */}
            <View style={styles.cameraHeader}>
              <View style={styles.cameraBadge}>
                <View style={styles.recordDot} />
                <Text style={styles.cameraBadgeText}>OCR CAM READY</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.flashBtn,
                  { backgroundColor: flashlightOn ? '#fbbf24' : 'rgba(255,255,255,0.2)' },
                ]}
                onPress={() => setFlashlightOn(!flashlightOn)}
              >
                <Ionicons
                  name={flashlightOn ? 'flash' : 'flash-off'}
                  size={16}
                  color={flashlightOn ? '#000000' : '#ffffff'}
                />
              </TouchableOpacity>
            </View>

            {/* Targeted Reticle Frame */}
            <View style={styles.reticleFrame}>
              {/* Corner brackets */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Simulated prescription paper inside target */}
              <View style={styles.simulatedPaper}>
                <Text style={styles.paperClinicHeader}>
                  CARAGA STATE UNIVERSITY HEALTH SERVICES
                </Text>
                <Text style={styles.paperDoctor}>{selectedSample.doctor}</Text>
                <View style={styles.paperDivider} />
                <Text style={styles.paperRxSymbol}>Rx</Text>
                <Text style={styles.paperDrug}>{selectedSample.medicationName}</Text>
                <Text style={styles.paperSig}>Sig: {selectedSample.instructions}</Text>
                <Text style={styles.paperQty}>Qty: {selectedSample.quantity}</Text>
              </View>

              {/* Scanning Laser Line when active */}
              {isScanning && (
                <View style={[styles.scanLaserLine, { top: `${scanProgress}%` }]} />
              )}
            </View>

            {/* Viewfinder Bottom Actions */}
            <View style={styles.cameraControlsRow}>
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={() => handleStartScan()}
              >
                <Ionicons name="images-outline" size={20} color="#ffffff" />
                <Text style={styles.galleryBtnText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.captureShutterBtn, isScanning && { opacity: 0.6 }]}
                onPress={handleStartScan}
                disabled={isScanning}
                activeOpacity={0.8}
              >
                <View style={styles.captureShutterInner}>
                  {isScanning ? (
                    <ActivityIndicator size="small" color="#0d9488" />
                  ) : (
                    <Ionicons name="scan" size={26} color="#0d9488" />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.galleryButton}
                onPress={() => setScanComplete(true)}
              >
                <Ionicons name="create-outline" size={20} color="#ffffff" />
                <Text style={styles.galleryBtnText}>Manual</Text>
              </TouchableOpacity>
            </View>

            {isScanning && (
              <View style={styles.scanningStatusBox}>
                <ActivityIndicator size="small" color="#38bdf8" />
                <Text style={styles.scanningStatusText}>
                  Tesseract.js Engine analyzing OCR bounding boxes... {scanProgress}%
                </Text>
              </View>
            )}
          </View>

          {/* OCR Result & Manual Entry Fallback Form */}
          {(scanComplete || !isScanning) && (
            <View style={[styles.resultsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.resultsHeader}>
                <View style={styles.resultsHeaderLeft}>
                  <View style={[styles.checkCircle, { backgroundColor: theme.successLight }]}>
                    <Ionicons name="shield-checkmark" size={18} color={theme.success} />
                  </View>
                  <View>
                    <Text style={[styles.resultsTitle, { color: theme.text }]}>
                      OCR Extraction Results
                    </Text>
                    <Text style={[styles.resultsSub, { color: theme.textSecondary }]}>
                      Confidence: 98.2% • PNDF Verified
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.rawToggleBtn, { backgroundColor: theme.backgroundSelected }]}
                  onPress={() => setShowRawOcr(!showRawOcr)}
                >
                  <Ionicons name="code-slash" size={14} color={theme.textSecondary} />
                  <Text style={[styles.rawToggleText, { color: theme.textSecondary }]}>
                    {showRawOcr ? 'Hide Raw' : 'View Raw'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Raw OCR Text Drawer if toggled */}
              {showRawOcr && (
                <View style={[styles.rawOcrContainer, { backgroundColor: theme.backgroundElement }]}>
                  <Text style={[styles.rawOcrLabel, { color: theme.textSecondary }]}>
                    RAW TESSERACT.JS TRANSCRIPTION:
                  </Text>
                  <Text style={[styles.rawOcrContent, { color: theme.text }]}>
                    {selectedSample.rawOcrText}
                  </Text>
                </View>
              )}

              {/* Verified Fields (Manual Entry Fallback) */}
              <View style={styles.formFields}>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                    Prescribed Medication
                  </Text>
                  <TextInput
                    style={[styles.inputField, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                    value={extractedName}
                    onChangeText={setExtractedName}
                    placeholder="Medication Name"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>

                <View style={styles.twoColRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Dosage</Text>
                    <TextInput
                      style={[styles.inputField, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                      value={extractedDosage}
                      onChangeText={setExtractedDosage}
                      placeholder="e.g. 500mg"
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Frequency</Text>
                    <TextInput
                      style={[styles.inputField, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                      value={extractedFrequency}
                      onChangeText={setExtractedFrequency}
                      placeholder="e.g. Twice daily"
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>
                </View>

                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                    Clinical Intake Instructions
                  </Text>
                  <TextInput
                    style={[styles.inputField, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                    value={extractedInstructions}
                    onChangeText={setExtractedInstructions}
                    placeholder="Intake instructions"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>

                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                    Prescribing Doctor (UCHW)
                  </Text>
                  <TextInput
                    style={[styles.inputField, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                    value={extractedDoctor}
                    onChangeText={setExtractedDoctor}
                    placeholder="Doctor Name"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                style={[styles.confirmSaveBtn, { backgroundColor: theme.primary }]}
                onPress={handleSaveToMedications}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                <Text style={styles.confirmSaveBtnText}>Confirm & Add to My Schedule</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
  topBanner: {
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
    fontSize: 13,
    marginTop: 2,
  },
  sampleSelectorBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: Spacing.two,
  },
  sampleSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sampleSelectorTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  sampleChipsRow: {
    flexDirection: 'row',
  },
  sampleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginRight: 8,
  },
  sampleChipText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  viewfinderContainer: {
    borderRadius: 20,
    padding: 16,
    minHeight: 340,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Spacing.three,
  },
  cameraHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cameraBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  recordDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  cameraBadgeText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 10,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  flashBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleFrame: {
    width: '92%',
    height: 190,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#14b8a6',
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  simulatedPaper: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    width: '84%',
    alignItems: 'center',
  },
  paperClinicHeader: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 9,
    color: '#334155',
    textAlign: 'center',
  },
  paperDoctor: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 8,
    color: '#64748b',
    marginTop: 1,
  },
  paperDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 4,
  },
  paperRxSymbol: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#0d9488',
    alignSelf: 'flex-start',
  },
  paperDrug: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
    color: '#0f172a',
  },
  paperSig: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 9,
    color: '#475569',
    marginTop: 2,
    textAlign: 'center',
  },
  paperQty: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
  },
  scanLaserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  cameraControlsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  galleryButton: {
    alignItems: 'center',
    gap: 4,
  },
  galleryBtnText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
    color: '#ffffff',
  },
  captureShutterBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureShutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#0d9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    marginTop: 10,
  },
  scanningStatusText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
    color: '#38bdf8',
  },
  resultsCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three,
    gap: 12,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
  },
  resultsSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  rawToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  rawToggleText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
  },
  rawOcrContainer: {
    padding: 10,
    borderRadius: 10,
    gap: 4,
  },
  rawOcrLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  rawOcrContent: {
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
  formFields: {
    gap: 10,
  },
  fieldRow: {
    gap: 4,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  inputField: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
  },
  confirmSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 100,
    marginTop: 8,
  },
  confirmSaveBtnText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: '#ffffff',
  },
});
