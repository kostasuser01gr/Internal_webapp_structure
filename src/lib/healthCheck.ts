import { 
  Vehicle, 
  Staff, 
  Shift, 
  Reservation, 
  LeaveRequest,
  HealthCheckIssue,
  HealthCheckResult,
  HealthCheckStatus
} from '../types';
import { generateId } from './utils';
import { format, isAfter, isBefore, isWithinInterval, parseISO } from 'date-fns';

export class HealthCheckService {
  /**
   * Run a comprehensive health check on all application data
   */
  static runHealthCheck(
    vehicles: Vehicle[],
    staff: Staff[],
    shifts: Shift[],
    reservations: Reservation[],
    leaveRequests: LeaveRequest[]
  ): HealthCheckResult {
    const issues: HealthCheckIssue[] = [];

    // Run all checks
    issues.push(...this.checkDuplicateVehicles(vehicles));
    issues.push(...this.checkDuplicateStaff(staff));
    issues.push(...this.checkDuplicateShifts(shifts));
    issues.push(...this.checkOverlappingShifts(shifts, staff));
    issues.push(...this.checkConflictingLeaveRequests(leaveRequests, shifts, staff));
    issues.push(...this.checkOrphanedReservations(reservations, shifts));
    issues.push(...this.checkDataIntegrity(vehicles, staff, shifts, reservations));
    issues.push(...this.checkPerformance(vehicles, staff, shifts, reservations));
    issues.push(...this.checkCapacityIssues(shifts, reservations, staff));

    // Determine overall status
    const status = this.determineOverallStatus(issues);

    // Calculate metrics
    const metrics = {
      totalVehicles: vehicles.length,
      totalStaff: staff.length,
      totalShifts: shifts.length,
      totalReservations: reservations.length,
      duplicates: issues.filter(i => i.title.toLowerCase().includes('duplicate')).length,
      conflicts: issues.filter(i => i.category === 'conflicts').length,
      performanceScore: this.calculatePerformanceScore(issues, vehicles, staff, shifts, reservations)
    };

    return {
      status,
      lastCheck: new Date(),
      issues,
      metrics
    };
  }

  /**
   * Check for duplicate vehicles based on license plate
   */
  private static checkDuplicateVehicles(vehicles: Vehicle[]): HealthCheckIssue[] {
    const issues: HealthCheckIssue[] = [];
    const plateMap = new Map<string, string[]>();

    vehicles.forEach(vehicle => {
      const normalizedPlate = vehicle.licensePlate.trim().toUpperCase().replace(/\s+/g, '');
      if (!plateMap.has(normalizedPlate)) {
        plateMap.set(normalizedPlate, []);
      }
      plateMap.get(normalizedPlate)!.push(vehicle.id);
    });

    plateMap.forEach((ids, plate) => {
      if (ids.length > 1) {
        issues.push({
          id: generateId(),
          category: 'data-integrity',
          severity: 'critical',
          title: `Διπλότυπη Πινακίδα: ${plate}`,
          description: `Βρέθηκαν ${ids.length} οχήματα με την ίδια πινακίδα. Αυτό μπορεί να προκαλέσει σύγχυση στην καταγραφή.`,
          affectedItems: ids,
          autoFixable: true,
          timestamp: new Date()
        });
      }
    });

    return issues;
  }

  /**
   * Check for duplicate staff based on email
   */
  private static checkDuplicateStaff(staff: Staff[]): HealthCheckIssue[] {
    const issues: HealthCheckIssue[] = [];
    const emailMap = new Map<string, string[]>();
    const phoneMap = new Map<string, string[]>();

    staff.forEach(member => {
      const normalizedEmail = member.email.trim().toLowerCase();
      const normalizedPhone = member.phone.trim().replace(/\s+/g, '');

      if (!emailMap.has(normalizedEmail)) {
        emailMap.set(normalizedEmail, []);
      }
      emailMap.get(normalizedEmail)!.push(member.id);

      if (!phoneMap.has(normalizedPhone)) {
        phoneMap.set(normalizedPhone, []);
      }
      phoneMap.get(normalizedPhone)!.push(member.id);
    });

    emailMap.forEach((ids, email) => {
      if (ids.length > 1) {
        issues.push({
          id: generateId(),
          category: 'data-integrity',
          severity: 'critical',
          title: `Διπλότυπο Email: ${email}`,
          description: `Βρέθηκαν ${ids.length} μέλη προσωπικού με το ίδιο email.`,
          affectedItems: ids,
          autoFixable: true,
          timestamp: new Date()
        });
      }
    });

    phoneMap.forEach((ids, phone) => {
      if (ids.length > 1) {
        issues.push({
          id: generateId(),
          category: 'data-integrity',
          severity: 'warning',
          title: `Διπλότυπο Τηλέφωνο: ${phone}`,
          description: `Βρέθηκαν ${ids.length} μέλη προσωπικού με το ίδιο τηλέφωνο.`,
          affectedItems: ids,
          autoFixable: false,
          timestamp: new Date()
        });
      }
    });

    return issues;
  }

