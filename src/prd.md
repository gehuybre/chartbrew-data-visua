# ChartBrew Rapporten Platform - PRD

## Core Purpose & Success

**Mission Statement**: Een moderne, gebruiksvriendelijke platform voor het presenteren van data-analyses in uitgebreid leesformaat met interactieve visualisaties en downloadbare charts.

**Success Indicators**: 
- Gebruikers kunnen rapporten eenvoudig doorzoeken en vinden
- Charts zijn duidelijk configureerbaar via JSON bestanden
- Rapporten volgen een uniforme stijl en zijn goed leesbaar
- Elk chart heeft download en embed functionaliteit

**Experience Qualities**: Professioneel, Inzichtelijk, Toegankelijk

## Project Classification & Approach

**Complexity Level**: Light Application - meerdere features met gestructureerde data management

**Primary User Activity**: Consuming - gebruikers lezen rapporten en analyseren data visualisaties

## Essential Features

### Rapport Structuur
- **Folder-gebaseerde organisatie**: Elk rapport heeft eigen folder met CSV data, chart configs, en HTML content
- **Scrollytelling presentatie**: Naadloze mix van tekst en visualisaties in long-read formaat
- **Uniforme styling**: Consistente typografie en visuele hiërarchie

### Chart Configuratie
- **JSON-gebaseerde configuratie**: Gedetailleerde chart instellingen per visualisatie
- **Flexibele styling opties**: Kleurpaletten, lijnstijlen, projecties, arceringen
- **Chart types ondersteuning**: Lijn, bar, taart, area, scatter, radar en meer
- **Download functionaliteit**: CSV export en iframe embed code
- **Animation presets**: Zes themagerichte animatie-stijlen voor enhanced storytelling

### Animation System
- **Thematische presets**: Professional, Dynamic, Smooth, Playful, Minimal, Technical
- **Chart-specifieke animaties**: Aangepaste bewegingen per chart type (bars, lines, pie)
- **Staggered timing**: Elementen animeren individueel voor visuele flow
- **Accessibility conscious**: Respecteert prefers-reduced-motion instellingen
- **Performance optimized**: Hardware-accelerated CSS transforms en transitions

### Zoek & Navigatie
- **Doorzoekbare rapporten**: Filter op titel, tags, auteur, content
- **Rapport overzicht**: Grid layout met cards voor elk rapport
- **Metadata weergave**: Auteur, datum, tags per rapport

## Design Direction

### Visual Tone & Identity
**Emotional Response**: Vertrouwen en professionaliteit met toegankelijke data presentatie
**Design Personality**: Zakelijk maar toegankelijk, modern en clean
**Visual Metaphors**: Data storytelling, documentanalyse, professionele rapportage

### Color Strategy
**Color Scheme Type**: Analogous - blauw-gebaseerd professioneel palet
**Primary Color**: Deep blue (oklch(0.45 0.15 240)) - betrouwbaarheid en professionaliteit
**Secondary Colors**: Teal (oklch(0.65 0.12 200)) en Purple (oklch(0.55 0.08 250)) voor ondersteuning
**Accent Color**: Bright blue (oklch(0.75 0.06 230)) voor CTAs en belangrijke elementen

### Typography System
**Font Pairing Strategy**: Inter voor headings (modern, leesbaar) en Crimson Text voor body (elegant, long-read vriendelijk)
**Typographic Hierarchy**: Duidelijke niveaus van H1 (2.5rem) tot body text (1.125rem)
**Which fonts**: Inter (headings) en Crimson Text (body text) via Google Fonts

### Component Usage
**Primary Components**: Cards voor rapport previews, scrollytelling sections voor content
**Chart Components**: D3.js gebaseerde visualisaties met configureerbare styling
**UI Elements**: Shadcn components voor consistent design systeem

## Implementation Considerations

### Folder Structuur
```
/src/rapporten/
├── rapport-naam/
│   ├── content.html          # Scrollytelling HTML content
│   ├── chart1.config.json    # Chart configuratie
│   ├── chart1.csv           # Chart data
│   └── chart2.config.json   # Meer charts...
```

### Chart Configuratie Mogelijkheden
- **Kleur management**: Standaard paletten, highlight colors, custom kleuren
- **Lijn styling**: Solid, dashed, dotted lijnen met configureerbare breedte
- **Projecties**: Gestippelde toekomst projecties
- **Animatie theming**: Zes voorgeprogrammeerde stijlen met aanpassingsopties

### Animation Implementation
- **CSS-first approach**: Hardware-accelerated transforms en transitions
- **Theme-based presets**: Professional, Dynamic, Smooth, Playful, Minimal, Technical
- **Staggered timing**: Elementen animeren met intelligent timing
- **Chart type awareness**: Specifieke animaties voor bars, lines, pie charts
- **Performance monitoring**: Automatic fallback voor oudere browsers
- **Accessibility compliance**: Automatic respect voor prefers-reduced-motion
- **Arceringen**: Patronen voor area charts
- **Interactiviteit**: Tooltips, legends, grid styling

### Technische Stack
- **Frontend**: React met TypeScript
- **Visualisaties**: D3.js voor flexibele chart rendering
- **Styling**: Tailwind CSS met custom CSS variabelen
- **Data**: CSV bestanden met JSON configuratie
- **State**: React hooks voor lokale state, useKV voor persistentie

## Accessibility & Readability
- **Contrast**: WCAG AA compliance voor alle tekst combinaties
- **Typography**: Optimale lijnhoogte (1.6) en letter spacing voor leesbaarheid
- **Navigation**: Keyboard accessible met duidelijke focus states
- **Responsive**: Mobile-first design met fluid typography

## Edge Cases & Problem Scenarios
- **Ontbrekende data**: Graceful fallbacks voor missende CSV of config bestanden
- **Chart render errors**: Error states met duidelijke foutmeldingen
- **Large datasets**: Performance optimalisatie voor grote CSV bestanden
- **Browser compatibility**: D3.js en modern CSS features support