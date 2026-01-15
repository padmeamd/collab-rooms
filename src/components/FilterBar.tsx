import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Category, VibeTag, Role } from '@/types';
import { allCategories, allVibeTags, allRoles } from '@/data/mockData';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterBarProps {
  selectedCategories: Category[];
  selectedVibes: VibeTag[];
  selectedRoles: Role[];
  selectedTime: 'all' | 'today' | 'week';
  onCategoriesChange: (categories: Category[]) => void;
  onVibesChange: (vibes: VibeTag[]) => void;
  onRolesChange: (roles: Role[]) => void;
  onTimeChange: (time: 'all' | 'today' | 'week') => void;
}

export function FilterBar({
  selectedCategories,
  selectedVibes,
  selectedRoles,
  selectedTime,
  onCategoriesChange,
  onVibesChange,
  onRolesChange,
  onTimeChange,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);
  
  const hasFilters = 
    selectedCategories.length > 0 || 
    selectedVibes.length > 0 || 
    selectedRoles.length > 0 || 
    selectedTime !== 'all';

  const clearFilters = () => {
    onCategoriesChange([]);
    onVibesChange([]);
    onRolesChange([]);
    onTimeChange('all');
  };

  const toggleCategory = (category: Category) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const toggleVibe = (vibe: VibeTag) => {
    if (selectedVibes.includes(vibe)) {
      onVibesChange(selectedVibes.filter(v => v !== vibe));
    } else {
      onVibesChange([...selectedVibes, vibe]);
    }
  };

  const toggleRole = (role: Role) => {
    if (selectedRoles.includes(role)) {
      onRolesChange(selectedRoles.filter(r => r !== role));
    } else {
      onRolesChange([...selectedRoles, role]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Time Filters + Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          {(['all', 'today', 'week'] as const).map((time) => (
            <Button
              key={time}
              size="sm"
              variant={selectedTime === time ? "default" : "ghost"}
              className="h-8 px-3"
              onClick={() => onTimeChange(time)}
            >
              {time === 'all' ? 'All Time' : time === 'today' ? 'Today' : 'This Week'}
            </Button>
          ))}
        </div>
        
        <Button
          variant={expanded ? "secondary" : "outline"}
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasFilters && (
            <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs">
              {selectedCategories.length + selectedVibes.length + selectedRoles.length}
            </Badge>
          )}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1 text-muted-foreground"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {expanded && (
        <div className="p-4 bg-card rounded-xl border border-border space-y-4 animate-slide-up">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Vibes */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Vibe</h4>
            <div className="flex flex-wrap gap-2">
              {allVibeTags.map(vibe => (
                <Button
                  key={vibe}
                  variant={selectedVibes.includes(vibe) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleVibe(vibe)}
                >
                  {vibe}
                </Button>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Roles Needed</h4>
            <div className="flex flex-wrap gap-2">
              {allRoles.map(role => (
                <Button
                  key={role}
                  variant={selectedRoles.includes(role) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleRole(role)}
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
