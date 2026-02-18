// Mock data for demonstration purposes
import {
  Company,
  Vehicle,
  WorkEntry,
  DashboardStats,
  TeamUser,
  TeamMessage,
  ChatChannel,
  Staff,
  Reservation,
  Shift,
  LeaveRequest,
  ShiftChangeRequest,
} from "../types";

export const companies: Company[] = [
  { id: "1", name: "Goldcar", color: "#F59E0B" },
  { id: "2", name: "Europcar", color: "#10B981" },
];

// Empty vehicles - new ones will be added
export const mockVehicles: Vehicle[] = [];

// Empty work entries - new ones will be added
export const mockWorkEntries: WorkEntry[] = [];

export const mockDashboardStats: DashboardStats = {
  totalVehicles: 0,
  todayEntries: 0,
  pendingWork: 0,
  avgDuration: 0,
  company1Count: 0,
  company2Count: 0,
  completedToday: 0,
  revenue: 0,
};

export const workTypeLabels: Record<string, string> = {
  "premium-full": "Premium Πλήρης",
  "exterior-only": "Εξωτερικό Μόνο",
  "interior-only": "Εσωτερικό Μόνο",
  disinfection: "Απολύμανση",
  wax: "Κερί",
  detailing: "Detailing",
};

export const statusLabels: Record<string, string> = {
  active: "Ενεργό",
  pending: "Εκκρεμεί",
  completed: "Ολοκληρώθηκε",
  maintenance: "Συντήρηση",
};

// Team Chat Mock Data - Empty (new users will be added)
export const mockTeamUsers: TeamUser[] = [];

// Empty chat channels - channels will be created by users
export const mockChatChannels: ChatChannel[] = [];

// Empty messages - new conversations will start fresh
export const mockTeamMessages: Record<string, TeamMessage[]> = {};

// Staff Management Data - Empty (new staff will be added)
export const mockStaff: Staff[] = [];

// Reservations - Empty (will be uploaded via Excel)
export const mockReservations: Reservation[] = [];

// Shifts - Empty (will be auto-generated from reservations)
export const mockShifts: Shift[] = [];

// Leave Requests - Empty
export const mockLeaveRequests: LeaveRequest[] = [];

// Shift Change Requests - Empty
export const mockShiftChangeRequests: ShiftChangeRequest[] = [];
