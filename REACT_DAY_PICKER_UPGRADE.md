# React Day Picker v9 Upgrade Guide

## Overview

This document summarizes the upgrade from `react-day-picker` v8.10.1 to v9.11.1 to resolve React 19 peer dependency conflicts.

## Problem Statement

The repository was using:
- React 19.2.0
- react-day-picker 8.10.1 (only supports React ^16.8.0 || ^17.0.0 || ^18.0.0)

This caused `ERESOLVE` peer dependency conflicts during Vercel deployments, preventing successful builds.

## Solution

Upgraded to react-day-picker v9.11.1 which supports React 19.

## Key Changes

### 1. Dependencies (package.json)

```json
{
  "engines": {
    "node": ">=20"
  },
  "dependencies": {
    "react-day-picker": "^9.11.1"
  },
  "overrides": {
    "react-day-picker": "^9.11.1"
  }
}
```

### 2. Calendar Component API Changes

The v9 API introduced breaking changes to classNames. Here's the mapping:

| v8 ClassNames | v9 ClassNames | Notes |
|---------------|---------------|-------|
| `caption` | `month_caption` | Caption wrapper |
| `nav_button` | `button_previous`, `button_next` | Split into separate buttons |
| `nav_button_previous` | (merged into `button_previous`) | Positioning now in button class |
| `nav_button_next` | (merged into `button_next`) | Positioning now in button class |
| `table` | `month_grid` | Grid container |
| `head_row` | `weekdays` | Header row |
| `head_cell` | `weekday` | Individual weekday cell |
| `row` | `week` | Week row |
| `cell` | `day` | Day cell container |
| `day` | `day_button` | Day button element |
| `day_selected` | `selected` | Selected state |
| `day_today` | `today` | Today indicator |
| `day_outside` | `outside` | Outside month days |
| `day_disabled` | `disabled` | Disabled state |
| `day_range_start` | `range_start` | Range start |
| `day_range_end` | `range_end` | Range end |
| `day_range_middle` | `range_middle` | Range middle |
| `day_hidden` | `hidden` | Hidden days |

### 3. Components API Changes

**v8:**
```tsx
components={{
  IconLeft: ({ className, ...props }) => <ChevronLeft className={cn("size-4", className)} {...props} />,
  IconRight: ({ className, ...props }) => <ChevronRight className={cn("size-4", className)} {...props} />
}}
```

**v9:**
```tsx
components={{
  Chevron: ({ orientation, ...props }) =>
    orientation === "left" ? (
      <ChevronLeft className="size-4" {...props} />
    ) : (
      <ChevronRight className="size-4" {...props} />
    )
}}
```

### 4. CI/CD Changes

**Before:**
```yaml
- name: Install dependencies
  run: npm ci --legacy-peer-deps
```

**After:**
```yaml
- name: Install dependencies
  run: npm ci
```

### 5. Vercel Configuration

Created `vercel.json` to ensure consistent builds:
```json
{
  "installCommand": "npm ci",
  "buildCommand": "npm run build"
}
```

## Usage Examples

The Calendar component maintains the same external API:

### Single Date Selection

```tsx
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  );
}
```

### Date Range Selection

```tsx
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { DateRange } from "react-day-picker";

function RangePicker() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  
  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
    />
  );
}
```

## Verification

All checks passed:
- ✅ `npm install` - No ERESOLVE errors
- ✅ `npm ci` - Lockfile works correctly
- ✅ `npm run lint` - No new linting errors
- ✅ `npm run typecheck` - Type checking passed
- ✅ `npm run build` - Production build successful

## Migration Steps for Other Projects

1. Update `package.json` dependencies and add overrides
2. Delete `package-lock.json`
3. Run `npm install` to regenerate lockfile
4. Update Calendar component classNames (see mapping above)
5. Update icon components to use new Chevron API
6. Run tests and verify builds
7. Update CI/CD to remove `--legacy-peer-deps`

## Resources

- [react-day-picker v9 Documentation](https://daypicker.dev/)
- [Migration Guide](https://daypicker.dev/docs/upgrading)
- [API Reference](https://daypicker.dev/api)

## Date of Upgrade

October 23, 2025
