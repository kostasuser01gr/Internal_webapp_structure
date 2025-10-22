# 🔧 Common Fixes & Solutions

## React ForwardRef Warnings

### Problem
```
Warning: Function components cannot be given refs. 
Attempts to access this ref will fail. 
Did you mean to use React.forwardRef()?
```

### Common Causes

#### 1. DialogTrigger with asChild + Button
**❌ Wrong:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button onClick={handleClick}>
      Open Dialog
    </Button>
  </DialogTrigger>
  <DialogContent>...</DialogContent>
</Dialog>
```

**✅ Correct:**
```tsx
<Button onClick={() => setIsOpen(true)}>
  Open Dialog
</Button>
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>...</DialogContent>
</Dialog>
```

#### 2. SheetTrigger with asChild + Button
**❌ Wrong:**
```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent>...</SheetContent>
</Sheet>
```

**✅ Correct:**
```tsx
<Button onClick={() => setIsOpen(true)}>Open</Button>
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent>...</SheetContent>
</Sheet>
```

#### 3. DropdownMenuTrigger with asChild
**❌ Wrong:**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>...</DropdownMenuContent>
</DropdownMenu>
```

**✅ Correct - Option 1 (Remove asChild):**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>...</DropdownMenuContent>
</DropdownMenu>
```

**✅ Correct - Option 2 (Use controlled state):**
```tsx
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(!isOpen)}>Menu</Button>
<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
  <DropdownMenuContent>...</DropdownMenuContent>
</DropdownMenu>
```

---

## General Rules

### When to Use `asChild`

**✅ Use asChild when:**
- Wrapping a custom component that forwards refs properly
- Using with `React.forwardRef()` components
- Radix UI documentation specifically requires it

**❌ Avoid asChild when:**
- Using with standard Button components
- You can use controlled state instead
- Getting ref warnings

### Pattern: Controlled Components

Most Radix UI components support controlled state:

```tsx
// Instead of using Trigger + asChild
const [isOpen, setIsOpen] = useState(false);

// Control via state
<Button onClick={() => setIsOpen(true)}>Open</Button>
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </DialogContent>
</Dialog>
```

---

## Date-fns Import Errors

### Problem
```
Module not found: date-fns/locale
```

### Solution
```tsx
// ✅ Correct import
import { el } from 'date-fns/locale';

// ✅ Or with default import
import { el as elLocale } from 'date-fns/locale';
```

---

## Missing Dependencies

### Problem
```
Cannot find module 'X'
```

### Solution
Check if you need to import from the correct path:

```tsx
// Components
import { Button } from './components/ui/button';

// Types
import { Vehicle } from '../types';

// Utils
import { cn } from '../lib/utils';

// Data
import { companies } from '../lib/mockData';
```

---

## TypeScript Errors

### Problem: Type 'string' is not assignable to type 'WorkType'

**❌ Wrong:**
```tsx
const workType = 'premium-full'; // string
```

**✅ Correct:**
```tsx
import { WorkType } from '../types';

const workType: WorkType = 'premium-full';
// or
const workType = 'premium-full' as WorkType;
```

### Problem: Object is possibly 'undefined'

**❌ Wrong:**
```tsx
const name = user.name; // if user can be undefined
```

**✅ Correct:**
```tsx
const name = user?.name || 'Unknown';
// or
const name = user ? user.name : 'Unknown';
```

---

## CSS/Tailwind Issues

### Problem: Styles not applying

**Check these:**
1. Tailwind classes are correct
2. No conflicting styles
3. `className` not `class`
4. Conditional classes use `cn()` utility

```tsx
// ✅ Correct
import { cn } from '../lib/utils';

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-class"
)}>
```

---

## Performance Issues

### Problem: Component re-renders too often

**Solution: Use React.memo and useMemo**

```tsx
import { useMemo, memo } from 'react';

// Memoize expensive calculations
const filteredData = useMemo(() => {
  return data.filter(item => item.status === 'active');
}, [data]);

// Memoize component
export const MyComponent = memo(({ data }) => {
  return <div>{data.map(...)}</div>;
});
```

---

## State Management

### Problem: State not updating

**Common mistakes:**

```tsx
// ❌ Wrong: Mutating state
setState(state.push(newItem));

