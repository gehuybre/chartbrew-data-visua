import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChartTemplateConfig,
  generateChartConfig,
  chartTemplates,
  chartThemes,
  commonAnnotations,
  exportChartConfig
} from '@/templates/chartTemplates';
import { ChartLine, Download, Plus, Trash2, Eye } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface ChartConfiguratorProps {
  onConfigGenerated?: (config: ChartTemplateConfig) => void;
  initialConfig?: Partial<ChartTemplateConfig>;
}

export function ChartConfigurator({ onConfigGenerated, initialConfig }: ChartConfiguratorProps) {
  const [config, setConfig] = useState<Partial<ChartTemplateConfig>>({
    type: 'line',
    colorScheme: 'default',
    lineStyle: 'solid',
    showLegend: true,
    showAxes: true,
    showGrid: true,
    enableDownload: true,
    enableEmbed: true,
    projectionData: false,
    customColors: [],
    annotations: [],
    ...initialConfig
  });

  const [annotations, setAnnotations] = useState<any[]>(config.annotations || []);
  const [newAnnotation, setNewAnnotation] = useState({
    type: 'line',
    value: '',
    label: '',
    color: 'oklch(0.65 0.12 30)',
    style: 'solid'
  });

  const handleConfigChange = (field: keyof ChartTemplateConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const addAnnotation = () => {
    if (!newAnnotation.value) {
      toast.error('Waarde is verplicht voor annotatie');
      return;
    }

    const annotation = {
      ...newAnnotation,
      value: newAnnotation.type === 'point' ? newAnnotation.value : parseFloat(newAnnotation.value) || 0
    };

    const updatedAnnotations = [...annotations, annotation];
    setAnnotations(updatedAnnotations);
    setConfig(prev => ({ ...prev, annotations: updatedAnnotations }));
    
    // Reset form
    setNewAnnotation({
      type: 'line',
      value: '',
      label: '',
      color: 'oklch(0.65 0.12 30)',
      style: 'solid'
    });

    toast.success('Annotatie toegevoegd');
  };

  const removeAnnotation = (index: number) => {
    const updatedAnnotations = annotations.filter((_, i) => i !== index);
    setAnnotations(updatedAnnotations);
    setConfig(prev => ({ ...prev, annotations: updatedAnnotations }));
    toast.success('Annotatie verwijderd');
  };

  const addCommonAnnotation = (type: string, value?: number) => {
    let annotation;
    switch (type) {
      case 'target':
        annotation = commonAnnotations.targetLine(value || 100);
        break;
      case 'average':
        annotation = commonAnnotations.averageLine(value || 50);
        break;
      case 'highlight':
        annotation = commonAnnotations.highlightArea(value || 0, (value || 0) + 10);
        break;
      default:
        return;
    }

    const updatedAnnotations = [...annotations, annotation];
    setAnnotations(updatedAnnotations);
    setConfig(prev => ({ ...prev, annotations: updatedAnnotations }));
    toast.success('Annotatie toegevoegd');
  };

  const loadTemplate = (templateName: string, theme: string = 'default') => {
    try {
      const generatedConfig = generateChartConfig(templateName, config, theme);
      setConfig(generatedConfig);
      setAnnotations(generatedConfig.annotations || []);
      toast.success(`Template "${templateName}" geladen`);
    } catch (error) {
      toast.error(`Fout bij laden van template: ${error}`);
    }
  };

  const generateConfig = () => {
    if (!config.type || !config.dataSource) {
      toast.error('Chart type en data bron zijn verplicht');
      return;
    }

    const finalConfig = {
      ...config,
      annotations
    } as ChartTemplateConfig;

    onConfigGenerated?.(finalConfig);
    toast.success('Chart configuratie gegenereerd!');
  };

  const exportConfig = () => {
    const finalConfig = {
      ...config,
      annotations
    } as ChartTemplateConfig;

    const configJson = exportChartConfig(finalConfig);
    const dataBlob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chart-config-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Configuratie geëxporteerd');
  };

  const selectedTheme = chartThemes[config.colorScheme as string] || chartThemes.default;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Chart Configurator</h2>
          <p className="text-muted-foreground">
            Configureer chart stijl, kleuren en gedrag voor uniforme rapporten
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportConfig}>
            <Download size={16} className="mr-2" />
            Exporteer
          </Button>
          <Button onClick={generateConfig} disabled={!config.type || !config.dataSource}>
            <Eye size={16} className="mr-2" />
            Genereer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basis</TabsTrigger>
          <TabsTrigger value="visual">Visueel</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="annotations">Annotaties</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Basic Configuration */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartLine size={20} />
                Basis Configuratie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chart-type">Chart Type *</Label>
                  <Select
                    value={config.type || 'line'}
                    onValueChange={(value) => handleConfigChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Lijn</SelectItem>
                      <SelectItem value="bar">Staaf</SelectItem>
                      <SelectItem value="area">Gebied</SelectItem>
                      <SelectItem value="pie">Cirkel</SelectItem>
                      <SelectItem value="scatter">Spreiding</SelectItem>
                      <SelectItem value="combo">Combinatie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-source">Data Bron *</Label>
                  <Input
                    id="data-source"
                    value={config.dataSource || ''}
                    onChange={(e) => handleConfigChange('dataSource', e.target.value)}
                    placeholder="data/chart-data.csv"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chart-title">Titel</Label>
                  <Input
                    id="chart-title"
                    value={config.title || ''}
                    onChange={(e) => handleConfigChange('title', e.target.value)}
                    placeholder="Chart titel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chart-subtitle">Ondertitel</Label>
                  <Input
                    id="chart-subtitle"
                    value={config.subtitle || ''}
                    onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                    placeholder="Chart ondertitel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-download"
                    checked={config.enableDownload || false}
                    onCheckedChange={(checked) => handleConfigChange('enableDownload', checked)}
                  />
                  <Label htmlFor="enable-download">Download</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-embed"
                    checked={config.enableEmbed || false}
                    onCheckedChange={(checked) => handleConfigChange('enableEmbed', checked)}
                  />
                  <Label htmlFor="enable-embed">Embed</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="projection-data"
                    checked={config.projectionData || false}
                    onCheckedChange={(checked) => handleConfigChange('projectionData', checked)}
                  />
                  <Label htmlFor="projection-data">Projectie</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-legend"
                    checked={config.showLegend !== false}
                    onCheckedChange={(checked) => handleConfigChange('showLegend', checked)}
                  />
                  <Label htmlFor="show-legend">Legende</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visual Configuration */}
        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visuele Instellingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color-scheme">Kleurenschema</Label>
                  <Select
                    value={config.colorScheme || 'default'}
                    onValueChange={(value) => handleConfigChange('colorScheme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Standaard</SelectItem>
                      <SelectItem value="highlight">Highlight</SelectItem>
                      <SelectItem value="monochrome">Monochroom</SelectItem>
                      <SelectItem value="categorical">Categorisch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line-style">Lijn Stijl</Label>
                  <Select
                    value={config.lineStyle || 'solid'}
                    onValueChange={(value) => handleConfigChange('lineStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Doorgetrokken</SelectItem>
                      <SelectItem value="dashed">Streepjes</SelectItem>
                      <SelectItem value="dotted">Stippen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    id="show-grid"
                    checked={config.showGrid !== false}
                    onCheckedChange={(checked) => handleConfigChange('showGrid', checked)}
                  />
                  <Label htmlFor="show-grid">Raster tonen</Label>
                </div>
              </div>

              {/* Color Preview */}
              <div className="space-y-3">
                <Label>Kleuren Voorbeeld</Label>
                <div className="p-4 border rounded-lg">
                  <div className="flex gap-2 mb-2">
                    {selectedTheme.colors[config.colorScheme as keyof typeof selectedTheme.colors]?.slice(0, 8).map((color, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div
                          className="w-8 h-8 rounded-lg border"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedTheme.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Configuration */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Configuratie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="x-axis">X-As Kolom</Label>
                  <Input
                    id="x-axis"
                    value={config.xAxis || ''}
                    onChange={(e) => handleConfigChange('xAxis', e.target.value)}
                    placeholder="datum"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="y-axis">Y-As Kolom(men)</Label>
                  <Input
                    id="y-axis"
                    value={Array.isArray(config.yAxis) ? config.yAxis.join(', ') : config.yAxis || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const yAxes = value.includes(',') ? value.split(',').map(s => s.trim()) : value;
                      handleConfigChange('yAxis', yAxes);
                    }}
                    placeholder="waarde1, waarde2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-axes"
                    checked={config.showAxes !== false}
                    onCheckedChange={(checked) => handleConfigChange('showAxes', checked)}
                  />
                  <Label htmlFor="show-axes">Assen tonen</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Annotations */}
        <TabsContent value="annotations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Annotation */}
            <Card>
              <CardHeader>
                <CardTitle>Annotatie Toevoegen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annotation-type">Type</Label>
                    <Select
                      value={newAnnotation.type}
                      onValueChange={(value) => setNewAnnotation(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Lijn</SelectItem>
                        <SelectItem value="area">Gebied</SelectItem>
                        <SelectItem value="point">Punt</SelectItem>
                        <SelectItem value="text">Tekst</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annotation-value">Waarde</Label>
                    <Input
                      id="annotation-value"
                      value={newAnnotation.value}
                      onChange={(e) => setNewAnnotation(prev => ({ ...prev, value: e.target.value }))}
                      placeholder={newAnnotation.type === 'point' ? 'x,y' : '100'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annotation-label">Label</Label>
                  <Input
                    id="annotation-label"
                    value={newAnnotation.label}
                    onChange={(e) => setNewAnnotation(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Doel"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annotation-color">Kleur</Label>
                    <Input
                      id="annotation-color"
                      value={newAnnotation.color}
                      onChange={(e) => setNewAnnotation(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="oklch(0.65 0.12 30)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annotation-style">Stijl</Label>
                    <Select
                      value={newAnnotation.style}
                      onValueChange={(value) => setNewAnnotation(prev => ({ ...prev, style: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Doorgetrokken</SelectItem>
                        <SelectItem value="dashed">Streepjes</SelectItem>
                        <SelectItem value="dotted">Stippen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={addAnnotation} className="w-full">
                  <Plus size={16} className="mr-2" />
                  Annotatie Toevoegen
                </Button>

                <div className="pt-4 border-t">
                  <Label className="text-sm">Snelle Annotaties</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addCommonAnnotation('target')}
                    >
                      Doel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addCommonAnnotation('average')}
                    >
                      Gemiddelde
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addCommonAnnotation('highlight')}
                    >
                      Highlight
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Annotations List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Annotaties ({annotations.length})
                  <Badge variant="secondary">
                    {annotations.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {annotations.map((annotation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {annotation.type}
                          </Badge>
                          <span className="font-medium text-sm">
                            {annotation.label || `${annotation.type} ${index + 1}`}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Waarde: {annotation.value} • Stijl: {annotation.style}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: annotation.color }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeAnnotation(index)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {annotations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <ChartLine size={32} className="mx-auto mb-2 opacity-50" />
                      <p>Nog geen annotaties toegevoegd</p>
                      <p className="text-xs">Voeg annotaties toe voor meer context</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chart Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Laad een voorgedefinieerd chart template
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(chartTemplates).map(([key, template]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{template.type}</Badge>
                      <h4 className="font-medium capitalize">{key}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.colorScheme} kleuren • {template.lineStyle} lijnen
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadTemplate(key)}
                      className="w-full"
                    >
                      Laad Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}