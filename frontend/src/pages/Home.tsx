import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGig } from '../context/GigContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Notifications from '../components/Notifications';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { gigs, fetchGigs, isLoading } = useGig();
  const { user } = useAuth();
  const { isConnected, notifications, clearNotifications } = useSocket();

  useEffect(() => {
    fetchGigs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGigs(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Gigs</h1>
            <p className="text-gray-500">Find your next project opportunity</p>
          </div>
          
          <div className="flex items-center gap-3">
            {user && (
              <>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {isConnected ? 'Live' : 'Offline'}
                  </span>
                </div>
                <Notifications />
              </>
            )}
          </div>
        </div>

        {notifications.length > 0 && (
          <div className="mb-8 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-900 text-lg">
                    🎉 Congratulations! You've been hired!
                  </p>
                  <p className="text-sm text-green-700 mt-0.5">
                    You were hired for "{notifications[0].gigTitle}" - Check notifications for details
                  </p>
                </div>
              </div>
              <button
                onClick={clearNotifications}
                className="text-green-600 hover:text-green-800 transition-colors p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSearch} className="mb-8 max-w-2xl">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search gigs by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading gigs...</p>
          </div>
        ) : gigs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No gigs found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search or check back later</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{gigs.length}</span> gig{gigs.length !== 1 ? 's' : ''} available
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gigs.map((gig) => {
                const owner = typeof gig.ownerId === 'object' ? gig.ownerId : null;
                const isOwner = user?._id === (typeof gig.ownerId === 'string' ? gig.ownerId : gig.ownerId._id);
                
                return (
                  <div key={gig._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1">
                        {gig.title}
                      </h3>
                      <span className={`shrink-0 ml-2 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        gig.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {gig.status === 'open' ? 'OPEN' : 'CLOSED'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">{gig.description}</p>
                    
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-sm text-gray-600 font-medium">Budget</span>
                        <span className="text-lg font-bold text-green-600">${gig.budget}</span>
                      </div>
                      
                      {owner && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-8 h-8 bg-linear-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {owner.name?.charAt(0).toUpperCase()}
                          </div>
                          <span>Posted by <span className="font-medium text-gray-700">{owner.name}</span></span>
                        </div>
                      )}
                    </div>
                    
                    <Link
                      to={`/gigs/${gig._id}`}
                      className="block w-full text-center bg-gray-800 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      {isOwner ? 'View Bids' : 'View Details'}
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;