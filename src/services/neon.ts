import { neon } from '@neondatabase/serverless';
import {
  MedicationItem,
  ScheduledDose,
  ChatMessage,
  ClinicInventoryItem,
  INITIAL_MEDICATIONS,
  INITIAL_SCHEDULED_DOSES,
  INITIAL_MESSAGES,
  INITIAL_INVENTORY,
} from '@/data/pndf-data';
import { StudentProfile } from '@/context/PillPalContext';

const dbUrl = process.env.EXPO_PUBLIC_NEON_DATABASE_URL;

// Initialized neon client if URL is set and not a placeholder
export const sql = dbUrl && !dbUrl.includes('LETMEPUTTHEPASSWORD') && !dbUrl.includes('[password]')
  ? neon(dbUrl)
  : null;

export const isNeonReady = (): boolean => {
  return Boolean(sql);
};

/**
 * Health check test query
 */
export async function testNeonConnection(): Promise<{ success: boolean; version?: string; error?: string }> {
  if (!sql) {
    return {
      success: false,
      error: 'Neon is not configured. Please set your database password in .env (EXPO_PUBLIC_NEON_DATABASE_URL)',
    };
  }
  try {
    const result = await sql`SELECT version();`;
    return { success: true, version: result[0]?.version as string };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to connect to Neon database' };
  }
}

/**
 * Fetch Student Profile from "User" & "PatientProfile"
 */
export async function fetchStudentProfile(idNumber?: string): Promise<StudentProfile | null> {
  if (!sql) return null;
  try {
    let rows = idNumber
      ? await sql`
          SELECT 
            u."id" as user_id,
            u."firstName",
            u."lastName",
            u."email",
            p."id" as patient_id,
            p."idNumber",
            p."department",
            p."medicalConditions",
            p."emergencyContactName",
            p."emergencyContactPhone"
          FROM "User" u
          JOIN "PatientProfile" p ON u."id" = p."userId"
          WHERE p."idNumber" = ${idNumber}
          LIMIT 1;
        `
      : [];

    if (rows.length === 0) {
      // Load the primary/first patient record from Neon
      rows = await sql`
        SELECT 
          u."id" as user_id,
          u."firstName",
          u."lastName",
          u."email",
          p."id" as patient_id,
          p."idNumber",
          p."department",
          p."medicalConditions",
          p."emergencyContactName",
          p."emergencyContactPhone"
        FROM "User" u
        JOIN "PatientProfile" p ON u."id" = p."userId"
        LIMIT 1;
      `;
    }

    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      name: `${r.firstName} ${r.lastName}`.trim() || 'Student Patient',
      studentId: r.idNumber || 'CSU-PATIENT',
      course: r.department || 'Caraga State University',
      yearLevel: 'Student',
      campus: 'Caraga State University - Main Campus',
      email: r.email,
      chronicConditions: r.medicalConditions ? r.medicalConditions.split(', ') : ['Chronic Care'],
      emergencyContact: r.emergencyContactName ? `${r.emergencyContactName} (${r.emergencyContactPhone || ''})` : 'N/A',
      assignedDoctor: 'Dr. Mary Rose Santos, MD (CSU UCHW)',
    };
  } catch (err) {
    console.warn('[Neon] Error fetching student profile:', err);
    return null;
  }
}

/**
 * Fetch Medications from "Prescription" table
 */
