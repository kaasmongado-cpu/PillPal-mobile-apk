import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  MedicationItem,
  ScheduledDose,
  ChatMessage,
  ProviderPatient,
  ClinicalAlert,
  ClinicInventoryItem,
  INITIAL_MEDICATIONS,
  INITIAL_SCHEDULED_DOSES,
  INITIAL_MESSAGES,
  INITIAL_PATIENTS,
  INITIAL_CLINICAL_ALERTS,
  INITIAL_INVENTORY,
} from '@/data/pndf-data';

export type UserRole = 'student' | 'provider';

export interface StudentProfile {
  name: string;
  studentId: string;
  course: string;
  yearLevel: string;
  campus: string;
  email: string;
  chronicConditions: string[];
  emergencyContact: string;
  assignedDoctor: string;
}

interface PillPalContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  studentProfile: StudentProfile;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  medications: MedicationItem[];
  scheduledDoses: ScheduledDose[];
  streakDays: number;
  overallAdherence: number;
  messages: ChatMessage[];
  patients: ProviderPatient[];
  alerts: ClinicalAlert[];
  inventory: ClinicInventoryItem[];
  susScore: number | null;
  lastConfirmedDoseTime: string | null;
  // Actions
  confirmDose: (doseId: string) => void;
  snoozeDose: (doseId: string) => void;
  addMedication: (med: Partial<MedicationItem>) => void;
  deleteMedication: (id: string) => void;
  sendMessage: (text: string, category?: ChatMessage['category']) => void;
  resolveAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  reorderInventory: (itemId: string, quantity: number) => void;
  submitSusSurvey: (answers: Record<number, number>) => number;
}

const PillPalContext = createContext<PillPalContextType | undefined>(undefined);

