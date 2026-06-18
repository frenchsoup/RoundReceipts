import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Round } from '../types';
import { useAuthStore } from '../store';

export default function RoundsPage() {
  const { user } = useAuthStore();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRounds();
  }, []);

  const loadRounds = async () => {
    try {
      const data = await api.getUserRounds();
      setRounds(data);
    } catch (error) {
      console.error('Failed to load rounds:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading rounds...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Rounds</h1>
          <p className="text-gray-600">View your round history</p>
        </div>
        <a href="/rounds/new" className="btn-primary">
          + New Round
        </a>
      </div>

      {rounds.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">⛳</div>
          <p className="text-gray-600 mb-4">No rounds yet</p>
          <a href="/rounds/new" className="btn-primary inline-block">
            Start Your First Round
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rounds.map((round) => (
            <a
              key={round.id}
              href={`/rounds/${round.id}`}
              className="card hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {round.courseName}
                  </h3>
                  <p className="text-sm text-gray-600">{round.teeBoxName}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    round.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {round.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{round.holesPlayed} holes</span>
                <span>
                  {new Date(round.createdAt).toLocaleDateString()}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
