import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { usePillPal } from '@/context/PillPalContext';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { updateStudentProfile, setRole } = usePillPal();

  const [name, setName] = useState('Kylle Mae Mercado');
  const [studentId, setStudentId] = useState('CSU-2022-0941');
  const [course, setCourse] = useState('BS Information Technology');
  const [yearLevel, setYearLevel] = useState('4th Year');
  const [email, setEmail] = useState('kmm@carsu.edu.ph');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    setIsLoading(true);
    updateStudentProfile({
      name,
      studentId,
      course,
      yearLevel,
      email,
    });
    setRole('student');

    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/home');
    }, 400);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Link href="/" asChild>
                <Pressable style={styles.backButton}>
                  <ThemedText style={styles.backText} themeColor="textSecondary">← Back</ThemedText>
                </Pressable>
              </Link>
            </View>

            <View style={styles.formContainer}>
              <Image 
                source={require('@/assets/images/pillpal-logo.svg')}
                style={styles.logo}
                contentFit="contain"
              />
              <ThemedText style={styles.title}>Student Registration</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Connect your health profile to Caraga State University UCHW.
              </ThemedText>

              <TextInput 
                style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                placeholder="Full Name"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
              />

              <View style={styles.twoCol}>
                <TextInput 
                  style={[styles.inputHalf, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                  placeholder="Student ID (CSU-XXXX-XXXX)"
                  placeholderTextColor={theme.textSecondary}
                  value={studentId}
                  onChangeText={setStudentId}
                />
                <TextInput 
                  style={[styles.inputHalf, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                  placeholder="Year Level (e.g. 4th Year)"
                  placeholderTextColor={theme.textSecondary}
                  value={yearLevel}
                  onChangeText={setYearLevel}
                />
              </View>

              <TextInput 
                style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                placeholder="Degree Program (e.g. BSIT, BSCS)"
                placeholderTextColor={theme.textSecondary}
                value={course}
                onChangeText={setCourse}
              />

              <TextInput 
                style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                placeholder="CSU Student E-mail"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              
              <TextInput 
                style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Pressable 
                style={({ pressed }) => [
                  styles.submitButton,
                  { backgroundColor: theme.primary },
                  pressed && { backgroundColor: theme.primaryHover },
                  isLoading && { opacity: 0.7 }
                ]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <ThemedText style={[styles.submitButtonText, { color: theme.primaryText }]}>
                  {isLoading ? 'Creating Student Account...' : 'REGISTER WITH CSU UCHW'}
                </ThemedText>
              </Pressable>

              <View style={styles.footer}>
                <ThemedText style={styles.footerText} themeColor="textSecondary">
                  Already have an account?{' '}
                </ThemedText>
                <Link href="/login" asChild>
                  <Pressable>
                    <ThemedText style={[styles.footerText, { color: theme.primary, fontFamily: 'Outfit_600SemiBold' }]}>
                      Sign In
                    </ThemedText>
                  </Pressable>
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
  },
  header: {
    height: 60,
    justifyContent: 'center',
  },
  backButton: {
    paddingVertical: Spacing.two,
  },
  backText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Spacing.six,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: Spacing.three,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    marginBottom: Spacing.four,
    textAlign: 'center',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  inputHalf: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    marginBottom: Spacing.three,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    marginBottom: Spacing.three,
  },
  submitButton: {
    width: '100%',
    height: 52,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  submitButtonText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
  },
});
