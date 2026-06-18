import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { User, CareerStats, Rivalry } from '../types';

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const [stats, setStats] = useState<CareerStats | null>(null);
  const [rivalries, setRivalries] = useState<Rivalry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { user, stats, rivalries } = await api.getUserProfile(userId!);
      setProfile(user);
      setStats(stats);
      setRivalries(rivalries);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-12">Profile not found</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profile.firstName?.charAt(0) || profile.username.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-600">@{profile.username}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
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
          <div className="text-3xl font-bold text-blue-600">
            {(stats?.winPercentage || 0).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Rivalries */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rivalries</h2>
        {rivalries.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            <p>No rivalries yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rivalries.map((rivalry) => (
              <div key={rivalry.id} className="card flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    vs. {rivalry.rivalFirstName} {rivalry.rivalLastName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {rivalry.roundsPlayed} rounds • {rivalry.myWins}-{rivalry.rivalWins}
                  </div>
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
    </div>
  );
}
