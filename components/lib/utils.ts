import { companies } from "./mockData";

/**
 * Get company information by ID
 */
export function getCompanyById(companyId: string) {
  return companies.find((c) => c.id === companyId);
}

/**
 * Get company name by ID
 */
export function getCompanyName(companyId: string): string {
  return getCompanyById(companyId)?.name || "N/A";
}

/**
 * Get company color by ID
 */
export function getCompanyColor(companyId: string): string {
  return getCompanyById(companyId)?.color || "#6B7280";
}

/**
 * Format license plate for display (uppercase)
 */
export function formatLicensePlate(plate: string): string {
  return plate.toUpperCase();
}

/**
 * Calculate total cost from work entries
 */
export function calculateTotalCost(entries: Array<{ cost: number }>): number {
  return entries.reduce((sum, entry) => sum + entry.cost, 0);
}

/**
 * Calculate total duration from work entries
 */
export function calculateTotalDuration(entries: Array<{ duration: number }>): number {
  return entries.reduce((sum, entry) => sum + entry.duration, 0);
}

/**
 * Calculate average duration from work entries
 */
export function calculateAverageDuration(entries: Array<{ duration: number }>): number {
  if (entries.length === 0) return 0;
  const total = calculateTotalDuration(entries);
  return Math.round(total / entries.length);
}

/**
 * Format currency to Euro
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/**
 * Format date to Greek locale
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Format datetime to Greek locale
 */
export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get time ago string (e.g., "2 ώρες πριν")
 */
export function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "τώρα";
  if (diffMins < 60) return `${diffMins} λεπτά πριν`;
  if (diffHours < 24) return `${diffHours} ώρες πριν`;
  if (diffDays < 7) return `${diffDays} μέρες πριν`;

  return formatDate(date);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Validate Greek license plate format
 */
export function isValidLicensePlate(plate: string): boolean {
  // Greek format: XXX-0000 or XXX0000
  const regex = /^[Α-Ωα-ωA-Za-z]{3}-?\d{4}$/;
  return regex.test(plate);
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
