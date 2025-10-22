# Color-Coded Detection System

## Overview
The live scan feature now uses a color-coded system to distinguish between different cylinder types, making it easier to identify objects at a glance.

## Color Mappings

### Cylinder Types

| Cylinder Type | Color | Hex Code | Visual |
|--------------|-------|----------|--------|
| **Oxygen** | Blue | `#4285F4` | 🔵 |
| **Nitrogen** | Purple | `#9C27B0` | 🟣 |
| **Acetylene** | Yellow | `#F4B400` | 🟡 |
| **CO2** | Green | `#0F9D58` | 🟢 |
| **Argon** | Cyan | `#00BCD4` | 🔷 |
| **Hydrogen** | Red | `#DB4437` | 🔴 |
| **Helium** | Orange | `#FF9800` | 🟠 |
| **LPG** | Pink | `#E91E63` | 🩷 |
| **Unknown** | Gray | `#757575` | ⚫ |

## Features

### 1. **Color-Coded Bounding Boxes**
- Each detected object gets a unique color based on its class
- Border, background, and label all use the same color scheme
- 15% opacity background for subtle highlighting

### 2. **Smart Label Positioning**
- Labels automatically position **inside** the box if there's enough room
- Falls back to **outside/above** for small objects
- Prevents text overflow with `numberOfLines={1}` and proper width constraints
- Fixed the "nitrogen cylinder" text coordinate issue

### 3. **Live Legend Panel**
- Shows on the **right side** of the screen
- Only displays when objects are detected
- Dynamically updates to show only currently detected classes
- Compact design (140px max width) with color swatches
- Automatically hides when debug panel is shown

### 4. **Corner Accents**
- Corner markers now match the class color
- Dynamic color application through style prop override
- Maintains visual consistency across all UI elements

## Implementation Details

### Color Configuration
```typescript
const CLASS_COLORS: Record<string, { color: string; bgColor: string; name: string }> = {
  'oxygen_cylinder': {
    color: '#4285F4',
    bgColor: 'rgba(66, 133, 244, 0.15)',
    name: 'Oxygen',
  },
  // ... more mappings
};
```

### Usage
```typescript
const classColor = getClassColor(detection.name);
// Returns: { color: string, bgColor: string, name: string }
```

### Smart Label Positioning Logic
```typescript
const labelHeight = 28;
const labelFitsInside = boxHeight > labelHeight + 10;
const labelTop = labelFitsInside ? 5 : -labelHeight - 5;
```

## Benefits

✅ **Instant Recognition** - Different colors for different cylinder types
✅ **Better UX** - No more overlapping or misaligned labels
✅ **Clean UI** - Legend only shows relevant classes
✅ **Production Ready** - Handles edge cases (small boxes, long names)
✅ **Extensible** - Easy to add new classes with colors

## UI Layout

```
┌─────────────────────────────┐
│ [Status Bar]                │ ← Top: Connection + Scanning status
│                             │
│        [Debug Panel]        │ ← Left: Performance metrics (toggle)
│                             │
│                [Legend]     │ ← Right: Color legend (auto)
│                             │
│     ┌─────────────┐         │
│     │   GRID      │         │ ← Center: Detection grid
│     │   FRAME     │         │
│     │             │         │
│     │  📦 Objects │         │ ← Colored boxes with labels
│     │             │         │
│     └─────────────┘         │
│                             │
│   [Instructions/Button]     │ ← Bottom: Controls
└─────────────────────────────┘
```

## Future Enhancements

- [ ] User-customizable colors
- [ ] Color blind mode (patterns/textures)
- [ ] Export legend to scan history
- [ ] Multi-language label names
- [ ] Confidence-based color intensity

## Technical Notes

### Label Text Overflow Fix
The previous implementation had labels that could overflow and misalign coordinates. Fixed by:
1. Using `numberOfLines={1}` to truncate long text
2. Setting `maxWidth: boxWidth` to constrain label size
3. Smart positioning logic to place inside when possible
4. Proper font sizing (`fontSize: 11`) for readability

### Performance
- Legend uses `Array.from(new Set(...))` to deduplicate classes
- Memoized color lookups via `getClassColor()` helper
- Minimal re-renders with proper key management

### Accessibility
- High contrast colors for visibility
- Clear visual separation between classes
- Text labels remain readable at all sizes