export function PillPalProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('student');
  
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: 'Kylle Mae Mercado',
    studentId: 'CSU-2022-0941',
    course: 'BS Information Technology',
    yearLevel: '4th Year',
    campus: 'Caraga State University - Main Campus',
    email: 'kmm@carsu.edu.ph',
    chronicConditions: ['Prediabetes', 'Mild Asthma'],
    emergencyContact: '+63 912 345 6789 (Mother)',
    assignedDoctor: 'Dr. Mary Rose Santos, MD (CSU UCHW)',
  });

  const [medications, setMedications] = useState<MedicationItem[]>(INITIAL_MEDICATIONS);
  const [scheduledDoses, setScheduledDoses] = useState<ScheduledDose[]>(INITIAL_SCHEDULED_DOSES);
  const [streakDays, setStreakDays] = useState<number>(14);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [patients, setPatients] = useState<ProviderPatient[]>(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState<ClinicalAlert[]>(INITIAL_CLINICAL_ALERTS);
  const [inventory, setInventory] = useState<ClinicInventoryItem[]>(INITIAL_INVENTORY);
  const [susScore, setSusScore] = useState<number | null>(82.5);
  const [lastConfirmedDoseTime, setLastConfirmedDoseTime] = useState<string | null>('08:04 AM');

  // Adherence calculation
  const overallAdherence = useMemo(() => {
    if (scheduledDoses.length === 0) return 100;
    const takenCount = scheduledDoses.filter(d => d.status === 'taken').length;
    // Blend today's rate with longitudinal baseline (92%)
    const todayRate = Math.round((takenCount / scheduledDoses.length) * 100);
    return Math.round((92 * 6 + todayRate) / 7);
  }, [scheduledDoses]);

  const confirmDose = useCallback((doseId: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setScheduledDoses(prev => {
      const updated = prev.map(dose => {
        if (dose.id === doseId) {
          return {
            ...dose,
            status: 'taken' as const,
            takenAt: timeString,
          };
        }
        return dose;
      });

      // Find the dose's medication and decrement pillsRemaining
      const targetDose = prev.find(d => d.id === doseId);
      if (targetDose) {
        setMedications(mList =>
          mList.map(m => {
            if (m.id === targetDose.medicationId && m.pillsRemaining > 0) {
              return { ...m, pillsRemaining: m.pillsRemaining - 1 };
            }
            return m;
          })
        );
      }

      setLastConfirmedDoseTime(timeString);
      return updated;
    });
  }, []);

  const snoozeDose = useCallback((doseId: string) => {
    setScheduledDoses(prev =>
      prev.map(dose => (dose.id === doseId ? { ...dose, status: 'snoozed' as const } : dose))
    );
  }, []);

  const addMedication = useCallback((newMed: Partial<MedicationItem>) => {
    const medId = `med-${Date.now()}`;
    const fullMed: MedicationItem = {
      id: medId,
      name: newMed.name || 'Prescribed Medicine',
      genericName: newMed.genericName || newMed.name || 'Generic Medicine',
      brandName: newMed.brandName,
      dosage: newMed.dosage || '500 mg',
      frequency: newMed.frequency || 'Once daily',
      times: newMed.times && newMed.times.length > 0 ? newMed.times : ['08:00 AM'],
      instructions: newMed.instructions || 'Take as instructed by CSU Health Clinic.',
      color: newMed.color || '#0d9488',
      shape: newMed.shape || 'round',
      pillsRemaining: newMed.pillsRemaining || 30,
      totalPills: newMed.totalPills || 30,
      refillThreshold: 7,
      adherenceRate: 100,
      prescribingDoctor: newMed.prescribingDoctor || 'Dr. Mary Rose Santos (CSU UCHW)',
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
      isPRN: newMed.isPRN || false,
    };

    setMedications(prev => [fullMed, ...prev]);

    // Also add scheduled doses for today
    const newDoses: ScheduledDose[] = fullMed.times.map((t, i) => ({
      id: `dose-${medId}-${i}`,
      medicationId: medId,
      medicationName: fullMed.name,
      dosage: fullMed.dosage,
      scheduledTime: t,
      timeSlot: t.includes('PM') ? (parseInt(t) >= 9 ? 'Bedtime' : 'Evening') : 'Morning',
      instructions: fullMed.instructions,
      status: 'pending',
      color: fullMed.color,
    }));

    setScheduledDoses(prev => [...prev, ...newDoses]);
  }, []);

  const deleteMedication = useCallback((id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    setScheduledDoses(prev => prev.filter(d => d.medicationId !== id));
  }, []);

  const sendMessage = useCallback((text: string, category?: ChatMessage['category']) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: role === 'student' ? 'student' : 'provider',
      senderName: role === 'student' ? studentProfile.name : 'Dr. Mary Rose Santos (UCHW)',
      content: text,
      timestamp: 'Just now',
      isRead: true,
      category: category || 'general',
    };

    setMessages(prev => [...prev, newMsg]);

    // If sent by student, simulate prompt clinical triage response after 1.5 seconds
    if (role === 'student') {
      setTimeout(() => {
        let replyText = 'Thank you for updating CSU Health Services. Your adherence log has been recorded.';
        const lower = text.toLowerCase();
        if (lower.includes('refill')) {
          replyText = 'Refill Request Received: Your prescription refill has been approved. You can pick it up at CSU UCHW Pharmacy between 8:00 AM - 5:00 PM.';
        } else if (lower.includes('side effect') || lower.includes('nausea') || lower.includes('dizzy')) {
          replyText = 'Clinical Advisory: Please take your dose strictly with meals. If symptoms persist for more than 24 hours, visit the UCHW Clinic or call our hotline.';
        } else if (lower.includes('missed') || lower.includes('forgot')) {
          replyText = 'Missed Dose Advisory: Take your dose as soon as you remember, unless it is close to your next scheduled time. Do not double up.';
        }

        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          sender: 'provider',
          senderName: 'Dr. Mary Rose Santos (UCHW)',
          content: replyText,
          timestamp: 'Just now',
          isRead: true,
        };
        setMessages(curr => [...curr, replyMsg]);
      }, 1200);
    }
  }, [role, studentProfile.name]);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  const reorderInventory = useCallback((itemId: string, quantity: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            stockLevel: item.stockLevel + quantity,
            status: 'In Stock' as const,
            incomingShipment: `CSU-UCHW-ORD#${Math.floor(1000 + Math.random() * 9000)} (Processing)`,
          };
        }
        return item;
      })
    );
  }, []);

  // System Usability Scale (SUS) Scoring Algorithm (Chapter 3.1.6.3):
  // For odd items (1, 3, 5, 7, 9): contribution = scale position - 1
  // For even items (2, 4, 6, 8, 10): contribution = 5 - scale position
  // Final SUS Score = sum of contributions * 2.5 (0 - 100)
  const submitSusSurvey = useCallback((answers: Record<number, number>): number => {
    let scoreSum = 0;
    for (let i = 1; i <= 10; i++) {
      const val = answers[i] || 3;
      if (i % 2 === 1) {
        scoreSum += (val - 1);
      } else {
        scoreSum += (5 - val);
      }
    }
    const finalScore = Math.round(scoreSum * 2.5 * 10) / 10;
    setSusScore(finalScore);
    return finalScore;
  }, []);

  const updateStudentProfile = useCallback((profile: Partial<StudentProfile>) => {
    setStudentProfile(prev => ({ ...prev, ...profile }));
  }, []);

  const value = {
    role,
    setRole,
    studentProfile,
    updateStudentProfile,
    medications,
    scheduledDoses,
    streakDays,
    overallAdherence,
    messages,
    patients,
    alerts,
    inventory,
    susScore,
    lastConfirmedDoseTime,
    confirmDose,
    snoozeDose,
    addMedication,
    deleteMedication,
    sendMessage,
    resolveAlert,
    dismissAlert,
    reorderInventory,
    submitSusSurvey,
  };

  return <PillPalContext.Provider value={value}>{children}</PillPalContext.Provider>;
}

export function usePillPal() {
  const context = useContext(PillPalContext);
  if (!context) {
    throw new Error('usePillPal must be used within a PillPalProvider');
  }
  return context;
}
