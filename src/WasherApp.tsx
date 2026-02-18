import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Car, Clock, User, Calendar } from "lucide-react";
import { companies, workTypeLabels } from "@/components/lib/mockData";
import { WorkType } from "@/components/types";

// Lightweight Washer App για γρήγορη καταχώρηση πλύσεων
export default function WasherApp() {
  const [currentUser] = useState({
    id: "washer-1",
    name: "Πλύντης",
    role: "washer" as const,
  });

  const [step, setStep] = useState<"input" | "confirm" | "success">("input");
  const [formData, setFormData] = useState({
    licensePlate: "",
    companyId: "",
    workType: "" as WorkType | "",
    duration: "",
    notes: "",
  });

  const [todayCount, setTodayCount] = useState(0);

  const workTypeDurations: Record<string, number> = {
    "premium-full": 75,
    "exterior-only": 30,
    "interior-only": 45,
    disinfection: 20,
    wax: 25,
    detailing: 120,
  };

  const handleWorkTypeChange = (type: WorkType) => {
    setFormData({
      ...formData,
      workType: type,
      duration: workTypeDurations[type]?.toString() || "",
    });
  };

  const handleSubmit = () => {
    setStep("confirm");
  };

  const handleConfirm = () => {
    // Εδώ θα γίνει το actual submit στο backend
    console.warn("Submitting wash entry:", {
      ...formData,
      technicianName: currentUser.name,
      date: new Date(),
    });

    setTodayCount((prev) => prev + 1);
    setStep("success");

    // Auto-reset after 3 seconds
    setTimeout(() => {
      resetForm();
    }, 3000);
  };

  const resetForm = () => {
    setFormData({
      licensePlate: "",
      companyId: "",
      workType: "" as WorkType | "",
      duration: "",
      notes: "",
    });
    setStep("input");
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl mb-2">Επιτυχής Καταχώρηση!</h2>
            <p className="text-gray-600 mb-6">
              Το όχημα {formData.licensePlate} καταχωρήθηκε επιτυχώς
            </p>
            <Badge className="text-lg py-2 px-4">Πλύσεις Σήμερα: {todayCount}</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl mb-1">🚗 Car Wash App</h1>
                <p className="opacity-90">Γρήγορη καταχώρηση πλύσεων</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{currentUser.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{new Date().toLocaleDateString("el-GR")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Σήμερα</p>
                  <p className="text-3xl">{todayCount}</p>
                </div>
                <Car className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Μέσος Χρόνος</p>
                  <p className="text-3xl">45'</p>
                </div>
                <Clock className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        {step === "input" ? (
          <Card>
            <CardHeader>
              <CardTitle>Νέα Πλύση Οχήματος</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* License Plate - Large Input */}
              <div>
                <Label className="text-lg">Αριθμός Κυκλοφορίας</Label>
                <Input
                  value={formData.licensePlate}
                  onChange={(e) =>
                    setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })
                  }
                  placeholder="π.χ. ΑΒΓ-1234"
                  className="text-2xl h-16 text-center tracking-wider"
                  autoFocus
                />
              </div>

              {/* Company - Large Buttons */}
              <div>
                <Label className="text-lg mb-3 block">Εταιρεία</Label>
                <div className="grid grid-cols-2 gap-3">
                  {companies.map((company) => (
                    <Button
                      key={company.id}
                      variant={formData.companyId === company.id ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, companyId: company.id })}
                      className="h-20 text-lg"
                      style={
                        formData.companyId === company.id
                          ? {
                              backgroundColor: company.color,
                              borderColor: company.color,
                            }
                          : { borderColor: company.color, color: company.color }
                      }
                    >
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: company.color }}
                      />
                      {company.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Work Type - Grid of Buttons */}
              <div>
                <Label className="text-lg mb-3 block">Τύπος Εργασίας</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(workTypeLabels).map(([key, label]) => (
                    <Button
                      key={key}
                      variant={formData.workType === key ? "default" : "outline"}
                      onClick={() => handleWorkTypeChange(key as WorkType)}
                      className="h-16 flex flex-col items-center justify-center gap-1"
                    >
                      <span className="text-sm">{label}</span>
                      <span className="text-xs opacity-70">{workTypeDurations[key]} λεπτά</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Duration Override */}
              {formData.workType && (
                <div>
                  <Label>Διάρκεια (λεπτά)</Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="h-12 text-lg"
                  />
                </div>
              )}

              {/* Notes - Optional */}
              <div>
                <Label>Σημειώσεις (Προαιρετικό)</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Επιπλέον σημειώσεις..."
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!formData.licensePlate || !formData.companyId || !formData.workType}
                className="w-full h-14 text-lg"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Επόμενο
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Confirmation Step */
          <Card>
            <CardHeader>
              <CardTitle>Επιβεβαίωση Στοιχείων</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Car className="h-4 w-4" />
                <AlertDescription>
                  Παρακαλώ επιβεβαιώστε τα στοιχεία πριν την καταχώρηση
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Αριθμός Κυκλοφορίας:</span>
                  <span className="text-xl tracking-wider">{formData.licensePlate}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Εταιρεία:</span>
                  <Badge
                    style={{
                      backgroundColor: `${companies.find((c) => c.id === formData.companyId)?.color}20`,
                      color: companies.find((c) => c.id === formData.companyId)?.color,
                    }}
                  >
                    {companies.find((c) => c.id === formData.companyId)?.name}
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Τύπος Εργασίας:</span>
                  <span>{formData.workType && workTypeLabels[formData.workType]}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Διάρκεια:</span>
                  <span>{formData.duration} λεπτά</span>
                </div>

                {formData.notes && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 block mb-2">Σημειώσεις:</span>
                    <span>{formData.notes}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setStep("input")} className="h-14">
                  Πίσω
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="h-14 text-lg bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Καταχώρηση
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">💡 Γρήγορες Συμβουλές:</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Πατήστε Enter για γρήγορη προχώρηση</li>
              <li>• Ο χρόνος υπολογίζεται αυτόματα</li>
              <li>• Μπορείτε να αλλάξετε τη διάρκεια χειροκίνητα</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
