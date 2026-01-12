import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
            GigFlow
          </Link>
          
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Browse Gigs
                </Link>
                <Link to="/create-gig" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Post Gig
                </Link>
                <Link to="/my-hired-freelancers" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  My Hires
                </Link>
                <span className="text-sm text-gray-500">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition-colors font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;