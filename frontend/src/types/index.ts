export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  ownerId: User | string;
  status: 'open' | 'assigned';
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  _id: string;
  gigId: string | Gig;
  freelancerId: User | string;
  message: string;
  price: number;
  status: 'pending' | 'hired' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface HireNotification {
  message: string;
  gigId: string;
  gigTitle: string;
  gigBudget: number;
  clientName: string;
  bidPrice: number;
  timestamp: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface GigContextType {
  gigs: Gig[];
  fetchGigs: (search?: string) => Promise<void>;
  createGig: (title: string, description: string, budget: number) => Promise<void>;
  isLoading: boolean;
}

export interface BidContextType {
  bids: Bid[];
  hiredFreelancers: Bid[];
  fetchBidsForGig: (gigId: string) => Promise<void>;
  createBid: (gigId: string, message: string, price: number) => Promise<void>;
  hireBid: (bidId: string) => Promise<void>;
  fetchHiredFreelancers: () => Promise<void>;
  isLoading: boolean;
}