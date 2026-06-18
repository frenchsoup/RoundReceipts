import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store';
import { CareerStats, Rivalry } from '../types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<CareerStats | null>(null);
  const [rivalries, setRivalries] = useState<Rivalry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { stats, rivalries } = await api.getUserProfile(user!.id);
      setStats(stats);
      setRivalries(rivalries);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || user?.username}!</h1>
          <p className="text-blue-100">Check your rivalries and start a new round</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-gray-600 text-sm font-medium mb-1">Rounds Played</div>
          <div className="text-3xl font-bold text-gray-900">{stats?.roundsPlayed || 0}</div>
        </div>
        <div className="card">
          <div className="text-gray-600 text-sm font-medium mb-1">Wins</div>
          <div className="text-3xl font-bold text-green-600">{stats?.wins || 0}</div>
        </div>
        <div className="card">
          <div className="text-gray-600 text-sm font-medium mb-1">Losses</div>
          <div className="text-3xl font-bold text-red-600">{stats?.losses || 0}</div>
        </div>
        <div className="card">
          <div className="text-gray-600 text-sm font-medium mb-1">Win Rate</div>
          <div className="text-3xl font-bold text-blue-600">{(stats?.winPercentage || 0).toFixed(1)}%</div>
        </div>
      </div>

      {/* Rivalries */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Rivalries</h2>
        {rivalries.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            <p>No rivalries yet. Add some friends and play a round!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rivalries.slice(0, 5).map((rivalry) => (
              <div key={rivalry.id} className="card flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">vs. {rivalry.rivalFirstName} {rivalry.rivalLastName}</div>
                  <div className="text-sm text-gray-600">{rivalry.roundsPlayed} rounds • {rivalry.myWins}-{rivalry.rivalWins}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    <span className="text-green-600">{rivalry.myWins}</span>
                    {' - '}
                    <span className="text-gray-600">{rivalry.ties}</span>
                    {' - '}
                    <span className="text-red-600">{rivalry.rivalWins}</span>
                  </div>
                  <div className="text-xs text-gray-500">W - T - L</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <a
          href="/rounds/new"
          className="card text-center py-8 hover:shadow-md cursor-pointer"
        >
          <div className="text-4xl mb-3">⛳</div>
          <div className="font-semibold text-gray-900">Start a Round</div>
          <div className="text-sm text-gray-600">Create a new round</div>
        </a>
        <a
          href="/friends"
          className="card text-center py-8 hover:shadow-md cursor-pointer"
        >
          <div className="text-4xl mb-3">👥</div>
          <div className="font-semibold text-gray-900">Add Friends</div>
          <div className="text-sm text-gray-600">Expand your rivalries</div>
        </a>
      </div>
    </div>
  );
}
