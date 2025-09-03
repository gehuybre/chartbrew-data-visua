import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Report } from '@/types';
import { ReportCard } from './components/ReportCard';
import { ReportViewer } from './components/ReportViewer';
import { SearchBar } from './components/SearchBar';
import { TemplateManager } from './components/TemplateManager';
import { loadAllReports } from './data/reportLoader';
import { FileText, ChartLine, Settings } from '@phosphor-icons/react';

function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const allReports = await loadAllReports();
      setReports(allReports);
      setFilteredReports(allReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportSelect = (report: Report) => {
    setSelectedReport(report);
  };

  const handleBackToReports = () => {
    setSelectedReport(null);
  };

  const handleTemplateManagerOpen = () => {
    setShowTemplateManager(true);
  };

  const handleTemplateManagerClose = () => {
    setShowTemplateManager(false);
  };

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="p-4 bg-primary text-primary-foreground rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-pulse">
              <ChartLine size={24} />
            </div>
            <h3 className="font-inter font-semibold text-lg mb-2">Rapporten laden...</h3>
            <p className="text-muted-foreground">
              Bezig met het laden van alle rapporten
            </p>
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  if (showTemplateManager) {
    return (
      <>
        <TemplateManager onBack={handleTemplateManagerClose} />
        <Toaster />
      </>
    );
  }

  if (selectedReport) {
    return (
      <>
        <ReportViewer 
          report={selectedReport} 
          onBack={handleBackToReports}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary text-primary-foreground rounded-lg">
                  <ChartLine size={24} />
                </div>
                <h1 className="font-inter font-bold text-3xl text-foreground">
                  ChartBrew Rapporten
                </h1>
              </div>
              <Button 
                variant="outline" 
                onClick={handleTemplateManagerOpen}
                className="flex items-center gap-2"
              >
                <Settings size={16} />
                Template Systeem
              </Button>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Data-analyse en inzichten in uitgebreid leesformaat
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Search and Filter */}
            <SearchBar 
              reports={reports}
              onFilteredReports={setFilteredReports}
            />

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>
                  {filteredReports.length} rapport{filteredReports.length !== 1 ? 'en' : ''} gevonden
                </span>
              </div>
              {filteredReports.length !== reports.length && (
                <span>
                  (gefilterd uit {reports.length} totaal)
                </span>
              )}
            </div>

            {/* Reports Grid */}
            {filteredReports.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onClick={() => handleReportSelect(report)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText size={24} className="text-muted-foreground" />
                </div>
                <h3 className="font-inter font-semibold text-lg mb-2">Geen rapporten gevonden</h3>
                <p className="text-muted-foreground">
                  Probeer je zoektermen aan te passen of de filters te wissen
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
      <Toaster />
    </>
  );
}

export default App;