import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { allInterests, allRoles, allMajors, allYears } from '@/data/mockData';
import { Role } from '@/types';
import { ArrowRight, ArrowLeft, User, GraduationCap, Palette, Link as LinkIcon, Sparkles } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Role[]>([]);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  
  const { currentUser, setCurrentUser, setIsOnboarded } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const toggleSkill = (skill: Role) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else if (selectedSkills.length < 4) {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleNext = () => {
    if (step === 1 && (!name || !major || !year)) {
      toast({
        title: "Missing info",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && selectedInterests.length === 0) {
      toast({
        title: "Select interests",
        description: "Pick at least one interest",
        variant: "destructive",
      });
      return;
    }
    if (step === 3 && selectedSkills.length === 0) {
      toast({
        title: "Select skills",
        description: "Pick at least one skill",
        variant: "destructive",
      });
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4) as Step);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleComplete = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name,
        major,
        year,
        interests: selectedInterests,
        skills: selectedSkills,
        portfolioUrl: portfolioUrl || undefined,
      };
      setCurrentUser(updatedUser);
      setIsOnboarded(true);
      toast({
        title: "Profile complete!",
        description: "Welcome to URoom. Let's find your first Room!",
      });
      navigate('/home');
    }
  };

  const stepIndicators = [
    { num: 1, label: 'Basics', icon: User },
    { num: 2, label: 'Interests', icon: Sparkles },
    { num: 3, label: 'Skills', icon: Palette },
    { num: 4, label: 'Portfolio', icon: LinkIcon },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-xl space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2">
          {stepIndicators.map(({ num, label, icon: Icon }) => (
            <div key={num} className="flex items-center">
              <div className={`
                flex items-center gap-2 px-3 py-2 rounded-full transition-all
                ${step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
              `}>
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">{label}</span>
              </div>
              {num < 4 && (
                <div className={`w-6 h-0.5 mx-1 ${step > num ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="card-elevated">
          {/* Step 1: Basics */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Let's get started</CardTitle>
                <CardDescription>Tell us a bit about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="What should we call you?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">Major / Field of Study</Label>
                  <div className="flex flex-wrap gap-2">
                    {allMajors.slice(0, 8).map(m => (
                      <Button
                        key={m}
                        type="button"
                        size="sm"
                        variant={major === m ? "default" : "outline"}
                        onClick={() => setMajor(m)}
                      >
                        {m}
                      </Button>
                    ))}
                  </div>
                  <Input
                    id="major"
                    placeholder="Or type your major..."
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <div className="flex flex-wrap gap-2">
                    {allYears.map(y => (
                      <Button
                        key={y}
                        type="button"
                        size="sm"
                        variant={year === y ? "default" : "outline"}
                        onClick={() => setYear(y)}
                      >
                        {y}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="font-display text-2xl">What interests you?</CardTitle>
                <CardDescription>Pick up to 5 interests (selected: {selectedInterests.length}/5)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map(interest => (
                    <Button
                      key={interest}
                      type="button"
                      size="sm"
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      onClick={() => toggleInterest(interest)}
                      disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 5}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="font-display text-2xl">What can you do?</CardTitle>
                <CardDescription>Select your roles in collaboration (up to 4)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {allRoles.map(role => (
                    <Button
                      key={role}
                      type="button"
                      size="lg"
                      variant={selectedSkills.includes(role) ? "gradient" : "outline"}
                      onClick={() => toggleSkill(role)}
                      disabled={!selectedSkills.includes(role) && selectedSkills.length >= 4}
                      className="gap-2"
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Portfolio */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Almost done!</CardTitle>
                <CardDescription>Add your portfolio link (optional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="portfolio"
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Behance, GitHub, personal site, YouTube channel... anything!
                  </p>
                </div>

                {/* Preview */}
                <div className="p-4 bg-secondary/50 rounded-xl space-y-3">
                  <h4 className="font-semibold">Your Profile Preview</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-bg-primary flex items-center justify-center text-white font-bold text-lg">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{name || 'Your Name'}</p>
                      <p className="text-sm text-muted-foreground">
                        {major || 'Your Major'} · {year || 'Year'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedSkills.map(skill => (
                      <Badge key={skill} variant="role" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="px-6 pb-6 flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button variant="gradient" onClick={handleNext} className="flex-1 gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="gradient" onClick={handleComplete} className="flex-1 gap-2">
                Complete Setup
                <Sparkles className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
