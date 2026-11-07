export interface PNDFMedication {
  id: string;
  genericName: string;
  brandNames: string[];
  therapeuticClass: string;
  standardDose: string;
  dosageForms: string[];
  commonFrequency: string;
  instructions: string;
  warnings: string;
}

export const PNDF_MEDICATIONS: PNDFMedication[] = [
  {
    id: 'pndf-1',
    genericName: 'Metformin Hydrochloride',
    brandNames: ['Glucophage', 'Neomet', 'Formet'],
    therapeuticClass: 'Oral Hypoglycemic / Antidiabetic',
    standardDose: '500 mg',
    dosageForms: ['Tablet 500mg', 'Tablet 850mg', 'XR Tablet 500mg'],
    commonFrequency: 'Twice daily',
    instructions: 'Take with or immediately after meals to reduce gastrointestinal upset.',
    warnings: 'Avoid excessive alcohol consumption. Monitor renal function periodically.',
  },
  {
    id: 'pndf-2',
    genericName: 'Losartan Potassium',
    brandNames: ['Cozaar', 'Lifezar', 'Arbloc'],
    therapeuticClass: 'Antihypertensive (ARB)',
    standardDose: '50 mg',
    dosageForms: ['Tablet 50mg', 'Tablet 100mg'],
    commonFrequency: 'Once daily',
    instructions: 'Take at the same time each morning, with or without food.',
    warnings: 'Do not use during pregnancy. Regular blood pressure monitoring required.',
  },
  {
    id: 'pndf-3',
    genericName: 'Salbutamol Sulfate',
    brandNames: ['Ventolin', 'Asmalin', 'Combivent'],
    therapeuticClass: 'Bronchodilator / Beta-2 Agonist',
    standardDose: '100 mcg/actuation',
    dosageForms: ['MDI Inhaler 100mcg', 'Nebule 2.5mg/2.5mL', 'Tablet 2mg'],
    commonFrequency: '1-2 puffs as needed every 4-6 hours for acute asthma symptoms',
    instructions: 'Rinse mouth after use. Shake canister well before each inhalation.',
    warnings: 'Report severe tremors or rapid heart rate if symptoms persist.',
  },
  {
    id: 'pndf-4',
    genericName: 'Amoxicillin Trihydrate',
    brandNames: ['Himox', 'Amoxil', 'Novamox'],
    therapeuticClass: 'Broad-spectrum Antibacterial (Penicillin)',
    standardDose: '500 mg',
    dosageForms: ['Capsule 500mg', 'Suspension 250mg/5mL'],
    commonFrequency: 'Every 8 hours for 7 days',
    instructions: 'Complete full prescribed course even if symptoms resolve earlier.',
    warnings: 'Contraindicated in penicillin-allergic patients.',
  },
  {
    id: 'pndf-5',
    genericName: 'Cetirizine Dihydrochloride',
    brandNames: ['Alnix', 'Virlix', 'Zyrtec'],
    therapeuticClass: 'Antihistamine (2nd Generation)',
    standardDose: '10 mg',
    dosageForms: ['Tablet 10mg', 'Syrup 5mg/5mL'],
    commonFrequency: 'Once daily at bedtime',
    instructions: 'Take with a glass of water before sleeping.',
    warnings: 'May cause mild drowsiness in sensitive individuals.',
  },
  {
    id: 'pndf-6',
    genericName: 'Paracetamol',
    brandNames: ['Biogesic', 'Tempra', 'Calpol'],
    therapeuticClass: 'Analgesic / Antipyretic',
    standardDose: '500 mg',
    dosageForms: ['Tablet 500mg', 'Syrup 250mg/5mL', 'Drops 100mg/mL'],
    commonFrequency: 'Every 4-6 hours as needed for fever or pain (max 4g/day)',
    instructions: 'Take with or without food. Do not exceed maximum daily dose.',
    warnings: 'Overdose carries risk of severe hepatic impairment.',
  },
  {
    id: 'pndf-7',
    genericName: 'Mefenamic Acid',
    brandNames: ['Ponstan', 'Dolfenal', 'Gardan'],
    therapeuticClass: 'Non-steroidal Anti-inflammatory (NSAID)',
    standardDose: '500 mg',
    dosageForms: ['Capsule 250mg', 'Tablet 500mg'],
    commonFrequency: 'Every 8 hours with meals',
    instructions: 'Strictly take after food to avoid gastric irritation.',
    warnings: 'Limit continuous use to 7 days maximum.',
  },
  {
    id: 'pndf-8',
    genericName: 'Omeprazole',
    brandNames: ['Losec', 'Omepron', 'Omebloc'],
    therapeuticClass: 'Proton Pump Inhibitor (Anti-ulcer)',
    standardDose: '20 mg',
    dosageForms: ['Capsule 20mg', 'Capsule 40mg'],
    commonFrequency: 'Once daily 30 minutes before breakfast',
    instructions: 'Swallow whole with water. Do not crush or chew beads.',
    warnings: 'Notify doctor if experiencing prolonged heartburn or indigestion.',
  },
  {
    id: 'pndf-9',
    genericName: 'Amlodipine Besylate',
    brandNames: ['Norvasc', 'Provasc', 'Vasalat'],
    therapeuticClass: 'Calcium Channel Blocker (Antihypertensive)',
    standardDose: '5 mg',
    dosageForms: ['Tablet 5mg', 'Tablet 10mg'],
    commonFrequency: 'Once daily in the morning',
    instructions: 'Take consistently at the same time each day.',
    warnings: 'Watch for ankle swelling or peripheral edema.',
  },
  {
    id: 'pndf-10',
    genericName: 'Montelukast Sodium',
    brandNames: ['Singulair', 'Kastair', 'Montair'],
    therapeuticClass: 'Leukotriene Receptor Antagonist',
    standardDose: '10 mg',
    dosageForms: ['Film-coated Tablet 10mg', 'Chewable Tablet 5mg'],
    commonFrequency: 'Once daily in the evening',
    instructions: 'For chronic maintenance of asthma and allergic rhinitis.',
    warnings: 'Not for immediate treatment of acute bronchospasm.',
  },
];

