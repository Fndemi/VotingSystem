import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const Results = () => {
  const [delegateResults, setDelegateResults] = useState([]);
  const [councilResults, setCouncilResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('council');
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const [delegates, council] = await Promise.all([
        ApiService.getAllElectedDelegates(),
        ApiService.getCouncilResults()
      ]);
      
      const delegateData = delegates.delegates || [];
      setDelegateResults(delegateData);
      setCouncilResults(council);
      
      // Calculate statistics
      const totalDelegateVotes = delegateData.reduce((sum, delegate) => sum + (delegate.voteCount || 0), 0);
      const totalCouncilVotes = council?.parties?.reduce((sum, party) => sum + (party.totalVotes || 0), 0) || 0;
      
      setStats({
        totalDelegates: delegateData.length,
        totalDelegateVotes,
        totalCouncilVotes,
        totalParties: council?.parties?.length || 0,
        winningParty: council?.winners ? Object.values(council.winners)[0]?.partyName : null
      });
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading election results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Election Results</h1>
            <p className="text-xl opacity-90">BlockVote Student Council Elections</p>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-2xl">🎓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Elected Delegates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDelegates}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-2xl">🗳️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Delegate Votes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDelegateVotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-2xl">🏛️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Council Votes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCouncilVotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-2xl">👑</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Winning Party</p>
                <p className="text-lg font-bold text-gray-900">{stats.winningParty || 'TBD'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('council')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'council'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🏛️ Council Results
              </button>
              <button
                onClick={() => setActiveTab('delegates')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'delegates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎓 Elected Delegates
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'council' && (
              <div className="space-y-6">
                {councilResults?.winners && Object.keys(councilResults.winners).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(councilResults.winners).map(([slotId, winner], index) => (
                      <div key={slotId} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{winner.slotName}</h3>
                            <p className="text-lg font-semibold text-blue-600">🎉 {winner.partyName}</p>
                          </div>
                          <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                            <div className="text-2xl font-bold text-blue-600">{winner.votes}</div>
                            <div className="text-xs text-gray-500 text-center">votes</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-4xl text-gray-400">📊</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Council Results Yet</h3>
                    <p className="text-gray-500">Council voting may still be in progress or not yet started.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'delegates' && (
              <div className="space-y-4">
                {delegateResults.length > 0 ? (
                  <div className="grid gap-4">
                    {delegateResults.map((delegate, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{delegate.name}</h3>
                            <p className="text-sm text-gray-600">{delegate.departmentName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">{delegate.voteCount}</div>
                            <div className="text-xs text-gray-500">votes</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-4xl text-gray-400">🎓</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Delegates Elected Yet</h3>
                    <p className="text-gray-500">Delegate voting may still be in progress or not yet started.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white mb-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">🎉 Thank You for Participating!</h3>
            <p className="text-lg opacity-90">
              Your vote matters in shaping the future of our student community.
            </p>
            <div className="mt-4 text-sm opacity-75">
              Powered by BlockVote - Secure Digital Democracy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};