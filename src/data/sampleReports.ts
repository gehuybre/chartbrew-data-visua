import { Report } from '../types';

export const sampleReports: Report[] = [
  {
    id: 'q3-2024-analytics',
    title: 'Q3 2024 Website Analytics Report',
    description: 'Comprehensive analysis of website performance, user engagement, and conversion metrics for the third quarter of 2024.',
    author: 'Analytics Team',
    date: '2024-10-15',
    tags: ['analytics', 'performance', 'quarterly'],
    thumbnail: '',
    charts: [
      {
        id: 'monthly-visitors',
        type: 'line',
        title: 'Monthly Unique Visitors',
        data: [
          { month: 'July', visitors: 15420 },
          { month: 'August', visitors: 18350 },
          { month: 'September', visitors: 21180 }
        ]
      },
      {
        id: 'traffic-sources',
        type: 'pie',
        title: 'Traffic Sources Distribution',
        data: [
          { source: 'Organic Search', percentage: 45 },
          { source: 'Direct', percentage: 25 },
          { source: 'Social Media', percentage: 15 },
          { source: 'Referrals', percentage: 10 },
          { source: 'Email', percentage: 5 }
        ]
      },
      {
        id: 'page-performance',
        type: 'bar',
        title: 'Top Performing Pages (Page Views)',
        data: [
          { page: 'Homepage', views: 8450 },
          { page: 'Product Catalog', views: 6200 },
          { page: 'About Us', views: 4100 },
          { page: 'Contact', views: 2800 },
          { page: 'Blog', views: 3600 }
        ]
      }
    ],
    content: `
# Executive Summary

Our Q3 2024 analytics reveal significant growth across all key performance indicators. Website traffic increased by **37%** compared to Q2, with particularly strong performance in organic search visibility.

## Key Findings

### Traffic Growth
The third quarter showed exceptional growth in unique visitors, with September marking our highest monthly traffic to date. This growth can be attributed to:

- Improved SEO strategy implementation
- Enhanced content marketing efforts  
- Strategic social media campaigns
- Optimized user experience across mobile devices

### User Engagement Patterns
Analysis of user behavior indicates improved engagement metrics:

- **Average session duration**: 4.2 minutes (+15% from Q2)
- **Pages per session**: 3.8 (+22% from Q2)
- **Bounce rate**: 32% (-8% from Q2)

### Conversion Performance
E-commerce and lead generation metrics show positive trends:

- **Conversion rate**: 2.8% (+0.4% from Q2)
- **Average order value**: €127 (+€12 from Q2)
- **Newsletter signups**: 1,240 new subscribers

## Recommendations

Based on these insights, we recommend:

1. **Double down on content marketing** - Blog posts are driving significant organic traffic
2. **Optimize mobile experience** - 68% of traffic is now mobile
3. **Expand social media presence** - Particularly on platforms showing highest engagement
4. **A/B test checkout process** - To further improve conversion rates

## Technical Notes

Data collection period: July 1 - September 30, 2024
Tools used: Google Analytics 4, Search Console, internal tracking
Data accuracy: ±2% margin of error
    `
  },
  {
    id: 'user-satisfaction-2024',
    title: 'Customer Satisfaction Survey Results 2024',
    description: 'Annual customer satisfaction survey results showing feedback across product quality, support, and overall experience.',
    author: 'Customer Success Team',
    date: '2024-09-28',
    tags: ['survey', 'satisfaction', 'customer-feedback'],
    thumbnail: '',
    charts: [
      {
        id: 'satisfaction-scores',
        type: 'bar',
        title: 'Satisfaction Scores by Category',
        data: [
          { category: 'Product Quality', score: 8.4 },
          { category: 'Customer Support', score: 7.9 },
          { category: 'Delivery Speed', score: 8.7 },
          { category: 'Value for Money', score: 7.6 },
          { category: 'Overall Experience', score: 8.2 }
        ]
      },
      {
        id: 'nps-trend',
        type: 'line',
        title: 'Net Promoter Score Trend',
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
        title: 'Response Rate by Customer Segment',
        data: [
          { segment: 'Premium Customers', responses: 340 },
          { segment: 'Standard Customers', responses: 890 },
          { segment: 'New Customers', responses: 156 },
          { segment: 'Enterprise', responses: 78 }
        ]
      }
    ],
    content: `
# Customer Satisfaction Report 2024

This comprehensive survey captures feedback from **1,464 customers** across all customer segments, representing our largest satisfaction study to date.

## Survey Methodology

- **Survey Period**: August 1-31, 2024
- **Response Rate**: 23.8% (industry average: 15-20%)
- **Sample Size**: 1,464 respondents
- **Method**: Email survey with follow-up reminders

## Overall Results

Our **Net Promoter Score (NPS) of 55** places us in the "excellent" category, representing a **13-point increase** from last year. This improvement reflects our continued investment in customer experience initiatives.

### Satisfaction Highlights

**Product Quality** remains our strongest performance area with an average score of **8.4/10**. Customer comments frequently praise:

- Build quality and durability
- Feature completeness  
- Ease of use
- Design aesthetics

**Delivery Speed** scored exceptionally well at **8.7/10**, reflecting our investment in logistics partnerships and warehouse optimization.

### Areas for Improvement

**Value for Money** scored lowest at **7.6/10**, indicating price sensitivity remains a concern. Key feedback themes:

- Pricing transparency requests
- More flexible payment options
- Clearer value proposition communication

**Customer Support** at **7.9/10** shows room for improvement, particularly:

- Faster response times during peak periods
- More self-service options
- Enhanced technical documentation

## Customer Segment Analysis

### Premium Customers (23% of responses)
- Highest satisfaction across all categories
- NPS: 67 (Excellent)
- Primary value drivers: Quality and exclusive features

### Standard Customers (61% of responses)  
- Balanced satisfaction scores
- NPS: 48 (Good)
- Primary concerns: Value and support responsiveness

### New Customers (11% of responses)
- Lower satisfaction due to onboarding challenges
- NPS: 31 (Needs improvement)
- Key improvement area: First-time user experience

### Enterprise (5% of responses)
- High satisfaction with customization options
- NPS: 72 (Excellent)
- Seeking enhanced integration capabilities

## Action Plan

Based on these findings, our 2025 priorities include:

1. **Pricing Strategy Review** - Implement more transparent pricing tiers
2. **Support Enhancement** - Reduce average response time to under 2 hours
3. **Onboarding Improvement** - Redesign new customer journey
4. **Self-Service Expansion** - Launch comprehensive knowledge base

## Conclusion

The 2024 results demonstrate strong customer loyalty and satisfaction growth. Our focus on product quality and operational excellence is clearly resonating with customers, while identified improvement areas provide a clear roadmap for 2025 initiatives.
    `
  },
  {
    id: 'sales-performance-h1',
    title: 'H1 2024 Sales Performance Analysis',
    description: 'First half sales results with regional breakdown, product performance, and pipeline analysis.',
    author: 'Sales Operations',
    date: '2024-07-05',
    tags: ['sales', 'performance', 'revenue'],
    thumbnail: '',
    charts: [
      {
        id: 'monthly-revenue',
        type: 'area',
        title: 'Monthly Revenue (€000s)',
        data: [
          { month: 'January', revenue: 280 },
          { month: 'February', revenue: 320 },
          { month: 'March', revenue: 380 },
          { month: 'April', revenue: 350 },
          { month: 'May', revenue: 420 },
          { month: 'June', revenue: 450 }
        ]
      },
      {
        id: 'regional-breakdown',
        type: 'bar',
        title: 'Revenue by Region (H1 2024)',
        data: [
          { region: 'North America', revenue: 780 },
          { region: 'Europe', revenue: 920 },
          { region: 'Asia Pacific', revenue: 540 },
          { region: 'Latin America', revenue: 210 },
          { region: 'Other', revenue: 150 }
        ]
      },
      {
        id: 'product-mix',
        type: 'pie',
        title: 'Revenue by Product Category',
        data: [
          { category: 'Software Licenses', revenue: 1200 },
          { category: 'Support Services', revenue: 800 },
          { category: 'Professional Services', revenue: 450 },
          { category: 'Training', revenue: 150 }
        ]
      }
    ],
    content: `
# H1 2024 Sales Performance Summary

The first half of 2024 delivered **€2.6M in total revenue**, representing **18% growth** over H1 2023 and exceeding our target by 8%.

## Revenue Performance

### Monthly Progression
Q2 showed particularly strong performance with **June achieving our highest monthly revenue** of €450K. This represents:

- **28% growth** over June 2023
- **125% achievement** of monthly target
- **3 consecutive months** of growth acceleration

### Regional Analysis

**Europe continues to be our strongest market**, contributing 35% of total revenue (€920K). Key drivers include:

- Successful expansion in German and French markets
- Strong renewal rates from existing customers
- New partnership agreements with regional system integrators

**North America** contributed €780K (30% of revenue) with highlights including:

- Major enterprise deal closures in Q2
- Improved sales cycle efficiency
- Enhanced channel partner performance

**Asia Pacific growth** of 45% YoY demonstrates the success of our regional expansion strategy, though absolute numbers remain below target due to longer sales cycles in the region.

## Product Performance

### Software Licenses (46% of revenue)
Our core software product continues to drive growth with **€1.2M in H1 revenue**. Success factors:

- Enhanced feature set released in Q1
- Competitive pricing adjustments
- Improved demo-to-close conversion rates

### Support Services (31% of revenue)
Recurring revenue from support services provides stable foundation at **€800K**. Notable improvements:

- 96% customer retention rate
- Average contract value increase of 12%
- Successful upselling to premium support tiers

### Professional Services (17% of revenue)
Custom implementation services generated **€450K**, with strong margins maintained despite increased project complexity.

## Pipeline Analysis

Our Q3/Q4 pipeline shows **€3.1M in qualified opportunities**, indicating potential for continued growth momentum:

- **€1.8M** in Q3 forecast (confidence: 78%)
- **€1.3M** in Q4 early-stage opportunities
- **Average deal size increase** of 15% over H1 2023

## Key Performance Indicators

### Sales Efficiency Metrics
- **Sales cycle length**: 89 days (target: 90 days) ✓
- **Lead conversion rate**: 23% (target: 20%) ✓
- **Customer acquisition cost**: €4,200 (target: €4,500) ✓
- **Annual contract value**: €28,400 (target: €25,000) ✓

### Team Performance
Our sales team of 12 professionals achieved:

- **108% of team quota** attainment
- **9 out of 12 reps** exceeded individual targets
- **142% increase** in qualified demos delivered

## Challenges and Opportunities

### Challenges
1. **Longer sales cycles in enterprise segment** - Average increased from 120 to 135 days
2. **Competitive pressure on pricing** - Particularly in North American market
3. **Resource constraints in customer success** - Impacting expansion revenue potential

### Opportunities
1. **Partnership channel development** - Early success suggests 25% revenue potential
2. **Product line extension** - Customer demand for adjacent solutions
3. **International expansion** - Untapped markets in South America and Africa

## H2 2024 Outlook

Based on current pipeline and market conditions, we forecast:

- **Q3 Revenue Target**: €1.5M (confidence: high)
- **Q4 Revenue Target**: €1.7M (confidence: medium)
- **Full Year Projection**: €5.8M (16% growth over 2023)

Key initiatives for H2 include accelerated partner recruitment, enterprise sales team expansion, and enhanced customer success programs to drive expansion revenue.
    `
  }
];