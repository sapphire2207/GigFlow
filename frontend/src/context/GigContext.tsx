import { createContext, useContext, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../lib/axiosInstance';
import type { Gig, GigContextType } from '../types';

const GigContext = createContext<GigContextType | undefined>(undefined);

export const GigProvider = ({ children }: { children: ReactNode }) => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGigs = async (search?: string) => {
    try {
      setIsLoading(true);
      const url = search ? `/gigs?search=${search}` : '/gigs';
      const response = await axiosInstance.get(url);
      setGigs(response.data.data);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch gigs';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createGig = async (title: string, description: string, budget: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/gigs', {
        title,
        description,
        budget,
      });
      
      toast.success(response.data.message || 'Gig created successfully!');
      await fetchGigs();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create gig';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GigContext.Provider value={{ gigs, fetchGigs, createGig, isLoading }}>
      {children}
    </GigContext.Provider>
  );
};

export const useGig = () => {
  const context = useContext(GigContext);
  if (context === undefined) {
    throw new Error('useGig must be used within a GigProvider');
  }
  return context;
};