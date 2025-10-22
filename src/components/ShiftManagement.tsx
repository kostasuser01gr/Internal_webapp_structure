import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar as CalendarIcon, Zap, Users, Clock, AlertCircle } from 'lucide-react';
import { Shift, Staff, Reservation } from '../types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { el } from 'date-fns/locale';

interface ShiftManagementProps {
  shifts: Shift[];
  staff: Staff[];
  reservations: Reservation[];
  onGenerateShifts: (date: Date) => void;
  onUpdateShift: (id: string, shift: Partial<Shift>) => void;
}

export function ShiftManagement({ 
  shifts, 
  staff, 
  reservations, 
  onGenerateShifts,
  onUpdateShift 
}: ShiftManagementProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const activeStaff = staff.filter(s => s.status === 'active');

  // Get week range
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Get shifts for selected period
  const periodShifts = useMemo(() => {
    if (viewMode === 'day') {
      return shifts.filter(s => isSameDay(new Date(s.date), selectedDate));
    }
    return shifts.filter(s => {
      const shiftDate = new Date(s.date);
      return shiftDate >= weekStart && shiftDate <= weekEnd;
    });
  }, [shifts, selectedDate, viewMode, weekStart, weekEnd]);

  // Get reservations for selected period
  const periodReservations = useMemo(() => {
    if (viewMode === 'day') {
      return reservations.filter(r => isSameDay(new Date(r.reservationDate), selectedDate));
    }
    return reservations.filter(r => {
      const resDate = new Date(r.reservationDate);
      return resDate >= weekStart && resDate <= weekEnd;
    });
  }, [reservations, selectedDate, viewMode, weekStart, weekEnd]);

  const getStaffById = (id: string) => staff.find(s => s.id === id);

  const getShiftsForDay = (date: Date) => {
    return periodShifts.filter(s => isSameDay(new Date(s.date), date));
  };

  const getReservationsForDay = (date: Date) => {
    return periodReservations.filter(r => isSameDay(new Date(r.reservationDate), date));
  };

  const handleAutoGenerate = () => {
    onGenerateShifts(selectedDate);
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-yellow-100 text-yellow-800';
      case 'afternoon': return 'bg-orange-100 text-orange-800';
      case 'night': return 'bg-indigo-100 text-indigo-800';
      case 'full-day': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl">Διαχείριση Βάρδιων</h2>
          <p className="text-gray-600">Αυτόματη δημιουργία βάρδιων από κρατήσεις</p>
        </div>
        <Button onClick={handleAutoGenerate}>
          <Zap className="mr-2 h-4 w-4" />
          Αυτόματη Δημιουργία Βάρδιων
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ενεργό Προσωπικό</p>
                <p className="text-2xl">{activeStaff.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Βάρδιες Περιόδου</p>
                <p className="text-2xl">{periodShifts.length}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Κρατήσεις</p>
                <p className="text-2xl">{periodReservations.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Εκκρεμείς</p>
                <p className="text-2xl">
                  {periodShifts.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Ημερολόγιο</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={el}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <Button 
                variant={viewMode === 'day' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => setViewMode('day')}
              >
                Ημερήσια Προβολή
              </Button>
              <Button 
                variant={viewMode === 'week' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => setViewMode('week')}
              >
                Εβδομαδιαία Προβολή
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shifts View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {viewMode === 'day' 
                ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: el })
                : `Εβδομάδα ${format(weekStart, 'd MMM', { locale: el })} - ${format(weekEnd, 'd MMM', { locale: el })}`
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'week' ? (
              <div className="space-y-4">
                {weekDays.map((day) => {
                  const dayShifts = getShiftsForDay(day);
                  const dayReservations = getReservationsForDay(day);
                  
                  return (
                    <div key={day.toString()} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">
                          {format(day, 'EEEE, d MMM', { locale: el })}
                        </h3>
                        <div className="flex gap-2 text-sm">
                          <Badge variant="outline">
                            {dayShifts.length} βάρδιες
                          </Badge>
                          <Badge variant="outline">
                            {dayReservations.length} κρατήσεις
                          </Badge>
                        </div>
                      </div>
                      
                      {dayShifts.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Δεν υπάρχουν προγραμματισμένες βάρδιες
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {dayShifts.map((shift) => {
                            const staffMember = getStaffById(shift.staffId);
                            return (
                              <div key={shift.id} className="border rounded p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{staffMember?.name || 'N/A'}</span>
                                  <Badge className={getShiftStatusColor(shift.status)} >
                                    {shift.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="h-3 w-3" />
                                  {shift.startTime} - {shift.endTime}
                                </div>
                                <Badge className={getShiftTypeColor(shift.type)}>
                                  {shift.type}
                                </Badge>
                                {shift.autoGenerated && (
                                  <Badge variant="outline" className="text-xs">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Auto
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Day View */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Βάρδιες Ημέρας</h4>
                  {periodShifts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-2">Δεν υπάρχουν βάρδιες για αυτή την ημέρα</p>
                      <Button onClick={handleAutoGenerate} variant="outline" size="sm">
                        Δημιουργία Βάρδιων
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {periodShifts.map((shift) => {
                        const staffMember = getStaffById(shift.staffId);
                        return (
                          <div key={shift.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h5 className="font-medium">{staffMember?.name || 'N/A'}</h5>
                                <p className="text-sm text-gray-600">{staffMember?.role}</p>
                              </div>
                              <Badge className={getShiftStatusColor(shift.status)}>
                                {shift.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Ώρες:</span> {shift.startTime} - {shift.endTime}
                              </div>
                              <div>
                                <Badge className={getShiftTypeColor(shift.type)}>
                                  {shift.type}
                                </Badge>
                              </div>
                            </div>
                            {shift.assignedReservations.length > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm text-gray-600 mb-2">
                                  Ανατεθειμένες Κρατήσεις: {shift.assignedReservations.length}
                                </p>
                              </div>
                            )}
                            {shift.notes && (
                              <p className="text-sm text-gray-600 mt-2">{shift.notes}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Κρατήσεις Ημέρας</h4>
                  {periodReservations.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Δεν υπάρχουν κρατήσεις για αυτή την ημέρα
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {periodReservations.map((res) => (
                        <div key={res.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{res.vehicleLicensePlate}</p>
                            <p className="text-sm text-gray-600">{res.timeSlot}</p>
                          </div>
                          <Badge>{res.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Algorithm Info */}
      <Card>
        <CardHeader>
          <CardTitle>Πώς Λειτουργεί η Αυτόματη Δημιουργία</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center">1</span>
                Ανάλυση Κρατήσεων
              </h4>
              <p className="text-gray-600 ml-8">
                Το σύστημα αναλύει όλες τις κρατήσεις της περιόδου και υπολογίζει τις ανάγκες σε προσωπικό.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center">2</span>
                Matching Δεξιοτήτων
              </h4>
              <p className="text-gray-600 ml-8">
                Αντιστοιχίζει το διαθέσιμο προσωπικό βάσει δεξιοτήτων και διαθεσιμότητας.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center">3</span>
                Δημιουργία Βάρδιων
              </h4>
              <p className="text-gray-600 ml-8">
                Δημιουργεί βέλτιστες βάρδιες λαμβάνοντας υπόψη φόρτο εργασίας και αιτήματα.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
