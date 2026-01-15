import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/RoleBadge';
import { useApp } from '@/contexts/AppContext';
import { Role } from '@/types';
import { 
  Edit, ExternalLink, LogOut, Calendar, Users, Award, Link as LinkIcon
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, logout, getUserRooms, getUserOutputs } = useApp();

  if (!currentUser) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="font-display text-2xl font-bold mb-4">Please log in</h2>
          <Link to="/auth">
            <Button variant="gradient">Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const userRooms = getUserRooms(currentUser.id);
  const userOutputs = getUserOutputs(currentUser.id);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-20 md:pb-0 space-y-6">
        {/* Profile Header */}
        <Card className="card-elevated overflow-hidden">
          <div className="h-24 gradient-bg-primary" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="text-2xl font-bold">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pb-2">
                <h1 className="font-display font-bold text-2xl">{currentUser.name}</h1>
                <p className="text-muted-foreground">
                  {currentUser.major} · {currentUser.year}
                </p>
              </div>
              <div className="flex gap-2 pb-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-destructive"
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </Button>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-6 space-y-2">
              <h3 className="font-medium text-sm">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map(skill => (
                  <RoleBadge key={skill} role={skill as Role} />
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mt-4 space-y-2">
              <h3 className="font-medium text-sm">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map(interest => (
                  <Badge key={interest} variant="secondary">{interest}</Badge>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            {currentUser.portfolioUrl && (
              <div className="mt-4">
                <a 
                  href={currentUser.portfolioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  {currentUser.portfolioUrl}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-elevated">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <p className="font-display font-bold text-2xl">{userRooms.length}</p>
              <p className="text-sm text-muted-foreground">Rooms Joined</p>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <p className="font-display font-bold text-2xl">{userOutputs.length}</p>
              <p className="text-sm text-muted-foreground">Collabs</p>
            </CardContent>
          </Card>
        </div>

        {/* Joined Rooms */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Joined Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userRooms.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">You haven't joined any rooms yet</p>
                <Link to="/home">
                  <Button variant="gradient">Find Rooms</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userRooms.map(room => (
                  <Link 
                    key={room.id} 
                    to={`/room/${room.id}`}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
                  >
                    <div>
                      <p className="font-medium">{room.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {room.date} · {room.location}
                      </p>
                    </div>
                    <Badge variant="category">{room.category}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Collabs/Outputs */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5" />
              Collabs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userOutputs.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Your collaboration outputs will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userOutputs.map(output => (
                  <div 
                    key={output.id} 
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{output.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Added on {new Date(output.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <a href={output.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
