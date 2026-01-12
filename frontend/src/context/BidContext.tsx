import { createContext, useContext, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../lib/axiosInstance';
import type { Bid, BidContextType } from '../types';

const BidContext = createContext<BidContextType | undefined>(undefined);

export const BidProvider = ({ children }: { children: ReactNode }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [hiredFreelancers, setHiredFreelancers] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBidsForGig = async (gigId: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/bids/${gigId}`);
      setBids(response.data.data);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch bids';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createBid = async (gigId: string, message: string, price: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/bids', {
        gigId,
        message,
        price,
      });
      
      toast.success(response.data.message || 'Bid submitted successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to submit bid';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hireBid = async (bidId: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(`/bids/${bidId}/hire`);
      
      toast.success(response.data.message || 'Freelancer hired successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to hire freelancer';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHiredFreelancers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/bids/hired/me');
      setHiredFreelancers(response.data.data);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch hired freelancers';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BidContext.Provider value={{ 
      bids, 
      hiredFreelancers,
      fetchBidsForGig, 
      createBid, 
      hireBid, 
      fetchHiredFreelancers,
      isLoading 
    }}>
      {children}
    </BidContext.Provider>
  );
};

export const useBid = () => {
  const context = useContext(BidContext);
  if (context === undefined) {
    throw new Error('useBid must be used within a BidProvider');
  }
  return context;
};