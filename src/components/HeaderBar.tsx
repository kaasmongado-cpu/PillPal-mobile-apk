import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePillPal } from '@/context/PillPalContext';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

export function HeaderBar({ title, subtitle, showBack = false }: HeaderBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const { role, setRole, studentProfile, susScore } = usePillPal();

  const handleRoleToggle = () => {
    if (role === 'student') {
      setRole('provider');
      router.push('/provider' as any);
    } else {
      setRole('student');
      router.push('/(tabs)/home' as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity 
              style={[styles.iconButton, { borderColor: theme.border }]} 
              onPress={() => router.back()}
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={20} color={theme.text} />
            </TouchableOpacity>
          )}

          <View style={styles.branding}>
            <View style={[styles.logoBadge, { backgroundColor: theme.primaryLight }]}>
              <MaterialCommunityIcons name="pill" size={20} color={theme.primary} />
            </View>
            <View>
              <Text style={[styles.brandTitle, { color: theme.text }]}>
                {title || 'PillPal'}
              </Text>
              <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
                {subtitle || (role === 'student' ? 'CSU Health & Wellness' : 'UCHW Clinical Provider')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          {/* SUS Questionnaire Quick Launch */}
          <TouchableOpacity
            style={[styles.susBadge, { backgroundColor: theme.secondaryLight, borderColor: theme.secondary }]}
            onPress={() => router.push('/sus-survey' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="star" size={14} color={theme.secondary} />
            <Text style={[styles.susText, { color: theme.secondary }]}>
              SUS {susScore !== null ? `${susScore}` : 'Eval'}
            </Text>
          </TouchableOpacity>

          {/* Role Switcher Pill */}
          <TouchableOpacity
            style={[
              styles.roleSwitchButton,
              {
                backgroundColor: role === 'student' ? theme.primaryLight : theme.accent + '25',
                borderColor: role === 'student' ? theme.primary : theme.accent,
              },
            ]}
            onPress={handleRoleToggle}
            activeOpacity={0.8}
          >
            <Ionicons
              name={role === 'student' ? 'school-outline' : 'medkit-outline'}
              size={14}
              color={role === 'student' ? theme.primary : theme.accent}
            />
            <Text
              style={[
                styles.roleSwitchText,
                { color: role === 'student' ? theme.primary : theme.accent },
              ]}
            >
              {role === 'student' ? 'Student' : 'Doctor Portal'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sync Status Banner */}
      <View style={[styles.syncBar, { backgroundColor: theme.backgroundSelected }]}>
        <View style={styles.syncLeft}>
          <View style={styles.onlineDot} />
          <Text style={[styles.syncText, { color: theme.textSecondary }]}>
            {role === 'student'
              ? `CSU UCHW Cloud Connected • ${studentProfile.studentId}`
              : 'CSU Health Informatics Portal • EMR Sync Active'}
          </Text>
        </View>
        <Text style={[styles.securityBadge, { color: theme.primary }]}>
          TLS 1.3 / RA 10173 Encrypted
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  susBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
  },
  susText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
  },
  roleSwitchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
  },
  roleSwitchText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
  },
  syncBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 4,
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  syncText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  securityBadge: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 10,
  },
});
