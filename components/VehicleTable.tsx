import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Trash2, Search, Car } from 'lucide-react';
import { Vehicle } from '@/components/types';
import { companies, statusLabels } from '@/components/lib/mockData';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onViewDetails: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export function VehicleTable({ vehicles, onViewDetails, onEdit, onDelete }: VehicleTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCompany = filterCompany === 'all' || vehicle.companyId === filterCompany;
      const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
      return matchesSearch && matchesCompany && matchesStatus;
    });
  }, [vehicles, searchTerm, filterCompany, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || 'N/A';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Αναζήτηση με αριθμό κυκλοφορίας..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCompany} onValueChange={setFilterCompany}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Εταιρεία" />
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
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Κατάσταση" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλες οι Καταστάσεις</SelectItem>
            <SelectItem value="active">Ενεργό</SelectItem>
            <SelectItem value="pending">Εκκρεμεί</SelectItem>
            <SelectItem value="completed">Ολοκληρώθηκε</SelectItem>
            <SelectItem value="maintenance">Συντήρηση</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Αρ. Κυκλοφορίας</TableHead>
              <TableHead>Εταιρεία</TableHead>
              <TableHead>Κατάσταση</TableHead>
              <TableHead className="hidden md:table-cell">Ημερομηνία</TableHead>
              <TableHead className="hidden md:table-cell">Σημειώσεις</TableHead>
              <TableHead className="text-right">Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Car className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-900 mb-1">Δεν βρέθηκαν οχήματα</p>
                      <p className="text-sm text-gray-500">
                        {vehicles.length === 0 
                          ? 'Ξεκινήστε προσθέτοντας το πρώτο όχημα' 
                          : 'Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης'}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: companies.find(c => c.id === vehicle.companyId)?.color,
                        }}
                      />
                      {getCompanyName(vehicle.companyId)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {statusLabels[vehicle.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(vehicle.createdAt).toLocaleDateString('el-GR')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                    {vehicle.notes || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(vehicle)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(vehicle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(vehicle.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
