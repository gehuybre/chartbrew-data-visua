import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { TemplateBuilder } from './TemplateBuilder';
import { ChartConfigurator } from './ChartConfigurator';
import { ReportTemplateConfig } from '@/templates/reportTemplate';
import { ChartTemplateConfig } from '@/templates/chartTemplates';
import { generateReportFolder, exportGeneratedReport } from '@/templates/reportGenerator';
import { ArrowLeft, FileText, ChartLine, Settings, Download, Trash2, FolderOpen } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface TemplateManagerProps {
  onBack: () => void;
}

export function TemplateManager({ onBack }: TemplateManagerProps) {
  const [savedTemplates, setSavedTemplates] = useState<ReportTemplateConfig[]>([]);
  const [savedChartConfigs, setSavedChartConfigs] = useState<ChartTemplateConfig[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [generatedReportPreview, setGeneratedReportPreview] = useState<string>('');

  const handleTemplateGenerated = (template: ReportTemplateConfig, generatedReport: any) => {
    // Save the template
    setSavedTemplates(current => {
      const existing = current.findIndex(t => t.title === template.title);
      if (existing >= 0) {
        const updated = [...current];
        updated[existing] = template;
        return updated;
      }
      return [...current, template];
    });

    // Generate complete report folder structure
    const chartConfigs: Record<string, ChartTemplateConfig> = {};
    template.sections.forEach(section => {
      if (section.chartConfig) {
        chartConfigs[section.id] = section.chartConfig;
      }
    });

    const reportFolder = generateReportFolder(template, chartConfigs);
    const exportJson = exportGeneratedReport(reportFolder);
    setGeneratedReportPreview(exportJson);

    toast.success(`Template "${template.title}" gegenereerd en opgeslagen`);
  };

  const handleChartConfigGenerated = (config: ChartTemplateConfig) => {
    // Save the chart config
    setSavedChartConfigs(current => {
      const configWithId = {
        ...config,
        id: config.title || `chart-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      return [...current, configWithId];
    });

    toast.success('Chart configuratie opgeslagen');
  };

  const downloadGeneratedReport = () => {
    if (!generatedReportPreview) {
      toast.error('Geen gegenereerd rapport beschikbaar');
      return;
    }

    const dataBlob = new Blob([generatedReportPreview], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Rapport structuur gedownload');
  };

  const deleteTemplate = (index: number) => {
    setSavedTemplates(current => current.filter((_, i) => i !== index));
    toast.success('Template verwijderd');
  };

  const deleteChartConfig = (index: number) => {
    setSavedChartConfigs(current => current.filter((_, i) => i !== index));
    toast.success('Chart configuratie verwijderd');
  };

  const exportTemplate = (template: ReportTemplateConfig) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}-template.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Template geëxporteerd');
  };

  const exportChartConfig = (config: ChartTemplateConfig) => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chart-config-${config.title || 'unnamed'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Chart configuratie geëxporteerd');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft size={20} />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary text-primary-foreground rounded-lg">
                <Settings size={24} />
              </div>
              <h1 className="font-inter font-bold text-3xl text-foreground">
                Template Systeem
              </h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Maak en beheer uniforme rapport templates met consistente stijl en structuur
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overzicht</TabsTrigger>
            <TabsTrigger value="report-builder">Rapport Builder</TabsTrigger>
            <TabsTrigger value="chart-configurator">Chart Configurator</TabsTrigger>
            <TabsTrigger value="generated">Gegenereerde Rapporten</TabsTrigger>
            <TabsTrigger value="documentation">Documentatie</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Saved Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={20} />
                    Opgeslagen Templates ({savedTemplates.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {savedTemplates.map((template, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{template.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {template.theme}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.sections.length} secties
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => exportTemplate(template)}
                          >
                            <Download size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTemplate(index)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {savedTemplates.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Nog geen templates opgeslagen</p>
                        <p className="text-xs">Ga naar de Rapport Builder om te beginnen</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Saved Chart Configs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartLine size={20} />
                    Chart Configuraties ({savedChartConfigs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {savedChartConfigs.map((config, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{config.title || 'Naamloos'}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {config.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {config.colorScheme}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => exportChartConfig(config)}
                          >
                            <Download size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteChartConfig(index)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {savedChartConfigs.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <ChartLine size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Nog geen chart configuraties opgeslagen</p>
                        <p className="text-xs">Ga naar de Chart Configurator om te beginnen</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Snelle Acties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="p-6 h-auto flex-col gap-2"
                    onClick={() => setActiveTab('report-builder')}
                  >
                    <FileText size={24} />
                    <span className="font-medium">Nieuw Rapport Template</span>
                    <span className="text-xs text-muted-foreground">
                      Maak een nieuw rapport template met secties en stijl
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="p-6 h-auto flex-col gap-2"
                    onClick={() => setActiveTab('chart-configurator')}
                  >
                    <ChartLine size={24} />
                    <span className="font-medium">Nieuwe Chart Configuratie</span>
                    <span className="text-xs text-muted-foreground">
                      Configureer chart stijl, kleuren en gedrag
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="p-6 h-auto flex-col gap-2"
                    onClick={() => setActiveTab('generated')}
                  >
                    <FolderOpen size={24} />
                    <span className="font-medium">Gegenereerde Rapporten</span>
                    <span className="text-xs text-muted-foreground">
                      Bekijk en download complete rapport structuren
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="p-6 h-auto flex-col gap-2"
                    onClick={() => setActiveTab('documentation')}
                  >
                    <Settings size={24} />
                    <span className="font-medium">Documentatie</span>
                    <span className="text-xs text-muted-foreground">
                      Leer hoe je templates gebruikt en aanpast
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Builder */}
          <TabsContent value="report-builder">
            <TemplateBuilder onTemplateGenerated={handleTemplateGenerated} />
          </TabsContent>

          {/* Generated Reports */}
          <TabsContent value="generated" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen size={20} />
                    Gegenereerde Rapport Structuur
                  </div>
                  {generatedReportPreview && (
                    <Button onClick={downloadGeneratedReport}>
                      <Download size={16} className="mr-2" />
                      Download Structuur
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedReportPreview ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Laatst gegenereerde rapport structuur. Dit JSON bestand bevat alle bestanden en mappen 
                      die nodig zijn voor een compleet rapport.
                    </p>
                    <Textarea
                      value={generatedReportPreview}
                      readOnly
                      className="font-mono text-xs h-96"
                      placeholder="Geen gegenereerd rapport beschikbaar"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={downloadGeneratedReport}>
                        <Download size={16} className="mr-2" />
                        Download JSON
                      </Button>
                      <Button variant="outline" onClick={() => setGeneratedReportPreview('')}>
                        <Trash2 size={16} className="mr-2" />
                        Wissen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <FolderOpen size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="font-semibold text-lg mb-2">Geen gegenereerde rapporten</h3>
                    <p className="text-muted-foreground mb-4">
                      Genereer een rapport template om de complete folder structuur te zien
                    </p>
                    <Button onClick={() => setActiveTab('report-builder')}>
                      Rapport Template Maken
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hoe Gegenereerde Rapporten Te Gebruiken</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <div className="scrolly-report">
                  <p>
                    Wanneer je een rapport template genereert, wordt een complete folder structuur 
                    gemaakt met alle benodigde bestanden:
                  </p>

                  <div className="recommendations-list">
                    <div className="recommendation">
                      <div className="rec-number">1</div>
                      <div className="rec-content">
                        <h4>Download de JSON structuur</h4>
                        <p>De JSON bevat alle bestanden en content voor je rapport</p>
                      </div>
                    </div>

                    <div className="recommendation">
                      <div className="rec-number">2</div>
                      <div className="rec-content">
                        <h4>Pak de bestanden uit</h4>
                        <p>Gebruik de JSON om de folder structuur en bestanden te creëren</p>
                      </div>
                    </div>

                    <div className="recommendation">
                      <div className="rec-number">3</div>
                      <div className="rec-content">
                        <h4>Vervang sample data</h4>
                        <p>Update de CSV bestanden in de data/ map met je eigen gegevens</p>
                      </div>
                    </div>

                    <div className="recommendation">
                      <div className="rec-number">4</div>
                      <div className="rec-content">
                        <h4>Pas content aan</h4>
                        <p>Wijzig de HTML content in sections/ voor je specifieke teksten</p>
                      </div>
                    </div>
                  </div>

                  <div className="highlight-box">
                    <h4>Bestanden in een gegenereerd rapport:</h4>
                    <ul>
                      <li><strong>index.html</strong> - Hoofdrapport bestand</li>
                      <li><strong>metadata.json</strong> - Rapport metadata</li>
                      <li><strong>README.md</strong> - Documentatie</li>
                      <li><strong>charts/</strong> - Chart configuratie bestanden</li>
                      <li><strong>data/</strong> - CSV data bestanden</li>
                      <li><strong>sections/</strong> - HTML content bestanden</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chart Configurator */}
          <TabsContent value="chart-configurator">
            <ChartConfigurator onConfigGenerated={handleChartConfigGenerated} />
          </TabsContent>

          {/* Documentation */}
          <TabsContent value="documentation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Systeem Documentatie</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <div className="scrolly-report">
                  <h3>Overzicht</h3>
                  <p>
                    Het Template Systeem zorgt voor uniforme rapporten met consistente stijl en structuur. 
                    Het bestaat uit twee hoofdcomponenten:
                  </p>

                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-value">Rapport Templates</div>
                      <div className="metric-label">Definiëren de structuur, secties en opmaak van rapporten</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">Chart Configuraties</div>
                      <div className="metric-label">Bepalen de visuele stijl en gedrag van grafieken</div>
                    </div>
                  </div>

                  <h3>Rapport Templates</h3>
                  <p>
                    Rapport templates definiëren de complete structuur van een rapport, inclusief:
                  </p>
                  <ul className="key-metrics">
                    <li><span className="metric">Metadata:</span> Titel, beschrijving, auteur, datum</li>
                    <li><span className="metric">Secties:</span> Tekst, grafieken, metrics, inzichten, aanbevelingen</li>
                    <li><span className="metric">Layout:</span> Enkele kolom, twee kolommen, of gemengd</li>
                    <li><span className="metric">Thema:</span> Standaard, analytisch, executive, of technisch</li>
                    <li><span className="metric">Features:</span> Downloads, delen, zoeken, metadata weergave</li>
                  </ul>

                  <h3>Chart Configuraties</h3>
                  <p>
                    Chart configuraties bepalen hoe grafieken eruit zien en functioneren:
                  </p>
                  
                  <div className="two-column-layout">
                    <div className="text-column">
                      <h4>Visuele Instellingen</h4>
                      <ul>
                        <li>Chart type (lijn, staaf, gebied, cirkel, etc.)</li>
                        <li>Kleurenschema (standaard, highlight, monochroom)</li>
                        <li>Lijn stijlen (doorgetrokken, streepjes, stippen)</li>
                        <li>Legende, assen en raster weergave</li>
                      </ul>

                      <h4>Interactiviteit</h4>
                      <ul>
                        <li>Download functionaliteit</li>
                        <li>Embed code generatie</li>
                        <li>Projectie data weergave</li>
                        <li>Annotaties en markeringen</li>
                      </ul>
                    </div>
                    
                    <div className="chart-column">
                      <div className="insight-box">
                        <h4>Standaard Thema's</h4>
                        <p><strong>Standaard:</strong> Professioneel blauw palet voor algemeen gebruik</p>
                        <p><strong>Analytisch:</strong> Gedempte kleuren voor data-gerichte rapporten</p>
                        <p><strong>Executive:</strong> Elegante kleuren voor management rapporten</p>
                      </div>
                    </div>
                  </div>

                  <h3>Gebruik van Templates</h3>
                  
                  <div className="recommendations-list">
                    <div className="recommendation">
                      <div className="rec-number">1</div>
                      <div className="rec-content">
                        <h4>Template Maken</h4>
                        <p>Ga naar de Rapport Builder en definieer de basis informatie, secties en stijl instellingen.</p>
                      </div>
                    </div>

                    <div className="recommendation">
                      <div className="rec-number">2</div>
                      <div className="rec-content">
                        <h4>Chart Configureren</h4>
                        <p>Gebruik de Chart Configurator om uniforme chart stijlen te maken die in meerdere rapporten gebruikt kunnen worden.</p>
                      </div>
                    </div>

                    <div className="recommendation">
                      <div className="rec-number">3</div>
                      <div className="rec-content">
                        <h4>Exporteren</h4>
                        <p>Exporteer templates en configuraties als JSON bestanden om ze te delen of als backup te bewaren.</p>
                      </div>
                    </div>

                    <div className="recommendation">
                      <div className="rec-number">4</div>
                      <div className="rec-content">
                        <h4>Implementeren</h4>
                        <p>Gebruik de gegenereerde templates in je rapporten voor consistente stijl en structuur.</p>
                      </div>
                    </div>
                  </div>

                  <h3>Best Practices</h3>
                  
                  <div className="highlight-box">
                    <h4>Template Ontwerp</h4>
                    <ul>
                      <li>Houd templates eenvoudig en herbruikbaar</li>
                      <li>Gebruik beschrijvende namen voor secties</li>
                      <li>Definieer een duidelijke volgorde van informatie</li>
                      <li>Kies thema's die passen bij je doelgroep</li>
                    </ul>
                  </div>

                  <div className="highlight-box">
                    <h4>Chart Configuratie</h4>
                    <ul>
                      <li>Kies kleurenschema's die goed samengaan</li>
                      <li>Gebruik annotaties om belangrijke punten te markeren</li>
                      <li>Enable downloads voor data transparantie</li>
                      <li>Test configuraties met echte data</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}