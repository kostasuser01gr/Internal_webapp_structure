import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Clock } from 'lucide-react';

export function ReportsAnalytics() {
  // Mock data for charts
  const dailyData = [
    { day: 'Δευτ', vehicles: 45, revenue: 520 },
    { day: 'Τρίτ', vehicles: 52, revenue: 680 },
    { day: 'Τετ', vehicles: 38, revenue: 450 },
    { day: 'Πέμ', vehicles: 61, revenue: 790 },
    { day: 'Παρ', vehicles: 73, revenue: 950 },
    { day: 'Σάβ', vehicles: 85, revenue: 1120 },
    { day: 'Κυρ', vehicles: 42, revenue: 530 },
  ];

  const workTypeData = [
    { name: 'Premium Πλήρης', value: 35, color: '#3B82F6' },
    { name: 'Εξωτερικό', value: 45, color: '#10B981' },
    { name: 'Εσωτερικό', value: 25, color: '#F59E0B' },
    { name: 'Απολύμανση', value: 20, color: '#EF4444' },
    { name: 'Detailing', value: 15, color: '#8B5CF6' },
  ];

  const companyComparison = [
    { month: 'Ιαν', company1: 450, company2: 380 },
    { month: 'Φεβ', company1: 520, company2: 420 },
    { month: 'Μαρ', company1: 580, company2: 490 },
    { month: 'Απρ', company1: 620, company2: 550 },
    { month: 'Μάι', company1: 690, company2: 610 },
    { month: 'Ιούν', company1: 720, company2: 680 },
  ];

  const performanceMetrics = [
    { title: 'Μέση Ανάπτυξη', value: '+15.3%', trend: 'up', icon: TrendingUp },
    { title: 'Μείωση Χρόνου', value: '-8.5%', trend: 'down', icon: Clock },
    { title: 'Αύξηση Εσόδων', value: '+22.7%', trend: 'up', icon: DollarSign },
    { title: 'Ικανοποίηση', value: '94%', trend: 'up', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">Αναφορές & Αναλύσεις</h2>
        <p className="text-gray-600">Στατιστικά και insights για τις εργασίες σας</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-2xl mt-1">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  metric.trend === 'up' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <metric.icon className={`h-5 w-5 ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList>
          <TabsTrigger value="daily">Ημερήσια</TabsTrigger>
          <TabsTrigger value="worktype">Τύποι Εργασιών</TabsTrigger>
          <TabsTrigger value="comparison">Σύγκριση Εταιρειών</TabsTrigger>
        </TabsList>

        {/* Daily Performance */}
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Ημερήσια Απόδοση</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="vehicles" fill="#3B82F6" name="Οχήματα" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="Έσοδα (€)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Type Distribution */}
        <TabsContent value="worktype">
          <Card>
            <CardHeader>
              <CardTitle>Κατανομή Τύπων Εργασιών</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={workTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {workTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {workTypeData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.value} εργασίες</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Comparison */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Σύγκριση Εταιρειών (6 μήνες)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={companyComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="company1"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="AutoClean Premium"
                  />
                  <Line
                    type="monotone"
                    dataKey="company2"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="SpeedWash Express"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
