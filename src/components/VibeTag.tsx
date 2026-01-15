import { Badge } from '@/components/ui/badge';
import { VibeTag as VibeTagType } from '@/types';

interface VibeTagProps {
  vibe: VibeTagType;
  size?: 'sm' | 'md';
}

export function VibeTag({ vibe, size = 'md' }: VibeTagProps) {
  const variantMap: Record<VibeTagType, 'chill' | 'serious' | 'beginner' | 'portfolio'> = {
    'Chill': 'chill',
    'Serious': 'serious',
    'Beginner-friendly': 'beginner',
    'Portfolio-focused': 'portfolio',
  };

  return (
    <Badge 
      variant={variantMap[vibe]} 
      className={size === 'sm' ? 'text-[10px] px-2 py-0' : ''}
    >
      {vibe}
    </Badge>
  );
}
