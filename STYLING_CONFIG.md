# Report Styling Configuration

This document defines the visual styling configuration for the ChartBrew Reports platform. All styling is controlled through CSS custom properties that can be easily modified to match your brand.

## Color Configuration

### Primary Theme Colors
```css
:root {
  /* Main brand colors */
  --background: oklch(0.98 0.005 240);     /* Page background */
  --foreground: oklch(0.25 0.08 240);     /* Main text color */
  --primary: oklch(0.45 0.15 240);        /* Primary action color */
  --secondary: oklch(0.55 0.08 250);      /* Secondary elements */
  --accent: oklch(0.65 0.12 200);         /* Accent highlights */
  
  /* Chart color palette */
  --chart-primary: oklch(0.45 0.15 240);
  --chart-secondary: oklch(0.65 0.12 200);
  --chart-tertiary: oklch(0.55 0.08 250);
  --chart-quaternary: oklch(0.75 0.06 230);
  --chart-quinary: oklch(0.35 0.12 220);
}
```

### Alternative Color Schemes

#### Corporate Blue
```css
:root {
  --primary: oklch(0.35 0.18 230);
  --secondary: oklch(0.65 0.08 220);
  --accent: oklch(0.55 0.15 210);
}
```

#### Professional Green
```css
:root {
  --primary: oklch(0.45 0.15 150);
  --secondary: oklch(0.55 0.08 140);
  --accent: oklch(0.65 0.12 160);
}
```

## Typography Configuration

### Font Selection
- **Headings**: Inter (sans-serif) - Clean, modern, highly legible
- **Body Text**: Crimson Text (serif) - Optimized for long-form reading
- **UI Elements**: Inter (sans-serif) - Consistent with headings

### Typography Scale
```css
/* Heading sizes */
h1 { font-size: 2rem; font-weight: 700; } /* Report titles */
h2 { font-size: 1.5rem; font-weight: 600; } /* Section headers */
h3 { font-size: 1.25rem; font-weight: 500; } /* Chart titles */

/* Body text */
body { 
  font-size: 1rem; 
  line-height: 1.6; 
  font-family: 'Crimson Text', serif; 
}
```

## Layout Configuration

### Spacing System
- Base spacing unit: 1rem (16px)
- Component spacing: 2rem between major sections
- Related elements: 0.5rem spacing

### Content Width
- Maximum content width: 4xl (896px) for optimal readability
- Chart containers: Full width within content area
- Grid layout: Responsive (1-3 columns based on screen size)

## Chart Styling Guidelines

### Chart Colors
Charts automatically use the defined color palette:
1. Primary: Main data series
2. Secondary: Comparison data
3. Tertiary through Quinary: Additional series

### Chart Typography
- Axis labels: Inter, 12px
- Chart titles: Inter Medium, 18px
- Tooltips: Inter Regular, 14px

## Customization Examples

### To change the primary color:
1. Update `--primary` in `:root`
2. Update `--chart-primary` for charts
3. Verify contrast ratios meet accessibility standards

### To switch to a different font:
1. Add Google Fonts link to `index.html`
2. Update CSS font-family declarations
3. Test readability across all content types

### To adjust spacing:
1. Modify spacing classes in components
2. Update `gap` values in grid layouts
3. Adjust padding/margin in chart containers

## Brand Integration

To integrate your brand colors:

1. **Extract brand colors** - Convert to oklch format for better color handling
2. **Test accessibility** - Ensure 4.5:1 contrast ratio for text
3. **Update CSS variables** - Modify the values in `src/index.css`
4. **Preview changes** - Check across all report types and chart varieties

## Configuration Management

The styling system is designed to be:
- **Centralized** - All colors defined in one location
- **Consistent** - Automatic application across components
- **Flexible** - Easy to modify without touching individual components
- **Accessible** - Built-in contrast and readability considerations