  /**
   * Check for duplicate shifts
   */
  private static checkDuplicateShifts(shifts: Shift[]): HealthCheckIssue[] {
    const issues: HealthCheckIssue[] = [];
    const shiftMap = new Map<string, string[]>();

    shifts.forEach(shift => {
      const key = `${shift.staffId}-${format(shift.date, 'yyyy-MM-dd')}-${shift.startTime}-${shift.endTime}`;
      if (!shiftMap.has(key)) {
        shiftMap.set(key, []);
      }
      shiftMap.get(key)!.push(shift.id);
    });

    shiftMap.forEach((ids, key) => {
      if (ids.length > 1) {
        issues.push({
          id: generateId(),
          category: 'data-integrity',
          severity: 'warning',
          title: `Διπλότυπη Βάρδια`,
          description: `Βρέθηκαν ${ids.length} ίδιες βάρδιες. Αυτό μπορεί να προκαλέσει προβλήματα στην κατανομή εργασίας.`,
          affectedItems: ids,
          autoFixable: true,
          timestamp: new Date()
        });
      }
    });

    return issues;
  }

  /**
   * Check for overlapping shifts for the same staff member
   */
  private static checkOverlappingShifts(shifts: Shift[], staff: Staff[]): HealthCheckIssue[] {
    const issues: HealthCheckIssue[] = [];
    const staffShifts = new Map<string, Shift[]>();

    // Group shifts by staff
    shifts.forEach(shift => {
      if (!staffShifts.has(shift.staffId)) {
        staffShifts.set(shift.staffId, []);
      }
      staffShifts.get(shift.staffId)!.push(shift);
    });

    // Check for overlaps
    staffShifts.forEach((memberShifts, staffId) => {
      const staffMember = staff.find(s => s.id === staffId);
      
      for (let i = 0; i < memberShifts.length; i++) {
        for (let j = i + 1; j < memberShifts.length; j++) {
          const shift1 = memberShifts[i];
          const shift2 = memberShifts[j];

          // Check if same day
          if (format(shift1.date, 'yyyy-MM-dd') === format(shift2.date, 'yyyy-MM-dd')) {
            const overlap = this.checkTimeOverlap(
              shift1.startTime,
              shift1.endTime,
              shift2.startTime,
              shift2.endTime
            );

            if (overlap) {
              issues.push({
                id: generateId(),
                category: 'conflicts',
                severity: 'critical',
                title: `Επικαλυπτόμενες Βάρδιες για ${staffMember?.name || 'Άγνωστο'}`,
                description: `Οι βάρδιες επικαλύπτονται στις ${format(shift1.date, 'dd/MM/yyyy')}: ${shift1.startTime}-${shift1.endTime} και ${shift2.startTime}-${shift2.endTime}`,
                affectedItems: [shift1.id, shift2.id],
                autoFixable: false,
                timestamp: new Date()
              });
            }
          }
        }
      }
    });

    return issues;
  }

  /**
   * Check for conflicting leave requests with scheduled shifts
   */
  private static checkConflictingLeaveRequests(
    leaveRequests: LeaveRequest[],
    shifts: Shift[],
    staff: Staff[]
  ): HealthCheckIssue[] {
    const issues: HealthCheckIssue[] = [];

    const approvedLeaves = leaveRequests.filter(lr => lr.status === 'approved');

    approvedLeaves.forEach(leave => {
      const staffMember = staff.find(s => s.id === leave.staffId);
      const conflictingShifts = shifts.filter(shift => {
        if (shift.staffId !== leave.staffId) return false;
        
        const shiftDate = shift.date;
        return isWithinInterval(shiftDate, {
          start: leave.startDate,
          end: leave.endDate
        });
      });

      if (conflictingShifts.length > 0) {
        issues.push({
          id: generateId(),
          category: 'conflicts',
          severity: 'critical',
          title: `Σύγκρουση Άδειας με Βάρδια για ${staffMember?.name || 'Άγνωστο'}`,
          description: `Υπάρχουν ${conflictingShifts.length} προγραμματισμένες βάρδιες κατά τη διάρκεια της εγκεκριμένης άδειας (${format(leave.startDate, 'dd/MM/yyyy')} - ${format(leave.endDate, 'dd/MM/yyyy')})`,
          affectedItems: [leave.id, ...conflictingShifts.map(s => s.id)],
          autoFixable: true,
          timestamp: new Date()
        });
      }
    });

    return issues;
  }

