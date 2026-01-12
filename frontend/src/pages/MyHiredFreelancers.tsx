import { useEffect } from 'react';
import { useBid } from '../context/BidContext';

const MyHiredFreelancers = () => {
  const { hiredFreelancers, fetchHiredFreelancers, isLoading } = useBid();

  useEffect(() => {
    fetchHiredFreelancers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Hired Freelancers</h1>
          <p className="text-gray-500">Manage your hired team members</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading hired freelancers...</p>
          </div>
        ) : hiredFreelancers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hired freelancers yet</h3>
              <p className="text-gray-500 text-sm">Start hiring talented freelancers for your projects</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{hiredFreelancers.length}</span> freelancer{hiredFreelancers.length !== 1 ? 's' : ''} hired
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hiredFreelancers.map((bid) => {
                const freelancer = typeof bid.freelancerId === 'object' ? bid.freelancerId : null;
                const gig = typeof bid.gigId === 'object' ? bid.gigId : null;

                return (
                  <div key={bid._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-linear-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {freelancer?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {freelancer?.name || 'Unknown'}
                            </h3>
                            <p className="text-sm text-gray-500">{freelancer?.email}</p>
                          </div>
                        </div>
                      </div>

                      {gig && (
                        <div className="space-y-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Project</p>
                            <p className="text-sm font-semibold text-gray-900">{gig.title}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Budget</p>
                              <p className="text-lg font-bold text-blue-700">${gig.budget}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                              <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Hired at</p>
                              <p className="text-lg font-bold text-green-700">${bid.price}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="border-t border-gray-100 pt-4 mb-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Proposal</p>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{bid.message}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          HIRED
                        </span>
                        {gig?.budget && bid.price && (
                          <span className="text-xs text-gray-500">
                            {Math.round(((gig.budget - bid.price) / gig.budget) * 100)}% saved
                          </span>
                        )}
                      </div>
                    </div>
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

export default MyHiredFreelancers;