export async function fetchMedications(idNumber?: string): Promise<MedicationItem[]> {
  if (!sql) return INITIAL_MEDICATIONS;
  try {
    let rows = idNumber
      ? await sql`
          SELECT 
            pr."id",
            pr."name",
            pr."dosage",
            pr."form",
            pr."instructions",
            pr."frequency",
            pr."scheduleTimes",
            pr."startDate",
            pr."endDate",
            pr."status",
            u."firstName" as doc_first,
            u."lastName" as doc_last
          FROM "Prescription" pr
          JOIN "PatientProfile" p ON pr."patientId" = p."id"
          LEFT JOIN "User" u ON pr."doctorId" = u."id"
          WHERE p."idNumber" = ${idNumber}
          ORDER BY pr."createdAt" DESC;
        `
      : [];

    if (rows.length === 0) {
      // Query active prescriptions directly from your database
      rows = await sql`
        SELECT 
          pr."id",
          pr."name",
          pr."dosage",
          pr."form",
          pr."instructions",
          pr."frequency",
          pr."scheduleTimes",
          pr."startDate",
          pr."endDate",
          pr."status",
          u."firstName" as doc_first,
          u."lastName" as doc_last
        FROM "Prescription" pr
        LEFT JOIN "User" u ON pr."doctorId" = u."id"
        ORDER BY pr."createdAt" DESC;
      `;
    }

    if (rows.length === 0) return INITIAL_MEDICATIONS;
    return rows.map((r, idx) => ({
      id: r.id,
      name: r.name,
      genericName: r.name.split(' ')[0] || r.name,
      dosage: r.dosage,
      frequency: r.frequency,
      times: r.scheduleTimes && r.scheduleTimes.length > 0 ? r.scheduleTimes : ['08:00 AM'],
      instructions: r.instructions || '',
      color: ['#0d9488', '#0284c7', '#6366f1', '#f59e0b'][idx % 4],
      shape: (r.form && r.form.toLowerCase().includes('inhaler') ? 'inhaler' : 'round') as any,
      pillsRemaining: 30,
      totalPills: 30,
      refillThreshold: 7,
      adherenceRate: 90,
      prescribingDoctor: r.doc_first ? `Dr. ${r.doc_first} ${r.doc_last} (CSU UCHW)` : 'Dr. Mary Rose Santos (CSU UCHW)',
      startDate: r.startDate ? new Date(r.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      isActive: r.status === 'ACTIVE',
      isPRN: r.frequency ? r.frequency.toLowerCase().includes('prn') || r.frequency.toLowerCase().includes('as needed') : false,
    }));
  } catch (err) {
    console.warn('[Neon] Error fetching prescriptions:', err);
    return INITIAL_MEDICATIONS;
  }
}

/**
 * Save Medication into "Prescription"
 */
export async function saveMedication(idNumber: string, med: MedicationItem): Promise<boolean> {
  if (!sql) return false;
  try {
    // Look up patient profile ID
    const pRows = await sql`SELECT "id" FROM "PatientProfile" WHERE "idNumber" = ${idNumber} LIMIT 1;`;
    if (pRows.length === 0) return false;
    const patientId = pRows[0].id;

    await sql`
      INSERT INTO "Prescription" (
        "id", "patientId", "name", "dosage", "form", "instructions", "frequency", "scheduleTimes", "status", "updatedAt"
      ) VALUES (
        ${med.id}, ${patientId}, ${med.name}, ${med.dosage}, ${med.shape}, ${med.instructions}, ${med.frequency}, ${med.times}, 'ACTIVE', NOW()
      )
      ON CONFLICT ("id") DO UPDATE SET
        "name" = EXCLUDED."name",
        "dosage" = EXCLUDED."dosage",
        "instructions" = EXCLUDED."instructions",
        "updatedAt" = NOW();
    `;
    return true;
  } catch (err) {
    console.warn('[Neon] Error saving prescription:', err);
    return false;
  }
}

/**
 * Delete Medication from "Prescription"
 */
export async function deleteMedicationFromDb(medId: string): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql`DELETE FROM "Prescription" WHERE "id" = ${medId};`;
    return true;
  } catch (err) {
    console.warn('[Neon] Error deleting prescription:', err);
    return false;
  }
}

/**
 * Fetch Scheduled Doses from "AdherenceLog"
 */
