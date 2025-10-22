import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, User, Wrench, DollarSign, FileText, Building2 } from 'lucide-react';
import { WorkEntry, Vehicle } from '../types';
import { workTypeLabels, companies } from '../lib/mockData';

interface VehicleHistoryProps {
  vehicle: Vehicle;
  workEntries: WorkEntry[];
  onAddWork: () => void;
}

export function VehicleHistory({ vehicle, workEntries, onAddWork }: VehicleHistoryProps) {
  const sortedEntries = [...workEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalCost = workEntries.reduce((sum, entry) => sum + entry.cost, 0);
  const totalDuration = workEntries.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div className="space-y-6">
      {/* Vehicle Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle>Όχημα: {vehicle.licensePlate}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span 
                  className="inline-flex items-center gap-2"
                  style={{ 
                    color: companies.find(c => c.id === vehicle.companyId)?.color 
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: companies.find(c => c.id === vehicle.companyId)?.color,
                    }}
                  />
                  <strong>{companies.find(c => c.id === vehicle.companyId)?.name}</strong>
                </span>
              </div>
            </div>
            <Button onClick={onAddWork}>Νέα Εργασία</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Σύνολο Εργασιών</p>
              <p className="text-2xl">{workEntries.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Συνολικό Κόστος</p>
              <p className="text-2xl">€{totalCost}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Συνολικός Χρόνος</p>
              <p className="text-2xl">{totalDuration} λεπτά</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Μέσος Χρόνος</p>
              <p className="text-2xl">
                {workEntries.length > 0 ? Math.round(totalDuration / workEntries.length) : 0} λεπτά
              </p>
            </div>
          </div>
          {vehicle.notes && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <FileText className="inline h-4 w-4 mr-2" />
                {vehicle.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Ιστορικό Εργασιών</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Δεν υπάρχει ιστορικό εργασιών
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 rounded-r-lg transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {workTypeLabels[entry.workType] || entry.workType}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {new Date(entry.date).toLocaleDateString('el-GR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {entry.duration} λεπτά
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        €{entry.cost}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <User className="h-4 w-4" />
                    <span>Τεχνικός: {entry.technicianName}</span>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-gray-700 mt-2">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
