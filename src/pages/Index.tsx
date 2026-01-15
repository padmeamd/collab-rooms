import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useEffect } from 'react';
import { 
  Users, Zap, Camera, Palette, Code, Film,
  ArrowRight, Sparkles, CheckCircle
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, isOnboarded } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && isOnboarded) {
      navigate('/home');
    }
  }, [isAuthenticated, isOnboarded, navigate]);

  const features = [
    {
      icon: Users,
      title: 'Small Group Rooms',
      description: 'Join 2-8 person teams for focused creative sessions'
    },
    {
      icon: Zap,
      title: 'Pop-Up Rooms',
      description: 'Create instant collaboration spaces in under 60 seconds'
    },
    {
      icon: Film,
      title: 'Mission-Driven',
      description: 'Every room has a purpose: film, photo, code, design, or review'
    },
    {
      icon: Sparkles,
      title: 'Build Your Portfolio',
      description: 'Save outputs from every collaboration you complete'
    },
  ];

  const roomExamples = [
    { title: 'Golden Hour Portraits', category: 'Photography', roles: ['Camera', 'Actor'] },
    { title: 'Self-Tape Session', category: 'Film & Video', roles: ['Actor', 'Director'] },
    { title: 'Hackathon Mini Team', category: 'Tech & Code', roles: ['Developer', 'Designer'] },
    { title: 'Portfolio Review Circle', category: 'Portfolio Review', roles: ['Designer', 'Developer'] },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-glow">
            <span className="text-white font-display font-bold text-xl">U</span>
          </div>
          <span className="font-display font-bold text-2xl">URoom</span>
        </div>
        <Link to="/auth">
          <Button variant="gradient" className="gap-2">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="container py-12 md:py-24 text-center">
        <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2">
          <Sparkles className="w-4 h-4 text-accent" />
          For university students
        </Badge>
        
        <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-tight mb-6">
          Find your <span className="gradient-text">creative crew</span>
          <br />build together
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join small-group Rooms for film shoots, photo walks, hackathons, and portfolio reviews. 
          Meet new people through real creative missions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth">
            <Button variant="gradient" size="xl" className="gap-2 text-lg">
              Start Collaborating
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="outline" size="xl" className="gap-2 text-lg">
            <Film className="w-5 h-5" />
            Watch Demo
          </Button>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex items-center justify-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span>100+ Rooms created</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span>500+ Students</span>
          </div>
        </div>
      </section>

      {/* Room Examples */}
      <section className="container py-12">
        <div className="grid md:grid-cols-4 gap-4">
          {roomExamples.map((room, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <Badge variant="category" className="mb-3">{room.category}</Badge>
              <h3 className="font-display font-semibold text-lg mb-2">{room.title}</h3>
              <div className="flex flex-wrap gap-1">
                {room.roles.map(role => (
                  <Badge key={role} variant="role" className="text-xs">{role}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Built for real collaboration
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Not a dating app. Not random networking. 
            Purpose-driven rooms for creative work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl bg-card border border-border text-center hover:border-primary/50 transition-colors"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl gradient-bg-primary flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16 bg-secondary/30 -mx-4 px-4 md:rounded-3xl md:mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: '1', title: 'Browse Rooms', desc: 'Find a room that matches your interests and schedule' },
            { step: '2', title: 'Join & Collaborate', desc: 'Pick your role and connect with the team' },
            { step: '3', title: 'Save Your Output', desc: 'Add your work to build your portfolio of collabs' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full gradient-bg-accent flex items-center justify-center text-white font-display font-bold text-xl">
                {item.step}
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 text-center">
        <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">
          Ready to find your crew?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
          Join URoom and start building connections through creative collaboration.
        </p>
        <Link to="/auth">
          <Button variant="gradient" size="xl" className="gap-2 text-lg">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="container py-8 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-bg-primary flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">U</span>
            </div>
            <span>URoom © 2026</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
