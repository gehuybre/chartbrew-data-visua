# ChartBrew-Style Reporting Platform

A comprehensive reporting platform that presents data visualizations in a long-read format with searchable content and uniform styling configuration.

**Experience Qualities**: 
1. Professional - Clean, business-ready interface that conveys credibility and expertise
2. Readable - Typography and layout optimized for consuming detailed reports and data insights  
3. Configurable - Flexible theming system allowing consistent branding across all reports

**Complexity Level**: Light Application (multiple features with basic state)
- Manages report data, search functionality, and configuration settings while maintaining focus on content presentation

## Essential Features

### Report Overview Dashboard
- **Functionality**: Display grid of all available reports with previews and metadata
- **Purpose**: Provide quick navigation and discovery of reports 
- **Trigger**: Landing page load
- **Progression**: Load reports → Display grid with thumbnails → Click to view full report
- **Success criteria**: All reports visible with clear titles, descriptions, and visual previews

### Individual Report Viewer  
- **Functionality**: Present full report with charts, markdown content, and styling
- **Purpose**: Deliver detailed data insights in readable long-form format
- **Trigger**: Click on report from overview or direct URL
- **Progression**: Select report → Load chart data → Render markdown content → Display with configured styling
- **Success criteria**: Charts load correctly, markdown renders properly, consistent styling applied

### Search and Filter System
- **Functionality**: Real-time search through report titles, descriptions, and content
- **Purpose**: Enable quick discovery of relevant reports and insights
- **Trigger**: Type in search input field
- **Progression**: Enter search terms → Filter results in real-time → Highlight matching content
- **Success criteria**: Accurate filtering, fast response, clear indication of matches

### Configuration Management
- **Functionality**: Define report styling, chart colors, and layout preferences
- **Purpose**: Maintain brand consistency and visual coherence across reports
- **Trigger**: Admin access to config panel or file-based configuration
- **Progression**: Access config → Modify settings → Apply changes → Preview updates
- **Success criteria**: Changes reflect immediately, settings persist, fallback to defaults

## Edge Case Handling
- **No Reports Available**: Show empty state with guidance for adding reports
- **Chart Loading Failures**: Display placeholder with retry option and error message
- **Search No Results**: Clear messaging with suggestions and option to clear filters  
- **Invalid Markdown**: Graceful fallback rendering with error indication
- **Missing Configuration**: Use sensible defaults when config values are unavailable

## Design Direction
The design should feel professional and academic, similar to research publications or corporate dashboards, with emphasis on readability and data clarity over visual flair.

## Color Selection
Analogous (adjacent colors on color wheel) - Using blues and blue-greens to create a cohesive, trustworthy feeling reminiscent of financial and analytical platforms.

- **Primary Color**: Deep Blue (oklch(0.45 0.15 240)) - Conveys trust and professionalism for headers and key actions
- **Secondary Colors**: Slate Blue (oklch(0.55 0.08 250)) for supporting elements, Light Blue (oklch(0.75 0.06 230)) for backgrounds
- **Accent Color**: Teal (oklch(0.65 0.12 200)) - Attention-grabbing highlight for CTAs and data points
- **Foreground/Background Pairings**: 
  - Background (Light Gray oklch(0.98 0.005 240)): Dark Blue text (oklch(0.25 0.08 240)) - Ratio 11.2:1 ✓
  - Card (White oklch(1 0 0)): Dark Blue text (oklch(0.25 0.08 240)) - Ratio 13.8:1 ✓  
  - Primary (Deep Blue oklch(0.45 0.15 240)): White text (oklch(1 0 0)) - Ratio 7.1:1 ✓
  - Accent (Teal oklch(0.65 0.12 200)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓

## Font Selection
Typography should emphasize legibility and hierarchy, using a modern sans-serif for headings and a readable serif for body content to enhance long-form reading.

- **Typographic Hierarchy**: 
  - H1 (Report Titles): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal spacing  
  - H3 (Chart Titles): Inter Medium/18px/normal spacing
  - Body Text: Crimson Text Regular/16px/relaxed line height (1.6)
  - Metadata: Inter Regular/14px/normal spacing

## Animations
Subtle and functional animations that guide attention to loading states and transitions without distracting from content consumption.

- **Purposeful Movement**: Smooth transitions between reports, gentle loading states for charts, subtle hover effects on interactive elements
- **Hierarchy of Movement**: Chart loading animations get priority, followed by page transitions, with minimal decoration on UI elements

## Component Selection
- **Components**: Card for report previews, Dialog for configuration, Input for search, Tabs for report sections, ScrollArea for long content, Skeleton for loading states
- **Customizations**: Custom chart containers with consistent padding, specialized markdown renderer component, configurable color scheme provider
- **States**: Hover states on report cards with subtle elevation, loading states with branded spinners, focus states with clear outlines
- **Icon Selection**: Search (MagnifyingGlass), Settings (Gear), Chart types (ChartBar, ChartPie), Navigation (ArrowLeft, ArrowRight)
- **Spacing**: Consistent 1rem base spacing, 2rem between major sections, 0.5rem for related elements
- **Mobile**: Single column layout for reports, collapsible search/filter panel, touch-friendly navigation controls