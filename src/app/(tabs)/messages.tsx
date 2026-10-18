import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { HeaderBar } from '@/components/HeaderBar';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { usePillPal } from '@/context/PillPalContext';
import { useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function MessagesScreen() {
  const theme = useTheme();
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, []);
// duplicate animation code removed
  const { messages, sendMessage, studentProfile } = usePillPal();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const quickChips = [
    { label: '💊 Refill Request', text: 'Hello Doctor, I would like to request a prescription refill for my maintenance medication.', category: 'refill' as const },
    { label: '⚠️ Report Side Effect', text: 'Doctor, I experienced mild stomach discomfort after my recent dose. Should I take it with food?', category: 'adverse_reaction' as const },
    { label: '❓ Missed Dose Advice', text: 'I missed my morning dose of Metformin by 3 hours. Should I take it now?', category: 'general' as const },
    { label: '📅 Clinic Consult', text: 'Good day! I would like to schedule a consultation at the CSU Health Center this week.', category: 'appointment' as const },
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleQuickChipPress = (text: string, category: 'refill' | 'adverse_reaction' | 'general' | 'appointment') => {
    sendMessage(text, category);
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <HeaderBar title="Clinical Chat" subtitle="Encrypted Provider Telemedicine" />

      {/* Provider Details Card Banner */}
      <View style={[styles.providerBanner, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.providerLeft}>
          <View style={[styles.doctorAvatar, { backgroundColor: theme.primaryLight }]}>
            <MaterialCommunityIcons name="doctor" size={24} color={theme.primary} />
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={[styles.doctorName, { color: theme.text }]}>Dr. Mary Rose Santos, MD</Text>
              <View style={styles.activeDot} />
            </View>
            <Text style={[styles.doctorTitle, { color: theme.textSecondary }]}>
              UCHW Medical Officer • Caraga State University
            </Text>
          </View>
        </View>

        <View style={[styles.verifiedBadge, { backgroundColor: theme.successLight }]}>
          <Ionicons name="shield-checkmark" size={12} color={theme.success} />
          <Text style={[styles.verifiedText, { color: theme.success }]}>DPA 2012</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messagesScroll}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          style={animatedStyle}>

          <View style={styles.maxWidthWrapper}>
            {/* Encryption notice */}
            <View style={[styles.encryptionNotice, { backgroundColor: theme.backgroundSelected }]}>
              <Ionicons name="lock-closed" size={13} color={theme.textSecondary} />
              <Text style={[styles.encryptionText, { color: theme.textSecondary }]}>
                Messages are protected under RA 10173 (Philippine Data Privacy Act) & TLS 1.3
              </Text>
            </View>

            {/* Quick Action Chips */}
            <View style={styles.quickChipsSection}>
              <Text style={[styles.quickChipsLabel, { color: theme.textSecondary }]}>
                QUICK CLINICAL INQUIRIES:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                {quickChips.map((chip, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.quickChip, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={() => handleQuickChipPress(chip.text, chip.category)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.quickChipText, { color: theme.text }]}>{chip.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Message Bubbles */}
            <View style={styles.bubblesList}>
              {messages.map(msg => {
                const isMe = msg.sender === 'student';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageRow,
                      isMe ? styles.messageRowMe : styles.messageRowOther,
                    ]}
                  >
                    {!isMe && (
                      <View style={[styles.bubbleAvatar, { backgroundColor: theme.primaryLight }]}>
                        <Text style={[styles.bubbleAvatarText, { color: theme.primary }]}>Dr</Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.bubble,
                        isMe
                          ? [styles.bubbleMe, { backgroundColor: theme.primary }]
                          : [styles.bubbleOther, { backgroundColor: theme.card, borderColor: theme.border }],
                      ]}
                    >
                      <Text
                        style={[
                          styles.bubbleSender,
                          { color: isMe ? 'rgba(255,255,255,0.7)' : theme.primary },
                        ]}
                      >
                        {msg.senderName}
                      </Text>
                      <Text
                        style={[
                          styles.bubbleText,
                          { color: isMe ? '#ffffff' : theme.text },
                        ]}
                      >
                        {msg.content}
                      </Text>
                      <View style={styles.bubbleMeta}>
                        <Text
                          style={[
                            styles.timestampText,
                            { color: isMe ? 'rgba(255,255,255,0.7)' : theme.textSecondary },
                          ]}
                        >
                          {msg.timestamp}
                        </Text>
                        {isMe && (
                          <Ionicons
                            name="checkmark-done"
                            size={14}
                            color="rgba(255,255,255,0.8)"
                          />
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.ScrollView>

        {/* Composer Bar */}
        <View style={[styles.composerBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <View style={styles.maxWidthWrapper}>
            <View style={styles.composerInner}>
              <TextInput
                style={[styles.composerInput, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
                placeholder="Type encrypted message to CSU Clinic..."
                placeholderTextColor={theme.textSecondary}
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: inputText.trim() ? theme.primary : theme.border },
                ]}
                onPress={handleSend}
                disabled={!inputText.trim()}
              >
                <Ionicons
                  name="arrow-up"
                  size={20}
                  color={inputText.trim() ? '#ffffff' : theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  providerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  providerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  doctorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doctorName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  doctorTitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 10,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesScroll: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  maxWidthWrapper: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  encryptionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: Spacing.two,
  },
  encryptionText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
    textAlign: 'center',
  },
  quickChipsSection: {
    marginBottom: Spacing.two,
  },
  quickChipsLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 6,
  },
  quickChipText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
  },
  bubblesList: {
    gap: 12,
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 8,
    maxWidth: '85%',
  },
  messageRowMe: {
    alignSelf: 'flex-end',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  bubbleAvatarText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  bubbleMe: {
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleSender: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
  },
  bubbleText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 2,
  },
  timestampText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
  },
  composerBar: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
  },
  composerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  composerInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
