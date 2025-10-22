import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, Plus, Check, X, Clock } from 'lucide-react';
import { LeaveRequest, Staff } from '@/components/types';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

interface LeaveRequestsProps {
  requests: LeaveRequest[];
  staff: Staff[];
  currentUserId?: string;
  onSubmitRequest: (request: Partial<LeaveRequest>) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function LeaveRequests({ 
  requests, 
  staff, 
  currentUserId,
  onSubmitRequest,
  onApprove,
  onReject 
}: LeaveRequestsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<LeaveRequest>>({
    staffId: currentUserId || '',
    startDate: new Date(),
    endDate: new Date(),
    type: 'vacation',
    reason: '',
    status: 'pending',
  });

  const handleSubmit = () => {
    onSubmitRequest(formData);
    setIsDialogOpen(false);
    setFormData({
      staffId: currentUserId || '',
      startDate: new Date(),
      endDate: new Date(),
      type: 'vacation',
      reason: '',
      status: 'pending',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacation': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-orange-100 text-orange-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vacation': return 'Άδεια';
      case 'sick': return 'Ασθένεια';
      case 'personal': return 'Προσωπική';
      case 'emergency': return 'Έκτακτη';
      default: return type;
    }
  };

  const getStaffName = (id: string) => {
    return staff.find(s => s.id === id)?.name || 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Αιτήματα Αδειών</h2>
          <p className="text-gray-600">Διαχείριση αιτημάτων αδειών προσωπικού</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Νέο Αίτημα
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Νέο Αίτημα Άδειας</DialogTitle>
              <DialogDescription>
                Δημιουργήστε ένα νέο αίτημα άδειας για μέλος του προσωπικού.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Προσωπικό</Label>
                <Select 
                  value={formData.staffId} 
                  onValueChange={(value) => setFormData({ ...formData, staffId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Από</Label>
                  <Input
                    type="date"
                    value={formData.startDate ? format(new Date(formData.startDate), 'yyyy-MM-dd') : ''}
                    onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Έως</Label>
                  <Input
                    type="date"
                    value={formData.endDate ? format(new Date(formData.endDate), 'yyyy-MM-dd') : ''}
                    onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>Τύπος Άδειας</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Άδεια</SelectItem>
                    <SelectItem value="sick">Ασθένεια</SelectItem>
                    <SelectItem value="personal">Προσωπική</SelectItem>
                    <SelectItem value="emergency">Έκτακτη</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Αιτιολογία (Προαιρετική)</Label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Αιτιολογία αιτήματος..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleSubmit}>
                  Υποβολή Αιτήματος
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Εκκρεμή</p>
                <p className="text-2xl">{requests.filter(r => r.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Εγκεκριμένα</p>
                <p className="text-2xl">{requests.filter(r => r.status === 'approved').length}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Απορριφθέντα</p>
                <p className="text-2xl">{requests.filter(r => r.status === 'rejected').length}</p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Αιτήματα</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Προσωπικό</TableHead>
                <TableHead>Τύπος</TableHead>
                <TableHead>Από</TableHead>
                <TableHead>Έως</TableHead>
                <TableHead>Ημέρες</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead className="hidden md:table-cell">Αιτιολογία</TableHead>
                <TableHead className="text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <CalendarIcon className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-gray-900 mb-1">Δεν υπάρχουν αιτήματα</p>
                        <p className="text-sm text-gray-500">Τα αιτήματα αδειών θα εμφανιστούν εδώ</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => {
                  const days = Math.ceil(
                    (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / 
                    (1000 * 60 * 60 * 24)
                  ) + 1;

                  return (
                    <TableRow key={request.id}>
                      <TableCell>{getStaffName(request.staffId)}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(request.type)}>
                          {getTypeLabel(request.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.startDate), 'd MMM yyyy', { locale: el })}
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.endDate), 'd MMM yyyy', { locale: el })}
                      </TableCell>
                      <TableCell>{days}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === 'pending' ? 'Εκκρεμεί' : 
                           request.status === 'approved' ? 'Εγκρίθηκε' : 'Απορρίφθηκε'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {request.reason || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onApprove(request.id)}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onReject(request.id)}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
