# ChartBrew Rapporten Website

Een moderne, Nederlandse website voor het presenteren van data-analyses in long-read formaat met ChartBrew integratie.

## Overzicht

Deze website biedt:
- **Long-read rapportformaat** met uitgebreide tekstuele analyses
- **Interactieve grafieken** aangedreven door ChartBrew data
- **CSV download functionaliteit** voor elke grafiek
- **Iframe embed codes** voor het delen op sociale media en websites
- **Doorzoekbare rapporten** met tags en filters
- **Uniforme stijl** via configureerbare CSS
- **Responsive design** geoptimaliseerd voor alle apparaten

## Mappenstructuur voor Rapporten

Elk rapport heeft zijn eigen map met de volgende structuur:

```
/public/rapporten/[rapport-id]/
├── rapport.md                 # Hoofdtekst (optioneel, anders vanuit data)
├── [grafiek-id].csv          # CSV data voor elke grafiek
├── [grafiek-id].csv          # Meer CSV bestanden
└── ...
```

### Voorbeeld
```
/public/rapporten/q3-2024-analytics/
├── monthly-visitors.csv
├── traffic-sources.csv
└── page-performance.csv
```

## CSV Bestand Formaat

CSV bestanden moeten een header rij hebben met kolomnamen:

```csv
month,visitors
Juli,15420
Augustus,18350
September,21180
```

## Rapport Configuratie

Rapporten worden gedefinieerd in `/src/data/sampleReports.ts`:

```typescript
{
  id: 'mijn-rapport',
  title: 'Mijn Rapport Titel',
  description: 'Korte beschrijving',
  author: 'Auteur Naam',
  date: '2024-10-15',
  tags: ['tag1', 'tag2'],
  folderPath: '/rapporten/mijn-rapport',
  charts: [
    {
      id: 'mijn-grafiek',
      type: 'bar', // 'bar', 'line', 'pie', 'area'
      title: 'Grafiek Titel',
      csvPath: '/rapporten/mijn-rapport/mijn-grafiek.csv',
      data: [/* fallback data */]
    }
  ],
  content: `# Markdown content hier...`
}
```

## Kleuren Configuratie

Alle grafiekkleuren kunnen worden aangepast in `/src/index.css`:

```css
:root {
  /* Basis interface kleuren */
  --background: oklch(0.98 0.005 240);
  --foreground: oklch(0.25 0.08 240);
  --primary: oklch(0.45 0.15 240);
  
  /* Grafiek kleurenpalet */
  --chart-primary: oklch(0.45 0.15 240);
  --chart-secondary: oklch(0.65 0.12 200);
  --chart-tertiary: oklch(0.55 0.08 250);
  --chart-quaternary: oklch(0.75 0.06 230);
  --chart-quinary: oklch(0.35 0.12 220);
}
```

## Export Functionaliteit

Voor elke grafiek biedt de website:

### CSV Download
- Downloadt het originele CSV bestand (indien aanwezig)
- Fallback naar gegenereerde CSV van grafiekdata
- Automatische bestandsnaamgeneratie

### Iframe Embed
- Genereert iframe code voor het inbedden van grafieken
- Standaard afmetingen: 600x400 pixels
- Aanpasbare width en height attributen
- Klaar voor sociale media en websites

```html
<iframe 
  src="https://jouw-site.com/embed/grafiek-id?config=..." 
  width="600" 
  height="400" 
  frameborder="0" 
  title="Grafiek Titel">
</iframe>
```

## Gebruik van de Website

### Voor Beheerders
1. Maak een nieuwe map in `/public/rapporten/[rapport-id]/`
2. Upload CSV bestanden voor elke grafiek
3. Voeg rapport configuratie toe aan `sampleReports.ts`
4. De website toont automatisch het nieuwe rapport

### Voor Bezoekers
1. Bekijk rapporten op de homepage
2. Gebruik de zoekfunctie om specifieke rapporten te vinden
3. Filter op tags voor gerelateerde content
4. Klik op een rapport voor de volledige long-read ervaring
5. Download CSV data of kopieer embed codes per grafiek

## API Integratie (Toekomstig)

De website is voorbereid voor ChartBrew API integratie:

```javascript
// Voorbeeld API call
const chartData = await fetch('/api/chartbrew/chart/[id]')
  .then(res => res.json());

// Update rapport data
updateChart(chartData);
```

## Technische Details

### Stack
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS + CSS variabelen
- **Grafieken**: Recharts
- **UI Components**: Shadcn/ui
- **Build**: Vite
- **Deployment**: GitHub Pages ready

### Toegankelijkheid
- WCAG AA compliant kleuren
- Keyboard navigatie ondersteuning
- Screen reader vriendelijk
- Responsief design

### Performance
- Lazy loading van grafieken
- Geoptimaliseerde bundel grootte
- Caching van statische assets
- Progressieve laadtijden

## Development

### Lokaal Draaien
```bash
npm install
npm run dev
```

### Bouwen voor Productie
```bash
npm run build
npm run preview
```

### Toevoegen van Nieuwe Rapporten
1. Voeg data toe aan `sampleReports.ts`
2. Upload CSV bestanden naar `public/rapporten/`
3. Test lokaal voor deployment

## Customisatie

### Thema Aanpassen
Bewerk CSS variabelen in `src/index.css` voor:
- Basis kleuren (achtergrond, tekst, borders)
- Grafiek kleurenpalet
- Typografie instellingen
- Border radius en spacing

### Nieuwe Grafiektypen
Voeg nieuwe types toe in `ChartViewer.tsx`:
1. Extend de `ChartData` type interface
2. Implementeer rendering logica
3. Test met sample data

### Nederlandse Vertalingen
Alle teksten zijn in het Nederlands:
- Interface elementen
- Foutmeldingen
- Placeholder teksten
- Datum formatteringen (nl-NL locale)

## Support en Onderhoud

Voor vragen over implementatie of aanpassingen, raadpleeg:
- Deze README
- `FOLDER_STRUCTURE.md` voor mappenstructuur details
- Inline code commentaar voor technische details
- GitHub Issues voor bugs en feature requests