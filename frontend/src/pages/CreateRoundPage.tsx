import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Course } from '../types';

export default function CreateRoundPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTeeBox, setSelectedTeeBox] = useState<string | null>(null);
  const [holesPlayed, setHolesPlayed] = useState(18);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRound = async () => {
    if (!selectedCourse || !selectedTeeBox) {
      alert('Please select a course and tee box');
      return;
    }

    setCreating(true);
    try {
      const round = await api.createRound(selectedCourse.id, selectedTeeBox, holesPlayed);
      window.location.href = `/rounds/${round.id}`;
    } catch (error) {
      console.error('Failed to create round:', error);
      alert('Failed to create round');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading courses...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Start a New Round</h1>
        <p className="text-gray-600">Select your course and get ready to play</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Course</h2>
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setSelectedTeeBox(null);
                  }}
                  className={`w-full card text-left ${
                    selectedCourse?.id === course.id
                      ? 'border-2 border-blue-600 bg-blue-50'
                      : 'hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{course.name}</div>
                  {course.location && (
                    <div className="text-sm text-gray-600">{course.location}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tee Box Selection */}
          {selectedCourse && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Tee Box</h2>
              <div className="space-y-2">
                {selectedCourse.teeBoxes?.map((teeBox) => (
                  <button
                    key={teeBox.id}
                    onClick={() => setSelectedTeeBox(teeBox.id)}
                    className={`w-full card text-left flex items-center gap-3 ${
                      selectedTeeBox === teeBox.id
                        ? 'border-2 border-blue-600 bg-blue-50'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    {teeBox.color && (
                      <div
                        className={`w-4 h-4 rounded-full bg-${teeBox.color}-500`}
                      />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{teeBox.name}</div>
                      {teeBox.rating && (
                        <div className="text-sm text-gray-600">
                          Rating: {teeBox.rating} | Slope: {teeBox.slope}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="card h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Round Summary</h2>

          <div className="space-y-4 mb-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Course</div>
              <div className="font-semibold text-gray-900">
                {selectedCourse?.name || 'Not selected'}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-2">Tee Box</div>
              <div className="font-semibold text-gray-900">
                {selectedTeeBox
                  ? selectedCourse?.teeBoxes?.find((t) => t.id === selectedTeeBox)?.name
                  : 'Not selected'}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Holes to Play</label>
              <select
                value={holesPlayed}
                onChange={(e) => setHolesPlayed(parseInt(e.target.value))}
                className="input"
              >
                <option value={9}>Front 9</option>
                <option value={18}>Full 18</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateRound}
            disabled={!selectedCourse || !selectedTeeBox || creating}
            className="btn-primary w-full"
          >
            {creating ? 'Creating...' : 'Start Round'}
          </button>
        </div>
      </div>
    </div>
  );
}
