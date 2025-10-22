import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { WorkEntry, WorkType } from '../types';
import { workTypeLabels } from '../lib/mockData';

interface WorkEntryFormProps {
  vehicleId: string;
  onSubmit: (data: Partial<WorkEntry>) => void;
  onCancel: () => void;
}

export function WorkEntryForm({ vehicleId, onSubmit, onCancel }: WorkEntryFormProps) {
  const [formData, setFormData] = useState<Partial<WorkEntry>>({
    vehicleId,
    technicianName: '',
    workType: 'exterior-only',
    duration: 30,
    cost: 20,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const workTypePricing: Record<WorkType, { duration: number; cost: number }> = {
    'premium-full': { duration: 75, cost: 45 },
    'exterior-only': { duration: 30, cost: 20 },
    'interior-only': { duration: 45, cost: 25 },
    'disinfection': { duration: 20, cost: 15 },
    'wax': { duration: 25, cost: 18 },
    'detailing': { duration: 120, cost: 80 },
  };

  const handleWorkTypeChange = (workType: WorkType) => {
    const pricing = workTypePricing[workType];
    setFormData({
      ...formData,
      workType,
      duration: pricing.duration,
      cost: pricing.cost,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Νέα Εργασία Πλυσίματος</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="technician">Τεχνικός *</Label>
            <Input
              id="technician"
              placeholder="π.χ. Γιώργος Π."
              value={formData.technicianName}
              onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workType">Τύπος Εργασίας *</Label>
            <Select
              value={formData.workType}
              onValueChange={(value: WorkType) => handleWorkTypeChange(value)}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(workTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Διάρκεια (λεπτά) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Κόστος (€) *</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Σημειώσεις</Label>
            <Textarea
              id="notes"
              placeholder="Πρόσθετες παρατηρήσεις για την εργασία..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Καταχώρηση Εργασίας
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Ακύρωση
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
