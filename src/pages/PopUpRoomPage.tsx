import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { missionTemplates, allRoles } from '@/data/mockData';
import { MissionTemplate, Role } from '@/types';
import { ArrowLeft, ArrowRight, Zap, MapPin, Clock, Users, Sparkles } from 'lucide-react';
import { format, addHours } from 'date-fns';

type Step = 1 | 2 | 3 | 4;

export default function PopUpRoomPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<MissionTemplate | null>(null);
  const [timeWindow, setTimeWindow] = useState<'now' | '1hr' | '2hr' | 'later'>('1hr');
  const [customTime, setCustomTime] = useState('');
  const [location, setLocation] = useState('');
  const [groupSize, setGroupSize] = useState(4);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  const { createRoom, currentUser } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTemplateSelect = (template: MissionTemplate) => {
    setSelectedTemplate(template);
    setSelectedRoles(template.suggestedRoles);
    setStep(2);
  };

  const toggleRole = (role: Role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(prev => prev.filter(r => r !== role));
    } else {
      setSelectedRoles(prev => [...prev, role]);
    }
  };

  const getTime = () => {
    const now = new Date();
    switch (timeWindow) {
      case 'now':
        return format(now, 'h:mm a');
      case '1hr':
        return format(addHours(now, 1), 'h:mm a');
      case '2hr':
        return format(addHours(now, 2), 'h:mm a');
      case 'later':
        return customTime || format(addHours(now, 3), 'h:mm a');
      default:
        return format(addHours(now, 1), 'h:mm a');
    }
  };

  const handleCreate = () => {
    if (!selectedTemplate || !location || selectedRoles.length === 0) {
      toast({
        title: "Missing info",
        description: "Please complete all steps",
        variant: "destructive",
      });
      return;
    }

    const generatedTitle = `Pop-Up: ${selectedTemplate.title} in ${timeWindow === 'now' ? 'minutes' : timeWindow === '1hr' ? '1 hour' : timeWindow === '2hr' ? '2 hours' : 'a bit'}`;

    const room = createRoom({
      title: generatedTitle,
      description: selectedTemplate.description,
      category: selectedTemplate.category,
      vibeTags: selectedTemplate.suggestedVibes,
      rolesNeeded: selectedRoles,
      date: format(new Date(), 'yyyy-MM-dd'),
      time: getTime(),
      location,
      maxParticipants: groupSize,
      createdBy: currentUser?.id || '',
      isPopUp: true,
    });

    toast({
      title: "Pop-Up Room created! ⚡",
      description: "Your room is live. Others can join now!",
    });

    navigate(`/room/${room.id}`);
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto pb-20 md:pb-0">
        <Button
          variant="ghost"
          onClick={() => step === 1 ? navigate(-1) : setStep((prev) => (prev - 1) as Step)}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? 'Back' : 'Previous'}
        </Button>

        <Card className="card-elevated overflow-hidden">
          {/* Header with gradient */}
          <div className="gradient-bg-accent p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl">Pop-Up Room</h1>
                <p className="text-white/80">Create a room in under 60 seconds</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    s <= step ? 'gradient-bg-accent' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Choose Template */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display font-semibold text-lg mb-1">Pick a mission</h2>
                  <p className="text-sm text-muted-foreground">What do you want to do?</p>
                </div>
                <div className="grid gap-3">
                  {missionTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="p-4 text-left border border-border rounded-xl hover:border-primary hover:bg-secondary/50 transition-all"
                    >
                      <div className="font-medium">{template.title}</div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: When */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display font-semibold text-lg mb-1 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent" />
                    When?
                  </h2>
                  <p className="text-sm text-muted-foreground">Choose a time window</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'now', label: 'Right now', desc: 'In the next few mins' },
                    { value: '1hr', label: 'In 1 hour', desc: format(addHours(new Date(), 1), 'h:mm a') },
                    { value: '2hr', label: 'In 2 hours', desc: format(addHours(new Date(), 2), 'h:mm a') },
                    { value: 'later', label: 'Later today', desc: 'Set custom time' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTimeWindow(opt.value as any)}
                      className={`p-4 text-left border rounded-xl transition-all ${
                        timeWindow === opt.value 
                          ? 'border-accent bg-accent/10' 
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-sm text-muted-foreground">{opt.desc}</div>
                    </button>
                  ))}
                </div>
                {timeWindow === 'later' && (
                  <Input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="mt-2"
                  />
                )}
                <Button 
                  variant="gradient" 
                  className="w-full gap-2" 
                  onClick={() => setStep(3)}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Step 3: Where + Size */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display font-semibold text-lg mb-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    Where & How Many?
                  </h2>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="e.g., Library Steps, Cafe Nova..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Group Size
                  </Label>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5, 6, 8].map(size => (
                      <Button
                        key={size}
                        type="button"
                        variant={groupSize === size ? "gradient" : "outline"}
                        onClick={() => setGroupSize(size)}
                        className="flex-1"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button 
                  variant="gradient" 
                  className="w-full gap-2" 
                  onClick={() => setStep(4)}
                  disabled={!location}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Step 4: Roles + Confirm */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display font-semibold text-lg mb-1 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Roles Needed
                  </h2>
                  <p className="text-sm text-muted-foreground">Who should join?</p>
                </div>
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

                {/* Preview */}
                <div className="p-4 bg-secondary/50 rounded-xl space-y-2">
                  <h4 className="font-semibold text-sm">Preview</h4>
                  <p className="font-medium">
                    Pop-Up: {selectedTemplate?.title} in {timeWindow === 'now' ? 'minutes' : timeWindow === '1hr' ? '1 hour' : '2 hours'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📍 {location} · 🕐 {getTime()} · 👥 {groupSize} people
                  </p>
                </div>

                <Button 
                  variant="accent" 
                  size="lg"
                  className="w-full gap-2" 
                  onClick={handleCreate}
                  disabled={selectedRoles.length === 0}
                >
                  <Zap className="w-4 h-4" />
                  Launch Pop-Up Room
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
