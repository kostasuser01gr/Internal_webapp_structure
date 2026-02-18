# 🔧 Troubleshooting Guide - CarWash Pro

Quick solutions to common issues after the empty state update.

---

## 🚨 Emergency Quick Fixes

### Application won't load / White screen

```bash
1. Check browser console (F12)
2. Look for red errors
3. Verify all files saved
4. Clear browser cache (Ctrl+Shift+Delete)
5. Hard refresh (Ctrl+F5)
6. Restart dev server
```

### "Cannot read property of undefined"

```bash
Cause: Missing null safety check
Solution: Verify optional chaining (?.) used
Location: Check the line number in error message
```

### Page crashes when clicking menu item

```bash
1. Check which view is selected
2. Open browser console
3. Note the error message
4. Verify component imports in App.tsx
```

---

## 📋 Component-Specific Issues

### Dashboard

#### Issue: Stats not showing

**Symptoms**: Blank stat cards  
**Solution**:

```javascript
Verify in App.tsx:
- calculateStats() function exists
- Returns proper DashboardStats object
- All values are numbers (not undefined)
```

#### Issue: Health Check widget error

**Solution**: Navigate to Health Check page directly to see detailed error

---

### Vehicles

#### Issue: "Δεν βρέθηκαν οχήματα" not showing

**Symptoms**: Blank page instead of empty state  
**Solution**:

```javascript
Check VehicleTable.tsx:
- Line ~105: Empty state condition present
- filteredVehicles.length === 0 check exists
- TableCell colSpan matches header count
```

#### Issue: Add vehicle form won't open

**Solution**:

```javascript
1. Check App.tsx setCurrentView works
2. Verify VehicleForm component imported
3. Check company data exists in mockData
```

---

### Staff Management

#### Issue: Empty state not displaying

**Solution**:

```javascript
StaffManagement.tsx line ~286:
- Verify filteredStaff.length === 0 check
- TableCell colSpan should be 7
- Icon imports working
```

#### Issue: "Νέο Μέλος" button not working

**Solution**:

```javascript
1. Check Dialog component imported
2. Verify isAddDialogOpen state
3. Check form submission handler
```

#### Issue: Skills not selectable

**Solution**:

```javascript
1. Verify workTypeLabels imported
2. Check toggleSkill function
3. Ensure formData.skills is array
```

---

### Team Chat

#### Issue: Page crashes on load

**Symptoms**: Error about selectedChannel  
**Solution**:

```javascript
TeamChat.tsx:
1. Line ~28: selectedChannel should allow null
   useState<ChatChannel | null>(...)
2. All selectedChannel uses need ?.
   Example: selectedChannel?.id
```

#### Issue: Empty state not showing

**Solution**:

```javascript
Line ~124-138: Check for empty state code:
if (mockChatChannels.length === 0) {
  return (/* empty state JSX */);
}
```

#### Issue: "Δημιουργία Καναλιού" button does nothing

**Expected**: Button is currently a placeholder  
**Future**: Will open dialog to create channel

---

### Shifts

#### Issue: Stats showing NaN

**Solution**:

```javascript
1. Verify all .length operations
2. Check .filter() returns array
3. Ensure numeric operations have defaults
```

#### Issue: Calendar not displaying

**Solution**:

```javascript
1. Check date-fns imported
2. Verify Calendar component from ui
3. Check locale (el) imported
```

#### Issue: Auto-generate doesn't work

**Expected**: Currently logs to console  
**Solution**: Check console for message

---

### Health Check

#### Issue: Always shows errors

**Solution**:

```javascript
healthCheck.ts:
1. Verify all check methods handle empty arrays
2. Check determineOverallStatus logic
3. Ensure no false positives
```

#### Issue: Performance score incorrect

**Solution**:

```javascript
Line ~49: calculatePerformanceScore
- Should return 100 for empty data
- Check division by zero handling
```

---

## 🐛 Common Error Messages

### "map is not a function"

**Cause**: Variable is not an array  
**Solution**:

```javascript
// Before
{items.map(...)}

// After
{items?.map(...) || []}
{Array.isArray(items) && items.map(...)}
```

### "Cannot read property 'id' of null"

**Cause**: Missing null check  
**Solution**:

```javascript
// Before
selectedItem.id;

// After
selectedItem?.id;
```

### "undefined is not an object"

**Cause**: Data not initialized  
**Solution**:

```javascript
// Check mockData.ts
export const mockVehicles: Vehicle[] = []; // ✅
export const mockVehicles; // ❌
```

### "Maximum update depth exceeded"

**Cause**: Infinite re-render loop  
**Solution**:

```javascript
// Check useEffect dependencies
useEffect(() => {
  // code
}, [deps]); // ✅ Include dependencies
```

---

## 🔍 Debugging Steps

### Step 1: Identify Location

```bash
1. Note error message
2. Find file name in error
3. Find line number
4. Open that file
```

### Step 2: Check Console

```bash
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Click error to see stack trace
```

### Step 3: Verify Data

```javascript
// Add console.logs
console.log("vehicles:", vehicles);
console.log("length:", vehicles?.length);
console.log("type:", typeof vehicles);
```

### Step 4: Check Types

```typescript
// Verify types match
const vehicles: Vehicle[] = mockVehicles; // ✅
const vehicles = mockVehicles; // Less safe
```

### Step 5: Test Isolation

```javascript
// Comment out problematic code
{
  /* {vehicles.map(...)} */
}

// If page loads, issue is in that section
```

---

## 📱 Mobile Issues

### Issue: Layout broken on mobile

**Solution**:

