import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scrollytelling } from './Scrollytelling';
import { ChartRenderer } from './ChartRenderer';
import { SimpleChartTest } from './SimpleChartTest';
import { SimpleBarChart, testBarData, testLineData } from './SimpleBarChart';
import { DirectChartTest } from './DirectChartTest';
import { Report } from '@/types';
import { ArrowLeft, CalendarDays, User } from '@phosphor-icons/react';

interface ReportViewerProps {
  report: Report;
  onBack: () => void;
}

export function ReportViewer({ report, onBack }: ReportViewerProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReportContent();
  }, [report]);

  const loadReportContent = () => {
    // For demo purposes, we'll use the mock HTML content
    // In a real implementation, this would load from the actual content.html file
    if (report.id === 'q3-2024-analytics') {
      setHtmlContent(getQ3AnalyticsContent());
    } else {
      setHtmlContent(getDefaultContent());
    }
  };

  const getQ3AnalyticsContent = () => {
    return `
      <div class="scrolly-report">
        <section id="introduction" class="scrolly-section text-section">
          <div class="container">
            <h1>Q3 2024 Website Analytics Rapport</h1>
            <p class="lead">
              Onze Q3 2024 analytics tonen significante groei in alle belangrijke prestatie-indicatoren. 
              Websiteverkeer steeg met <strong>37%</strong> vergeleken met Q2, met bijzonder sterke 
              prestaties in organische zoekzichtbaarheid.
            </p>
            <div class="highlight-box">
              <h3>Samenvatting van Resultaten</h3>
              <ul class="key-metrics">
                <li><span class="metric">37%</span> toename in websiteverkeer</li>
                <li><span class="metric">21,180</span> unieke bezoekers in september</li>
                <li><span class="metric">45%</span> van verkeer via organisch zoeken</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="traffic-growth" class="scrolly-section chart-section">
          <div class="container">
            <div class="section-header">
              <h2>Verkeersgroei Doorheen Q3</h2>
              <p>
                Het derde kwartaal toonde uitzonderlijke groei in unieke bezoekers, waarbij 
                september ons hoogste maandelijkse verkeer tot nu toe markeerde.
              </p>
            </div>
            
            <div class="scrolly-chart-container">
              <div class="chart-placeholder" id="monthly-visitors-chart" data-chart="monthly-visitors"></div>
            </div>
            
            <div class="analysis-text">
              <h3>Groei Acceleratie</h3>
              <p>
                De maandelijkse groei toont een versnelling vanaf augustus, met een 
                opmerkelijke sprong van <strong>18,350</strong> naar <strong>21,180</strong> 
                unieke bezoekers tussen augustus en september.
              </p>
              
              <h4>Deze groei kan worden toegeschreven aan:</h4>
              <ul>
                <li>Verbeterde SEO-strategie implementatie</li>
                <li>Verbeterde contentmarketing-inspanningen</li>
                <li>Strategische social media campagnes</li>
                <li>Geoptimaliseerde gebruikerservaring op mobiele apparaten</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="page-performance" class="scrolly-section chart-text-section">
          <div class="container">
            <div class="section-header">
              <h2>Pagina Prestatie Analyse</h2>
              <p>Welke pagina's trekken de meeste aandacht van onze bezoekers?</p>
            </div>
            
            <div class="chart-placeholder" id="page-performance-chart" data-chart="page-performance"></div>
            
            <div class="analysis-text">
              <h3>Homepage Dominantie</h3>
              <p>
                Onze homepage blijft veruit de meest bezochte pagina met <strong>8,450 weergaven</strong>, 
                wat de effectiviteit van onze landingspagina optimalisaties bevestigt.
              </p>
              
              <h4>Belangrijke Bevindingen:</h4>
              <ul>
                <li><strong>Productcatalogus</strong> (6,200 weergaven) - Sterke commerciële interesse</li>
                <li><strong>Blog</strong> (3,600 weergaven) - Content marketing succes</li>
                <li><strong>Over Ons</strong> (4,100 weergaven) - Merkvertrouwen opbouw</li>
                <li><strong>Contact</strong> (2,800 weergaven) - Goede lead generatie basis</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="recommendations" class="scrolly-section text-section">
          <div class="container">
            <h2>Aanbevelingen voor Q4</h2>
            
            <div class="recommendations-list">
              <div class="recommendation">
                <div class="rec-number">1</div>
                <div class="rec-content">
                  <h4>Inzetten op contentmarketing</h4>
                  <p>Blogposts genereren significant organisch verkeer en moeten uitgebreid worden</p>
                </div>
              </div>
              
              <div class="recommendation">
                <div class="rec-number">2</div>
                <div class="rec-content">
                  <h4>Mobiele ervaring optimaliseren</h4>
                  <p>68% van het verkeer is nu mobiel - prioriteit voor UX verbeteringen</p>
                </div>
              </div>
              
              <div class="recommendation">
                <div class="rec-number">3</div>
                <div class="rec-content">
                  <h4>Social media aanwezigheid uitbreiden</h4>
                  <p>Vooral op platforms met hoogste betrokkenheid investeren</p>
                </div>
              </div>
              
              <div class="recommendation">
                <div class="rec-number">4</div>
                <div class="rec-content">
                  <h4>A/B test checkout proces</h4>
                  <p>Om conversiepercentages verder te verbeteren en weerstand weg te nemen</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  };

  const getDefaultContent = () => {
    return `
      <div class="scrolly-report">
        <section class="scrolly-section text-section">
          <div class="container">
            <h1>${report.title}</h1>
            <p class="lead">${report.description}</p>
            
            <div class="charts-section">
              ${report.charts.map(chart => `
                <div class="chart-container" style="margin: 3rem 0;">
                  <div class="chart-placeholder" id="${chart.id}-chart" data-chart="${chart.id}"></div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      </div>
    `;
  };

  const handleChartVisible = (chartId: string) => {
    setVisibleCharts(prev => new Set([...prev, chartId]));
  };

  // Get rendered charts for visible chart IDs
  const getRenderedCharts = () => {
    return Array.from(visibleCharts).map(chartId => {
      const chart = report.charts.find(c => c.id === chartId);
      if (!chart) return null;
      
      return (
        <ChartRenderer
          key={chartId}
          configPath={chart.configPath}
          width={800}
          height={400}
          className="chart-rendered"
        />
      );
    }).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Terug naar Rapporten
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
                <span>{new Date(report.date).toLocaleDateString('nl-NL', { 
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

      {/* Scrollytelling Content */}
      <div className="scrolly-article">
        {report.id === 'q3-2024-analytics' ? (
          <Q3AnalyticsScrollyContent report={report} />
        ) : (
          <DefaultScrollyContent report={report} />
        )}
      </div>
    </div>
  );
}

// React-based scrollytelling components
function Q3AnalyticsScrollyContent({ report }: { report: Report }) {
  return (
    <div className="scrolly-report">
      <section id="introduction" className="scrolly-section text-section">
        <div className="container">
          <h1>Q3 2024 Website Analytics Rapport</h1>
          <p className="lead">
            Onze Q3 2024 analytics tonen significante groei in alle belangrijke prestatie-indicatoren. 
            Websiteverkeer steeg met <strong>37%</strong> vergeleken met Q2, met bijzonder sterke 
            prestaties in organische zoekzichtbaarheid.
          </p>
          <div className="highlight-box">
            <h3>Samenvatting van Resultaten</h3>
            <ul className="key-metrics">
              <li><span className="metric">37%</span> toename in websiteverkeer</li>
              <li><span className="metric">21,180</span> unieke bezoekers in september</li>
              <li><span className="metric">45%</span> van verkeer via organisch zoeken</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="traffic-growth" className="scrolly-section chart-section">
        <div className="container">
          <div className="section-header">
            <h2>Verkeersgroei Doorheen Q3</h2>
            <p>
              Het derde kwartaal toonde uitzonderlijke groei in unieke bezoekers, waarbij 
              september ons hoogste maandelijkse verkeer tot nu toe markeerde.
            </p>
          </div>
          
          <div className="scrolly-chart-container">
            <DirectChartTest />
            
            <SimpleBarChart data={testBarData} width={600} height={300} />
            
            <SimpleChartTest />
            
            <ChartRenderer
              configPath="/src/rapporten/q3-2024-analytics/monthly-visitors.config.json"
              width={800}
              height={400}
            />
          </div>
          
          <div className="analysis-text">
            <h3>Groei Acceleratie</h3>
            <p>
              De maandelijkse groei toont een versnelling vanaf augustus, met een 
              opmerkelijke sprong van <strong>18,350</strong> naar <strong>21,180</strong> 
              unieke bezoekers tussen augustus en september.
            </p>
            
            <h4>Deze groei kan worden toegeschreven aan:</h4>
            <ul>
              <li>Verbeterde SEO-strategie implementatie</li>
              <li>Verbeterde contentmarketing-inspanningen</li>
              <li>Strategische social media campagnes</li>
              <li>Geoptimaliseerde gebruikerservaring op mobiele apparaten</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="page-performance" className="scrolly-section chart-text-section">
        <div className="container">
          <div className="section-header">
            <h2>Pagina Prestatie Analyse</h2>
            <p>Welke pagina's trekken de meeste aandacht van onze bezoekers?</p>
          </div>
          
          <ChartRenderer
            configPath="/src/rapporten/q3-2024-analytics/page-performance.config.json"
            width={800}
            height={400}
          />
          
          <div className="analysis-text">
            <h3>Homepage Dominantie</h3>
            <p>
              Onze homepage blijft veruit de meest bezochte pagina met <strong>8,450 weergaven</strong>, 
              wat de effectiviteit van onze landingspagina optimalisaties bevestigt.
            </p>
            
            <h4>Belangrijke Bevindingen:</h4>
            <ul>
              <li><strong>Productcatalogus</strong> (6,200 weergaven) - Sterke commerciële interesse</li>
              <li><strong>Blog</strong> (3,600 weergaven) - Content marketing succes</li>
              <li><strong>Over Ons</strong> (4,100 weergaven) - Merkvertrouwen opbouw</li>
              <li><strong>Contact</strong> (2,800 weergaven) - Goede lead generatie basis</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="recommendations" className="scrolly-section text-section">
        <div className="container">
          <h2>Aanbevelingen voor Q4</h2>
          
          <div className="recommendations-list">
            <div className="recommendation">
              <div className="rec-number">1</div>
              <div className="rec-content">
                <h4>Inzetten op contentmarketing</h4>
                <p>Blogposts genereren significant organisch verkeer en moeten uitgebreid worden</p>
              </div>
            </div>
            
            <div className="recommendation">
              <div className="rec-number">2</div>
              <div className="rec-content">
                <h4>Mobiele ervaring optimaliseren</h4>
                <p>68% van het verkeer is nu mobiel - prioriteit voor UX verbeteringen</p>
              </div>
            </div>
            
            <div className="recommendation">
              <div className="rec-number">3</div>
              <div className="rec-content">
                <h4>Social media aanwezigheid uitbreiden</h4>
                <p>Vooral op platforms met hoogste betrokkenheid investeren</p>
              </div>
            </div>
            
            <div className="recommendation">
              <div className="rec-number">4</div>
              <div className="rec-content">
                <h4>A/B test checkout proces</h4>
                <p>Om conversiepercentages verder te verbeteren en weerstand weg te nemen</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DefaultScrollyContent({ report }: { report: Report }) {
  return (
    <div className="scrolly-report">
      <section className="scrolly-section text-section">
        <div className="container">
          <h1>{report.title}</h1>
          <p className="lead">{report.description}</p>
          
          <div className="charts-section">
            {report.charts.map(chart => (
              <div key={chart.id} className="chart-container" style={{ margin: '3rem 0' }}>
                <ChartRenderer
                  configPath={chart.configPath}
                  width={800}
                  height={400}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}