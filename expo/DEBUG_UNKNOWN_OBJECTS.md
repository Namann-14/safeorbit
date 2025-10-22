# Debugging "Unknown Object" Issue

## What I Fixed

### 1. **Enhanced Class Name Matching**
The `getClassColor` function now handles multiple naming formats:
- ✅ Exact match (e.g., `oxygen_cylinder`)
- ✅ Normalized match (lowercase + underscores)
- ✅ With/without `_cylinder` suffix
- ✅ Falls back to showing actual name instead of "Unknown"

### 2. **Added More Class Variants**
Expanded the `CLASS_COLORS` mapping to include:
```typescript
// Now supports all these formats:
'oxygen_cylinder' → Oxygen (Blue)
'oxygen'          → Oxygen (Blue)
'nitrogen_cylinder' → Nitrogen (Purple)
'nitrogen'        → Nitrogen (Purple)
'co2_cylinder'    → CO2 (Green)
'co2'             → CO2 (Green)
'carbon_dioxide'  → CO2 (Green)
// ... and more
```

### 3. **Enhanced Debug Logging**
Added comprehensive logging to track what's happening:

```typescript
// Logs all object names from backend
console.log('🎯 Detection result:', {
  allObjectNames: ['oxygen_cylinder', 'nitrogen', ...],
  // ...
});

// Logs unknown classes
console.log('❓ Unknown class detected:', 'some_class_name');
```

## How to Debug

### Step 1: Check Console Logs
When you run live scan, look for these logs:

```
📸 Captured photo: { width: 480, height: 640, aspect: '0.75' }
🎯 Detection result: {
  objects: 2,
  imageSize: [640, 640],
  allObjectNames: ['oxygen_cylinder', 'nitrogen_cylinder'], // ← Check this!
  firstBox: { name: 'oxygen_cylinder', bbox: {...} }
}
```

### Step 2: Check for Unknown Classes
If you see this log:
```
❓ Unknown class detected: some_weird_name (normalized: some_weird_name)
```

That means the backend is sending a class name that's not in our mapping.

### Step 3: Add Missing Classes
If you find an unknown class, add it to `CLASS_COLORS`:

```typescript
const CLASS_COLORS: Record<string, { color: string; bgColor: string; name: string }> = {
  // ... existing colors
  'your_new_class': {
    color: '#HEXCODE',
    bgColor: 'rgba(R, G, B, 0.15)',
    name: 'Display Name',
  },
};
```

## Common Issues & Solutions

### Issue: Shows "Unknown" instead of object name
**Cause**: Class name from backend doesn't match any variant in `CLASS_COLORS`

**Solution**: 
1. Check console for `❓ Unknown class detected:` log
2. Add that class name to `CLASS_COLORS` mapping
3. Restart the app

### Issue: Wrong color for object
**Cause**: Class name is matching wrong entry in `CLASS_COLORS`

**Solution**: 
1. Check the `allObjectNames` log
2. Verify the exact format backend is sending
3. Update the mapping key to match exactly

### Issue: Object shows actual backend name (e.g., "oxygen_cylinder")
**Current Behavior**: This is now intentional! If a class is unknown, we show the actual name instead of generic "Unknown"

**To Change**: Add proper mapping in `CLASS_COLORS` for clean display name

## Testing Steps

1. **Start Live Scan**
2. **Open Developer Console** (check logs in Metro bundler or device logs)
3. **Point camera at cylinders**
4. **Check logs for**:
   - ✅ `🎯 Detection result:` - Shows all detected object names
   - ⚠️ `❓ Unknown class detected:` - Shows any unmapped classes
5. **Verify detection tray shows correct names and colors**

## Expected Behavior

### If class is mapped:
```
Detection Tray:
🔵 Oxygen              95%
🟣 Nitrogen    ×2      92%
```

### If class is not mapped (but improved):
```
Detection Tray:
⚫ oxygen_cylinder      95%  ← Shows actual name, gray color
🟣 Nitrogen    ×2      92%  ← Mapped classes still work
```

## Quick Reference: Current Mappings

| Backend Name | Display Name | Color |
|--------------|--------------|-------|
| oxygen_cylinder / oxygen | Oxygen | 🔵 Blue |
| nitrogen_cylinder / nitrogen | Nitrogen | 🟣 Purple |
| acetylene_cylinder / acetylene | Acetylene | 🟡 Yellow |
| co2_cylinder / co2 / carbon_dioxide | CO2 | 🟢 Green |
| argon_cylinder / argon | Argon | 🔷 Cyan |
| hydrogen_cylinder / hydrogen | Hydrogen | 🔴 Red |
| helium_cylinder / helium | Helium | 🟠 Orange |
| lpg_cylinder / lpg | LPG | 🩷 Pink |
| cylinder | Cylinder | ⚪ Blue Gray |
| *anything else* | *actual name* | ⚫ Gray |

## Next Steps

1. **Test the live scan** and check if objects now show correct names
2. **Check console logs** for any `❓ Unknown class` messages
3. **Report back** with the exact class names from the logs if still seeing issues
4. I can then add those specific class names to the mapping

## Code Location

All color mappings are in:
```
e:\safeorbit\app\app\(tabs)\live-scan.tsx
Lines ~108-190
```

Look for `CLASS_COLORS` constant and `getClassColor` function.
