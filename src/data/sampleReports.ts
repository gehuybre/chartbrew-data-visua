import { Report } from '../types';

export const sampleReports: Report[] = [
  {
    id: 'q3-2024-analytics',
    title: 'Q3 2024 Website Analytics Rapport',
    description: 'Uitgebreide analyse van websiteprestaties, gebruikersbetrokkenheid en conversie-indicatoren voor het derde kwartaal van 2024.',
    author: 'Analytics Team',
    date: '2024-10-15',
    tags: ['analytics', 'prestaties', 'kwartaal'],
    thumbnail: '',
    folderPath: '/rapporten/q3-2024-analytics',
    charts: [
      {
        id: 'monthly-visitors',
        type: 'line',
        title: 'Maandelijkse Unieke Bezoekers',
        csvPath: '/rapporten/q3-2024-analytics/monthly-visitors.csv',
        data: [
          { month: 'Juli', visitors: 15420 },
          { month: 'Augustus', visitors: 18350 },
          { month: 'September', visitors: 21180 }
        ]
      },
      {
        id: 'traffic-sources',
        type: 'pie',
        title: 'Verdeling Verkeersbronnen',
        csvPath: '/rapporten/q3-2024-analytics/traffic-sources.csv',
        data: [
          { source: 'Organisch Zoeken', percentage: 45 },
          { source: 'Direct', percentage: 25 },
          { source: 'Social Media', percentage: 15 },
          { source: 'Verwijzingen', percentage: 10 },
          { source: 'E-mail', percentage: 5 }
        ]
      },
      {
        id: 'page-performance',
        type: 'bar',
        title: 'Best Presterende Pagina\'s (Paginaweergaven)',
        csvPath: '/rapporten/q3-2024-analytics/page-performance.csv',
        data: [
          { page: 'Homepage', views: 8450 },
          { page: 'Productcatalogus', views: 6200 },
          { page: 'Over Ons', views: 4100 },
          { page: 'Contact', views: 2800 },
          { page: 'Blog', views: 3600 }
        ]
      }
    ],
    content: `
# Samenvatting

Onze Q3 2024 analytics tonen significante groei in alle belangrijke prestatie-indicatoren. Websiteverkeer steeg met **37%** vergeleken met Q2, met bijzonder sterke prestaties in organische zoekzichtbaarheid.

## Belangrijkste Bevindingen

### Verkeersgroei
Het derde kwartaal toonde uitzonderlijke groei in unieke bezoekers, waarbij september ons hoogste maandelijkse verkeer tot nu toe markeerde. Deze groei kan worden toegeschreven aan:

- Verbeterde SEO-strategie implementatie
- Verbeterde contentmarketing-inspanningen  
- Strategische social media campagnes
- Geoptimaliseerde gebruikerservaring op mobiele apparaten

### Gebruikersbetrokkenheidspatronen
Analyse van gebruikersgedrag toont verbeterde betrokkenheidsmetrieken:

- **Gemiddelde sessieduur**: 4.2 minuten (+15% t.o.v. Q2)
- **Pagina's per sessie**: 3.8 (+22% t.o.v. Q2)
- **Bouncepercentage**: 32% (-8% t.o.v. Q2)

### Conversieprestaties
E-commerce en leadgeneratie metrieken tonen positieve trends:

- **Conversiepercentage**: 2.8% (+0.4% t.o.v. Q2)
- **Gemiddelde bestelwaarde**: €127 (+€12 t.o.v. Q2)
- **Nieuwsbrief aanmeldingen**: 1.240 nieuwe abonnees

## Aanbevelingen

Op basis van deze inzichten bevelen we aan:

1. **Inzetten op contentmarketing** - Blogposts genereren significant organisch verkeer
2. **Mobiele ervaring optimaliseren** - 68% van het verkeer is nu mobiel
3. **Social media aanwezigheid uitbreiden** - Vooral op platforms met hoogste betrokkenheid
4. **A/B test checkout proces** - Om conversiepercentages verder te verbeteren
    `
  },
  {
    id: 'user-satisfaction-2024',
    title: 'Klanttevredenheidsonderzoek Resultaten 2024',
    description: 'Jaarlijkse resultaten van klanttevredenheidsonderzoek met feedback over productkwaliteit, ondersteuning en algehele ervaring.',
    author: 'Customer Success Team',
    date: '2024-09-28',
    tags: ['onderzoek', 'tevredenheid', 'klantfeedback'],
    thumbnail: '',
    folderPath: '/rapporten/user-satisfaction-2024',
    charts: [
      {
        id: 'satisfaction-scores',
        type: 'bar',
        title: 'Tevredenheidsscores per Categorie',
        csvPath: '/rapporten/user-satisfaction-2024/satisfaction-scores.csv',
        data: [
          { category: 'Productkwaliteit', score: 8.4 },
          { category: 'Klantondersteuning', score: 7.9 },
          { category: 'Leveringssnelheid', score: 8.7 },
          { category: 'Prijs-kwaliteitverhouding', score: 7.6 },
          { category: 'Algehele Ervaring', score: 8.2 }
        ]
      },
      {
        id: 'nps-trend',
        type: 'line',
        title: 'Net Promoter Score Trend',
        csvPath: '/rapporten/user-satisfaction-2024/nps-trend.csv',
        data: [
          { quarter: 'Q1 2024', nps: 42 },
          { quarter: 'Q2 2024', nps: 47 },
          { quarter: 'Q3 2024', nps: 52 },
          { quarter: 'Q4 2024', nps: 55 }
        ]
      },
      {
        id: 'response-distribution',
        type: 'pie',
        title: 'Responspercentage per Klantsegment',
        csvPath: '/rapporten/user-satisfaction-2024/response-distribution.csv',
        data: [
          { segment: 'Premium Klanten', responses: 340 },
          { segment: 'Standaard Klanten', responses: 890 },
          { segment: 'Nieuwe Klanten', responses: 156 },
          { segment: 'Enterprise', responses: 78 }
        ]
      }
    ],
    content: `
# Klanttevredenheidsrapport 2024

Dit uitgebreide onderzoek verzamelt feedback van **1.464 klanten** uit alle klantsegmenten en vertegenwoordigt onze grootste tevredenheidsstudie tot nu toe.

## Onderzoeksmethodologie

- **Onderzoeksperiode**: 1-31 augustus 2024
- **Responspercentage**: 23.8% (branchegemiddelde: 15-20%)
- **Steekproefgrootte**: 1.464 respondenten
- **Methode**: E-mail enquête met herinneringen

## Algehele Resultaten

Onze **Net Promoter Score (NPS) van 55** plaatst ons in de "uitstekende" categorie, wat een **verbetering van 13 punten** ten opzichte van vorig jaar vertegenwoordigt.

### Tevredenheidshoogtepunten

**Productkwaliteit** blijft ons sterkste prestatiegebied met een gemiddelde score van **8.4/10**. Klantcommentaren prijzen vaak:

- Bouwkwaliteit en duurzaamheid
- Functiecompleetheid  
- Gebruiksgemak
- Ontwerpesthetiek

### Verbetergebieden

**Prijs-kwaliteitverhouding** scoorde het laagst met **7.6/10**, wat aangeeft dat prijsgevoeligheid een zorg blijft.

**Klantondersteuning** met **7.9/10** toont ruimte voor verbetering, vooral:

- Snellere responstijden tijdens piekperiodes
- Meer zelfserviceopties
- Verbeterde technische documentatie
    `
  },
  {
    id: 'sales-performance-h1',
    title: 'H1 2024 Verkoopprestatie Analyse',
    description: 'Eerste helft verkoop resultaten met regionale uitsplitsing, productprestaties en pijplijnanalyse.',
    author: 'Sales Operations',
    date: '2024-07-05',
    tags: ['verkoop', 'prestaties', 'omzet'],
    thumbnail: '',
    folderPath: '/rapporten/sales-performance-h1',
    charts: [
      {
        id: 'monthly-revenue',
        type: 'area',
        title: 'Maandelijkse Omzet (€000s)',
        csvPath: '/rapporten/sales-performance-h1/monthly-revenue.csv',
        data: [
          { month: 'Januari', revenue: 280 },
          { month: 'Februari', revenue: 320 },
          { month: 'Maart', revenue: 380 },
          { month: 'April', revenue: 350 },
          { month: 'Mei', revenue: 420 },
          { month: 'Juni', revenue: 450 }
        ]
      },
      {
        id: 'regional-breakdown',
        type: 'bar',
        title: 'Omzet per Regio (H1 2024)',
        csvPath: '/rapporten/sales-performance-h1/regional-breakdown.csv',
        data: [
          { region: 'Noord-Amerika', revenue: 780 },
          { region: 'Europa', revenue: 920 },
          { region: 'Azië-Pacific', revenue: 540 },
          { region: 'Latijns-Amerika', revenue: 210 },
          { region: 'Overig', revenue: 150 }
        ]
      },
      {
        id: 'product-mix',
        type: 'pie',
        title: 'Omzet per Productcategorie',
        csvPath: '/rapporten/sales-performance-h1/product-mix.csv',
        data: [
          { category: 'Software Licenties', revenue: 1200 },
          { category: 'Ondersteuningsdiensten', revenue: 800 },
          { category: 'Professionele Diensten', revenue: 450 },
          { category: 'Training', revenue: 150 }
        ]
      }
    ],
    content: `
# H1 2024 Verkoopprestatie Samenvatting

De eerste helft van 2024 leverde **€2.6M totale omzet** op, wat **18% groei** ten opzichte van H1 2023 vertegenwoordigt en ons doelwit met 8% overtreft.

## Omzetprestaties

### Maandelijkse Progressie
Q2 toonde bijzonder sterke prestaties met **juni dat onze hoogste maandelijkse omzet** van €450K behaalde.

### Regionale Analyse

**Europa blijft onze sterkste markt** en draagt 35% van de totale omzet bij (€920K). Belangrijke drijfveren zijn onder meer:

- Succesvolle expansie in Duitse en Franse markten
- Sterke verlengingspercentages van bestaande klanten
- Nieuwe partnerschapsovereenkomsten met regionale systeemintegrators

**Noord-Amerika** droeg €780K bij (30% van omzet) met hoogtepunten waaronder:

- Grote enterprise deal sluitingen in Q2
- Verbeterde verkoopcyclus efficiëntie
- Verbeterde kanaalpartner prestaties

## Productprestaties

### Software Licenties (46% van omzet)
Ons kernproduct blijft groei stimuleren met **€1.2M in H1 omzet**.

### Ondersteuningsdiensten (31% van omzet)
Terugkerende omzet uit ondersteuningsdiensten biedt stabiele basis met **€800K**.

## Pijplijn Analyse

Onze Q3/Q4 pijplijn toont **€3.1M in gekwalificeerde kansen**, wat wijst op potentieel voor voortgezet groeimomentum.
    `
  }
];