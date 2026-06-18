import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Friend } from '../types';
import { useAuthStore } from '../store';

export default function FriendsPage() {
  const { user } = useAuthStore();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFriends();
      loadPendingRequests();
    }
  }, [user]);

  const loadFriends = async () => {
    try {
      const data = await api.getFriends(user!.id);
      setFriends(data);
    } catch (error) {
      console.error('Failed to load friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const data = await api.getPendingRequests(user!.id);
      setPendingRequests(data);
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await api.searchUsers(searchQuery);
      setSearchResults(results.filter((u: any) => u.id !== user?.id));
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSendRequest = async (friendId: string) => {
    try {
      await api.sendFriendRequest(friendId);
      alert('Friend request sent!');
      setSearchResults([]);
      setSearchQuery('');
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert('Request already sent or already friends');
      } else {
        alert('Failed to send request');
      }
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await api.acceptFriendRequest(requestId);
      loadFriends();
      loadPendingRequests();
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading friends...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Friends</h1>
        <p className="text-gray-600">Manage your golf circle</p>
      </div>

      {/* Search */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for golfers..."
            className="input"
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map((result) => (
              <div key={result.id} className="card flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{result.username}</div>
                  {result.firstName && (
                    <div className="text-sm text-gray-600">
                      {result.firstName} {result.lastName || ''}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleSendRequest(result.id)}
                  className="btn-primary text-sm"
                >
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Friend Requests</h2>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.id} className="card flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{request.username}</div>
                  {request.firstName && (
                    <div className="text-sm text-gray-600">
                      {request.firstName} {request.lastName || ''}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="btn-primary text-sm"
                  >
                    Accept
                  </button>
                  <button className="btn-secondary text-sm">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Friends ({friends.length})
        </h2>
        {friends.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            <p>No friends yet. Search and add some golfers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {friends.map((friend) => (
              <div key={friend.id} className="card flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{friend.username}</div>
                  {friend.firstName && (
                    <div className="text-sm text-gray-600">
                      {friend.firstName} {friend.lastName || ''}
                    </div>
                  )}
                </div>
                <a
                  href={`/profile/${friend.id}`}
                  className="btn-ghost text-sm"
                >
                  View Profile
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
