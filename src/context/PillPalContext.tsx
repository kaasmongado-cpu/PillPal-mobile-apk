import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import {
  MedicationItem,
  ScheduledDose,
  ChatMessage,
  ProviderPatient,
  ClinicalAlert,
  ClinicInventoryItem,
  StudentProfile,
} from '@/data/pndf-data';
import {
  isNeonReady,
  fetchStudentProfile,
  fetchMedications,
  saveMedication,
  deleteMedicationFromDb,
  fetchScheduledDoses,
  updateDoseInDb,
  fetchChatMessages,
  insertChatMessage,
  fetchClinicInventory,
  fetchPatients,
  fetchClinicalAlerts,
  resolveAlertInDb,
} from '@/services/neon';

export type UserRole = 'student' | 'provider';
export type { StudentProfile };

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
  isLoading: boolean;
  refreshData: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: 'Caraga State University Student',
    studentId: '2022-04912',
    course: 'College of Nursing',
    yearLevel: 'Student',
    campus: 'Caraga State University - Main Campus',
    email: '',
    chronicConditions: [],
    emergencyContact: '',
    assignedDoctor: 'Dr. Mary Rose Santos, MD (CSU UCHW)',
  });

  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [scheduledDoses, setScheduledDoses] = useState<ScheduledDose[]>([]);
  const [streakDays, setStreakDays] = useState<number>(14);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [patients, setPatients] = useState<ProviderPatient[]>([]);
  const [alerts, setAlerts] = useState<ClinicalAlert[]>([]);
  const [inventory, setInventory] = useState<ClinicInventoryItem[]>([]);
  const [susScore, setSusScore] = useState<number | null>(null);
  const [lastConfirmedDoseTime, setLastConfirmedDoseTime] = useState<string | null>(null);

  // Load all live collections directly from Neon Database
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isNeonReady()) {
        const [profile, msgs, inv, pts, altList] = await Promise.all([
          fetchStudentProfile(),
          fetchChatMessages(),
          fetchClinicInventory(),
          fetchPatients(),
          fetchClinicalAlerts(),
        ]);

        if (profile) {
          setStudentProfile(profile);
          const [medList, doseList] = await Promise.all([
            fetchMedications(profile.studentId),
            fetchScheduledDoses(profile.studentId),
          ]);
          setMedications(medList);
          setScheduledDoses(doseList);
        } else {
          const [medList, doseList] = await Promise.all([
            fetchMedications(),
            fetchScheduledDoses(),
          ]);
          setMedications(medList);
          setScheduledDoses(doseList);
        }

        setMessages(msgs);
        setInventory(inv);
        setPatients(pts);
        setAlerts(altList);
      }
    } catch (err) {
      console.warn('[PillPalContext] Error loading Neon data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Adherence calculation
  const overallAdherence = useMemo(() => {
    if (scheduledDoses.length === 0) return 100;
    const takenCount = scheduledDoses.filter(d => d.status === 'taken').length;
    return Math.round((takenCount / scheduledDoses.length) * 100);
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

    // Background sync to Neon Postgres
    updateDoseInDb(doseId, 'taken', timeString).catch(() => {});
  }, []);

  const snoozeDose = useCallback((doseId: string) => {
    setScheduledDoses(prev =>
      prev.map(dose => (dose.id === doseId ? { ...dose, status: 'snoozed' as const } : dose))
    );

    // Background sync to Neon Postgres
    updateDoseInDb(doseId, 'snoozed').catch(() => {});
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

    // Background sync to Neon Postgres
    saveMedication(studentProfile.studentId, fullMed).catch(() => {});

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
  }, [studentProfile.studentId]);

  const deleteMedication = useCallback((id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    setScheduledDoses(prev => prev.filter(d => d.medicationId !== id));

    // Background sync to Neon Postgres
    deleteMedicationFromDb(id).catch(() => {});
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

    // Background sync to Neon Postgres
    insertChatMessage(studentProfile.studentId, newMsg).catch(() => {});
  }, [role, studentProfile.name, studentProfile.studentId]);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, resolved: true } : a))
    );
    // Background sync to Neon Postgres
    resolveAlertInDb(alertId).catch(() => {});
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
    isLoading,
    refreshData,
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
