import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScheduledDose } from '@/data/pndf-data';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface DoseCardProps {
  dose: ScheduledDose;
  onConfirm: (id: string) => void;
  onSnooze: (id: string) => void;
  isNext?: boolean;
}

export function DoseCard({ dose, onConfirm, onSnooze, isNext = false }: DoseCardProps) {
  const theme = useTheme();
  const isTaken = dose.status === 'taken';
  const isSnoozed = dose.status === 'snoozed';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isTaken ? theme.backgroundSelected : theme.card,
          borderColor: isNext ? theme.primary : theme.cardBorder,
          borderWidth: isNext ? 2 : 1,
        },
      ]}
    >
      {isNext && (
        <View style={[styles.nextBanner, { backgroundColor: theme.primary }]}>
          <Ionicons name="flash" size={11} color="#ffffff" />
          <Text style={styles.nextBannerText}>NEXT SCHEDULED DOSE</Text>
        </View>
      )}

      <View style={styles.mainRow}>
        {/* Time slot & Pill icon indicator */}
        <View style={[styles.iconBox, { backgroundColor: isTaken ? theme.successLight : theme.primaryLight }]}>
          <MaterialCommunityIcons
            name={isTaken ? 'check-decagram' : 'pill'}
            size={22}
            color={isTaken ? theme.success : theme.primary}
          />
        </View>

        <View style={styles.infoCol}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.medName,
                { color: theme.text, textDecorationLine: isTaken ? 'line-through' : 'none' },
              ]}
              numberOfLines={1}
            >
              {dose.medicationName}
            </Text>
          </View>

          <Text style={[styles.dosageText, { color: theme.textSecondary }]}>
            {dose.dosage} • {dose.instructions}
          </Text>

          <View style={styles.tagRow}>
            <View style={[styles.timeTag, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="time-outline" size={12} color={theme.textSecondary} />
              <Text style={[styles.timeTagText, { color: theme.textSecondary }]}>
                {dose.scheduledTime} ({dose.timeSlot})
              </Text>
            </View>

            {isSnoozed && (
              <View style={[styles.snoozeTag, { backgroundColor: theme.warningLight }]}>
                <Ionicons name="alarm-outline" size={12} color={theme.warning} />
                <Text style={[styles.snoozeTagText, { color: theme.warning }]}>Snoozed</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionCol}>
          {isTaken ? (
            <View style={[styles.takenBadge, { backgroundColor: theme.successLight }]}>
              <Ionicons name="checkmark-done" size={16} color={theme.success} />
              <Text style={[styles.takenText, { color: theme.success }]}>
                {dose.takenAt || 'Taken'}
              </Text>
            </View>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.takeButton, { backgroundColor: theme.primary }]}
                onPress={() => onConfirm(dose.id)}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={16} color="#ffffff" />
                <Text style={styles.takeButtonText}>Take</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.snoozeButton, { borderColor: theme.border }]}
                onPress={() => onSnooze(dose.id)}
                activeOpacity={0.7}
              >
                <Ionicons name="notifications-off-outline" size={14} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    marginVertical: 6,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  nextBanner: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderBottomLeftRadius: 10,
  },
  nextBannerText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 9,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  medName: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
  },
  dosageText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeTagText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 10,
  },
  snoozeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  snoozeTagText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 10,
  },
  actionCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  takeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  },
  takeButtonText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: '#ffffff',
  },
  snoozeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
  },
  takenText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
});
