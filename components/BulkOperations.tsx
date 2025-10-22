import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Edit3, Trash2, FileSpreadsheet, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function BulkOperations() {
  const [selectedOperation, setSelectedOperation] = useState('import');
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">Μαζικές Λειτουργίες</h2>
        <p className="text-gray-600">Διαχείριση πολλαπλών οχημάτων ταυτόχρονα</p>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="import">Εισαγωγή</TabsTrigger>
          <TabsTrigger value="export">Εξαγωγή</TabsTrigger>
          <TabsTrigger value="edit">Επεξεργασία</TabsTrigger>
          <TabsTrigger value="delete">Διαγραφή</TabsTrigger>
        </TabsList>

        {/* Import Tab */}
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Μαζική Εισαγωγή Οχημάτων</CardTitle>
              <CardDescription>
                Εισάγετε πολλά οχήματα ταυτόχρονα από αρχείο CSV ή Excel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Το αρχείο πρέπει να περιέχει τις στήλες: Αρ. Κυκλοφορίας, Εταιρεία, Κατάσταση, Σημειώσεις
                </AlertDescription>
              </Alert>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="bulk-import"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="bulk-import" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm">
                    {importFile ? importFile.name : 'Επιλέξτε αρχείο CSV ή Excel'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Μέχρι 5,000 εγγραφές</p>
                </label>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" disabled={!importFile}>
                  <Upload className="mr-2 h-4 w-4" />
                  Εισαγωγή {importFile ? `(${importFile.name})` : ''}
                </Button>
                <Button variant="outline">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Λήψη Υποδείγματος
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Εξαγωγή Δεδομένων</CardTitle>
              <CardDescription>
                Κατεβάστε τα δεδομένα σας σε διάφορες μορφές
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Επιλέξτε Εταιρεία</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλες οι Εταιρείες</SelectItem>
                    <SelectItem value="1">AutoClean Premium</SelectItem>
                    <SelectItem value="2">SpeedWash Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Επιλέξτε Κατάσταση</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
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

              <div className="space-y-2">
                <Label>Περιοχή Ημερομηνιών</Label>
                <Select defaultValue="today">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Σήμερα</SelectItem>
                    <SelectItem value="week">Αυτή την Εβδομάδα</SelectItem>
                    <SelectItem value="month">Αυτόν τον Μήνα</SelectItem>
                    <SelectItem value="all">Όλος ο Χρόνος</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button variant="outline">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Εξαγωγή CSV
                </Button>
                <Button variant="outline">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Εξαγωγή Excel
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Εξαγωγή PDF
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Πλήρης Αναφορά
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Edit Tab */}
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Μαζική Επεξεργασία</CardTitle>
              <CardDescription>
                Ενημερώστε πολλά οχήματα ταυτόχρονα
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Επιλέξτε τα οχήματα που θέλετε να επεξεργαστείτε από τη λίστα οχημάτων
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Αλλαγή Εταιρείας</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε νέα εταιρεία" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">AutoClean Premium</SelectItem>
                    <SelectItem value="2">SpeedWash Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Αλλαγή Κατάστασης</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε νέα κατάσταση" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ενεργό</SelectItem>
                    <SelectItem value="pending">Εκκρεμεί</SelectItem>
                    <SelectItem value="completed">Ολοκληρώθηκε</SelectItem>
                    <SelectItem value="maintenance">Συντήρηση</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Προσθήκη Σημειώσεων</Label>
                <Textarea placeholder="Αυτές οι σημειώσεις θα προστεθούν σε όλα τα επιλεγμένα οχήματα..." />
              </div>

              <Button className="w-full">
                <Edit3 className="mr-2 h-4 w-4" />
                Εφαρμογή Αλλαγών σε 0 Οχήματα
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Delete Tab */}
        <TabsContent value="delete">
          <Card>
            <CardHeader>
              <CardTitle>Μαζική Διαγραφή</CardTitle>
              <CardDescription>
                Διαγράψτε πολλά οχήματα με βάση φίλτρα
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  ⚠️ Προσοχή: Αυτή η ενέργεια είναι μη αναστρέψιμη!
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Διαγραφή με Κατάσταση</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε κατάσταση" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Μόνο Ολοκληρωμένα</SelectItem>
                    <SelectItem value="maintenance">Μόνο σε Συντήρηση</SelectItem>
                    <SelectItem value="old">Παλαιότερα από 30 ημέρες</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Διαγραφή με Εταιρεία</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε εταιρεία" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">AutoClean Premium</SelectItem>
                    <SelectItem value="2">SpeedWash Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Διαγραφή Οχημάτων
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
