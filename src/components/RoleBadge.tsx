import { Badge } from '@/components/ui/badge';
import { Role } from '@/types';
import { Camera, Clapperboard, Edit3, Palette, Code, PenTool, Film, Users } from 'lucide-react';

interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const roleIcons: Record<Role, React.ReactNode> = {
  'Actor': <Users className="w-3 h-3" />,
  'Camera': <Camera className="w-3 h-3" />,
  'Editor': <Edit3 className="w-3 h-3" />,
  'Designer': <Palette className="w-3 h-3" />,
  'Developer': <Code className="w-3 h-3" />,
  'Writer': <PenTool className="w-3 h-3" />,
  'Director': <Clapperboard className="w-3 h-3" />,
  'Producer': <Film className="w-3 h-3" />,
};

export function RoleBadge({ role, size = 'md', showIcon = true }: RoleBadgeProps) {
  return (
    <Badge 
      variant="role" 
      className={`gap-1 ${size === 'sm' ? 'text-[10px] px-2 py-0' : ''}`}
    >
      {showIcon && roleIcons[role]}
      {role}
    </Badge>
  );
}
