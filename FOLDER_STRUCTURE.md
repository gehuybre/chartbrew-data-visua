# ChartBrew Rapporten - Mappenstructuur

Deze website ondersteunt een eenvoudige mappenstructuur voor het organiseren van rapporten met hun bijbehorende data en tekstbestanden.

## Mappenstructuur

```
/rapporten/
├── q3-2024-analytics/
│   ├── rapport.md                    # Hoofdtekst van het rapport
│   ├── monthly-visitors.csv          # Data voor maandelijkse bezoekers grafiek
│   ├── traffic-sources.csv           # Data voor verkeersbronnen grafiek
│   └── page-performance.csv          # Data voor paginaprestaties grafiek
│
├── user-satisfaction-2024/
│   ├── rapport.md                    # Hoofdtekst van het rapport
│   ├── satisfaction-scores.csv       # Data voor tevredenheidsscores grafiek
│   ├── nps-trend.csv                # Data voor NPS trend grafiek
│   └── response-distribution.csv     # Data voor respons verdeling grafiek
│
└── sales-performance-h1/
    ├── rapport.md                    # Hoofdtekst van het rapport
    ├── monthly-revenue.csv           # Data voor maandelijkse omzet grafiek
    ├── regional-breakdown.csv        # Data voor regionale verdeling grafiek
    └── product-mix.csv               # Data voor productmix grafiek
```

## CSV Bestand Formaat

Elk CSV bestand moet de volgende structuur hebben:

### Voorbeeld: monthly-visitors.csv
```csv
month,visitors
Juli,15420
Augustus,18350
September,21180
```

### Voorbeeld: traffic-sources.csv
```csv
source,percentage
Organisch Zoeken,45
Direct,25
Social Media,15
Verwijzingen,10
E-mail,5
```

## Markdown Bestand Formaat

Het rapport.md bestand in elke map bevat de uitgebreide tekst die bij de grafieken wordt getoond:

### Voorbeeld: rapport.md
```markdown
# Rapporttitel

Uitgebreide beschrijving van het rapport met analyses, conclusies en aanbevelingen.

## Sectie 1

Content hier...

## Sectie 2

Meer content...
```

## Gebruik in de Website

1. Upload je CSV bestanden naar de juiste map
2. Zet je uitgebreide rapporttekst in rapport.md
3. De website toont automatisch downloadknoppen voor elke grafiek
4. Gebruikers kunnen iframe embed codes kopiëren voor sociale media en websites
5. Alle grafieken volgen de gedefinieerde kleurenschema's uit de CSS configuratie

## Export Functionaliteit

Voor elke grafiek biedt de website:

- **CSV Download**: Download de onderliggende data
- **Iframe Embed**: Kopieer code om de grafiek in te voegen op andere websites
- **Social Media Ready**: Grafieken zijn geoptimaliseerd voor delen

## Configuratie

Alle kleuren en styling kunnen worden aangepast via de CSS variabelen in `src/index.css`:

```css
:root {
  --chart-primary: oklch(0.45 0.15 240);
  --chart-secondary: oklch(0.65 0.12 200);
  --chart-tertiary: oklch(0.55 0.08 250);
  --chart-quaternary: oklch(0.75 0.06 230);
  --chart-quinary: oklch(0.35 0.12 220);
}
```