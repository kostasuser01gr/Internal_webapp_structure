import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  Download,
  Lightbulb,
  Zap,
  FileText,
  RefreshCw
} from 'lucide-react';
import { ChatMessage, Vehicle, WorkEntry, Staff, Shift, Reservation, LeaveRequest, DashboardStats } from '@/components/types';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  // Real data from the application
  vehicles?: Vehicle[];
  workEntries?: WorkEntry[];
  staff?: Staff[];
  shifts?: Shift[];
  reservations?: Reservation[];
  leaveRequests?: LeaveRequest[];
  stats?: DashboardStats;
  onActionTrigger?: (action: string, data?: any) => void;
}

type QueryCategory = 
  | 'stats' 
  | 'vehicles' 
  | 'shifts' 
  | 'staff' 
  | 'reservations' 
  | 'predictions' 
  | 'reports' 
  | 'help'
  | 'general';

interface AnalysisResult {
  category: QueryCategory;
  insights: string[];
  data?: any;
  suggestions?: string[];
  warnings?: string[];
}

export function ChatBot({ 
  isOpen, 
  onClose, 
  isMinimized, 
  onToggleMinimize,
  vehicles = [],
  workEntries = [],
  staff = [],
  shifts = [],
  reservations = [],
  leaveRequests = [],
  stats,
  onActionTrigger
}: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 **Γεια σας! Είμαι ο AI βοηθός σας**\n\nΕίμαι εδώ για να σας βοηθήσω με:\n\n🔍 **Αναλύσεις & Πληροφορίες**\n• Ζωντανά στατιστικά και τάσεις\n• Αναλυτικές αναφορές\n• Προβλέψεις και insights\n\n⚡ **Έξυπνες Προτάσεις**\n• Βελτιστοποίηση βαρδιών\n• Εντοπισμός προβλημάτων\n• Προληπτικές ενέργειες\n\n🎯 **Γρήγορες Ενέργειες**\n• Μαζικές λειτουργίες\n• Εξαγωγή αναφορών\n• Διαχείριση προσωπικού\n\nΤι θα θέλατε να μάθετε;',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Advanced Analytics Engine
  const analyzeData = (): AnalysisResult => {
    const insights: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Vehicle analysis
    const pendingVehicles = vehicles.filter(v => v.status === 'pending').length;
    const completedToday = workEntries.filter(w => {
      const today = new Date();
      return w.date.toDateString() === today.toDateString();
    }).length;

    // Staff analysis
    const activeStaff = staff.filter(s => s.status === 'active').length;
    const onLeaveStaff = staff.filter(s => s.status === 'on-leave').length;
    
    // Shift analysis
    const todayShifts = shifts.filter(s => {
      const today = new Date();
      return s.date.toDateString() === today.toDateString();
    });

    // Reservation analysis
    const pendingReservations = reservations.filter(r => r.status === 'pending').length;
    const todayReservations = reservations.filter(r => {
      const today = new Date();
      return r.reservationDate.toDateString() === today.toDateString();
    });

    // Revenue analysis
    const todayRevenue = workEntries
      .filter(w => {
        const today = new Date();
        return w.date.toDateString() === today.toDateString();
      })
      .reduce((sum, w) => sum + w.cost, 0);

    // Generate insights
    if (pendingVehicles > 5) {
      warnings.push(`⚠️ Υψηλός αριθμός εκκρεμών οχημάτων: ${pendingVehicles}`);
      suggestions.push('Εκχωρήστε περισσότερο προσωπικό στα εκκρεμή οχήματα');
    }

    if (todayShifts.length < todayReservations.length / 3) {
      warnings.push('⚠️ Ανεπαρκές προσωπικό για τις σημερινές κρατήσεις');
      suggestions.push('Δημιουργήστε επιπλέον βάρδιες ή καλέστε εφεδρικό προσωπικό');
    }

    if (onLeaveStaff > activeStaff * 0.3) {
      warnings.push(`⚠️ Πολλοί εργαζόμενοι σε άδεια: ${onLeaveStaff}`);
    }

    if (todayRevenue < 500 && completedToday > 0) {
      insights.push('💡 Τα έσοδα είναι χαμηλότερα από τον στόχο - προωθήστε premium υπηρεσίες');
    }

    if (completedToday > 20) {
      insights.push(`🎉 Εξαιρετική απόδοση σήμερα: ${completedToday} ολοκληρωμένες εργασίες!`);
    }

    return {
      category: 'stats',
      insights,
      warnings,
      suggestions,
      data: {
        vehicles: vehicles.length,
        pendingVehicles,
        completedToday,
        activeStaff,
        todayRevenue,
        todayReservations,
        pendingReservations
      }
    };
  };

  // Natural Language Query Parser
  const parseQuery = (query: string): QueryCategory => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.match(/στατιστικ|αναλυτ|αριθμ|πόσ|σύνολο|μέτρ/)) return 'stats';
    if (lowerQuery.match(/όχημα|αυτοκίνητ|πινακίδ|license/)) return 'vehicles';
    if (lowerQuery.match(/βάρδι|shift|ωράρι|προγραμμ/)) return 'shifts';
    if (lowerQuery.match(/προσωπικ|εργαζόμεν|τεχνικ|washer|staff/)) return 'staff';
    if (lowerQuery.match(/κράτησ|reservation|ραντεβού/)) return 'reservations';
    if (lowerQuery.match(/πρόβλεψ|τάση|μέλλον|predict/)) return 'predictions';
    if (lowerQuery.match(/αναφορ|report|εξαγωγ|export|pdf/)) return 'reports';
    if (lowerQuery.match(/βοήθει|help|πώς|τι μπορ/)) return 'help';
    
    return 'general';
  };

  // Enhanced Response Generator with Real Data
  const generateAIResponse = (userMessage: string): ChatMessage => {
    const category = parseQuery(userMessage);
    const lowerMsg = userMessage.toLowerCase();
    const analysis = analyzeData();

    // Update conversation context
    setConversationContext(prev => [...prev.slice(-5), userMessage]);

    // Category-based responses
    switch (category) {
      case 'stats':
        return generateStatsResponse(analysis);
      
      case 'vehicles':
        return generateVehiclesResponse(lowerMsg);
      
      case 'shifts':
        return generateShiftsResponse(lowerMsg);
      
      case 'staff':
        return generateStaffResponse(lowerMsg);
      
      case 'reservations':
        return generateReservationsResponse(lowerMsg);
      
      case 'predictions':
        return generatePredictionsResponse(analysis);
      
      case 'reports':
        return generateReportsResponse();
      
      case 'help':
        return generateHelpResponse();
      
      default:
        return generateSmartResponse(lowerMsg, analysis);
    }
  };

  const generateStatsResponse = (analysis: AnalysisResult): ChatMessage => {
    const { data } = analysis;
    const completionRate = data.vehicles > 0 
      ? ((data.completedToday / data.vehicles) * 100).toFixed(1) 
      : '0.0';

    let content = `📊 **Ζωντανή Επισκόπηση Συστήματος**\n\n`;
    content += `**Οχήματα**\n`;
    content += `• Συνολικά: ${data.vehicles}\n`;
    content += `• Εκκρεμή: ${data.pendingVehicles}\n`;
    content += `• Ολοκληρωμένα σήμερα: ${data.completedToday}\n`;
    content += `• Ποσοστό ολοκλήρωσης: ${completionRate}%\n\n`;
    
    content += `**Προσωπικό**\n`;
    content += `• Ενεργοί εργαζόμενοι: ${data.activeStaff}\n\n`;
    
    content += `**Έσοδα**\n`;
    content += `• Σήμερα: €${data.todayRevenue.toFixed(2)}\n`;
    content += `• Μέσος όρος ανά εργασία: €${data.completedToday > 0 ? (data.todayRevenue / data.completedToday).toFixed(2) : '0.00'}\n\n`;

    content += `**Κρατήσεις**\n`;
    content += `• Σήμερα: ${data.todayReservations}\n`;
    content += `• Εκκρεμείς: ${data.pendingReservations}\n`;

    if (analysis.warnings && analysis.warnings.length > 0) {
      content += `\n**⚠️ Προειδοποιήσεις**\n`;
      analysis.warnings.forEach(w => content += `${w}\n`);
    }

    if (analysis.suggestions && analysis.suggestions.length > 0) {
      content += `\n**💡 Προτάσεις**\n`;
      analysis.suggestions.forEach(s => content += `• ${s}\n`);
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      actions: [
        { type: 'report', label: '📄 Λήψη Αναφοράς', data: { type: 'daily-summary' } },
        { type: 'analysis', label: '📈 Εβδομαδιαία Ανάλυση', data: { type: 'weekly' } },
        { type: 'suggestion', label: '🔄 Ανανέωση', data: { action: 'refresh' } },
      ],
    };
  };

  const generateVehiclesResponse = (query: string): ChatMessage => {
    const pendingVehicles = vehicles.filter(v => v.status === 'pending');
    const recentVehicles = vehicles.slice(-5).reverse();
    
    let content = `🚗 **Διαχείριση Οχημάτων**\n\n`;
    
    if (query.includes('εκκρεμ') || query.includes('pending')) {
      content += `**Εκκρεμή Οχήματα: ${pendingVehicles.length}**\n\n`;
      
      if (pendingVehicles.length > 0) {
        pendingVehicles.slice(0, 5).forEach((v, i) => {
          content += `${i + 1}. **${v.licensePlate}**\n`;
          content += `   Κατάσταση: Εκκρεμεί\n`;
          if (v.notes) content += `   Σημείωση: ${v.notes}\n`;
          content += `\n`;
        });
        
        if (pendingVehicles.length > 5) {
          content += `...και ${pendingVehicles.length - 5} ακόμα\n`;
        }
      } else {
        content += `✅ Δεν υπάρχουν εκκρεμή οχήματα!\n`;
      }
    } else {
      content += `**Σύνολο: ${vehicles.length} οχήματα**\n\n`;
      content += `📊 **Κατανομή ανά κατάσταση:**\n`;
      const statusCounts = vehicles.reduce((acc, v) => {
        acc[v.status] = (acc[v.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(statusCounts).forEach(([status, count]) => {
        const statusLabels: Record<string, string> = {
          active: 'Ενεργά',
          pending: 'Εκκρεμή',
          completed: 'Ολοκληρωμένα',
          maintenance: 'Συντήρηση'
        };
        content += `• ${statusLabels[status] || status}: ${count}\n`;
      });

      if (recentVehicles.length > 0) {
        content += `\n**📝 Πρόσφατα:**\n`;
        recentVehicles.forEach((v, i) => {
          content += `${i + 1}. ${v.licensePlate} - ${v.status}\n`;
        });
      }
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      actions: pendingVehicles.length > 0 ? [
        { type: 'bulk-operation', label: '⚡ Μαζική Ενημέρωση', data: { type: 'update-pending' } },
        { type: 'report', label: '📋 Εξαγωγή Λίστας', data: { type: 'vehicle-list' } },
      ] : [
        { type: 'suggestion', label: '➕ Προσθήκη Οχήματος', data: { action: 'add-vehicle' } },
        { type: 'report', label: '📋 Εξαγωγή Όλων', data: { type: 'all-vehicles' } },
      ],
    };
  };

  const generateShiftsResponse = (query: string): ChatMessage => {
    const today = new Date();
    const todayShifts = shifts.filter(s => s.date.toDateString() === today.toDateString());
    const upcomingShifts = shifts.filter(s => s.date > today).slice(0, 5);
    
    let content = `📅 **Διαχείριση Βαρδιών**\n\n`;
    
    content += `**Σημερινές Βάρδιες: ${todayShifts.length}**\n\n`;
    
    if (todayShifts.length > 0) {
      const shiftsByType = todayShifts.reduce((acc, s) => {
        acc[s.type] = (acc[s.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      content += `📊 Κατανομή:\n`;
      Object.entries(shiftsByType).forEach(([type, count]) => {
        const typeLabels: Record<string, string> = {
          morning: 'Πρωινές',
          afternoon: 'Απογευματινές',
          night: 'Νυχτερινές',
          'full-day': 'Ολοήμερες'
        };
        content += `• ${typeLabels[type] || type}: ${count}\n`;
      });

      const confirmedShifts = todayShifts.filter(s => s.status === 'confirmed').length;
      const scheduledShifts = todayShifts.filter(s => s.status === 'scheduled').length;
      
      content += `\n✅ Επιβεβαιωμένες: ${confirmedShifts}\n`;
      content += `⏳ Προγραμματισμένες: ${scheduledShifts}\n`;
    } else {
      content += `⚠️ Δεν υπάρχουν προγραμματισμένες βάρδιες για σήμερα!\n`;
    }

    if (upcomingShifts.length > 0) {
      content += `\n**🔜 Επόμενες Βάρδιες:**\n`;
      upcomingShifts.forEach((s, i) => {
        const staffMember = staff.find(st => st.id === s.staffId);
        content += `${i + 1}. ${staffMember?.name || 'Άγνωστος'} - ${s.startTime} έως ${s.endTime}\n`;
      });
    }

    // Check for understaffing
    const todayReservations = reservations.filter(r => 
      r.reservationDate.toDateString() === today.toDateString()
    ).length;
    
    if (todayReservations > todayShifts.length * 3) {
      content += `\n⚠️ **Προειδοποίηση**: Ίσως χρειάζεστε επιπλέον προσωπικό!\n`;
      content += `Κρατήσεις: ${todayReservations} vs Βάρδιες: ${todayShifts.length}\n`;
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      actions: [
        { type: 'suggestion', label: '➕ Δημιουργία Βάρδιας', data: { action: 'create-shift' } },
        { type: 'analysis', label: '📊 Ανάλυση Βαρδιών', data: { type: 'shift-analysis' } },
        { type: 'report', label: '📅 Εβδομαδιαίο Πρόγραμμα', data: { type: 'weekly-schedule' } },
      ],
    };
  };

  const generateStaffResponse = (query: string): ChatMessage => {
    const activeStaff = staff.filter(s => s.status === 'active');
    const onLeaveStaff = staff.filter(s => s.status === 'on-leave');
    const pendingLeaveRequests = leaveRequests.filter(r => r.status === 'pending');
    
    let content = `👥 **Διαχείριση Προσωπικού**\n\n`;
    content += `**Σύνολο: ${staff.length} εργαζόμενοι**\n\n`;
    
    content += `📊 **Κατάσταση:**\n`;
    content += `• ✅ Ενεργοί: ${activeStaff.length}\n`;
    content += `• 🏖️ Σε άδεια: ${onLeaveStaff.length}\n`;
    content += `• ⏳ Αιτήματα αδειών: ${pendingLeaveRequests.length}\n\n`;

    if (activeStaff.length > 0) {
      const roleCount = activeStaff.reduce((acc, s) => {
        acc[s.role] = (acc[s.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      content += `**Κατανομή ρόλων:**\n`;
      Object.entries(roleCount).forEach(([role, count]) => {
        const roleLabels: Record<string, string> = {
          washer: 'Πλύντες',
          staff: 'Προσωπικό'
        };
        content += `• ${roleLabels[role] || role}: ${count}\n`;
      });
    }

    if (pendingLeaveRequests.length > 0) {
      content += `\n**⏰ Εκκρεμή Αιτήματα Αδειών:**\n`;
      pendingLeaveRequests.slice(0, 3).forEach((req, i) => {
        const staffMember = staff.find(s => s.id === req.staffId);
        const startDate = req.startDate.toLocaleDateString('el-GR');
        const endDate = req.endDate.toLocaleDateString('el-GR');
        content += `${i + 1}. ${staffMember?.name || 'Άγνωστος'}\n`;
        content += `   Περίοδος: ${startDate} - ${endDate}\n`;
        content += `   Τύπος: ${req.type}\n\n`;
      });
    }

    // Performance insights
    const todayWork = workEntries.filter(w => {
      const today = new Date();
      return w.date.toDateString() === today.toDateString();
    });

    if (todayWork.length > 0) {
      const technicianStats = todayWork.reduce((acc, w) => {
        const name = w.technicianName;
        if (!acc[name]) {
          acc[name] = { count: 0, revenue: 0 };
        }
        acc[name].count++;
        acc[name].revenue += w.cost;
        return acc;
      }, {} as Record<string, { count: number; revenue: number }>);

      const topPerformer = Object.entries(technicianStats).sort((a, b) => b[1].count - a[1].count)[0];
      
      if (topPerformer) {
        content += `\n🌟 **Top Performer Σήμερα:**\n`;
        content += `${topPerformer[0]} - ${topPerformer[1].count} εργασίες, €${topPerformer[1].revenue.toFixed(2)}\n`;
      }
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      actions: pendingLeaveRequests.length > 0 ? [
        { type: 'suggestion', label: '✅ Έγκριση Αδειών', data: { action: 'approve-leaves' } },
        { type: 'analysis', label: '📊 Απόδοση Προσωπικού', data: { type: 'staff-performance' } },
      ] : [
        { type: 'suggestion', label: '➕ Προσθήκη Προσωπικού', data: { action: 'add-staff' } },
        { type: 'report', label: '📋 Αναφορά Προσωπικού', data: { type: 'staff-report' } },
      ],
    };
  };

  const generateReservationsResponse = (query: string): ChatMessage => {
    const today = new Date();
    const todayReservations = reservations.filter(r => 
      r.reservationDate.toDateString() === today.toDateString()
    );
    const pendingReservations = reservations.filter(r => r.status === 'pending');
    const upcomingReservations = reservations.filter(r => r.reservationDate > today).slice(0, 5);
    
    let content = `📋 **Διαχείριση Κρατήσεων**\n\n`;
    content += `**Σήμερα: ${todayReservations.length} κρατήσεις**\n`;
    content += `**Εκκρεμείς: ${pendingReservations.length}**\n\n`;

    if (todayReservations.length > 0) {
      const statusCount = todayReservations.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      content += `📊 **Κατάσταση σημερινών:**\n`;
      Object.entries(statusCount).forEach(([status, count]) => {
        const statusLabels: Record<string, string> = {
          pending: '⏳ Εκκρεμείς',
          confirmed: '✅ Επιβεβαιωμένες',
          completed: '✔️ Ολοκληρωμένες',
          cancelled: '❌ Ακυρωμένες'
        };
        content += `${statusLabels[status] || status}: ${count}\n`;
      });

      // Time slot analysis
      const timeSlots = todayReservations.reduce((acc, r) => {
        const slot = r.timeSlot;
        acc[slot] = (acc[slot] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const busySlots = Object.entries(timeSlots)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      if (busySlots.length > 0) {
        content += `\n🕐 **Πιο πολυσύχναστες ώρες:**\n`;
        busySlots.forEach(([slot, count]) => {
          content += `• ${slot}: ${count} κρατήσεις\n`;
        });
      }
    }

    if (upcomingReservations.length > 0) {
      content += `\n**🔜 Επόμενες Κρατήσεις:**\n`;
      upcomingReservations.forEach((r, i) => {
        const date = r.reservationDate.toLocaleDateString('el-GR');
        content += `${i + 1}. ${r.vehicleLicensePlate} - ${date} (${r.timeSlot})\n`;
      });
    }

    // Capacity analysis
    const todayShifts = shifts.filter(s => s.date.toDateString() === today.toDateString());
    const capacity = todayShifts.length * 4; // Assume 4 cars per shift
    const utilizationRate = capacity > 0 ? ((todayReservations.length / capacity) * 100).toFixed(1) : '0.0';

    content += `\n**📈 Χρησιμοποίηση Δυναμικότητας:**\n`;
    content += `${utilizationRate}% (${todayReservations.length}/${capacity})\n`;

    if (parseFloat(utilizationRate) > 80) {
      content += `⚠️ Υψηλή πληρότητα - Εξετάστε επιπλέον βάρδιες!\n`;
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      actions: [
        { type: 'suggestion', label: '📥 Ανέβασμα Excel', data: { action: 'upload-reservations' } },
        { type: 'bulk-operation', label: '✅ Επιβεβαίωση Όλων', data: { type: 'confirm-all' } },
        { type: 'report', label: '📅 Πρόγραμμα Εβδομάδας', data: { type: 'weekly-reservations' } },
      ],
    };
  };

  const generatePredictionsResponse = (analysis: AnalysisResult): ChatMessage => {
    const todayWork = workEntries.filter(w => {
      const today = new Date();
      return w.date.toDateString() === today.toDateString();
    });

    const avgRevenue = todayWork.length > 0
      ? todayWork.reduce((sum, w) => sum + w.cost, 0) / todayWork.length
      : 0;

    const todayReservations = reservations.filter(r => {
      const today = new Date();
      return r.reservationDate.toDateString() === today.toDateString();
    });

    let content = `🔮 **Προβλέψεις & Τάσεις**\n\n`;
    
    // Revenue prediction
    const pendingReservationsCount = todayReservations.filter(r => r.status === 'pending').length;
    const projectedRevenue = avgRevenue * pendingReservationsCount;
    
    content += `💰 **Προβλεπόμενα Έσοδα Σήμερα:**\n`;
    content += `• Τρέχοντα: €${analysis.data.todayRevenue.toFixed(2)}\n`;
    content += `• Προβλεπόμενα: €${(analysis.data.todayRevenue + projectedRevenue).toFixed(2)}\n`;
    content += `• Εκκρεμείς εργασίες: ${pendingReservationsCount}\n\n`;

    // Workload prediction
    const avgDuration = todayWork.length > 0
      ? todayWork.reduce((sum, w) => sum + w.duration, 0) / todayWork.length
      : 45;

    const estimatedTimeRemaining = Math.round(pendingReservationsCount * avgDuration);
    
    content += `⏱️ **Εκτιμώμενος Χρόνος:**\n`;
    content += `• Υπολειπόμενος χρόνος: ~${estimatedTimeRemaining} λεπτά\n`;
    content += `• Μέση διάρκεια εργασίας: ${Math.round(avgDuration)} λεπτά\n\n`;

    // Trend analysis
    content += `📈 **Τάσεις:**\n`;
    
    if (todayWork.length > 10) {
      content += `• ↗️ Υψηλή δραστηριότητα σήμερα\n`;
    } else if (todayWork.length < 5) {
      content += `• ↘️ Χαμηλή δραστηριότητα σήμερα\n`;
    } else {
      content += `• → Κανονική δραστηριότητα\n`;
    }

    // Weekly prediction
    const weekdayRevenue = analysis.data.todayRevenue;
    const projectedWeekRevenue = weekdayRevenue * 6; // 6-day work week
    
    content += `\n📅 **Εβδομαδιαία Πρόβλεψη:**\n`;
    content += `• Προβλεπόμενα έσοδα εβδομάδας: €${projectedWeekRevenue.toFixed(2)}\n`;
    content += `• Βασισμένο σε σημερινή απόδοση\n\n`;

    // Recommendations
    content += `💡 **Συστάσεις:**\n`;
    
    if (projectedRevenue < 300) {
      content += `• Προωθήστε premium υπηρεσίες (κερί, detailing)\n`;
    }
    
    if (estimatedTimeRemaining > 240) {
      content += `• Εξετάστε την προσθήκη επιπλέον προσωπικού\n`;
    }
    
    if (todayReservations.length < 15) {
      content += `• Στείλτε προωθητικά μηνύματα σε πελάτες\n`;
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      actions: [
        { type: 'analysis', label: '📊 Λεπτομερής Ανάλυση', data: { type: 'detailed-forecast' } },
        { type: 'report', label: '📈 Trend Report', data: { type: 'trends' } },
      ],
    };
  };

  const generateReportsResponse = (): ChatMessage => {
    let content = `📄 **Διαθέσιμες Αναφορές**\n\n`;
    
    content += `**📊 Λειτουργικές Αναφορές:**\n`;
    content += `• Ημερήσια Ανακεφαλαίωση\n`;
    content += `• Εβδομαδιαία Ανάλυση\n`;
    content += `• Μηνιαία Αναφορά Εσόδων\n`;
    content += `• Απόδοση Προσωπικού\n\n`;
    
    content += `**🚗 Αναφορές Οχημάτων:**\n`;
    content += `• Λίστα Ενεργών Οχημάτων\n`;
    content += `• Ιστορικό Πλύσεων\n`;
    content += `• Οχήματα με Εκκρεμότητες\n`;
    content += `• Στατιστικά ανά Εταιρεία\n\n`;
    
    content += `**👥 Αναφορές Προσωπικού:**\n`;
    content += `• Πρόγραμμα Βαρδιών\n`;
    content += `• Καταγραφή Απουσιών\n`;
    content += `• Αιτήματα Αδειών\n`;
    content += `• KPIs Τεχνικών\n\n`;
    
    content += `**💰 Οικονομικές Αναφορές:**\n`;
    content += `• Ανάλυση Εσόδων\n`;
    content += `• Συγκριτικά Στατιστικά\n`;
    content += `• Προβλέψεις Εσόδων\n`;
    content += `• ROI ανά Υπηρεσία\n\n`;
    
    content += `Όλες οι αναφορές μπορούν να εξαχθούν σε Excel, PDF ή CSV format.\n`;

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      actions: [
        { type: 'report', label: '📥 Ημερήσια Αναφορά (Excel)', data: { type: 'daily', format: 'excel' } },
        { type: 'report', label: '📥 Εβδομαδιαία Αναφορά (PDF)', data: { type: 'weekly', format: 'pdf' } },
        { type: 'report', label: '📥 Οχήματα (CSV)', data: { type: 'vehicles', format: 'csv' } },
        { type: 'report', label: '📥 Προσωπικό (Excel)', data: { type: 'staff', format: 'excel' } },
      ],
    };
  };

  const generateHelpResponse = (): ChatMessage => {
    let content = `❓ **Οδηγός Χρήσης AI Βοηθού**\n\n`;
    
    content += `**🔍 Τι μπορώ να ρωτήσω:**\n\n`;
    
    content += `**Στατιστικά & Ανάλυση:**\n`;
    content += `• "Δείξε μου τα στατιστικά σήμερα"\n`;
    content += `• "Πόσα οχήματα έχουμε;"\n`;
    content += `• "Ποια είναι τα έσοδά μας;"\n`;
    content += `• "Ανάλυσε την απόδοση"\n\n`;
    
    content += `**Οχήματα:**\n`;
    content += `• "Ποια οχήματα εκκρεμούν;"\n`;
    content += `• "Λίστα όλων των οχημάτων"\n`;
    content += `• "Οχήματα που χρειάζονται προσοχή"\n\n`;
    
    content += `**Προσωπικό & Βάρδιες:**\n`;
    content += `• "Ποιος δουλεύει σήμερα;"\n`;
    content += `• "Πόσες βάρδιες έχουμε;"\n`;
    content += `• "Ποιος έχει άδεια;"\n`;
    content += `• "Αιτήματα αδειών"\n\n`;
    
    content += `**Κρατήσεις:**\n`;
    content += `• "Πόσες κρατήσεις έχουμε σήμερα;"\n`;
    content += `• "Εκκρεμείς κρατήσεις"\n`;
    content += `• "Πρόγραμμα της εβδομάδας"\n\n`;
    
    content += `**Προβλέψεις:**\n`;
    content += `• "Πρόβλεψε τα έσοδα"\n`;
    content += `• "Τάσεις και insights"\n`;
    content += `• "Τι αναμένεται;"\n\n`;
    
    content += `**Αναφορές:**\n`;
    content += `• "Δημιούργησε αναφορά"\n`;
    content += `• "Εξαγωγή δεδομένων"\n`;
    content += `• "Λήψη Excel/PDF"\n\n`;
    
    content += `💡 Μπορείτε να ρωτήσετε με φυσική γλώσσα - θα καταλάβω!\n`;

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      actions: [
        { type: 'suggestion', label: '📊 Δοκίμασε: Στατιστικά', data: { query: 'Δείξε μου στατιστικά' } },
        { type: 'suggestion', label: '🚗 Δοκίμασε: Οχήματα', data: { query: 'Ποια οχήματα εκκρεμούν' } },
        { type: 'suggestion', label: '🔮 Δοκίμασε: Προβλέψεις', data: { query: 'Πρόβλεψε τα έσοδα' } },
      ],
    };
  };

  const generateSmartResponse = (query: string, analysis: AnalysisResult): ChatMessage => {
    // Intelligent fallback with contextual suggestions
    let content = `Κατάλαβα την ερώτησή σας!\n\n`;
    
    // Provide relevant insights based on current data
    if (analysis.warnings && analysis.warnings.length > 0) {
      content += `⚠️ **Προσοχή:**\n`;
      analysis.warnings.forEach(w => content += `${w}\n`);
      content += `\n`;
    }

    content += `💡 **Μπορώ να σας βοηθήσω με:**\n\n`;
    content += `📊 "Δείξε μου στατιστικά" - Πλήρη επισκόπηση συστήματος\n`;
    content += `🚗 "Ποια οχήματα εκκρεμούν" - Εκκρεμή οχήματα\n`;
    content += `👥 "Πόσοι εργαζόμενοι είναι ενεργοί" - Κατάσταση προσωπικού\n`;
    content += `📅 "Σημερινές βάρδιες" - Πρόγραμμα ημέρας\n`;
    content += `🔮 "Πρόβλεψε τα έσοδα" - Προβλέψεις και τάσεις\n`;
    content += `📄 "Δημιούργησε αναφορά" - Εξαγωγή δεδομένων\n`;

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      actions: [
        { type: 'suggestion', label: '📊 Στατιστικά', data: { query: 'στατιστικά' } },
        { type: 'suggestion', label: '❓ Βοήθεια', data: { query: 'βοήθεια' } },
      ],
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking with realistic delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 400); // 800-1200ms delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionClick = (action: any) => {
    if (action.data?.query) {
      // Auto-fill suggested query
      setInput(action.data.query);
    } else if (onActionTrigger) {
      // Trigger action in parent component
      onActionTrigger(action.type, action.data);
    }
  };

  // Quick action suggestions based on current state
  const getQuickActions = () => {
    const actions = [];
    
    if (vehicles.filter(v => v.status === 'pending').length > 0) {
      actions.push({ label: '⚡ Εκκρεμή Οχήματα', query: 'Ποια οχήματα εκκρεμούν;' });
    }
    
    if (leaveRequests.filter(r => r.status === 'pending').length > 0) {
      actions.push({ label: '📋 Αιτήματα Αδειών', query: 'Αιτήματα αδειών' });
    }
    
    actions.push({ label: '📊 Στατιστικά', query: 'Δείξε μου στατιστικά' });
    actions.push({ label: '🔮 Προβλέψεις', query: 'Πρόβλεψε τα έσοδα' });
    
    return actions;
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isMinimized ? 'w-80' : 'w-full md:w-[450px]'
      }`}
      style={{ maxHeight: isMinimized ? '60px' : '700px' }}
    >
      <Card className="shadow-2xl border-2">
        <CardHeader 
          className="flex flex-row items-center justify-between py-3 px-4 cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors" 
          onClick={onToggleMinimize}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full blur-sm opacity-50" />
              <Bot className="h-5 w-5 text-blue-600 relative z-10" />
              <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <CardTitle className="text-base">AI Βοηθός</CardTitle>
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />
              Ενεργός
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => { e.stopPropagation(); onToggleMinimize(); }}
              className="hover:bg-white/50"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="hover:bg-white/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Quick Actions Bar */}
            <div className="p-3 bg-gray-50 border-b">
              <div className="flex gap-2 flex-wrap">
                {getQuickActions().map((action, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setInput(action.query)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            <ScrollArea className="h-[480px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-lg p-3 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                      {message.actions && message.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                          {message.actions.map((action, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 bg-white hover:bg-gray-50"
                              onClick={() => handleActionClick(action)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString('el-GR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex gap-1 items-center">
                        <Bot className="h-4 w-4 text-blue-600 mr-2" />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Input
                  placeholder="Ρωτήστε οτιδήποτε..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-white"
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Πατήστε Enter για αποστολή • Shift+Enter για νέα γραμμή
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