  /**
   * Check for orphaned reservations (not assigned to any shift)
   */
  private static checkOrphanedReservations(
    reservations: Reservation[],
    shifts: Shift[]
  ): HealthCheckIssue[] {
    const issues: HealthCheckIssue[] = [];
    const assignedReservationIds = new Set<string>();

    shifts.forEach(shift => {
      shift.assignedReservations.forEach(resId => assignedReservationIds.add(resId));
    });

    const orphanedReservations = reservations.filter(
      res => res.status === 'confirmed' && !assignedReservationIds.has(res.id)
    );

    if (orphanedReservations.length > 0) {
      issues.push({
        id: generateId(),
        category: 'data-integrity',
        severity: 'warning',
        title: `${orphanedReservations.length} Κρατήσεις χωρίς Ανάθεση`,
        description: `Βρέθηκαν επιβεβαιωμένες κρατήσεις που δεν έχουν ανατεθεί σε καμία βάρδια.`,
        affectedItems: orphanedReservations.map(r => r.id),
        autoFixable: true,
        timestamp: new Date()
      });
    }

    return issues;
  }

  /**
   * Check general data integrity
   */
  private static checkDataIntegrity(
    vehicles: Vehicle[],
    staff: Staff[],
    shifts: Shift[],
    reservations: Reservation[]
  ): HealthCheckIssue[] {
    const issues: HealthCheckIssue[] = [];

    // Check for invalid vehicle statuses
    const invalidVehicles = vehicles.filter(v => !['active', 'pending', 'completed', 'maintenance'].includes(v.status));
    if (invalidVehicles.length > 0) {
      issues.push({
        id: generateId(),
        category: 'data-integrity',
        severity: 'warning',
        title: `Μη Έγκυρες Καταστάσεις Οχημάτων`,
        description: `${invalidVehicles.length} οχήματα έχουν μη έγκυρη κατάσταση.`,
        affectedItems: invalidVehicles.map(v => v.id),
        autoFixable: true,
        timestamp: new Date()
      });
    }

    // Check for inactive staff with scheduled future shifts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const inactiveStaff = staff.filter(s => s.status === 'inactive');
    inactiveStaff.forEach(staffMember => {
      const futureShifts = shifts.filter(
        shift => shift.staffId === staffMember.id && isAfter(shift.date, today)
      );

      if (futureShifts.length > 0) {
        issues.push({
          id: generateId(),
          category: 'data-integrity',
          severity: 'warning',
          title: `Ανενεργό Προσωπικό με Μελλοντικές Βάρδιες`,
          description: `Το μέλος ${staffMember.name} είναι ανενεργό αλλά έχει ${futureShifts.length} προγραμματισμένες βάρδιες.`,
          affectedItems: [staffMember.id, ...futureShifts.map(s => s.id)],
          autoFixable: true,
          timestamp: new Date()
        });
      }
    });

    // Check for missing company assignments in vehicles
    const vehiclesWithoutCompany = vehicles.filter(v => !v.companyId);
    if (vehiclesWithoutCompany.length > 0) {
      issues.push({
        id: generateId(),
        category: 'data-integrity',
        severity: 'info',
        title: `Οχήματα χωρίς Εταιρεία`,
        description: `${vehiclesWithoutCompany.length} οχήματα δεν έχουν ανατεθεί σε εταιρεία.`,
        affectedItems: vehiclesWithoutCompany.map(v => v.id),
        autoFixable: false,
        timestamp: new Date()
      });
    }

    return issues;
  }

