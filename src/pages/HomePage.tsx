import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { RoomCard } from '@/components/RoomCard';
import { FilterBar } from '@/components/FilterBar';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Category, VibeTag, Role } from '@/types';
import { Plus, Zap, Sparkles } from 'lucide-react';
import { isToday, isThisWeek, parseISO } from 'date-fns';

export default function HomePage() {
  const { rooms, currentUser } = useApp();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<VibeTag[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [selectedTime, setSelectedTime] = useState<'all' | 'today' | 'week'>('all');

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(room.category)) {
        return false;
      }
      // Vibe filter
      if (selectedVibes.length > 0 && !room.vibeTags.some(v => selectedVibes.includes(v))) {
        return false;
      }
      // Role filter
      if (selectedRoles.length > 0 && !room.rolesNeeded.some(r => selectedRoles.includes(r))) {
        return false;
      }
      // Time filter
      if (selectedTime !== 'all') {
        const roomDate = parseISO(room.date);
        if (selectedTime === 'today' && !isToday(roomDate)) {
          return false;
        }
        if (selectedTime === 'week' && !isThisWeek(roomDate)) {
          return false;
        }
      }
      return true;
    });
  }, [rooms, selectedCategories, selectedVibes, selectedRoles, selectedTime]);

  return (
    <Layout>
      <div className="space-y-6 pb-20 md:pb-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl">
              Discover Rooms
            </h1>
            <p className="text-muted-foreground mt-1">
              Find your next creative collaboration
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/popup">
              <Button variant="accent" className="gap-2">
                <Zap className="w-4 h-4" />
                Pop-Up Room
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="gradient" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Room
              </Button>
            </Link>
          </div>
        </div>

        {/* Personalized greeting */}
        {currentUser && currentUser.skills.length > 0 && (
          <div className="p-4 bg-secondary/50 rounded-xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <p className="text-sm">
              <span className="font-medium">Looking for {currentUser.skills[0]}s?</span>
              <span className="text-muted-foreground ml-1">
                We found {filteredRooms.filter(r => r.rolesNeeded.includes(currentUser.skills[0] as Role)).length} rooms that need you!
              </span>
            </p>
          </div>
        )}

        {/* Filters */}
        <FilterBar
          selectedCategories={selectedCategories}
          selectedVibes={selectedVibes}
          selectedRoles={selectedRoles}
          selectedTime={selectedTime}
          onCategoriesChange={setSelectedCategories}
          onVibesChange={setSelectedVibes}
          onRolesChange={setSelectedRoles}
          onTimeChange={setSelectedTime}
        />

        {/* Room Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">No rooms found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or create a new room!
            </p>
            <Link to="/create">
              <Button variant="gradient" className="gap-2">
                <Plus className="w-4 h-4" />
                Create a Room
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