// ✅ Correct: Creating new array
setState([...state, newItem]);

// ❌ Wrong: Mutating object
setState({ ...state, name: 'New Name' }); // if nested objects
setState(state.property = 'new value');

// ✅ Correct: Creating new object
setState({ ...state, name: 'New Name' });
// For nested:
setState({
  ...state,
  nested: {
    ...state.nested,
    property: 'new value'
  }
});
```

---

## Event Handlers

### Problem: onClick not working

```tsx
// ❌ Wrong: Calling function immediately
<Button onClick={handleClick()}>

// ✅ Correct: Passing function reference
<Button onClick={handleClick}>

// ✅ Correct: With parameters
<Button onClick={() => handleClick(param)}>

// ✅ Correct: With event
<Button onClick={(e) => handleClick(e, param)}>
```

---

## Conditional Rendering

### Problem: "0" or "false" showing in UI

```tsx
// ❌ Wrong: Can render 0
{count && <div>{count} items</div>}

// ✅ Correct
{count > 0 && <div>{count} items</div>}
// or
{!!count && <div>{count} items</div>}

// ❌ Wrong: Can render "false"
{isActive && <Badge>Active</Badge>}

// ✅ Correct: Use ternary for boolean
{isActive ? <Badge>Active</Badge> : null}
```

---

## Form Handling

### Problem: Form submits but page refreshes

```tsx
// ❌ Wrong
<form onSubmit={handleSubmit}>

// ✅ Correct
<form onSubmit={(e) => {
  e.preventDefault();
  handleSubmit();
}}>
```

---

## Array Keys

### Problem: Warning about missing key prop

```tsx
// ❌ Wrong: Using index as key
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}

// ✅ Correct: Using unique identifier
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}

// ✅ Acceptable: If items never reorder and have no ID
{items.map((item, index) => (
  <div key={`${item.name}-${index}`}>{item.name}</div>
))}
```

---

## Async/Await

### Problem: Unhandled promise rejection

```tsx
// ❌ Wrong
const handleSubmit = async () => {
  await api.submit(data);
  // No error handling
};

// ✅ Correct
const handleSubmit = async () => {
  try {
    await api.submit(data);
    toast.success('Success!');
  } catch (error) {
    toast.error('Error: ' + error.message);
  }
};
```

---

## Date Handling

### Problem: Invalid Date

```tsx
// ❌ Wrong: String comparison
if (date1 > date2) // if dates are strings

// ✅ Correct: Convert to Date objects
if (new Date(date1) > new Date(date2))

// ✅ Better: Use date-fns
import { isAfter, isBefore, parseISO } from 'date-fns';

if (isAfter(parseISO(date1), parseISO(date2)))
```

---

## Debugging Tips

### Console.log Effectively

```tsx
// ❌ Less useful
console.log(data);

// ✅ More useful
console.log('User data:', data);
console.log('Props:', { prop1, prop2, prop3 });
console.table(arrayData); // For arrays
console.dir(object, { depth: null }); // For deep objects
```

### React DevTools

1. Install React DevTools extension
2. Use Components tab to inspect props/state
3. Use Profiler to find performance issues
4. Use Console to access component instances: `$r`

---

## Testing

### Problem: Component not rendering in tests

```tsx
// ✅ Proper test setup
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('button click works', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole('button', { name: /click me/i });
  await userEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

## Quick Reference

### Import Paths
```tsx
// UI Components
import { Button } from './components/ui/button';

// Custom Components  
import { StaffManagement } from './components/StaffManagement';

// Types
import { Staff, Vehicle } from './types';
import type { Staff } from './types'; // type-only import

// Utils
import { cn, generateId } from './lib/utils';

// Data
import { companies, mockStaff } from './lib/mockData';

// Icons
import { Plus, Edit, Trash } from 'lucide-react';

// External
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
```

### Common Patterns

```tsx
// State
const [value, setValue] = useState<Type>(initialValue);

// Effect
useEffect(() => {
  // effect code
  return () => {
    // cleanup
  };
}, [dependencies]);

// Memo
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Callback
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// Ref
const ref = useRef<HTMLDivElement>(null);
```

---

**Keep this guide handy for quick fixes!** 🔧

*Last updated: October 21, 2025*
