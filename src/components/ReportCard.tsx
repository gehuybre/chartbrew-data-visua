import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Report } from '@/types';
import { CalendarDays, User, Tag } from '@phosphor-icons/react';

interface ReportCardProps {
  report: Report;
  onClick: () => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="font-inter font-semibold text-lg group-hover:text-primary transition-colors">
              {report.title}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {report.description}
            </CardDescription>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{report.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays size={14} />
            <span>{new Date(report.date).toLocaleDateString('nl-NL')}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Tag size={14} className="text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {report.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {report.charts.length} grafiek{report.charts.length !== 1 ? 'en' : ''} inbegrepen
        </div>
      </CardContent>
    </Card>
  );
}