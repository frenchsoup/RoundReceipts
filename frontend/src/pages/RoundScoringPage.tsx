import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Round, Score } from '../types';

export default function RoundScoringPage() {
  const { roundId } = useParams<{ roundId: string }>();
  const [round, setRound] = useState<Round | null>(null);
  const [scores, setScores] = useState<{ [userId: string]: { [holeId: string]: number } }>({});
  const [selectedHole, setSelectedHole] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [wheelOpen, setWheelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roundId) {
      loadRound();
    }
  }, [roundId]);

  const loadRound = async () => {
    try {
      const data = await api.getRound(roundId!);
      setRound(data);
      if (data.participants.length > 0) {
        setSelectedPlayer(data.participants[0].userId);
      }
      if (data.holes.length > 0) {
        setSelectedHole(0);
      }
    } catch (error) {
      console.error('Failed to load round:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreSubmit = async (score: number) => {
    if (!round || !selectedPlayer || selectedHole === undefined) return;

    const hole = round.holes[selectedHole];
    try {
      await api.submitScore(roundId!, hole.id, score);
      setScores((prev) => ({
        ...prev,
        [selectedPlayer]: {
          ...(prev[selectedPlayer] || {}),
          [hole.id]: score,
        },
      }));
      setWheelOpen(false);
      // Move to next hole
      if (selectedHole < round.holes.length - 1) {
        setSelectedHole(selectedHole + 1);
      }
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  const handleCompleteRound = async () => {
    if (!roundId) return;
    try {
      await api.completeRound(roundId);
      alert('Round completed!');
      window.location.href = '/rounds';
    } catch (error) {
      console.error('Failed to complete round:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading round...</div>;
  }

  if (!round) {
    return <div className="text-center py-12">Round not found</div>;
  }

  const currentHole = round.holes[selectedHole];
  const currentScore = scores[selectedPlayer]?.[currentHole.id];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900">{round.courseName}</h1>
        <p className="text-gray-600">{round.teeBoxName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scorecard */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Scorecard</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-2 text-left">Hole</th>
                    {round.participants.map((p) => (
                      <th key={p.userId} className="px-2 py-2">
                        {p.userId.slice(0, 3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {round.holes.map((hole) => (
                    <tr key={hole.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-2 py-2 text-left font-medium">
                        {hole.holeNumber} (P{hole.par})
                      </td>
                      {round.participants.map((p) => (
                        <td key={p.userId} className="px-2 py-2">
                          {scores[p.userId]?.[hole.id] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Score Wheel */}
        <div className="card h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter Scores</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Player
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="input"
              >
                {round.participants.map((p) => (
                  <option key={p.userId} value={p.userId}>
                    {p.userId}
                  </option>
                ))}
              </select>
            </div>

            {currentHole && (
              <>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Hole {currentHole.holeNumber}</div>
                  <div className="text-2xl font-bold text-gray-900">Par {currentHole.par}</div>
                  {currentHole.yardage && (
                    <div className="text-sm text-gray-600">{currentHole.yardage} yards</div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full aspect-square flex items-center justify-center text-center">
                  <div>
                    {currentScore ? (
                      <div className="text-white">
                        <div className="text-sm opacity-90">Current Score</div>
                        <div className="text-6xl font-bold">{currentScore}</div>
                      </div>
                    ) : (
                      <div className="text-white opacity-75">Tap to score</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleScoreSubmit(score)}
                      className={`py-3 rounded-lg font-semibold transition-all ${
                        currentScore === score
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedHole(Math.max(0, selectedHole - 1))}
                  className="btn-secondary w-full"
                >
                  Previous Hole
                </button>

                {selectedHole === round.holes.length - 1 && (
                  <button
                    onClick={handleCompleteRound}
                    className="btn-primary w-full"
                  >
                    Complete Round
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
