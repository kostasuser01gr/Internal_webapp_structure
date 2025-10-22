import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LayoutDashboard, 
  Car, 
  Plus, 
  Settings, 
  FileSpreadsheet, 
  BarChart3,
  Menu,
  Bot,
  LogOut,
  Building2,
  MessageSquare,
  Users,
  CalendarClock,
  Upload,
  CalendarDays,
  Activity
} from 'lucide-react';
import { DashboardStats } from '@/components/DashboardStats';
import { VehicleTable } from '@/components/VehicleTable';
import { VehicleForm } from '@/components/VehicleForm';
import { VehicleHistory } from '@/components/VehicleHistory';
import { ChatBot } from '@/components/ChatBot';
import { BulkOperations } from '@/components/BulkOperations';
import { ReportsAnalytics } from '@/components/ReportsAnalytics';
import { WorkEntryForm } from '@/components/WorkEntryForm';
import { TeamChat } from '@/components/TeamChat';
import { StaffManagement } from '@/components/StaffManagement';
import { ShiftManagement } from '@/components/ShiftManagement';
import { ReservationUpload } from '@/components/ReservationUpload';
import { LeaveRequests } from '@/components/LeaveRequests';
import { HealthCheck } from '@/components/HealthCheck';
import { 
  mockVehicles, 
  mockDashboardStats, 
  mockWorkEntries, 
  companies,
  mockStaff,
  mockShifts,
  mockReservations,
  mockLeaveRequests
} from '@/components/lib/mockData';
import { Vehicle, WorkEntry, Staff, Shift, Reservation, LeaveRequest } from '@/components/types';
import { generateId } from '@/components/lib/utils';

