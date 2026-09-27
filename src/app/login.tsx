import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to dashboard
      // router.replace('/dashboard');
    }, 1500);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
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
              <ThemedText style={styles.title}>Welcome Back</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">Sign in to your account.</ThemedText>

              <TextInput 
                style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                placeholder="E-mail"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput 
                style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
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
                  {isLoading ? 'Signing in...' : 'SIGN IN'}
                </ThemedText>
              </Pressable>

              <View style={styles.footer}>
                <ThemedText style={styles.footerText} themeColor="textSecondary">
                  Don't have an account?{' '}
                </ThemedText>
                <Link href="/register" asChild>
                  <Pressable>
                    <ThemedText style={[styles.footerText, { color: theme.text, fontFamily: 'Outfit_600SemiBold' }]}>
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
    marginBottom: Spacing.four,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 32,
    letterSpacing: -1,
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    marginBottom: Spacing.five,
  },
  input: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
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
    fontSize: 14,
  },
  submitButton: {
    width: '100%',
    height: 52,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  submitButtonText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
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
