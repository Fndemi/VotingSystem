import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const ElectedDelegates = () => {
  const [currentPhase, setCurrentPhase] = useState(null);
  const [delegates, setDelegates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const phaseData = await ApiService.getCurrentPhase();
        setCurrentPhase(phaseData.currentPhase);

        if (phaseData.currentPhase >= 2) {
          const delegatesResponse = await ApiService.getAllElectedDelegates();
          setDelegates(delegatesResponse.delegates || []);
        }
      } catch (error) {
        console.error('Error fetching delegates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delegates...</p>
        </div>
      </div>
    );
  }

  if (!currentPhase || currentPhase < 2) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">🗳️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Elected Delegates
          </h2>
          <p className="text-gray-600">
            Delegates will be visible after the delegate voting phase begins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">🎓</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
          Elected Delegates
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Representatives elected from each department
        </p>
      </div>

      <div className="grid gap-3 md:gap-4">
        {delegates.length > 0 ? (
          delegates.map((delegate, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-5 border-2 border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-bold text-base md:text-lg text-gray-900">{delegate.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{delegate.registrationNumber}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{delegate.schoolName}</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{delegate.departmentName}</span>
                  </div>
                </div>
                <div className="bg-white px-5 py-3 rounded-xl shadow-sm text-center sm:text-right">
                  <div className="text-xl md:text-2xl font-bold text-blue-600">{delegate.voteCount}</div>
                  <div className="text-xs text-gray-600">votes</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500">No delegates have been elected yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};