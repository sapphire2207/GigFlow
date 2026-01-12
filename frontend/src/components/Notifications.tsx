import { useState } from 'react';
import { useSocket } from '../context/SocketContext';

const Notifications = () => {
  const { notifications, clearNotifications } = useSocket();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">You'll see updates here when you get hired</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notif, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-10 h-10 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 mb-1">
                            Hired for "{notif.gigTitle}"
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            Congratulations! {notif.clientName} hired you for this project.
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                              Budget: ${notif.gigBudget}
                            </span>
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded font-medium">
                              Your Bid: ${notif.bidPrice}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notif.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;