export interface SamplePrescription {
  id: string;
  title: string;
  doctor: string;
  clinic: string;
  licenseNumber: string;
  ptrNumber: string;
  date: string;
  patientName: string;
  patientId: string;
  medicationName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: string;
  instructions: string;
  rawOcrText: string;
}

export const SAMPLE_PRESCRIPTIONS: SamplePrescription[] = [
  {
    id: 'sample-rx-1',
    title: 'CSU Health Services - Chronic Care (Metformin)',
    doctor: 'Dr. Mary Rose Santos, MD, FPCP',
    clinic: 'University Center for Health and Wellness (UCHW), Caraga State University',
    licenseNumber: 'PRC No. 0129841',
    ptrNumber: 'PTR 8421092',
    date: '2026-04-10',
    patientName: 'Kylle Mae Mercado',
    patientId: 'CSU-2022-0941',
    medicationName: 'Metformin HCl 500mg',
    genericName: 'Metformin Hydrochloride',
    dosage: '500 mg',
    frequency: 'Twice daily (8:00 AM & 7:00 PM)',
    duration: '30 Days',
    quantity: '60 Tablets',
    instructions: 'Take 1 tablet with or after meals (Breakfast and Dinner).',
    rawOcrText: `CARAGA STATE UNIVERSITY - MAIN CAMPUS
UNIVERSITY CENTER FOR HEALTH AND WELLNESS (UCHW)
Ampayon, Butuan City, Agusan del Norte

PATIENT: Kylle Mae Mercado      DATE: 2026-04-10
STUDENT ID: CSU-2022-0941       AGE: 21  SEX: F
DIAGNOSIS: Prediabetes / Metabolic Management

Rx:
Metformin HCl 500mg Tablet #60
Sig: Take 1 tab BID pc (Breakfast & Dinner)

Dr. Mary Rose Santos, MD
License: 0129841 | PTR: 8421092`,
  },
  {
    id: 'sample-rx-2',
    title: 'CSU Health Services - Respiratory (Salbutamol MDI)',
    doctor: 'Dr. James Presbitero, MD',
    clinic: 'University Center for Health and Wellness (UCHW)',
    licenseNumber: 'PRC No. 0087412',
    ptrNumber: 'PTR 5521401',
    date: '2026-04-12',
    patientName: 'Kylle Mae Mercado',
    patientId: 'CSU-2022-0941',
    medicationName: 'Salbutamol Sulfate 100mcg',
    genericName: 'Salbutamol Sulfate',
    dosage: '100 mcg/puff',
    frequency: 'As needed for wheezing/dyspnea',
    duration: '60 Days',
    quantity: '1 Canister (200 doses)',
    instructions: 'Inhale 2 puffs PRN for shortness of breath. Rinse mouth after.',
    rawOcrText: `CARAGA STATE UNIVERSITY HEALTH SERVICES
STUDENT HEALTH & CLINICAL RECORDS

NAME: Kylle Mae Mercado         DATE: April 12, 2026
COURSE: BSIT 4-A                UCHW CLINIC #04

Rx:
Salbutamol 100mcg Inhaler (Ventolin MDI)
Sig: Inhale 2 puffs q4-6h PRN dyspnea

Refill: 1x
Dr. James Presbitero, MD
PRC: 0087412`,
  },
  {
    id: 'sample-rx-3',
    title: 'CSU Health Services - Acute Care (Amoxicillin)',
    doctor: 'Dr. Riah Encarnacion, MD',
    clinic: 'UCHW Primary Care Division',
    licenseNumber: 'PRC No. 0099431',
    ptrNumber: 'PTR 7741203',
    date: '2026-04-15',
    patientName: 'Kylle Mae Mercado',
    patientId: 'CSU-2022-0941',
    medicationName: 'Amoxicillin Trihydrate 500mg',
    genericName: 'Amoxicillin Trihydrate',
    dosage: '500 mg',
    frequency: 'Every 8 hours (8 AM, 4 PM, 12 MN)',
    duration: '7 Days',
    quantity: '21 Capsules',
    instructions: 'Take 1 capsule every 8 hours. Complete entire 7 days.',
    rawOcrText: `CSU UNIVERSITY CENTER FOR HEALTH AND WELLNESS
OUTPATIENT DEPARTMENT PRESCRIPTION

Patient: Kylle Mae Mercado      Date: 2026-04-15
Rx:
Amoxicillin 500mg Caps #21
Sig: 1 cap TID x 7 days
Complete full course.

Dr. Riah Encarnacion, MD
PRC Lic. 0099431`,
  },
];

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

