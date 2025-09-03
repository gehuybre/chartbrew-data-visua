# Template Systeem - ChartBrew Rapporten

Een krachtig template systeem voor het genereren van uniforme rapporten met consistente stijl en structuur.

## 🎯 Overzicht

Het Template Systeem bestaat uit vier hoofdcomponenten:

1. **Rapport Templates** - Definiëren de structuur en opmaak van rapporten
2. **Chart Configuraties** - Bepalen de visuele stijl van grafieken  
3. **Report Generator** - Genereert complete rapport folder structuren
4. **Template Manager** - Beheer interface voor alle templates

## 📋 Features

### Rapport Templates
- **Flexibele secties**: Tekst, grafieken, metrics, inzichten, aanbevelingen
- **Meerdere layouts**: Enkele kolom, twee kolommen, gemengd
- **Thema ondersteuning**: Standaard, analytisch, executive, technisch
- **Metadata beheer**: Auteur, datum, versie, beschrijving
- **Export functionaliteit**: JSON export voor hergebruik

### Chart Configuraties
- **Chart types**: Lijn, staaf, gebied, cirkel, spreiding, combinatie
- **Kleurenschema's**: Standaard, highlight, monochroom, categorisch
- **Stijl opties**: Lijn stijlen, legendes, assen, rasters
- **Interactiviteit**: Downloads, embed codes, annotaties
- **Thema integratie**: Consistente kleuren door heel het rapport

### Report Generator
- **Complete folder structuur**: HTML, JSON, CSS, data bestanden
- **Sample data generatie**: Automatische CSV bestanden per chart type
- **README documentatie**: Automatisch gegenereerde documentatie
- **Responsive HTML**: Mobile-first responsive design
- **Chart integratie**: Automatische chart loading en configuratie

## 🚀 Gebruik

### 1. Nieuw Rapport Template Maken

```typescript
import { ReportTemplateConfig } from '@/templates/reportTemplate';

const template: ReportTemplateConfig = {
  title: "Maandelijkse Verkoop Analyse",
  description: "Overzicht van verkoop metrics en trends",
  author: "Data Team",
  theme: "analytical",
  layout: "two-column",
  sections: [
    {
      id: "summary",
      type: "text", 
      title: "Samenvatting",
      order: 1,
      content: "<p>Deze maand zagen we...</p>"
    },
    {
      id: "sales-chart",
      type: "chart",
      title: "Verkoop Trends", 
      order: 2,
      chartConfig: {
        type: "line",
        dataSource: "data/sales.csv",
        colorScheme: "default"
      }
    }
  ]
};
```

### 2. Chart Configuratie

```typescript
import { ChartTemplateConfig } from '@/templates/chartTemplates';

const chartConfig: ChartTemplateConfig = {
  type: "line",
  title: "Verkoop Trends",
  dataSource: "data/sales.csv",
  colorScheme: "default", 
  lineStyle: "solid",
  showLegend: true,
  showAxes: true,
  enableDownload: true,
  annotations: [
    {
      type: "line",
      value: 100,
      label: "Doel",
      color: "oklch(0.65 0.12 30)",
      style: "dashed"
    }
  ]
};
```

### 3. Rapport Genereren

```typescript
import { generateReportFolder } from '@/templates/reportGenerator';

const generatedReport = generateReportFolder(template, {
  'sales-chart': chartConfig
});

// Resultaat bevat complete folder structuur:
// - index.html (hoofdrapport)
// - metadata.json (rapport metadata)
// - charts/sales-chart-config.json (chart configuratie)
// - data/sales-chart-data.csv (sample data)
// - README.md (documentatie)
```

## 🎨 Thema's en Styling

### Beschikbare Thema's

**Standaard**: Professioneel blauw palet voor algemeen gebruik
- Primary: `oklch(0.45 0.15 240)`
- Secondary: `oklch(0.65 0.12 200)`

**Analytisch**: Gedempte kleuren voor data-gerichte rapporten  
- Focus op functionaliteit en leesbaarheid
- Subtiele kleuren die data niet afleiden

**Executive**: Elegante kleuren voor management rapporten
- Hoge contrast voor presentaties
- Professionele uitstraling

**Technisch**: Gedetailleerde styling voor technische documentatie
- Monospace fonts voor code
- Duidelijke structuur voor complexe informatie

### Chart Kleurenschema's

- **default**: Standaard kleurenpallet 
- **highlight**: Accent kleuren voor belangrijke data
- **monochrome**: Grijstinten voor elegante rapporten
- **categorical**: Onderscheidende kleuren voor categorieën

## 📁 Gegenereerde Folder Structuur

```
rapport-naam/
├── index.html              # Hoofdrapport
├── metadata.json           # Rapport metadata  
├── README.md              # Automatische documentatie
├── charts/                # Chart configuraties
│   ├── chart1-config.json
│   └── chart2-config.json
├── data/                  # Data bestanden
│   ├── chart1-data.csv
│   └── chart2-data.csv
└── sections/              # Sectie content
    ├── summary.html
    └── conclusions.html
```

## 🔧 API Referentie

### ReportTemplateConfig Interface

```typescript
interface ReportTemplateConfig {
  title: string;
  description: string;
  author?: string;
  date?: string;
  version?: string;
  sections: ReportSection[];
  theme?: 'default' | 'analytical' | 'executive' | 'technical';
  layout?: 'single-column' | 'two-column' | 'mixed';
  enableDownloads?: boolean;
  enableSharing?: boolean;
  showMetadata?: boolean;
}
```

### ChartTemplateConfig Interface

```typescript
interface ChartTemplateConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'combo';
  dataSource: string;
  title?: string;
  subtitle?: string;
  colorScheme?: 'default' | 'highlight' | 'monochrome' | 'categorical';
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  showLegend?: boolean;
  showAxes?: boolean;
  showGrid?: boolean;
  enableDownload?: boolean;
  enableEmbed?: boolean;
  projectionData?: boolean;
  customColors?: string[];
  annotations?: ChartAnnotation[];
}
```

## 💡 Best Practices

### Template Ontwerp
- Houd templates eenvoudig en herbruikbaar
- Gebruik beschrijvende namen voor secties
- Definieer een duidelijke volgorde van informatie
- Kies thema's die passen bij je doelgroep

### Chart Configuratie
- Kies kleurenschema's die goed samengaan  
- Gebruik annotaties om belangrijke punten te markeren
- Enable downloads voor data transparantie
- Test configuraties met echte data

### Data Integratie
- Gebruik consistente CSV formaten
- Voeg betekenisvolle headers toe
- Valideer data kwaliteit vooraf
- Documenteer data bronnen

## 🔄 Workflow

1. **Template Maken**: Definieer structuur en stijl in Template Builder
2. **Charts Configureren**: Stel visuele stijl in Chart Configurator  
3. **Rapport Genereren**: Genereer complete folder structuur
4. **Data Toevoegen**: Vervang sample data met echte gegevens
5. **Content Aanpassen**: Update teksten voor specifieke rapporten
6. **Delen**: Export en distribueer het rapport

## 🎯 Voordelen

- **Consistentie**: Uniforme stijl door alle rapporten
- **Efficiëntie**: Snelle generatie van nieuwe rapporten  
- **Flexibiliteit**: Aanpasbare templates voor verschillende doeleinden
- **Kwaliteit**: Gestandaardiseerde best practices
- **Onderhoud**: Centrale plek voor stijl wijzigingen

Het Template Systeem zorgt ervoor dat alle rapporten een professionele, consistente uitstraling hebben terwijl het de tijd voor rapportcreatie drastisch vermindert.