type View = 
  | 'dashboard' 
  | 'vehicles' 
  | 'add-vehicle' 
  | 'vehicle-detail' 
  | 'bulk' 
  | 'reports' 
  | 'chat'
  | 'staff'
  | 'shifts'
  | 'reservations'
  | 'leave-requests'
  | 'health-check';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showWorkEntryForm, setShowWorkEntryForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for new features
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);

  // Filter vehicles by selected company
  const filteredVehicles = selectedCompany === 'all' 
    ? mockVehicles 
    : mockVehicles.filter(v => v.companyId === selectedCompany);

  // Calculate real-time dashboard stats
  const calculateStats = () => {
    const today = new Date();
    const todayEntries = mockWorkEntries.filter(w => 
      w.date.toDateString() === today.toDateString()
    );
    
    return {
      totalVehicles: mockVehicles.length,
      todayEntries: todayEntries.length,
      pendingWork: mockVehicles.filter(v => v.status === 'pending').length,
      avgDuration: todayEntries.length > 0 
        ? todayEntries.reduce((sum, w) => sum + w.duration, 0) / todayEntries.length 
        : 0,
      company1Count: mockVehicles.filter(v => v.companyId === '1').length,
      company2Count: mockVehicles.filter(v => v.companyId === '2').length,
      completedToday: mockVehicles.filter(v => v.status === 'completed').length,
      revenue: todayEntries.reduce((sum, w) => sum + w.cost, 0),
    };
  };

  // Handle chatbot actions
  const handleChatbotAction = (action: string, data?: any) => {
    switch (action) {
      case 'bulk-operation':
        setCurrentView('bulk');
        setIsChatMinimized(true);
        break;
      case 'report':
        setCurrentView('reports');
        setIsChatMinimized(true);
        break;
      case 'health-check':
        setCurrentView('health-check');
        setIsChatMinimized(true);
        break;
      case 'suggestion':
        if (data?.action === 'add-vehicle') {
          setCurrentView('add-vehicle');
          setIsChatMinimized(true);
        } else if (data?.action === 'create-shift') {
          setCurrentView('shifts');
          setIsChatMinimized(true);
        } else if (data?.action === 'add-staff') {
          setCurrentView('staff');
          setIsChatMinimized(true);
        } else if (data?.action === 'upload-reservations') {
          setCurrentView('reservations');
          setIsChatMinimized(true);
        } else if (data?.action === 'approve-leaves') {
          setCurrentView('leave-requests');
          setIsChatMinimized(true);
        } else if (data?.action === 'health-check') {
          setCurrentView('health-check');
          setIsChatMinimized(true);
        }
        break;
      case 'analysis':
        setCurrentView('reports');
        setIsChatMinimized(true);
        break;
      default:
        console.log('Chatbot action:', action, data);
    }
  };

  const navigation = [
    { id: 'dashboard', name: 'Επισκόπηση', icon: LayoutDashboard },
    { id: 'vehicles', name: 'Οχήματα', icon: Car },
    { id: 'add-vehicle', name: 'Νέο Όχημα', icon: Plus },
    { id: 'staff', name: 'Προσωπικό', icon: Users },
    { id: 'reservations', name: 'Κρατήσεις', icon: Upload },
    { id: 'shifts', name: 'Βάρδιες', icon: CalendarClock },
    { id: 'leave-requests', name: 'Αιτήματα Αδειών', icon: CalendarDays },
    { id: 'health-check', name: 'Έλεγχος Υγείας', icon: Activity },
    { id: 'chat', name: 'Team Chat', icon: MessageSquare },
    { id: 'bulk', name: 'Μαζικές Λειτουργίες', icon: FileSpreadsheet },
    { id: 'reports', name: 'Αναφορές', icon: BarChart3 },
  ];

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentView('vehicle-detail');
    setMobileMenuOpen(false);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentView('add-vehicle');
    setMobileMenuOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το όχημα;')) {
      console.log('Delete vehicle:', id);
    }
  };

  const handleSubmitVehicle = (data: Partial<Vehicle>) => {
    console.log('Submit vehicle:', data);
    setCurrentView('vehicles');
    setSelectedVehicle(null);
  };

  const handleSubmitWork = (data: Partial<WorkEntry>) => {
    console.log('Submit work entry:', data);
    setShowWorkEntryForm(false);
  };

  // Staff Management Handlers
  const handleAddStaff = (data: Partial<Staff>) => {
    const newStaff: Staff = {
      id: generateId(),
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      role: data.role || 'washer',
      status: data.status || 'active',
      companyId: data.companyId,
      skills: data.skills || [],
      createdAt: new Date(),
    };
    setStaff([...staff, newStaff]);
  };

  const handleUpdateStaff = (id: string, data: Partial<Staff>) => {
    setStaff(staff.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το μέλος προσωπικού;')) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  // Reservation Handlers
  const handleImportReservations = (newReservations: Partial<Reservation>[]) => {
    const reservationsWithIds = newReservations.map(r => ({
      ...r,
      id: generateId(),
      status: r.status || 'pending',
    } as Reservation));
    
    setReservations([...reservations, ...reservationsWithIds]);
    alert(`Εισήχθησαν ${reservationsWithIds.length} κρατήσεις επιτυχώς!`);
  };

  // Shift Management Handlers
  const handleGenerateShifts = (date: Date) => {
    // Algorithm για auto-generation βάρδιων
    const activeStaff = staff.filter(s => s.status === 'active');
    
    if (activeStaff.length === 0) {
      alert('Δεν υπάρχει διαθέσιμο προσωπικό!');
      return;
    }

    // Βρες κρατήσεις για την ημέρα/εβδομάδα
    const dayReservations = reservations.filter(r => {
      const resDate = new Date(r.reservationDate);
      return resDate.toDateString() === date.toDateString();
    });

    if (dayReservations.length === 0) {
      alert('Δεν υπάρχουν κρατήσεις για αυτή την ημέρα!');
      return;
    }

    // Simple algorithm: Assign shifts based on reservations
    const newShifts: Shift[] = [];
    let staffIndex = 0;

    // Group reservations by time slot
    const morningRes = dayReservations.filter(r => r.timeSlot.startsWith('0') || r.timeSlot.startsWith('1'));
    const afternoonRes = dayReservations.filter(r => r.timeSlot.startsWith('1') || r.timeSlot.startsWith('2'));

    // Create morning shifts
    if (morningRes.length > 0) {
      const staffNeeded = Math.ceil(morningRes.length / 3); // 3 reservations per staff
      for (let i = 0; i < Math.min(staffNeeded, activeStaff.length); i++) {
        const staff = activeStaff[staffIndex % activeStaff.length];
        if (!staff) continue;
        
        newShifts.push({
          id: generateId(),
          staffId: staff.id,
          date: date,
          startTime: '08:00',
          endTime: '14:00',
          type: 'morning',
          status: 'scheduled',
          assignedReservations: morningRes.slice(i * 3, (i + 1) * 3).map(r => r.id),
          autoGenerated: true,
        });
        staffIndex++;
      }
    }

    // Create afternoon shifts
    if (afternoonRes.length > 0) {
      const staffNeeded = Math.ceil(afternoonRes.length / 3);
      for (let i = 0; i < Math.min(staffNeeded, activeStaff.length); i++) {
        const staff = activeStaff[staffIndex % activeStaff.length];
        if (!staff) continue;
        
        newShifts.push({
          id: generateId(),
          staffId: staff.id,
          date: date,
          startTime: '14:00',
          endTime: '20:00',
          type: 'afternoon',
          status: 'scheduled',
          assignedReservations: afternoonRes.slice(i * 3, (i + 1) * 3).map(r => r.id),
          autoGenerated: true,
        });
        staffIndex++;
      }
    }

    setShifts([...shifts, ...newShifts]);
    alert(`Δημιουργήθηκαν ${newShifts.length} βάρδιες αυτόματα!`);
  };

  const handleUpdateShift = (id: string, data: Partial<Shift>) => {
    setShifts(shifts.map(s => s.id === id ? { ...s, ...data } : s));
  };

  // Leave Request Handlers
  const handleSubmitLeaveRequest = (data: Partial<LeaveRequest>) => {
    const newRequest: LeaveRequest = {
      ...data,
      id: generateId(),
      status: 'pending',
      createdAt: new Date(),
    } as LeaveRequest;
    
    setLeaveRequests([...leaveRequests, newRequest]);
  };

  const handleApproveLeave = (id: string) => {
    setLeaveRequests(leaveRequests.map(r => 
      r.id === id ? { ...r, status: 'approved' as const } : r
    ));
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests(leaveRequests.map(r => 
      r.id === id ? { ...r, status: 'rejected' as const } : r
    ));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl">Επισκόπηση</h1>
                <p className="text-gray-600">Σύστημα Διαχείρισης Πλυντηρίου Οχημάτων - Goldcar/Europcar</p>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-500" />
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλες οι Εταιρείες</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DashboardStats stats={calculateStats()} />
            
            {/* Quick Health Check Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Έλεγχος Υγείας Συστήματος</h3>
                    <p className="text-sm text-muted-foreground">
                      Αυτόματος έλεγχος για διπλότυπα, συγκρούσεις και θέματα ακεραιότητας δεδομένων
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('health-check')}
                >
                  Προβολή Ελέγχου
                </Button>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Πρόσφατα Οχήματα</h2>
                {mockVehicles.length === 0 && (
                  <Button onClick={() => setCurrentView('add-vehicle')} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Προσθήκη Οχήματος
                  </Button>
                )}
              </div>
              <VehicleTable
                vehicles={filteredVehicles.slice(0, 5)}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        );

      case 'vehicles':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl">Διαχείριση Οχημάτων</h1>
                <p className="text-gray-600">Προβολή και επεξεργασία όλων των οχημάτων</p>
              </div>
              <Button onClick={() => setCurrentView('add-vehicle')}>
                <Plus className="mr-2 h-4 w-4" />
                Νέο Όχημα
              </Button>
            </div>
            <VehicleTable
              vehicles={filteredVehicles}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        );

      case 'add-vehicle':
        return (
          <div className="max-w-2xl mx-auto">
            <VehicleForm
              vehicle={selectedVehicle || undefined}
              onSubmit={handleSubmitVehicle}
              onCancel={() => {
                setCurrentView('vehicles');
                setSelectedVehicle(null);
              }}
            />
          </div>
        );

      case 'vehicle-detail':
        if (!selectedVehicle) {
          setCurrentView('dashboard');
          return null;
        }
        return (
          <div className="space-y-6">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentView('vehicles');
                setSelectedVehicle(null);
              }}
            >
              ← Επιστροφή στη Λίστα
            </Button>
            {showWorkEntryForm ? (
              <WorkEntryForm
                vehicleId={selectedVehicle.id}
                onSubmit={handleSubmitWork}
                onCancel={() => setShowWorkEntryForm(false)}
              />
            ) : (
              <VehicleHistory
                vehicle={selectedVehicle}
                workEntries={mockWorkEntries.filter(e => e.vehicleId === selectedVehicle.id)}
                onAddWork={() => setShowWorkEntryForm(true)}
              />
            )}
          </div>
        );

      case 'staff':
        return (
          <StaffManagement
            staff={staff}
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        );

      case 'reservations':
        return (
          <ReservationUpload
            onImport={handleImportReservations}
          />
        );

      case 'shifts':
        return (
          <ShiftManagement
            shifts={shifts}
            staff={staff}
            reservations={reservations}
            onGenerateShifts={handleGenerateShifts}
            onUpdateShift={handleUpdateShift}
          />
        );

      case 'leave-requests':
        return (
          <LeaveRequests
            requests={leaveRequests}
            staff={staff}
            currentUserId="user-1"
            onSubmitRequest={handleSubmitLeaveRequest}
            onApprove={handleApproveLeave}
            onReject={handleRejectLeave}
          />
        );

      case 'health-check':
        return (
          <HealthCheck
            vehicles={mockVehicles}
            staff={staff}
            shifts={shifts}
            reservations={reservations}
            leaveRequests={leaveRequests}
            onAutoFix={(issueId) => {
              console.log('Auto-fix issue:', issueId);
              // Auto-fix logic will be handled here
              alert('Αυτόματη διόρθωση ενεργοποιήθηκε για το θέμα: ' + issueId);
            }}
          />
        );

      case 'bulk':
        return <BulkOperations />;

      case 'reports':
        return <ReportsAnalytics />;

      case 'chat':
        return <TeamChat />;

      default:
        return null;
    }
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg">CarWash Pro</h2>
            <p className="text-xs text-gray-600">Goldcar & Europcar</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentView(item.id as View);
              if (mobile) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === item.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="flex-1 text-left">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
          <Settings className="h-5 w-5" />
          <span>Ρυθμίσεις</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
          <LogOut className="h-5 w-5" />
          <span>Αποσύνδεση</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">CarWash Pro</h1>
          <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(true)}>
            <Bot className="h-5 w-5" />
          </Button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* AI Chatbot */}
      {isChatOpen && (
        <ChatBot
          isOpen={isChatOpen}
          isMinimized={isChatMinimized}
          onClose={() => setIsChatOpen(false)}
          onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
          vehicles={mockVehicles}
          workEntries={mockWorkEntries}
          staff={staff}
          shifts={shifts}
          reservations={reservations}
          leaveRequests={leaveRequests}
          stats={calculateStats()}
          onActionTrigger={handleChatbotAction}
        />
      )}

      {/* Floating AI Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow z-50"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