```javascript
1. Check responsive classes (md:, lg:)
2. Verify mobile menu toggle
3. Test with DevTools device mode
```

### Issue: Touch targets too small

**Solution**:

```javascript
1. Check button sizes
2. Add p-3 or p-4 for padding
3. Ensure min 44x44px touch targets
```

---

## 🎨 UI Issues

### Issue: Empty state icon not showing

**Solution**:

```javascript
1. Verify lucide-react import
2. Check icon name correct
3. Ensure className includes size (h-6 w-6)
```

### Issue: Colors not displaying

**Solution**:

```javascript
1. Check Tailwind classes valid
2. Verify globals.css loaded
3. Check for typos in class names
```

### Issue: Text overlapping

**Solution**:

```javascript
1. Add truncate class
2. Use max-w-[...] constraint
3. Check flex/grid layouts
```

---

## 🔄 Data Flow Issues

### Issue: Form submits but nothing happens

**Solution**:

```javascript
1. Check onSubmit handler exists
2. Verify state update called
3. Check console for console.log
4. Ensure data structure correct
```

### Issue: Filter not working

**Solution**:

```javascript
1. Check filter function logic
2. Verify state updates
3. Check useMemo dependencies
4. Ensure case-insensitive comparison
```

---

## 💾 State Management Issues

### Issue: State not updating

**Solution**:

```javascript
// Check setter is called
setState(newValue); // ✅
state = newValue; // ❌ Wrong!

// Check proper spread
setState([...oldArray, newItem]); // ✅
setState(oldArray.push(newItem)); // ❌
```

### Issue: Props not passing

**Solution**:

```javascript
// Verify prop names match
<Component data={data} /> // ✅
<Component myData={data} /> // ❌ If expects 'data'
```

---

## 🔐 Type Safety Issues

### Issue: TypeScript errors

**Solution**:

```bash
1. Run: tsc --noEmit
2. Read error messages
3. Fix type mismatches
4. Add type annotations
```

### Issue: "Type 'X' is not assignable to type 'Y'"

**Solution**:

```typescript
// Check type definitions in types/index.ts
// Verify imported types match usage
```

---

## 📊 Performance Issues

### Issue: Slow loading

**Solution**:

```javascript
1. Check for large arrays being processed
2. Use useMemo for expensive operations
3. Implement virtual scrolling for long lists
4. Optimize re-renders
```

### Issue: Memory leak

**Solution**:

```javascript
useEffect(() => {
  const interval = setInterval(...);

  return () => clearInterval(interval); // ✅ Cleanup!
}, []);
```

---

## 🧪 Testing Issues

### Issue: Can't reproduce error

**Solution**:

```bash
1. Clear all browser data
2. Use incognito mode
3. Try different browser
4. Check specific user flow
```

### Issue: Works locally, fails in production

**Solution**:

```bash
1. Check environment variables
2. Verify build process
3. Check production console
4. Test with production build locally
```

---

## 🆘 When All Else Fails

### Nuclear Options

#### 1. Clear Everything

```bash
1. Close all browser tabs
2. Clear browser cache completely
3. Close IDE/editor
4. Restart computer
5. Open fresh
```

#### 2. Verify Files

```bash
1. Check all files saved
2. Verify no uncommitted changes
3. Compare with backup
4. Re-clone if using git
```

#### 3. Check Environment

```bash
1. Node version correct?
2. Dependencies installed?
3. Dev server running?
4. Port conflicts?
```

#### 4. Start Fresh

```bash
1. Delete node_modules
2. Delete package-lock.json
3. npm install
4. npm start
```

---

## 📚 Reference Materials

### Quick Links

- Health Check Report: `/HEALTH_CHECK_RESULT.md`
- Verification Checklist: `/VERIFICATION_CHECKLIST.md`
- Status Report: `/STATUS_REPORT.md`
- App Summary: `/APP_SUMMARY.md`

### Important Files

- Mock Data: `/lib/mockData.ts`
- Type Definitions: `/types/index.ts`
- Main App: `/App.tsx`
- Health Check Logic: `/lib/healthCheck.ts`

---

## 🎯 Prevention Tips

### Before Making Changes

1. ✅ Read relevant documentation
2. ✅ Understand data flow
3. ✅ Check types match
4. ✅ Test in isolation

### After Making Changes

1. ✅ Check browser console
2. ✅ Test all affected views
3. ✅ Verify mobile layout
4. ✅ Run health check

### Best Practices

1. ✅ Use optional chaining (?.)
2. ✅ Check array length before map
3. ✅ Provide default values
4. ✅ Handle null/undefined cases
5. ✅ Add proper TypeScript types

---

## 📞 Getting Help

### Information to Provide

1. Error message (exact text)
2. File and line number
3. What you were trying to do
4. What happened instead
5. Browser console screenshot
6. Code snippet if relevant

### Diagnostic Commands

```javascript
// In browser console:
console.log("mockVehicles:", mockVehicles);
console.log("mockStaff:", mockStaff);
console.log("mockShifts:", mockShifts);
console.log("mockChatChannels:", mockChatChannels);
```

---

## ✅ Verification After Fix

After applying any fix:

1. [ ] Error gone from console
2. [ ] Feature works as expected
3. [ ] No new errors introduced
4. [ ] Mobile layout still works
5. [ ] Other features still work
6. [ ] Health check passes

---

## 🎉 Success!

If issue resolved:

1. Document what fixed it
2. Test thoroughly
3. Check for similar issues elsewhere
4. Continue normal operations

---

**Last Updated**: October 21, 2024  
**Version**: 2.0 - Clean Start Edition

**Need more help?** Review the comprehensive documentation files or check browser console for specific error details.
