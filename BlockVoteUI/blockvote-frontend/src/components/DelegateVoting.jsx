import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { ModernCard } from './ModernCard';

export const DelegateVoting = ({ user }) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [electedDelegate, setElectedDelegate] = useState(null);
  const [loadingWinner, setLoadingWinner] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);

  useEffect(() => {
    const fetchCurrentPhase = async () => {
      try {
        const phaseData = await ApiService.getCurrentPhase();
        setCurrentPhase(phaseData.currentPhase);
      } catch (error) {
        console.error('Error fetching current phase:', error);
        setCurrentPhase(0);
      }
    };

    fetchCurrentPhase();
    const interval = setInterval(fetchCurrentPhase, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingWinner(true);
        try {
          const result = await ApiService.getMyDepartmentDelegateResult();
          if (result.hasDelegate) {
            setElectedDelegate(result.delegate);
          }
        } catch (error) {
          console.error('Error loading elected delegate:', error);
        } finally {
          setLoadingWinner(false);
        }

        if (currentPhase !== 2) {
          setErrorMessage('Delegate voting is not open at this time.');
          setLoadingCandidates(false);
          return;
        }

        const status = await ApiService.getDelegateVotingStatus();
        if (status.hasVoted) {
          setHasVoted(true);
          setStatusMessage('You have already voted for a delegate.');
        }

        const deptCandidates = await ApiService.getDelegateCandidatesByDepartment(
          user.schoolId,
          user.departmentId,
        );
        setCandidates(deptCandidates);
        
        if (deptCandidates.length === 0) {
          setStatusMessage('There are currently no delegate candidates registered for your department.');
        } else if (!status.hasVoted) {
          setStatusMessage('Select one candidate from your department and cast your vote.');
        }
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load voting data.');
      } finally {
        setLoadingCandidates(false);
      }
    };

    if (user && currentPhase !== null) {
      loadData();
    } else {
      setLoadingCandidates(false);
    }
  }, [user, currentPhase]);

  const handleVote = async () => {
    setErrorMessage('');
    setStatusMessage('');

    if (hasVoted) {
      setErrorMessage('You have already voted for a delegate.');
      return;
    }

    if (!selectedCandidateId) {
      setErrorMessage('Please select a candidate before voting.');
      return;
    }

    try {
      setSubmitting(true);
      const result = await ApiService.castDelegateVote(selectedCandidateId);
      setStatusMessage(result.message || 'Your vote has been recorded.');
      setHasVoted(true);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to cast vote.');
    } finally {
      setSubmitting(false);
    }
  };

  if (currentPhase !== 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <ModernCard className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">⏸️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delegate Voting Not Open</h2>
            <p className="text-gray-600 mb-2">
              Delegate voting is not currently open. Current phase: {currentPhase}
            </p>
            <p className="text-sm text-gray-500">
              Please wait for the delegate voting phase to begin.
            </p>
          </ModernCard>
        </div>
      </div>
    );
  }

  if (currentPhase !== null && currentPhase > 2 && electedDelegate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <ModernCard className="p-6">
            <h2 className="text-3xl font-bold gradient-text mb-2 text-center">🏆 Delegate Election Results</h2>
            <p className="text-gray-600 text-center">
              The delegate voting has ended. Here is the winner for your department.
            </p>
          </ModernCard>

          <ModernCard className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
            <div className="text-center mb-4">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Elected Delegate</h3>
              <p className="text-green-600 text-sm">Congratulations to the winner!</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-center">
                <h4 className="text-3xl font-bold text-gray-900 mb-2">{electedDelegate.name}</h4>
                <p className="text-lg text-gray-700 mb-4">
                  Registration: <span className="font-mono font-semibold">{electedDelegate.registrationNumber}</span>
                </p>
                <div className="inline-block bg-green-100 px-6 py-3 rounded-full">
                  <p className="text-green-800 font-bold text-lg">
                    Total Votes: {electedDelegate.voteCount}
                  </p>
                </div>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <ModernCard className="p-6">
          <h2 className="text-3xl font-bold gradient-text mb-2 text-center">🗳️ Delegate Voting</h2>
          <p className="text-gray-600 text-center">
            Vote for a delegate in your department
          </p>
        </ModernCard>

        {/* User Info */}
        <ModernCard className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <p className="text-blue-900 font-medium">
            <strong>{user.name}</strong> - {user.registrationNumber}
          </p>
          <p className="text-blue-700 text-sm">
            Department ID: {user.departmentId} • School ID: {user.schoolId}
          </p>
        </ModernCard>

        {/* Messages */}
        {statusMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Loading */}
        {loadingCandidates && (
          <ModernCard className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading candidates...</p>
          </ModernCard>
        )}

        {/* Voting Interface */}
        {!loadingCandidates && !hasVoted && candidates.length > 0 && (
          <>
            <ModernCard className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="font-bold text-blue-900 mb-2">📋 Voting Instructions:</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Select one candidate from your department</li>
                <li>• You can only vote once</li>
                <li>• Your vote is recorded securely</li>
              </ul>
            </ModernCard>

            <ModernCard className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Available Candidates:</h3>
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${ 
                      selectedCandidateId === candidate.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 ${
                        selectedCandidateId === candidate.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400'
                      }`}>
                        {selectedCandidateId === candidate.id && (
                          <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-600">
                          Registration: {candidate.registrationNumber}
                        </p>
                        {candidate.manifesto && (
                          <p className="text-sm text-gray-700 mt-2">
                            <span className="font-semibold">Manifesto:</span> {candidate.manifesto}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCard>

            <ModernCard className="p-6">
              <button
                type="button"
                onClick={handleVote}
                disabled={submitting || !selectedCandidateId || hasVoted}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all shadow-md"
              >
                {submitting ? 'Submitting vote...' : 'Cast Your Vote'}
              </button>
            </ModernCard>
          </>
        )}

        {/* Already Voted */}
        {!loadingCandidates && hasVoted && (
          <ModernCard className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-2xl flex items-center justify-center">
                <span className="text-3xl text-white">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Vote Recorded!</h3>
              <p className="text-green-800">
                Your vote has been recorded. Thank you for participating in the delegate election.
              </p>
            </div>
          </ModernCard>
        )}

        {/* No Candidates */}
        {!loadingCandidates && candidates.length === 0 && !hasVoted && (
          <ModernCard className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📭</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Candidates Available</h3>
            <p className="text-gray-600">
              There are currently no delegate candidates registered for your department. Please check back later.
            </p>
          </ModernCard>
        )}
      </div>
    </div>
  );
};