  /**
   * Check performance and potential issues
   */
  private static checkPerformance(
    vehicles: Vehicle[],
    staff: Staff[],
    shifts: Shift[],
    reservations: Reservation[]
  ): HealthCheckIssue[] {
    const issues: HealthCheckIssue[] = [];

    // Check for large datasets
    if (vehicles.length > 4000) {
      issues.push({
        id: generateId(),
        category: 'performance',
        severity: 'warning',
        title: `Μεγάλος Αριθμός Οχημάτων`,
        description: `Έχετε ${vehicles.length} οχήματα. Συνιστάται αρχειοθέτηση των παλαιότερων για βελτίωση απόδοσης.`,
        affectedItems: [],
        autoFixable: false,
        timestamp: new Date()
      });
    }

    // Check for very old data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const oldVehicles = vehicles.filter(v => isBefore(v.createdAt, sixMonthsAgo) && v.status === 'completed');
    if (oldVehicles.length > 500) {
      issues.push({
        id: generateId(),
        category: 'performance',
        severity: 'info',
        title: `Παλαιά Ολοκληρωμένα Οχήματα`,
        description: `${oldVehicles.length} οχήματα έχουν ολοκληρωθεί πριν από 6+ μήνες και μπορούν να αρχειοθετηθούν.`,
        affectedItems: oldVehicles.map(v => v.id),
        autoFixable: true,
        timestamp: new Date()
      });
    }

    return issues;
  }

  /**
   * Check for capacity issues
   */
  private static checkCapacityIssues(
    shifts: Shift[],
    reservations: Reservation[],
    staff: Staff[]
  ): HealthCheckIssue[] {
    const issues: HealthCheckIssue[] = [];

    const activeWashers = staff.filter(s => s.role === 'washer' && s.status === 'active');

    // Check if there are days with too many reservations and not enough staff
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      return date;
    });

    next7Days.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayReservations = reservations.filter(
        r => format(r.reservationDate, 'yyyy-MM-dd') === dateStr && r.status !== 'cancelled'
      );
      const dayShifts = shifts.filter(
        s => format(s.date, 'yyyy-MM-dd') === dateStr && s.status !== 'cancelled'
      );

      if (dayReservations.length > 0 && dayShifts.length === 0) {
        issues.push({
          id: generateId(),
          category: 'conflicts',
          severity: 'critical',
          title: `Κρατήσεις χωρίς Προσωπικό - ${format(date, 'dd/MM/yyyy')}`,
          description: `Υπάρχουν ${dayReservations.length} κρατήσεις αλλά δεν υπάρχουν προγραμματισμένες βάρδιες.`,
          affectedItems: dayReservations.map(r => r.id),
          autoFixable: true,
          timestamp: new Date()
        });
      }

      // Check if too many reservations for available staff
      const totalMinutes = dayReservations.reduce((sum, r) => sum + r.estimatedDuration, 0);
      const availableMinutes = dayShifts.reduce((sum, s) => {
        const start = parseInt(s.startTime.split(':')[0]) * 60 + parseInt(s.startTime.split(':')[1]);
        const end = parseInt(s.endTime.split(':')[0]) * 60 + parseInt(s.endTime.split(':')[1]);
        return sum + (end - start);
      }, 0);

      if (totalMinutes > availableMinutes * 0.9) { // 90% capacity
        issues.push({
          id: generateId(),
          category: 'conflicts',
          severity: 'warning',
          title: `Υπερφόρτωση Προσωπικού - ${format(date, 'dd/MM/yyyy')}`,
          description: `Η εκτιμώμενη διάρκεια εργασιών (${Math.round(totalMinutes/60)}h) ξεπερνά το 90% της διαθέσιμης χωρητικότητας (${Math.round(availableMinutes/60)}h).`,
          affectedItems: [],
          autoFixable: false,
          timestamp: new Date()
        });
      }
    });

    return issues;
  }

  /**
   * Check if two time ranges overlap
   */
  private static checkTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const s1 = toMinutes(start1);
    const e1 = toMinutes(end1);
    const s2 = toMinutes(start2);
    const e2 = toMinutes(end2);

    return (s1 < e2 && e1 > s2);
  }

  /**
   * Determine overall status based on issues
   */
  private static determineOverallStatus(issues: HealthCheckIssue[]): HealthCheckStatus {
    if (issues.some(i => i.severity === 'critical')) return 'critical';
    if (issues.some(i => i.severity === 'warning')) return 'warning';
    if (issues.some(i => i.severity === 'info')) return 'info';
    return 'healthy';
  }

  /**
   * Calculate performance score (0-100)
   */
  private static calculatePerformanceScore(
    issues: HealthCheckIssue[],
    vehicles: Vehicle[],
    staff: Staff[],
    shifts: Shift[],
    reservations: Reservation[]
  ): number {
    let score = 100;

    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 15;
          break;
        case 'warning':
          score -= 5;
          break;
        case 'info':
          score -= 1;
          break;
      }
    });

    // Deduct points for large datasets
    if (vehicles.length > 4000) score -= 5;
    if (shifts.length > 1000) score -= 5;

    return Math.max(0, Math.min(100, score));
  }
}
