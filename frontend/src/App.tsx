import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { GigProvider } from './context/GigContext';
import { BidProvider } from './context/BidContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';
import MyHiredFreelancers from './pages/MyHiredFreelancers';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <GigProvider>
            <BidProvider>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/create-gig"
                    element={
                      <ProtectedRoute>
                        <CreateGig />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/gigs/:gigId" element={<GigDetails />} />
                  <Route
                    path="/my-hired-freelancers"
                    element={
                      <ProtectedRoute>
                        <MyHiredFreelancers />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </div>
            </BidProvider>
          </GigProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;