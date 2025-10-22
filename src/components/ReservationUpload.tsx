import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Reservation } from '../types';
import { companies } from '../lib/mockData';

interface ReservationUploadProps {
  onImport: (reservations: Partial<Reservation>[]) => void;
}

export function ReservationUpload({ onImport }: ReservationUploadProps) {
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [validData, setValidData] = useState<Partial<Reservation>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('Το αρχείο είναι κενό');
      }

      // Parse CSV/Excel (simplified)
      const headers = lines[0].split(/[,;\t]/).map(h => h.trim().toLowerCase());
      const data = lines.slice(1).map(line => {
        const values = line.split(/[,;\t]/);
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || '';
        });
        return row;
      });

      setParsedData(data);
      validateAndConvert(data);
    } catch (error) {
      setErrors([`Σφάλμα ανάγνωσης αρχείου: ${error}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const validateAndConvert = (data: any[]) => {
    const valid: Partial<Reservation>[] = [];
    const errorsList: string[] = [];

    data.forEach((row, index) => {
      try {
        // Try to detect column names (flexible)
        const licensePlate = 
          row['license plate'] || 
          row['licensePlate'] || 
          row['plate'] || 
          row['αριθμός κυκλοφορίας'] || 
          row['πινακίδα'] || 
          '';

        const companyName = 
          row['company'] || 
          row['εταιρεία'] || 
          row['company name'] || 
          '';

        const date = 
          row['date'] || 
          row['reservation date'] || 
          row['ημερομηνία'] || 
          '';

        const timeSlot = 
          row['time'] || 
          row['time slot'] || 
          row['ώρα'] || 
          '';

        const workType = 
          row['type'] || 
          row['work type'] || 
          row['service'] || 
          row['τύπος'] || 
          '';

        // Validate required fields
        if (!licensePlate) {
          errorsList.push(`Γραμμή ${index + 2}: Λείπει αριθμός κυκλοφορίας`);
          return;
        }

        if (!companyName) {
          errorsList.push(`Γραμμή ${index + 2}: Λείπει εταιρεία`);
          return;
        }

        if (!date) {
          errorsList.push(`Γραμμή ${index + 2}: Λείπει ημερομηνία`);
          return;
        }

        // Find company ID
        const company = companies.find(
          c => c.name.toLowerCase() === companyName.toLowerCase()
        );

        if (!company) {
          errorsList.push(`Γραμμή ${index + 2}: Άγνωστη εταιρεία "${companyName}"`);
          return;
        }

        // Parse date
        let reservationDate: Date;
        try {
          // Support multiple date formats
          if (date.includes('/')) {
            const [day, month, year] = date.split('/');
            reservationDate = new Date(`${year}-${month}-${day}`);
          } else if (date.includes('-')) {
            reservationDate = new Date(date);
          } else {
            throw new Error('Invalid date format');
          }

          if (isNaN(reservationDate.getTime())) {
            throw new Error('Invalid date');
          }
        } catch {
          errorsList.push(`Γραμμή ${index + 2}: Μη έγκυρη ημερομηνία "${date}"`);
          return;
        }

        // Map work type
        const workTypeMap: Record<string, string> = {
          'premium': 'premium-full',
          'full': 'premium-full',
          'exterior': 'exterior-only',
          'εξωτερικό': 'exterior-only',
          'interior': 'interior-only',
          'εσωτερικό': 'interior-only',
          'disinfection': 'disinfection',
          'απολύμανση': 'disinfection',
          'wax': 'wax',
          'κερί': 'wax',
          'detailing': 'detailing',
        };

        const mappedWorkType = workTypeMap[workType.toLowerCase()] || 'exterior-only';

        valid.push({
          vehicleLicensePlate: licensePlate.toUpperCase(),
          companyId: company.id,
          reservationDate,
          timeSlot: timeSlot || '09:00-10:00',
          workType: mappedWorkType as any,
          estimatedDuration: 45,
          status: 'pending',
          uploadedFrom: 'excel',
        });
      } catch (error) {
        errorsList.push(`Γραμμή ${index + 2}: ${error}`);
      }
    });

    setValidData(valid);
    setErrors(errorsList);
  };

  const handleImport = () => {
    onImport(validData);
    setParsedData([]);
    setValidData([]);
    setErrors([]);
  };

  const downloadTemplate = () => {
    const template = `License Plate,Company,Date,Time Slot,Work Type
ΑΒΓ-1234,Goldcar,21/10/2025,09:00-10:00,premium
ΧΨΖ-5678,Europcar,21/10/2025,10:00-11:00,exterior`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reservations_template.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Μαζική Εισαγωγή Κρατήσεων</h2>
        <p className="text-gray-600">Ανεβάστε αρχείο Excel/CSV με τις κρατήσεις</p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Ανέβασμα Αρχείου</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="mb-2">Σύρετε το αρχείο εδώ ή κάντε κλικ για να επιλέξετε</p>
            <p className="text-sm text-gray-500 mb-4">Υποστηρίζονται: CSV, Excel (.xlsx, .xls)</p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild variant="outline">
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Επιλογή Αρχείου
                </span>
              </Button>
            </label>
          </div>

          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Κατέβασμα Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Template Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Οδηγίες Μορφής Αρχείου</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Απαιτούμενες Στήλες:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>License Plate</strong> / Αριθμός Κυκλοφορίας (π.χ. ΑΒΓ-1234)</li>
                <li>• <strong>Company</strong> / Εταιρεία (Goldcar ή Europcar)</li>
                <li>• <strong>Date</strong> / Ημερομηνία (DD/MM/YYYY ή YYYY-MM-DD)</li>
                <li>• <strong>Time Slot</strong> / Ώρα (προαιρετικό, π.χ. 09:00-10:00)</li>
                <li>• <strong>Work Type</strong> / Τύπος (premium, exterior, interior, κλπ.)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Υποστηριζόμενοι Τύποι Εργασίας:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">premium / full</Badge>
                <Badge variant="outline">exterior / εξωτερικό</Badge>
                <Badge variant="outline">interior / εσωτερικό</Badge>
                <Badge variant="outline">disinfection / απολύμανση</Badge>
                <Badge variant="outline">wax / κερί</Badge>
                <Badge variant="outline">detailing</Badge>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Το σύστημα είναι ευέλικτο και αναγνωρίζει στήλες με διάφορα ονόματα (Αγγλικά/Ελληνικά).
                Μπορείτε να χρησιμοποιήσετε κόμμα (,), ερωτηματικό (;) ή tab ως διαχωριστικό.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Προεπισκόπηση Δεδομένων</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                  {validData.length} έγκυρα
                </Badge>
                {errors.length > 0 && (
                  <Badge variant="outline" className="bg-red-50">
                    <XCircle className="h-3 w-3 mr-1 text-red-600" />
                    {errors.length} σφάλματα
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Errors */}
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium mb-2">Βρέθηκαν σφάλματα:</p>
                    <ul className="text-sm space-y-1">
                      {errors.slice(0, 5).map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                      {errors.length > 5 && (
                        <li>... και {errors.length - 5} ακόμα</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Valid Data Table */}
              {validData.length > 0 && (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Αρ. Κυκλοφορίας</TableHead>
                        <TableHead>Εταιρεία</TableHead>
                        <TableHead>Ημερομηνία</TableHead>
                        <TableHead>Ώρα</TableHead>
                        <TableHead>Τύπος</TableHead>
                        <TableHead>Κατάσταση</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validData.slice(0, 10).map((res, i) => (
                        <TableRow key={i}>
                          <TableCell>{res.vehicleLicensePlate}</TableCell>
                          <TableCell>
                            <Badge style={{ 
                              backgroundColor: `${companies.find(c => c.id === res.companyId)?.color}20`,
                              color: companies.find(c => c.id === res.companyId)?.color 
                            }}>
                              {companies.find(c => c.id === res.companyId)?.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {res.reservationDate ? new Date(res.reservationDate).toLocaleDateString('el-GR') : '-'}
                          </TableCell>
                          <TableCell>{res.timeSlot}</TableCell>
                          <TableCell><Badge variant="outline">{res.workType}</Badge></TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Έγκυρο
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {validData.length > 10 && (
                    <p className="text-sm text-gray-500 text-center">
                      ... και {validData.length - 10} ακόμα καταχωρήσεις
                    </p>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setParsedData([]);
                      setValidData([]);
                      setErrors([]);
                    }}>
                      Ακύρωση
                    </Button>
                    <Button onClick={handleImport} disabled={validData.length === 0}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Εισαγωγή {validData.length} Κρατήσεων
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
