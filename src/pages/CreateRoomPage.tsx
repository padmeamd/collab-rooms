import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Category, VibeTag, Role } from '@/types';
import { allCategories, allVibeTags, allRoles } from '@/data/mockData';
import { ArrowLeft, Plus, MapPin, Calendar, Clock, Users } from 'lucide-react';

export default function CreateRoomPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [selectedVibes, setSelectedVibes] = useState<VibeTag[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(6);

  const { createRoom, currentUser } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleVibe = (vibe: VibeTag) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(prev => prev.filter(v => v !== vibe));
    } else {
      setSelectedVibes(prev => [...prev, vibe]);
    }
  };

  const toggleRole = (role: Role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(prev => prev.filter(r => r !== role));
    } else {
      setSelectedRoles(prev => [...prev, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !date || !time || !location || selectedRoles.length === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const room = createRoom({
      title,
      description,
      category: category as Category,
      vibeTags: selectedVibes,
      rolesNeeded: selectedRoles,
      date,
      time,
      location,
      maxParticipants,
      createdBy: currentUser?.id || '',
    });

    toast({
      title: "Room created!",
      description: "Your room is now live and visible to others.",
    });

    navigate(`/room/${room.id}`);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-0">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <Plus className="w-6 h-6 text-primary" />
              Create a Room
            </CardTitle>
            <CardDescription>
              Set up your collaboration space and invite others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Room Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Golden Hour Portrait Session"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map(cat => (
                    <Button
                      key={cat}
                      type="button"
                      size="sm"
                      variant={category === cat ? "default" : "outline"}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Vibe Tags */}
              <div className="space-y-2">
                <Label>Vibe Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {allVibeTags.map(vibe => (
                    <Button
                      key={vibe}
                      type="button"
                      size="sm"
                      variant={selectedVibes.includes(vibe) ? "default" : "outline"}
                      onClick={() => toggleVibe(vibe)}
                    >
                      {vibe}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Roles Needed */}
              <div className="space-y-2">
                <Label>Roles Needed *</Label>
                <div className="flex flex-wrap gap-2">
                  {allRoles.map(role => (
                    <Button
                      key={role}
                      type="button"
                      size="sm"
                      variant={selectedRoles.includes(role) ? "gradient" : "outline"}
                      onClick={() => toggleRole(role)}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time *
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location *
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Central Park, Main Fountain"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              {/* Max Participants */}
              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Max Participants *
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="maxParticipants"
                    type="number"
                    min={2}
                    max={8}
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">(2-8 people)</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your room mission, what you'll do, and what to bring..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" variant="gradient" size="lg" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Create Room
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
