import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface AdherenceRingProps {
  score: number; // 0 - 100
  streak: number;
  dosesTaken: number;
  totalDoses: number;
}

export function AdherenceRing({ score, streak, dosesTaken, totalDoses }: AdherenceRingProps) {
  const theme = useTheme();

  const getStatusColor = (val: number) => {
    if (val >= 80) return theme.primary;
    if (val >= 60) return theme.warning;
    return theme.danger;
  };

  const getStatusLabel = (val: number) => {
    if (val >= 80) return 'Optimal Adherence';
    if (val >= 60) return 'Moderate Adherence';
    return 'Critical Non-Adherence';
  };

  const statusColor = getStatusColor(score);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.contentRow}>
        {/* Ring simulation with styled concentric circles */}
        <View style={styles.gaugeContainer}>
          <View style={[styles.outerRing, { borderColor: theme.border }]}>
            <View
              style={[
                styles.progressRing,
                {
                  borderColor: statusColor,
                  borderTopColor: statusColor,
                  borderRightColor: statusColor,
                  borderLeftColor: score > 50 ? statusColor : 'transparent',
                  borderBottomColor: score > 75 ? statusColor : 'transparent',
                },
              ]}
            >
              <View style={[styles.innerCircle, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.scoreValue, { color: theme.text }]}>{score}%</Text>
                <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>Adherence</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Adherence Highlights & Streak */}
        <View style={styles.metricsContainer}>
          <View style={[styles.streakBadge, { backgroundColor: '#fef3c7', borderColor: '#fde68a' }]}>
            <FontAwesome5 name="fire" size={14} color="#d97706" />
            <Text style={styles.streakText}>{streak} Day Streak!</Text>
          </View>

          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusLabel(score)}
            </Text>
          </View>

          <Text style={[styles.subNote, { color: theme.textSecondary }]}>
            {dosesTaken} of {totalDoses} doses completed today
          </Text>

          <View style={styles.statPills}>
            <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
              <Ionicons name="checkmark-circle" size={13} color={theme.success} />
              <Text style={[styles.pillText, { color: theme.text }]}>Taken: {dosesTaken}</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
              <Ionicons name="time" size={13} color={theme.textSecondary} />
              <Text style={[styles.pillText, { color: theme.text }]}>Left: {Math.max(0, totalDoses - dosesTaken)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three,
    marginVertical: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  innerCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }], // Counter-rotate text back to normal
  },
  scoreValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    lineHeight: 28,
  },
  scoreLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricsContainer: {
    flex: 1,
    gap: 6,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  streakText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: '#b45309',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
  },
  subNote: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
  },
  statPills: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pillText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
  },
});
