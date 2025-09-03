import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ReportTemplateConfig, 
  ReportSection, 
  generateReportFromTemplate,
  defaultTemplates 
} from '@/templates/reportTemplate';
import { chartTemplates, chartThemes } from '@/templates/chartTemplates';
import { FileText, ChartLine, Plus, Trash2, Download, Eye } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface TemplateBuilderProps {
  onTemplateGenerated?: (template: ReportTemplateConfig, generatedReport: any) => void;
}

export function TemplateBuilder({ onTemplateGenerated }: TemplateBuilderProps) {
  const [config, setConfig] = useState<ReportTemplateConfig>({
    title: '',
    description: '',
    author: '',
    sections: [],
    theme: 'default',
    layout: 'single-column',
    enableDownloads: true,
    enableSharing: true,
    showMetadata: true
  });

  const [currentSection, setCurrentSection] = useState<ReportSection>({
    id: '',
    type: 'text',
    title: '',
    content: '',
    order: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  const handleConfigChange = (field: keyof ReportTemplateConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (field: keyof ReportSection, value: any) => {
    setCurrentSection(prev => ({ ...prev, [field]: value }));
  };

  const addSection = () => {
    if (!currentSection.id || !currentSection.type) {
      toast.error('Sectie ID en type zijn verplicht');
      return;
    }

    const newSection = {
      ...currentSection,
      order: currentSection.order || config.sections.length + 1,
      id: currentSection.id.toLowerCase().replace(/\s+/g, '-')
    };

    if (isEditing) {
      const updatedSections = [...config.sections];
      updatedSections[editingIndex] = newSection;
      setConfig(prev => ({ ...prev, sections: updatedSections }));
      setIsEditing(false);
      setEditingIndex(-1);
      toast.success('Sectie bijgewerkt');
    } else {
      setConfig(prev => ({ 
        ...prev, 
        sections: [...prev.sections, newSection] 
      }));
      toast.success('Sectie toegevoegd');
    }

    // Reset form
    setCurrentSection({
      id: '',
      type: 'text',
      title: '',
      content: '',
      order: 0
    });
  };

  const editSection = (index: number) => {
    setCurrentSection(config.sections[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const deleteSection = (index: number) => {
    const updatedSections = config.sections.filter((_, i) => i !== index);
    setConfig(prev => ({ ...prev, sections: updatedSections }));
    toast.success('Sectie verwijderd');
  };

  const loadTemplate = (templateName: string) => {
    const template = defaultTemplates[templateName as keyof typeof defaultTemplates];
    if (template) {
      setConfig(prev => ({
        ...prev,
        ...template,
        title: prev.title || `Nieuw ${templateName} rapport`,
        description: prev.description || `Automatisch gegenereerd ${templateName} rapport`
      }));
      toast.success(`${templateName} template geladen`);
    }
  };

  const generateReport = () => {
    if (!config.title || config.sections.length === 0) {
      toast.error('Titel en minimaal één sectie zijn verplicht');
      return;
    }

    try {
      const generated = generateReportFromTemplate(config);
      onTemplateGenerated?.(config, generated);
      toast.success('Rapport template gegenereerd!');
    } catch (error) {
      toast.error('Fout bij genereren van rapport template');
      console.error(error);
    }
  };

  const exportTemplate = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.title.toLowerCase().replace(/\s+/g, '-')}-template.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Template geëxporteerd');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Rapport Template Builder</h2>
          <p className="text-muted-foreground">
            Maak uniforme rapport templates met consistente stijl en structuur
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTemplate} disabled={!config.title}>
            <Download size={16} className="mr-2" />
            Exporteer
          </Button>
          <Button onClick={generateReport} disabled={!config.title || config.sections.length === 0}>
            <Eye size={16} className="mr-2" />
            Voorbeeld
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basis Info</TabsTrigger>
          <TabsTrigger value="sections">Secties</TabsTrigger>
          <TabsTrigger value="styling">Styling</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Rapport Informatie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel *</Label>
                  <Input
                    id="title"
                    value={config.title}
                    onChange={(e) => handleConfigChange('title', e.target.value)}
                    placeholder="Rapport titel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Auteur</Label>
                  <Input
                    id="author"
                    value={config.author || ''}
                    onChange={(e) => handleConfigChange('author', e.target.value)}
                    placeholder="Naam van de auteur"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => handleConfigChange('description', e.target.value)}
                  placeholder="Korte beschrijving van het rapport"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Versie</Label>
                  <Input
                    id="version"
                    value={config.version || ''}
                    onChange={(e) => handleConfigChange('version', e.target.value)}
                    placeholder="1.0.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Datum</Label>
                  <Input
                    id="date"
                    type="date"
                    value={config.date || ''}
                    onChange={(e) => handleConfigChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Metadata tonen</Label>
                  <Select
                    value={config.showMetadata ? 'true' : 'false'}
                    onValueChange={(value) => handleConfigChange('showMetadata', value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Ja</SelectItem>
                      <SelectItem value="false">Nee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections */}
        <TabsContent value="sections" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditing ? 'Sectie Bewerken' : 'Nieuwe Sectie'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="section-id">Sectie ID *</Label>
                    <Input
                      id="section-id"
                      value={currentSection.id}
                      onChange={(e) => handleSectionChange('id', e.target.value)}
                      placeholder="sectie-id"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section-type">Type *</Label>
                    <Select
                      value={currentSection.type}
                      onValueChange={(value) => handleSectionChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Tekst</SelectItem>
                        <SelectItem value="chart">Grafiek</SelectItem>
                        <SelectItem value="metrics">Metrics</SelectItem>
                        <SelectItem value="insights">Inzichten</SelectItem>
                        <SelectItem value="recommendations">Aanbevelingen</SelectItem>
                        <SelectItem value="mixed">Gemengd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section-title">Titel</Label>
                  <Input
                    id="section-title"
                    value={currentSection.title || ''}
                    onChange={(e) => handleSectionChange('title', e.target.value)}
                    placeholder="Sectie titel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section-subtitle">Ondertitel</Label>
                  <Input
                    id="section-subtitle"
                    value={currentSection.subtitle || ''}
                    onChange={(e) => handleSectionChange('subtitle', e.target.value)}
                    placeholder="Sectie ondertitel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section-order">Volgorde</Label>
                  <Input
                    id="section-order"
                    type="number"
                    value={currentSection.order}
                    onChange={(e) => handleSectionChange('order', parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>

                {currentSection.type !== 'chart' && (
                  <div className="space-y-2">
                    <Label htmlFor="section-content">Content (HTML)</Label>
                    <Textarea
                      id="section-content"
                      value={currentSection.content || ''}
                      onChange={(e) => handleSectionChange('content', e.target.value)}
                      placeholder="HTML content voor deze sectie"
                      rows={4}
                    />
                  </div>
                )}

                <Button onClick={addSection} className="w-full">
                  <Plus size={16} className="mr-2" />
                  {isEditing ? 'Sectie Bijwerken' : 'Sectie Toevoegen'}
                </Button>

                {isEditing && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditingIndex(-1);
                      setCurrentSection({
                        id: '',
                        type: 'text',
                        title: '',
                        content: '',
                        order: 0
                      });
                    }}
                    className="w-full"
                  >
                    Annuleren
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Sections List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Secties ({config.sections.length})
                  <Badge variant="secondary">
                    {config.sections.length} {config.sections.length === 1 ? 'sectie' : 'secties'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {config.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {section.type}
                            </Badge>
                            <span className="font-medium text-sm">
                              {section.title || section.id}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Volgorde: {section.order} • ID: {section.id}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => editSection(index)}
                          >
                            Bewerk
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteSection(index)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}

                  {config.sections.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText size={32} className="mx-auto mb-2 opacity-50" />
                      <p>Nog geen secties toegevoegd</p>
                      <p className="text-xs">Voeg een sectie toe om te beginnen</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Styling */}
        <TabsContent value="styling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartLine size={20} />
                Stijl & Layout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Thema</Label>
                  <Select
                    value={config.theme || 'default'}
                    onValueChange={(value) => handleConfigChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Standaard</SelectItem>
                      <SelectItem value="analytical">Analytisch</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="technical">Technisch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="layout">Layout</Label>
                  <Select
                    value={config.layout || 'single-column'}
                    onValueChange={(value) => handleConfigChange('layout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-column">Enkele kolom</SelectItem>
                      <SelectItem value="two-column">Twee kolommen</SelectItem>
                      <SelectItem value="mixed">Gemengd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Downloads toestaan</Label>
                  <Select
                    value={config.enableDownloads ? 'true' : 'false'}
                    onValueChange={(value) => handleConfigChange('enableDownloads', value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Ja</SelectItem>
                      <SelectItem value="false">Nee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Beschikbare Chart Thema's</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(chartThemes).map(([key, theme]) => (
                    <div key={key} className="p-3 border rounded-lg">
                      <h5 className="font-medium mb-1">{theme.name}</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        {theme.description}
                      </p>
                      <div className="flex gap-1">
                        {theme.colors.primary.slice(0, 5).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Standaard Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Laad een voorgedefinieerd template als startpunt
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(defaultTemplates).map(([key, template]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 capitalize">{key}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.sections?.length} secties • {template.theme} thema
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