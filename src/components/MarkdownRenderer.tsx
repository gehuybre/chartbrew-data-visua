import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const renderMarkdown = () => {
    try {
      return marked(content);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return '<p>Error rendering content</p>';
    }
  };

  return (
    <div 
      className={`prose prose-lg max-w-none 
        prose-headings:font-inter prose-headings:text-foreground
        prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8
        prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-6  
        prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-4
        prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
        prose-strong:text-foreground prose-strong:font-semibold
        prose-em:text-foreground
        prose-ul:text-foreground prose-ol:text-foreground
        prose-li:text-foreground prose-li:mb-1
        prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
        prose-code:text-accent prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown() }}
    />
  );
}