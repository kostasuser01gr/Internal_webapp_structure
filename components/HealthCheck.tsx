import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  XCircle,
  Zap,
  Database,
  TrendingUp,
  AlertCircle,
  Wrench
} from 'lucide-react';
import { HealthCheckResult, HealthCheckIssue, Vehicle, Staff, Shift, Reservation, LeaveRequest } from '@/components/types';
import { HealthCheckService } from '@/components/lib/healthCheck';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

interface HealthCheckProps {
  vehicles: Vehicle[];
  staff: Staff[];
  shifts: Shift[];
  reservations: Reservation[];
  leaveRequests: LeaveRequest[];
  onAutoFix?: (issueId: string) => void;
}

export function HealthCheck({
  vehicles,
  staff,
  shifts,
  reservations,
  leaveRequests,
  onAutoFix
}: HealthCheckProps) {
  const [healthResult, setHealthResult] = useState<HealthCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const runHealthCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      const result = HealthCheckService.runHealthCheck(
        vehicles,
        staff,
        shifts,
        reservations,
        leaveRequests
      );
      setHealthResult(result);
      setIsChecking(false);
    }, 500);
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      runHealthCheck();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, vehicles, staff, shifts, reservations, leaveRequests]);

  const getStatusIcon = (severity: string) => {
    switch (severity) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (severity: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      healthy: 'default',
      info: 'secondary',
      warning: 'outline',
      critical: 'destructive'
    };

    const labels: Record<string, string> = {
      healthy: 'Υγιές',
      info: 'Πληροφορία',
      warning: 'Προειδοποίηση',
      critical: 'Κρίσιμο'
    };

    return (
      <Badge variant={variants[severity] || 'default'}>
        {labels[severity] || severity}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data-integrity':
        return <Database className="h-4 w-4" />;
      case 'performance':
        return <TrendingUp className="h-4 w-4" />;
      case 'system':
        return <Zap className="h-4 w-4" />;
      case 'conflicts':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'data-integrity': 'Ακεραιότητα Δεδομένων',
      'performance': 'Απόδοση',
      'system': 'Σύστημα',
      'conflicts': 'Συγκρούσεις'
    };
    return labels[category] || category;
  };

  const groupIssuesByCategory = (issues: HealthCheckIssue[]) => {
    const grouped = new Map<string, HealthCheckIssue[]>();
    issues.forEach(issue => {
      if (!grouped.has(issue.category)) {
        grouped.set(issue.category, []);
      }
      grouped.get(issue.category)!.push(issue);
    });
    return grouped;
  };

  const groupIssuesBySeverity = (issues: HealthCheckIssue[]) => {
    const grouped = new Map<string, HealthCheckIssue[]>();
    issues.forEach(issue => {
      if (!grouped.has(issue.severity)) {
        grouped.set(issue.severity, []);
      }
      grouped.get(issue.severity)!.push(issue);
    });
    return grouped;
  };

  if (!healthResult) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const criticalCount = healthResult.issues.filter(i => i.severity === 'critical').length;
  const warningCount = healthResult.issues.filter(i => i.severity === 'warning').length;
  const infoCount = healthResult.issues.filter(i => i.severity === 'info').length;
  const autoFixableCount = healthResult.issues.filter(i => i.autoFixable).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {getStatusIcon(healthResult.status)}
              </div>
              <div>
                <CardTitle>Έλεγχος Υγείας Συστήματος</CardTitle>
                <CardDescription>
                  Τελευταίος έλεγχος: {format(healthResult.lastCheck, 'dd MMM yyyy, HH:mm', { locale: el })}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Αυτόματη Ανανέωση' : 'Μη Αυτόματη'}
              </Button>
              <Button
                onClick={runHealthCheck}
                disabled={isChecking}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                Έλεγχος Τώρα
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {getStatusIcon(healthResult.status)}
                <div>
                  <p className="font-medium">Κατάσταση Συστήματος</p>
                  <p className="text-sm text-muted-foreground">
                    {healthResult.issues.length === 0
                      ? 'Όλα λειτουργούν άριστα!'
                      : `${healthResult.issues.length} θέμα${healthResult.issues.length > 1 ? 'τα' : ''} εντοπίστηκ${healthResult.issues.length > 1 ? 'αν' : 'ε'}`
                    }
                  </p>
                </div>
              </div>
              {getStatusBadge(healthResult.status)}
            </div>

            {/* Performance Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm">Βαθμολογία Απόδοσης</p>
                <p className="text-sm">{healthResult.metrics.performanceScore}/100</p>
              </div>
              <Progress value={healthResult.metrics.performanceScore} />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Κρίσιμα</span>
                </div>
                <p className="text-2xl mt-1">{criticalCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Προειδοποιήσεις</span>
                </div>
                <p className="text-2xl mt-1">{warningCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Πληροφορίες</span>
                </div>
                <p className="text-2xl mt-1">{infoCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Αυτόματη Διόρθωση</span>
                </div>
                <p className="text-2xl mt-1">{autoFixableCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Μετρήσεις Συστήματος</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Οχήματα</p>
              <p className="text-2xl">{healthResult.metrics.totalVehicles}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Προσωπικό</p>
              <p className="text-2xl">{healthResult.metrics.totalStaff}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Βάρδιες</p>
              <p className="text-2xl">{healthResult.metrics.totalShifts}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Κρατήσεις</p>
              <p className="text-2xl">{healthResult.metrics.totalReservations}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Συγκρούσεις</p>
              <p className="text-2xl text-red-500">{healthResult.metrics.conflicts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues */}
      {healthResult.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Εντοπισμένα Θέματα</CardTitle>
            <CardDescription>
              Αναλυτική λίστα όλων των θεμάτων που εντοπίστηκαν
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Όλα ({healthResult.issues.length})</TabsTrigger>
                <TabsTrigger value="critical">Κρίσιμα ({criticalCount})</TabsTrigger>
                <TabsTrigger value="category">Κατηγορία</TabsTrigger>
                <TabsTrigger value="fixable">Διορθώσιμα ({autoFixableCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {healthResult.issues.map((issue) => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        onAutoFix={onAutoFix}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="critical">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {healthResult.issues
                      .filter(i => i.severity === 'critical')
                      .map((issue) => (
                        <IssueCard
                          key={issue.id}
                          issue={issue}
                          onAutoFix={onAutoFix}
                        />
                      ))}
                    {criticalCount === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                        <p>Δεν υπάρχουν κρίσιμα θέματα!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="category">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {Array.from(groupIssuesByCategory(healthResult.issues)).map(([category, issues]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center gap-2 py-2">
                          {getCategoryIcon(category)}
                          <h4 className="font-medium">{getCategoryLabel(category)} ({issues.length})</h4>
                        </div>
                        <div className="space-y-2 pl-6">
                          {issues.map((issue) => (
                            <IssueCard
                              key={issue.id}
                              issue={issue}
                              onAutoFix={onAutoFix}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="fixable">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {healthResult.issues
                      .filter(i => i.autoFixable)
                      .map((issue) => (
                        <IssueCard
                          key={issue.id}
                          issue={issue}
                          onAutoFix={onAutoFix}
                        />
                      ))}
                    {autoFixableCount === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Info className="h-12 w-12 mx-auto mb-2" />
                        <p>Δεν υπάρχουν θέματα για αυτόματη διόρθωση.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* No Issues */}
      {healthResult.issues.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl mb-2">Τέλειο! Δεν Εντοπίστηκαν Θέματα</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Το σύστημα λειτουργεί άριστα. Όλα τα δεδομένα είναι ακέραια και δεν υπάρχουν συγκρούσεις.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function IssueCard({ issue, onAutoFix }: { issue: HealthCheckIssue; onAutoFix?: (issueId: string) => void }) {
  const getStatusIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-900 bg-yellow-50/50 dark:bg-yellow-950/20';
      case 'critical':
        return 'border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20';
      default:
        return 'border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <Alert className={getSeverityColor(issue.severity)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3 flex-1">
          <div className="mt-0.5">
            {getStatusIcon(issue.severity)}
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-medium">{issue.title}</h4>
            <AlertDescription>{issue.description}</AlertDescription>
            {issue.affectedItems && issue.affectedItems.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Επηρεάζει: {issue.affectedItems.length} στοιχεί{issue.affectedItems.length > 1 ? 'α' : 'ο'}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {format(issue.timestamp, 'dd MMM yyyy, HH:mm', { locale: el })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {issue.autoFixable && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAutoFix?.(issue.id)}
            >
              <Wrench className="h-3 w-3 mr-1" />
              Διόρθωση
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
}
