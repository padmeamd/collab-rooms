export type VibeTag = 'Chill' | 'Serious' | 'Beginner-friendly' | 'Portfolio-focused';

export type Role = 'Actor' | 'Camera' | 'Editor' | 'Designer' | 'Developer' | 'Writer' | 'Director' | 'Producer';

export type Category = 
  | 'Film & Video' 
  | 'Photography' 
  | 'Design' 
  | 'Tech & Code' 
  | 'Writing' 
  | 'Music & Audio' 
  | 'Portfolio Review' 
  | 'Hackathon';

export interface User {
  id: string;
  name: string;
  email: string;
  major: string;
  year: string;
  interests: string[];
  skills: string[];
  portfolioUrl?: string;
  avatar?: string;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  category: Category;
  vibeTags: VibeTag[];
  rolesNeeded: Role[];
  time: string;
  date: string;
  location: string;
  maxParticipants: number;
  createdBy: string;
  createdAt: string;
  isPopUp?: boolean;
}

export interface RoomMember {
  id: string;
  roomId: string;
  userId: string;
  user: User;
  roleChosen?: Role;
  joinedAt: string;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface RoomOutput {
  id: string;
  roomId: string;
  userId: string;
  user: User;
  title: string;
  link: string;
  imageUrl?: string;
  createdAt: string;
}

export interface MissionTemplate {
  id: string;
  title: string;
  category: Category;
  description: string;
  suggestedRoles: Role[];
  suggestedVibes: VibeTag[];
}
