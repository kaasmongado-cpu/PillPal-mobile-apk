import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { usePillPal, UserRole } from '@/context/PillPalContext';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { setRole } = usePillPal();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('kmm@carsu.edu.ph');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('kmm@carsu.edu.ph');
    } else {
      setEmail('dr.santos@carsu.edu.ph');
    }
  };

  const handleLogin = () => {
    setIsLoading(true);
    setRole(selectedRole);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'student') {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/provider');
      }
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
              <ThemedText style={styles.title}>ACCESS_PORTAL</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Caraga State University Health Adherence Platform
              </ThemedText>

              {/* Role Toggle Tabs */}
              <View style={[styles.roleToggleContainer, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <TouchableOpacity
                  style={[
                    styles.roleToggleBtn,
                    selectedRole === 'student' && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => handleSelectRole('student')}
                >
                  <Ionicons
                    name="school"
                    size={16}
                    color={selectedRole === 'student' ? '#ffffff' : theme.textSecondary}
                  />
                  <ThemedText
                    style={[
                      styles.roleToggleText,
                      { color: selectedRole === 'student' ? '#ffffff' : theme.textSecondary },
                    ]}
                  >
                    CSU Student
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleToggleBtn,
                    selectedRole === 'provider' && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => handleSelectRole('provider')}
                >
                  <Ionicons
                    name="medkit"
                    size={16}
                    color={selectedRole === 'provider' ? '#ffffff' : theme.textSecondary}
                  />
                  <ThemedText
                    style={[
                      styles.roleToggleText,
                      { color: selectedRole === 'provider' ? '#ffffff' : theme.textSecondary },
                    ]}
                  >
                    Doctor / UCHW
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <TextInput 
                style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                placeholder={selectedRole === 'student' ? "CSU Student E-mail / ID" : "Provider ID / E-mail"}
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput 
                style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <View style={styles.forgotPassword}>
                <ThemedText style={styles.linkText} themeColor="textSecondary">Forgot your password?</ThemedText>
              </View>

              <Pressable 
                style={({ pressed }) => [
                  styles.submitButton,
                  { backgroundColor: theme.primary },
                  pressed && { backgroundColor: theme.primaryHover },
                  isLoading && { opacity: 0.7 }
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <ThemedText style={[styles.submitButtonText, { color: theme.primaryText }]}>
                  {isLoading ? 'Authenticating...' : `SIGN IN AS ${selectedRole.toUpperCase()}`}
                </ThemedText>
              </Pressable>

              <View style={styles.footer}>
                <ThemedText style={styles.footerText} themeColor="textSecondary">
                  Don't have an account?{' '}
                </ThemedText>
                <Link href="/register" asChild>
                  <Pressable>
                    <ThemedText style={[styles.footerText, { color: theme.primary, fontFamily: 'Outfit_600SemiBold' }]}>
                      Sign Up
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
  roleToggleContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  roleToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  roleToggleText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
  },
  input: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    marginBottom: Spacing.three,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: Spacing.four,
    paddingHorizontal: 4,
  },
  linkText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
  },
  submitButton: {
    width: '100%',
    height: 52,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  submitButtonText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
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
