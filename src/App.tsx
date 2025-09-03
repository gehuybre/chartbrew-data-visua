import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Report } from '@/types';
import { ReportCard } from './components/ReportCard';
import { ReportViewer } from './components/ReportViewer';
import { SearchBar } from './components/SearchBar';
import { sampleReports } from './data/sampleReports';
import { FileText, ChartLine } from '@phosphor-icons/react';

function App() {
  const [reports] = useKV<Report[]>('reports', sampleReports);
  const [filteredReports, setFilteredReports] = useState<Report[]>(reports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleReportSelect = (report: Report) => {
    setSelectedReport(report);
  };

  const handleBackToReports = () => {
    setSelectedReport(null);
  };

  if (selectedReport) {
    return (
      <ReportViewer 
        report={selectedReport} 
        onBack={handleBackToReports}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <ChartLine size={24} />
            </div>
            <h1 className="font-inter font-bold text-3xl text-foreground">
              ChartBrew Reports
            </h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Comprehensive data analysis and insights in long-read format
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
                {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
              </span>
            </div>
            {filteredReports.length !== reports.length && (
              <span>
                (filtered from {reports.length} total)
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
              <h3 className="font-inter font-semibold text-lg mb-2">No reports found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or clearing the filters
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;