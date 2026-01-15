import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Home, Plus, Zap, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentUser, logout, isAuthenticated } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/home', label: 'Rooms', icon: Home },
    { path: '/create', label: 'Create', icon: Plus },
    { path: '/popup', label: 'Pop-Up', icon: Zap },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">U</span>
            </div>
            <span className="font-display font-bold text-xl">URoom</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={isActive(path) ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && currentUser && (
              <>
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{currentUser.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background animate-slide-up">
            <nav className="container py-4 flex flex-col gap-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link 
                  key={path} 
                  to={path} 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(path) ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Button>
                </Link>
              ))}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  Log out
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container py-6 md:py-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} className="flex-1">
              <Button
                variant="ghost"
                className={`w-full flex-col gap-1 h-auto py-2 ${
                  isActive(path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
