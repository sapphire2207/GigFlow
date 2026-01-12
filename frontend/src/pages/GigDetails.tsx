import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGig } from '../context/GigContext';
import { useBid } from '../context/BidContext';
import { useAuth } from '../context/AuthContext';
import type { Gig } from '../types';

const GigDetails = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const { gigs, fetchGigs } = useGig();
  const { bids, fetchBidsForGig, createBid, hireBid, isLoading } = useBid();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentGig, setCurrentGig] = useState<Gig | null>(null);
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [confirmHire, setConfirmHire] = useState<string | null>(null);

  useEffect(() => {
    if (gigId) {
      fetchGigs();
    }
  }, [gigId]);

  useEffect(() => {
    const gig = gigs.find(g => g._id === gigId);
    if (gig) {
      setCurrentGig(gig);
      const ownerId = typeof gig.ownerId === 'string' ? gig.ownerId : gig.ownerId._id;
      if (user && user._id === ownerId) {
        fetchBidsForGig(gigId!);
      }
    }
  }, [gigs, gigId, user]);

  if (!currentGig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading gig details...</p>
        </div>
      </div>
    );
  }

  const owner = typeof currentGig.ownerId === 'object' ? currentGig.ownerId : null;
  const ownerId = typeof currentGig.ownerId === 'string' ? currentGig.ownerId : currentGig.ownerId._id;
  const isOwner = user?._id === ownerId;

  const handleBidSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createBid(gigId!, message, Number(price));
      setMessage('');
      setPrice('');
      setShowBidForm(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to submit bid:', error);
    }
  };

  const handleHire = async (bidId: string) => {
    try {
      await hireBid(bidId);
      await fetchGigs();
      await fetchBidsForGig(gigId!);
      setConfirmHire(null);
    } catch (error) {
      console.error('Failed to hire:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-2"
        >
          ← Back to Gigs
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentGig.title}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{currentGig.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold">
              Budget: ${currentGig.budget}
            </div>
            <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">
              Status: <span className="font-medium capitalize">{currentGig.status}</span>
            </div>
            {owner && (
              <div className="text-gray-500">
                Posted by <span className="font-medium text-gray-700">{owner.name}</span>
              </div>
            )}
          </div>
        </div>

        {!isOwner && currentGig.status === 'open' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {!showBidForm ? (
              <button
                onClick={() => setShowBidForm(true)}
                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Place a Bid
              </button>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Submit Your Bid</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Explain why you're the best fit..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow resize-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter your bid amount"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Bid'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBidForm(false)}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {isOwner && bids.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Bids Received</h2>
            <div className="space-y-4">
              {bids.map((bid) => {
                const freelancer = typeof bid.freelancerId === 'object' ? bid.freelancerId : null;
                
                return (
                  <div key={bid._id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        {freelancer && (
                          <p className="font-semibold text-gray-900">{freelancer.name}</p>
                        )}
                        <p className="text-sm text-gray-500">{freelancer?.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">${bid.price}</p>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1 ${
                          bid.status === 'hired' ? 'bg-green-100 text-green-700' :
                          bid.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {bid.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{bid.message}</p>
                    {bid.status === 'pending' && currentGig.status === 'open' && (
                      <>
                        {confirmHire === bid._id ? (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-gray-700 mb-3">Are you sure you want to hire this freelancer?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleHire(bid._id)}
                                disabled={isLoading}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                              >
                                {isLoading ? 'Hiring...' : 'Yes, Hire'}
                              </button>
                              <button
                                onClick={() => setConfirmHire(null)}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmHire(bid._id)}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            Hire This Freelancer
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isOwner && bids.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-400 font-medium">No bids received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigDetails;