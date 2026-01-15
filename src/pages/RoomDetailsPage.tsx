import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { VibeTag } from '@/components/VibeTag';
import { RoleBadge } from '@/components/RoleBadge';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { allRoles } from '@/data/mockData';
import { Role } from '@/types';
import { 
  ArrowLeft, Calendar, MapPin, Users, Zap, Send, 
  LogOut, Link as LinkIcon, Upload, ExternalLink,
  MessageCircle, Award
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function RoomDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    rooms, currentUser, isAuthenticated,
    getRoomMembers, getRoomMessages, getRoomOutputs,
    isUserInRoom, joinRoom, leaveRoom, sendMessage, addOutput
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showOutputForm, setShowOutputForm] = useState(false);
  const [outputTitle, setOutputTitle] = useState('');
  const [outputLink, setOutputLink] = useState('');

  const room = rooms.find(r => r.id === id);
  const members = getRoomMembers(id || '');
  const messages = getRoomMessages(id || '');
  const outputs = getRoomOutputs(id || '');
  const isMember = isUserInRoom(id || '');
  const isFull = room ? members.length >= room.maxParticipants : false;

  if (!room) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="font-display text-2xl font-bold mb-4">Room not found</h2>
          <Link to="/home">
            <Button>Back to Rooms</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleJoin = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (selectedRole) {
      joinRoom(room.id, selectedRole);
      toast({
        title: "Joined!",
        description: `You've joined as ${selectedRole}`,
      });
    }
  };

  const handleLeave = () => {
    leaveRoom(room.id);
    toast({
      title: "Left room",
      description: "You've left this room",
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(room.id, messageText);
      setMessageText('');
    }
  };

  const handleAddOutput = (e: React.FormEvent) => {
    e.preventDefault();
    if (outputTitle && outputLink) {
      addOutput({
        roomId: room.id,
        userId: currentUser?.id || '',
        title: outputTitle,
        link: outputLink,
      });
      setOutputTitle('');
      setOutputLink('');
      setShowOutputForm(false);
      toast({
        title: "Output added!",
        description: "Your work has been saved to this room",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-0 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Room Header */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge variant="category">{room.category}</Badge>
            {room.isPopUp && (
              <Badge variant="accent" className="gap-1">
                <Zap className="w-3 h-3" />
                Pop-Up
              </Badge>
            )}
          </div>
          
          <h1 className="font-display font-bold text-3xl md:text-4xl">
            {room.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {room.vibeTags.map(vibe => (
              <VibeTag key={vibe} vibe={vibe} />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(parseISO(room.date), 'EEEE, MMMM d')} at {room.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{room.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className={isFull ? 'text-destructive' : ''}>
                {members.length}/{room.maxParticipants} {isFull && '(Full)'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {room.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Roles Needed */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Roles Needed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {room.rolesNeeded.map(role => (
                    <RoleBadge key={role} role={role} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quest Card - Intro Prompt */}
            {isMember && (
              <Card className="border-2 border-accent bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-accent">
                    <MessageCircle className="w-5 h-5" />
                    Quest Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Introduce yourself to the group! Share:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Your major and year</li>
                    <li>What you want to do in this Room</li>
                    <li>Optional: your portfolio link</li>
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Room Chat */}
            {isMember && (
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Room Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Messages */}
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {messages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No messages yet. Start the conversation!
                      </p>
                    ) : (
                      messages.map(msg => (
                        <div key={msg.id} className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={msg.user.avatar} />
                            <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{msg.user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(parseISO(msg.createdAt), 'h:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{msg.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" variant="gradient">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Outputs */}
            <Card className="card-elevated">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Room Outputs
                </CardTitle>
                {isMember && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowOutputForm(!showOutputForm)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Add Output
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {showOutputForm && (
                  <form onSubmit={handleAddOutput} className="mb-4 p-4 bg-secondary/50 rounded-lg space-y-3">
                    <div className="space-y-2">
                      <Label>Output Title</Label>
                      <Input
                        placeholder="e.g., Our Short Film"
                        value={outputTitle}
                        onChange={(e) => setOutputTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link</Label>
                      <Input
                        placeholder="https://..."
                        value={outputLink}
                        onChange={(e) => setOutputLink(e.target.value)}
                      />
                    </div>
                    <Button type="submit" size="sm" variant="gradient">
                      Save Output
                    </Button>
                  </form>
                )}

                {outputs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No outputs yet. Complete your mission and add your work!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {outputs.map(output => (
                      <div key={output.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{output.title}</p>
                            <p className="text-xs text-muted-foreground">by {output.user.name}</p>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join/Leave Card */}
            <Card className="card-elevated sticky top-24">
              <CardContent className="pt-6">
                {isMember ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge variant="success" className="mb-2">You're in!</Badge>
                      <p className="text-sm text-muted-foreground">
                        You've joined this room
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 text-destructive hover:text-destructive"
                      onClick={handleLeave}
                    >
                      <LogOut className="w-4 h-4" />
                      Leave Room
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Choose your role</Label>
                      <div className="flex flex-wrap gap-2">
                        {room.rolesNeeded.map(role => (
                          <Button
                            key={role}
                            size="sm"
                            variant={selectedRole === role ? "gradient" : "outline"}
                            onClick={() => setSelectedRole(role)}
                          >
                            {role}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="gradient" 
                      size="lg"
                      className="w-full"
                      disabled={!selectedRole || isFull}
                      onClick={handleJoin}
                    >
                      {isFull ? 'Room Full' : 'Join Room'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participants */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Participants ({members.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.user.avatar} />
                        <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{member.user.name}</p>
                        {member.roleChosen && (
                          <Badge variant="role" className="text-xs mt-0.5">
                            {member.roleChosen}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {members.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Be the first to join!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
