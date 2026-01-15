import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Room, RoomMember, Message, RoomOutput } from '@/types';
import { mockUsers, mockRooms, mockRoomMembers, mockMessages, mockOutputs } from '@/data/mockData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  roomMembers: RoomMember[];
  setRoomMembers: React.Dispatch<React.SetStateAction<RoomMember[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  outputs: RoomOutput[];
  setOutputs: React.Dispatch<React.SetStateAction<RoomOutput[]>>;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  joinRoom: (roomId: string, role?: string) => void;
  leaveRoom: (roomId: string) => void;
  createRoom: (room: Omit<Room, 'id' | 'createdAt'>) => Room;
  sendMessage: (roomId: string, text: string) => void;
  addOutput: (output: Omit<RoomOutput, 'id' | 'createdAt' | 'user'>) => void;
  getRoomMembers: (roomId: string) => RoomMember[];
  getRoomMessages: (roomId: string) => Message[];
  getRoomOutputs: (roomId: string) => RoomOutput[];
  getUserRooms: (userId: string) => Room[];
  getUserOutputs: (userId: string) => RoomOutput[];
  isUserInRoom: (roomId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>(mockRoomMembers);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [outputs, setOutputs] = useState<RoomOutput[]>(mockOutputs);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('uroom_user');
    const savedOnboarded = localStorage.getItem('uroom_onboarded');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedOnboarded) {
      setIsOnboarded(JSON.parse(savedOnboarded));
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('uroom_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('uroom_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('uroom_onboarded', JSON.stringify(isOnboarded));
  }, [isOnboarded]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - accept any email/password for demo
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      setCurrentUser(existingUser);
      return true;
    }
    // Create new user for demo
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      major: '',
      year: '',
      interests: [],
      skills: [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsOnboarded(false);
    return true;
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false; // User already exists
    }
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      major: '',
      year: '',
      interests: [],
      skills: [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsOnboarded(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsOnboarded(false);
    localStorage.removeItem('uroom_user');
    localStorage.removeItem('uroom_onboarded');
  };

  const joinRoom = (roomId: string, role?: string) => {
    if (!currentUser) return;
    const existingMember = roomMembers.find(
      m => m.roomId === roomId && m.userId === currentUser.id
    );
    if (existingMember) return;

    const newMember: RoomMember = {
      id: Date.now().toString(),
      roomId,
      userId: currentUser.id,
      user: currentUser,
      roleChosen: role as any,
      joinedAt: new Date().toISOString(),
    };
    setRoomMembers(prev => [...prev, newMember]);
  };

  const leaveRoom = (roomId: string) => {
    if (!currentUser) return;
    setRoomMembers(prev => 
      prev.filter(m => !(m.roomId === roomId && m.userId === currentUser.id))
    );
  };

  const createRoom = (room: Omit<Room, 'id' | 'createdAt'>): Room => {
    const newRoom: Room = {
      ...room,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setRooms(prev => [newRoom, ...prev]);
    
    // Auto-join creator
    if (currentUser) {
      const newMember: RoomMember = {
        id: Date.now().toString(),
        roomId: newRoom.id,
        userId: currentUser.id,
        user: currentUser,
        joinedAt: new Date().toISOString(),
      };
      setRoomMembers(prev => [...prev, newMember]);
    }
    
    return newRoom;
  };

  const sendMessage = (roomId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      roomId,
      userId: currentUser.id,
      user: currentUser,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addOutput = (output: Omit<RoomOutput, 'id' | 'createdAt' | 'user'>) => {
    if (!currentUser) return;
    const newOutput: RoomOutput = {
      ...output,
      id: Date.now().toString(),
      user: currentUser,
      createdAt: new Date().toISOString(),
    };
    setOutputs(prev => [...prev, newOutput]);
  };

  const getRoomMembers = (roomId: string) => 
    roomMembers.filter(m => m.roomId === roomId);

  const getRoomMessages = (roomId: string) => 
    messages.filter(m => m.roomId === roomId);

  const getRoomOutputs = (roomId: string) => 
    outputs.filter(o => o.roomId === roomId);

  const getUserRooms = (userId: string) => {
    const userRoomIds = roomMembers
      .filter(m => m.userId === userId)
      .map(m => m.roomId);
    return rooms.filter(r => userRoomIds.includes(r.id));
  };

  const getUserOutputs = (userId: string) =>
    outputs.filter(o => o.userId === userId);

  const isUserInRoom = (roomId: string) => {
    if (!currentUser) return false;
    return roomMembers.some(
      m => m.roomId === roomId && m.userId === currentUser.id
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated: !!currentUser,
        isOnboarded,
        setIsOnboarded,
        rooms,
        setRooms,
        roomMembers,
        setRoomMembers,
        messages,
        setMessages,
        outputs,
        setOutputs,
        users,
        login,
        signup,
        logout,
        joinRoom,
        leaveRoom,
        createRoom,
        sendMessage,
        addOutput,
        getRoomMembers,
        getRoomMessages,
        getRoomOutputs,
        getUserRooms,
        getUserOutputs,
        isUserInRoom,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
