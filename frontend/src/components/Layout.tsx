import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Round Receipts</span>
          </Link>

          {user && (
            <nav className="flex items-center gap-8">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/rounds"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Rounds
              </Link>
              <Link
                to="/friends"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Friends
              </Link>
              <Link
                to={`/profile/${user.id}`}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
