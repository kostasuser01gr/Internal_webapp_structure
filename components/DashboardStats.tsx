import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, ClipboardList, Clock, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react";
import { DashboardStats as Stats } from "@/components/types";

interface DashboardStatsProps {
  stats: Stats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Συνολικά Οχήματα",
      value: stats.totalVehicles.toString(),
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Καταχωρήσεις Σήμερα",
      value: stats.todayEntries.toString(),
      icon: ClipboardList,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Εκκρεμείς Εργασίες",
      value: stats.pendingWork.toString(),
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Ολοκληρώθηκαν Σήμερα",
      value: stats.completedToday.toString(),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Μέσος Χρόνος",
      value: `${stats.avgDuration} λεπτά`,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Έσοδα Σήμερα",
      value: `€${stats.revenue}`,
      icon: DollarSign,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
