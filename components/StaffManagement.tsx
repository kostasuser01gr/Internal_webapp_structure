import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, UserCheck, UserX, Search } from "lucide-react";
import { Staff, WorkType } from "@/components/types";
import { companies, workTypeLabels } from "@/components/lib/mockData";

interface StaffManagementProps {
  staff: Staff[];
  onAddStaff: (staff: Partial<Staff>) => void;
  onUpdateStaff: (id: string, staff: Partial<Staff>) => void;
  onDeleteStaff: (id: string) => void;
}

export function StaffManagement({
  staff,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
}: StaffManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [formData, setFormData] = useState<Partial<Staff>>({
    name: "",
    email: "",
    phone: "",
    role: "washer",
    status: "active",
    companyId: undefined,
    skills: [],
  });

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || s.role === filterRole;
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSubmit = () => {
    if (editingStaff) {
      onUpdateStaff(editingStaff.id, formData);
      setEditingStaff(null);
    } else {
      onAddStaff(formData);
    }
    resetForm();
    setIsAddDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "washer",
      status: "active",
      companyId: undefined,
      skills: [],
    });
  };

  const handleEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({
      name: s.name,
      email: s.email,
      phone: s.phone,
      role: s.role,
      status: s.status,
      companyId: s.companyId,
      skills: s.skills || [],
    });
    setIsAddDialogOpen(true);
  };

  const toggleSkill = (skill: WorkType) => {
    const currentSkills = formData.skills || [];
    if (currentSkills.includes(skill)) {
      setFormData({ ...formData, skills: currentSkills.filter((s) => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...currentSkills, skill] });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "washer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "active" ? (
      <UserCheck className="h-4 w-4 text-green-600" />
    ) : (
      <UserX className="h-4 w-4 text-gray-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl">Διαχείριση Προσωπικού</h2>
          <p className="text-gray-600">Προσθήκη και διαχείριση μελών προσωπικού</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <Button
            onClick={() => {
              resetForm();
              setEditingStaff(null);
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Νέο Μέλος
          </Button>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? "Επεξεργασία Μέλους" : "Νέο Μέλος Προσωπικού"}
              </DialogTitle>
              <DialogDescription>
                {editingStaff
                  ? "Επεξεργαστείτε τα στοιχεία του μέλους του προσωπικού."
                  : "Προσθέστε ένα νέο μέλος στο προσωπικό της εταιρείας."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ονοματεπώνυμο *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="π.χ. Γιώργος Παπαδόπουλος"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Τηλέφωνο *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+30 6XX XXX XXXX"
                  />
                </div>
                <div>
                  <Label>Ρόλος *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: Staff["role"]) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="washer">Πλύντης</SelectItem>
                      <SelectItem value="staff">Προσωπικό</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Κατάσταση</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Staff["status"]) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ενεργός</SelectItem>
                      <SelectItem value="inactive">Ανενεργός</SelectItem>
                      <SelectItem value="on-leave">Σε Άδεια</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Εταιρεία (Προαιρετικό)</Label>
                  <Select
                    value={formData.companyId || "none"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, companyId: value === "none" ? "" : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Όλες" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Όλες</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.role === "washer" && (
                <div>
                  <Label>Δεξιότητες (Τύποι Εργασίας)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(workTypeLabels).map(([key, label]) => (
                      <Button
                        key={key}
                        type="button"
                        variant={formData.skills?.includes(key as WorkType) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSkill(key as WorkType)}
                        className="justify-start"
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleSubmit}>{editingStaff ? "Ενημέρωση" : "Προσθήκη"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Αναζήτηση με όνομα ή email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ρόλος" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλοι οι Ρόλοι</SelectItem>
            <SelectItem value="washer">Πλύντης</SelectItem>
            <SelectItem value="staff">Προσωπικό</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Κατάσταση" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλες</SelectItem>
            <SelectItem value="active">Ενεργός</SelectItem>
            <SelectItem value="inactive">Ανενεργός</SelectItem>
            <SelectItem value="on-leave">Σε Άδεια</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Προσωπικό ({filteredStaff.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Κατάσταση</TableHead>
                <TableHead>Όνομα</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Τηλέφωνο</TableHead>
                <TableHead>Ρόλος</TableHead>
                <TableHead className="hidden md:table-cell">Δεξιότητες</TableHead>
                <TableHead className="text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserX className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 mb-1">Δεν βρέθηκε προσωπικό</p>
                        <p className="text-sm text-gray-500">
                          {staff.length === 0
                            ? "Ξεκινήστε προσθέτοντας το πρώτο μέλος"
                            : "Δοκιμάστε να αλλάξετε τα φίλτρα"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{getStatusIcon(s.status)}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(s.role)}>
                        {s.role === "washer" ? "Πλύντης" : "Προσωπικό"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {s.skills && s.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {s.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {workTypeLabels[skill]}
                            </Badge>
                          ))}
                          {s.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{s.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(s)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDeleteStaff(s.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
