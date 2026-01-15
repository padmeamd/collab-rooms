import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VibeTag } from '@/components/VibeTag';
import { RoleBadge } from '@/components/RoleBadge';
import { Room } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Calendar, MapPin, Users, Zap } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const { getRoomMembers, isUserInRoom, joinRoom, isAuthenticated } = useApp();
  const members = getRoomMembers(room.id);
  const isMember = isUserInRoom(room.id);
  const isFull = members.length >= room.maxParticipants;

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  return (
    <Card className="card-elevated overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="category" className="text-xs">
                {room.category}
              </Badge>
              {room.isPopUp && (
                <Badge variant="accent" className="text-xs gap-1">
                  <Zap className="w-3 h-3" />
                  Pop-Up
                </Badge>
              )}
            </div>
            <Link to={`/room/${room.id}`}>
              <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                {room.title}
              </h3>
            </Link>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {room.vibeTags.map(vibe => (
            <VibeTag key={vibe} vibe={vibe} size="sm" />
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {room.rolesNeeded.slice(0, 4).map(role => (
            <RoleBadge key={role} role={role} size="sm" />
          ))}
          {room.rolesNeeded.length > 4 && (
            <Badge variant="outline" className="text-[10px]">
              +{room.rolesNeeded.length - 4} more
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(room.date)} · {room.time}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{room.location}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className={`text-sm font-medium ${isFull ? 'text-destructive' : 'text-foreground'}`}>
            {members.length}/{room.maxParticipants}
          </span>
          {isFull && (
            <span className="text-xs text-destructive">Full</span>
          )}
        </div>
        
        {isMember ? (
          <Link to={`/room/${room.id}`}>
            <Button size="sm" variant="secondary">
              View Room
            </Button>
          </Link>
        ) : (
          <Link to={`/room/${room.id}`}>
            <Button 
              size="sm" 
              variant={isFull ? "outline" : "gradient"}
              disabled={isFull}
            >
              {isFull ? 'Full' : 'Join Room'}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
