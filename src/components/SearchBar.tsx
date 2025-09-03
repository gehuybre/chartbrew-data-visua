import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { Report } from '@/types';

interface SearchBarProps {
  reports: Report[];
  onFilteredReports: (filtered: Report[]) => void;
}

export function SearchBar({ reports, onFilteredReports }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from reports
  const allTags = [...new Set(reports.flatMap(report => report.tags))].sort();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterReports(term, selectedTags);
  };

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    filterReports(searchTerm, newSelectedTags);
  };

  const filterReports = (term: string, tags: string[]) => {
    let filtered = reports;

    // Filter by search term
    if (term.trim()) {
      const searchLower = term.toLowerCase();
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchLower) ||
        report.description.toLowerCase().includes(searchLower) ||
        report.content.toLowerCase().includes(searchLower) ||
        report.author.toLowerCase().includes(searchLower)
      );
    }

    // Filter by tags
    if (tags.length > 0) {
      filtered = filtered.filter(report =>
        tags.some(tag => report.tags.includes(tag))
      );
    }

    onFilteredReports(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    onFilteredReports(reports);
  };

  const hasActiveFilters = searchTerm.trim() || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search reports by title, content, or author..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 h-12 font-inter"
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-muted-foreground">Tags:</span>
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleTagToggle(tag)}
          >
            {tag}
          </Badge>
        ))}
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ml-2"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}