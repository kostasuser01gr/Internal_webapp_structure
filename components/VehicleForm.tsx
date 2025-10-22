import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { Vehicle } from '@/components/types';
import { companies } from '@/components/lib/mockData';

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (data: Partial<Vehicle>) => void;
  onCancel: () => void;
}

export function VehicleForm({ vehicle, onSubmit, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    licensePlate: vehicle?.licensePlate || '',
    companyId: vehicle?.companyId || '',
    status: vehicle?.status || 'pending',
    notes: vehicle?.notes || '',
    imageUrl: vehicle?.imageUrl || '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(vehicle?.imageUrl || null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{vehicle ? 'Επεξεργασία Οχήματος' : 'Νέο Όχημα'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* License Plate */}
          <div className="space-y-2">
            <Label htmlFor="licensePlate">Αριθμός Κυκλοφορίας *</Label>
            <Input
              id="licensePlate"
              placeholder="π.χ. ΑΒΓ-1234"
              value={formData.licensePlate}
              onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
              required
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Εταιρεία *</Label>
            <Select
              value={formData.companyId}
              onValueChange={(value) => setFormData({ ...formData, companyId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε εταιρεία" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: company.color }}
                      />
                      {company.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Κατάσταση</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Εκκρεμεί</SelectItem>
                <SelectItem value="active">Ενεργό</SelectItem>
                <SelectItem value="completed">Ολοκληρώθηκε</SelectItem>
                <SelectItem value="maintenance">Συντήρηση</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Φωτογραφία Οχήματος</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Vehicle preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, imageUrl: '' });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Κάντε κλικ για ανέβασμα ή βγάλτε φωτογραφία
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG έως 10MB</p>
                </label>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Σημειώσεις</Label>
            <Textarea
              id="notes"
              placeholder="Πρόσθετα στοιχεία, παρατηρήσεις..."
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              {vehicle ? 'Αποθήκευση' : 'Καταχώρηση'}
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
