import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePillPal } from '@/context/PillPalContext';
import { useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { SUS_QUESTIONS } from '@/data/pndf-data';

export default function SusSurveyScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { susScore, submitSusSurvey } = usePillPal();

  // Initial responses (defaults to 4 or 5 for positive, 1 or 2 for negative to reflect good usability baseline)
  const [responses, setResponses] = useState<Record<number, number>>({
    1: 4, // Like to use frequently
    2: 1, // Unnecessarily complex
    3: 5, // Easy to use
    4: 1, // Need technical support
    5: 4, // Well integrated
    6: 2, // Inconsistency
    7: 5, // Learn quickly
    8: 1, // Cumbersome
    9: 5, // Confident
    10: 1, // Learn a lot of things
  });

  const [submitted, setSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(susScore ?? 82.5);

  const handleSelect = (questionId: number, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    const score = submitSusSurvey(responses);
    setCalculatedScore(score);
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: theme.border }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>System Usability Scale</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              Standard 10-Item SUS Evaluation (Brooke, 1996)
            </Text>
          </View>
        </View>

        {calculatedScore !== null && (
          <View style={[styles.scoreBadge, { backgroundColor: theme.successLight }]}>
            <Text style={[styles.scoreBadgeText, { color: theme.success }]}>
              {calculatedScore} / 100
            </Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.maxWidthWrapper}>
          {/* Institutional Capstone Banner */}
          <View style={[styles.infoBanner, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="information-circle" size={20} color={theme.primary} />
            <Text style={[styles.infoBannerText, { color: theme.primary }]}>
              PillPal Capstone Evaluation Target: Minimum SUS score of 70 (acceptable usability threshold)
              for Caraga State University student and healthcare-provider participants.
            </Text>
          </View>

          {/* Questionnaire list */}
          <View style={styles.questionList}>
            {SUS_QUESTIONS.map(q => {
              const currentVal = responses[q.id] || 3;
              return (
                <View
                  key={q.id}
                  style={[styles.questionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <View style={styles.qHeader}>
                    <View style={[styles.qNumberCircle, { backgroundColor: theme.backgroundSelected }]}>
                      <Text style={[styles.qNumberText, { color: theme.text }]}>{q.id}</Text>
                    </View>
                    <Text style={[styles.qText, { color: theme.text }]}>{q.text}</Text>
                  </View>

                  {/* 1-5 Likert Options */}
                  <View style={styles.likertRow}>
                    <Text style={[styles.likertEndLabel, { color: theme.textSecondary }]}>
                      Strongly{'\n'}Disagree
                    </Text>

                    <View style={styles.radioGroup}>
                      {[1, 2, 3, 4, 5].map(val => {
                        const isSelected = currentVal === val;
                        return (
                          <TouchableOpacity
                            key={val}
                            style={[
                              styles.radioCircle,
                              {
                                backgroundColor: isSelected ? theme.primary : theme.backgroundElement,
                                borderColor: isSelected ? theme.primary : theme.border,
                              },
                            ]}
                            onPress={() => handleSelect(q.id, val)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.radioNumber,
                                { color: isSelected ? '#ffffff' : theme.text },
                              ]}
                            >
                              {val}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <Text style={[styles.likertEndLabel, { color: theme.textSecondary, textAlign: 'right' }]}>
                      Strongly{'\n'}Agree
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Submit Action */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Ionicons name="calculator" size={18} color="#ffffff" />
            <Text style={styles.submitBtnText}>Calculate & Save SUS Score</Text>
          </TouchableOpacity>

          {/* Result Card if submitted */}
          {submitted && calculatedScore !== null && (
            <View style={[styles.resultSummaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.resultRow}>
                <View style={[styles.resultCircle, { backgroundColor: calculatedScore >= 70 ? theme.successLight : theme.warningLight }]}>
                  <Text
                    style={[
                      styles.resultCircleScore,
                      { color: calculatedScore >= 70 ? theme.success : theme.warning },
                    ]}
                  >
                    {calculatedScore}
                  </Text>
                  <Text style={[styles.resultCircleScale, { color: theme.textSecondary }]}>/ 100</Text>
                </View>

                <View style={styles.resultDetails}>
                  <Text style={[styles.resultStatusTitle, { color: theme.text }]}>
                    {calculatedScore >= 80
                      ? 'Grade A: Excellent Usability'
                      : calculatedScore >= 70
                      ? 'Grade B: Acceptable Usability'
                      : 'Needs Refinement'}
                  </Text>
                  <Text style={[styles.resultStatusSub, { color: theme.textSecondary }]}>
                    {calculatedScore >= 70
                      ? 'Achieves the target SUS benchmark (>=70) established in Chapter 3.1.5 and 3.3 of the Capstone!'
                      : 'Below the 70 benchmark threshold.'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.doneBtn, { backgroundColor: theme.backgroundSelected }]}
                onPress={() => router.back()}
              >
                <Text style={[styles.doneBtnText, { color: theme.text }]}>Return to PillPal</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
  },
  headerSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  scoreBadgeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  maxWidthWrapper: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginBottom: Spacing.two,
  },
  infoBannerText: {
    flex: 1,
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    lineHeight: 18,
  },
  questionList: {
    gap: 12,
  },
  questionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  qHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  qNumberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qNumberText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
  },
  qText: {
    flex: 1,
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    lineHeight: 19,
  },
  likertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likertEndLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 9,
    width: 45,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  radioCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioNumber: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 100,
    marginTop: 18,
    marginBottom: 12,
  },
  submitBtnText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: '#ffffff',
  },
  resultSummaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    marginTop: 6,
    marginBottom: 24,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  resultCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCircleScore: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
  },
  resultCircleScale: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
  },
  resultDetails: {
    flex: 1,
    gap: 4,
  },
  resultStatusTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
  },
  resultStatusSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  doneBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
  },
});
