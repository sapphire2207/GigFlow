import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

interface HireNotification {
  message: string;
  gigId: string;
  gigTitle: string;
  gigBudget: number;
  clientName: string;
  bidPrice: number;
  timestamp: Date;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: HireNotification[];
  clearNotifications: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<HireNotification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Only connect if user is logged in
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      
      // Register user with their socket
      if (user?._id) {
        newSocket.emit('register', user._id);
        console.log('User registered with socket:', user._id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Listen for hire notifications
    newSocket.on('hired', (data: HireNotification) => {
      console.log('Received hire notification:', data);
      
      // Add to notifications list
      setNotifications(prev => [data, ...prev]);
      
      // Show toast notification with custom styling
      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-bold text-green-700">Congratulations!</div>
          <div className="text-sm">{data.message}</div>
          <div className="text-xs text-gray-600 mt-1">
            Budget: ${data.gigBudget} | Your Bid: ${data.bidPrice}
          </div>
        </div>,
        {
          autoClose: 8000,
          className: 'bg-green-50 border-l-4 border-green-500',
        }
      );
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, notifications, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};