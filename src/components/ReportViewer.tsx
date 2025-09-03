import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartViewer } from './ChartViewer';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Report } from '@/types';
import { ArrowLeft, CalendarDays, User } from '@phosphor-icons/react';

interface ReportViewerProps {
  report: Report;
  onBack: () => void;
}

export function ReportViewer({ report, onBack }: ReportViewerProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Reports
            </Button>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-inter font-bold text-3xl text-foreground">
              {report.title}
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {report.description}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{report.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                <span>{new Date(report.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {report.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-12">
          {/* Charts Section */}
          {report.charts.length > 0 && (
            <section>
              <h2 className="font-inter font-semibold text-2xl mb-6 text-foreground">
                Data Visualizations
              </h2>
              <div className="grid gap-8">
                {report.charts.map((chart, index) => (
                  <ChartViewer 
                    key={chart.id} 
                    chart={chart}
                    className={index > 0 ? "mt-8" : ""}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Report Content */}
          <section>
            <div className="border-t pt-8">
              <MarkdownRenderer content={report.content} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}