export async function fetchScheduledDoses(idNumber?: string): Promise<ScheduledDose[]> {
  if (!sql) return INITIAL_SCHEDULED_DOSES;
  try {
    let rows = idNumber
      ? await sql`
          SELECT 
            a."id",
            a."prescriptionId",
            a."scheduledTime",
            a."takenTime",
            a."status",
            pr."name" as med_name,
            pr."dosage",
            pr."instructions"
          FROM "AdherenceLog" a
          JOIN "PatientProfile" p ON a."patientId" = p."id"
          JOIN "Prescription" pr ON a."prescriptionId" = pr."id"
          WHERE p."idNumber" = ${idNumber}
          ORDER BY a."scheduledTime" ASC;
        `
      : [];

    if (rows.length === 0) {
      // Query adherence logs from Neon
      rows = await sql`
        SELECT 
          a."id",
          a."prescriptionId",
          a."scheduledTime",
          a."takenTime",
          a."status",
          pr."name" as med_name,
          pr."dosage",
          pr."instructions"
        FROM "AdherenceLog" a
        JOIN "Prescription" pr ON a."prescriptionId" = pr."id"
        ORDER BY a."scheduledTime" ASC;
      `;
    }

    if (rows.length === 0) return INITIAL_SCHEDULED_DOSES;
    return rows.map((r, idx) => {
      let timeStr = '08:00 AM';
      if (r.scheduledTime) {
        const d = new Date(r.scheduledTime);
        timeStr = isNaN(d.getTime()) ? String(r.scheduledTime) : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      const slot = timeStr.includes('PM') ? (parseInt(timeStr) >= 9 ? 'Bedtime' : 'Evening') : 'Morning';
      return {
        id: r.id,
        medicationId: r.prescriptionId,
        medicationName: r.med_name || 'Medicine',
        dosage: r.dosage || '',
        scheduledTime: timeStr,
        timeSlot: slot as any,
        status: (r.status === 'TAKEN' ? 'taken' : r.status === 'SKIPPED' ? 'snoozed' : 'pending') as any,
        takenAt: r.takenTime ? new Date(r.takenTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        instructions: r.instructions || '',
        color: ['#0d9488', '#0284c7', '#6366f1', '#f59e0b'][idx % 4],
      };
    });
  } catch (err) {
    console.warn('[Neon] Error fetching adherence logs:', err);
    return INITIAL_SCHEDULED_DOSES;
  }
}

/**
 * Update Dose Status in "AdherenceLog"
 */
export async function updateDoseInDb(doseId: string, status: 'taken' | 'snoozed', takenAt?: string): Promise<boolean> {
  if (!sql) return false;
  try {
    const dbStatus = status === 'taken' ? 'TAKEN' : 'SKIPPED';
    await sql`
      UPDATE "AdherenceLog"
      SET "status" = ${dbStatus}::"AdherenceStatus", "takenTime" = NOW()
      WHERE "id" = ${doseId};
    `;
    return true;
  } catch (err) {
    console.warn('[Neon] Error updating adherence log:', err);
    return false;
  }
}

/**
 * Fetch Chat Messages from "Message" & "Conversation"
 */
export async function fetchChatMessages(): Promise<ChatMessage[]> {
  if (!sql) return INITIAL_MESSAGES;
  try {
    const rows = await sql`
      SELECT 
        m."id",
        m."senderId",
        m."content",
        m."createdAt",
        m."isRead",
        u."role",
        u."firstName",
        u."lastName"
      FROM "Message" m
      LEFT JOIN "User" u ON m."senderId" = u."id"
      ORDER BY m."createdAt" ASC
      LIMIT 50;
    `;
    if (rows.length === 0) return INITIAL_MESSAGES;
    return rows.map(r => ({
      id: r.id,
      sender: r.role === 'DOCTOR' || r.role === 'HEALTH_STAFF' ? 'provider' : 'student',
      senderName: r.firstName ? `${r.firstName} ${r.lastName}` : 'UCHW Clinical Staff',
      content: r.content,
      timestamp: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: r.isRead,
      category: 'general',
    }));
  } catch (err) {
    console.warn('[Neon] Error fetching messages:', err);
    return INITIAL_MESSAGES;
  }
}

/**
 * Insert a Chat Message into "Message"
 */
export async function insertChatMessage(studentId: string, msg: ChatMessage): Promise<boolean> {
  if (!sql) return false;
  try {
    // Find active conversation
    const cRows = await sql`SELECT "id" FROM "Conversation" ORDER BY "createdAt" DESC LIMIT 1;`;
    let convId = cRows[0]?.id;
    if (!convId) {
      convId = `conv-${Date.now()}`;
      await sql`INSERT INTO "Conversation" ("id", "updatedAt") VALUES (${convId}, NOW());`;
    }

    // Find student user id
    const uRows = await sql`
      SELECT u."id" FROM "User" u
      JOIN "PatientProfile" p ON u."id" = p."userId"
      WHERE p."idNumber" = ${studentId}
      LIMIT 1;
    `;
    const senderId = uRows[0]?.id || `usr-${Date.now()}`;

    await sql`
      INSERT INTO "Message" (
        "id", "conversationId", "senderId", "content", "isRead", "messageType"
      ) VALUES (
        ${msg.id}, ${convId}, ${senderId}, ${msg.content}, false, 'TEXT'
      );
    `;
    return true;
  } catch (err) {
    console.warn('[Neon] Error inserting message:', err);
    return false;
  }
}

/**
 * Fetch Clinic Inventory from "InventoryItem"
 */
export async function fetchClinicInventory(): Promise<ClinicInventoryItem[]> {
  if (!sql) return INITIAL_INVENTORY;
  try {
    const rows = await sql`
      SELECT "id", "name", "brandName", "strength", "form", "category", "currentStock", "minimumStock", "status"
      FROM "InventoryItem"
      ORDER BY "name" ASC;
    `;
    if (rows.length === 0) return INITIAL_INVENTORY;
    return rows.map(r => ({
      id: r.id,
      medicationName: r.name,
      genericName: r.brandName || r.name,
      dosage: r.strength || '',
      category: (r.category || 'Chronic Maintenance') as any,
      stockLevel: r.currentStock,
      reorderThreshold: r.minimumStock,
      unit: r.form || 'Tablets',
      status: r.currentStock <= 0 ? 'Critical' : r.currentStock <= r.minimumStock ? 'Low Stock' : 'In Stock',
      lastRestocked: 'Recently',
    }));
  } catch (err) {
    console.warn('[Neon] Error fetching inventory items:', err);
    return INITIAL_INVENTORY;
  }
}