export interface MedicationItem {
  id: string;
  name: string;
  genericName: string;
  brandName?: string;
  dosage: string;
  frequency: string;
  times: string[];
  instructions: string;
  color: string;
  shape: 'round' | 'capsule' | 'inhaler' | 'oval';
  pillsRemaining: number;
  totalPills: number;
  refillThreshold: number;
  adherenceRate: number; // 0-100
  prescribingDoctor: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isPRN?: boolean; // As needed
}

// Static initial data removed — all data loads live from Neon database via src/services/neon.ts

export interface ScheduledDose {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime';
  instructions: string;
  status: 'pending' | 'taken' | 'snoozed' | 'missed';
  takenAt?: string;
  color: string;
}

// Static initial data removed — all data loads live from Neon database via src/services/neon.ts

export interface ChatMessage {
  id: string;
  sender: 'student' | 'provider';
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  status?: 'sent' | 'delivered' | 'read';
  category?: 'general' | 'refill' | 'adverse_reaction' | 'appointment';
}

// Static initial data removed — all data loads live from Neon database via src/services/neon.ts

export interface ProviderPatient {
  id: string;
  studentId: string;
  name: string;
  course: string;
  yearLevel: string;
  chronicCondition: string;
  adherenceRate: number;
  status: 'Consistent' | 'Normal' | 'Critical';
  lastDoseTime: string;
  activeMedicationsCount: number;
  avatarInitials: string;
  prescriptions: string[];
  contact: string;
}

// Static initial data removed — all data loads live from Neon database via src/services/neon.ts

export interface ClinicalAlert {
  id: string;
  type: 'missed_dose' | 'low_inventory' | 'reading_anomaly' | 'security';
  priority: 'high' | 'medium' | 'low';
  title: string;
  subtitle: string;
  patientName: string;
  patientId?: string;
  timestamp: string;
  resolved: boolean;
}

// Static initial data removed — all data loads live from Neon database via src/services/neon.ts

export interface ClinicInventoryItem {
  id: string;
  name: string;
  category: string;
  dosage: string;
  stockLevel: number;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Critical Depletion';
  incomingShipment?: string;
}

// Static initial data removed — all data loads live from Neon database via src/services/neon.ts

export interface SusQuestion {
  id: number;
  text: string;
  isPositive: boolean; // odd items are positive, even are negative
}

export const SUS_QUESTIONS: SusQuestion[] = [
  { id: 1, text: 'I think that I would like to use this system frequently.', isPositive: true },
  { id: 2, text: 'I found the system unnecessarily complex.', isPositive: false },
  { id: 3, text: 'I thought the system was easy to use.', isPositive: true },
  { id: 4, text: 'I think that I would need the support of a technical person to use this system.', isPositive: false },
  { id: 5, text: 'I found the various functions in this system were well integrated.', isPositive: true },
  { id: 6, text: 'I thought there was too much inconsistency in this system.', isPositive: false },
  { id: 7, text: 'I would imagine that most people would learn to use this system very quickly.', isPositive: true },
  { id: 8, text: 'I found the system very cumbersome to use.', isPositive: false },
  { id: 9, text: 'I felt very confident using the system.', isPositive: true },
  { id: 10, text: 'I needed to learn a lot of things before I could get going with this system.', isPositive: false },
];
