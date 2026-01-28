import React, { useEffect, useRef, useState } from 'react';
import ApiService from '../services/api';

export const ModernNavbar = ({ currentUser, onLogout, onGoHome }) => {
  const [currentPhase, setCurrentPhase] = useState(null);
  const [phaseLoading, setPhaseLoading] = useState(true);
  const [delegateStatus, setDelegateStatus] = useState(null);
  const [loadingDelegate, setLoadingDelegate] = useState(false);

  // Get current phase from Web2 API
  useEffect(() => {
    const fetchCurrentPhase = async () => {
      try {
        const phaseData = await ApiService.getCurrentPhase();
        setCurrentPhase(phaseData.currentPhase);
      } catch (error) {
        console.error('Error fetching current phase:', error);
        setCurrentPhase(0);
      } finally {
        setPhaseLoading(false);
      }
    };

    fetchCurrentPhase();
    const interval = setInterval(fetchCurrentPhase, 5000);
    return () => clearInterval(interval);
  }, []);

  // Check delegate candidate status
  useEffect(() => {
    const checkDelegateStatus = async () => {
      if (currentUser?.registrationNumber) {
        try {
          setLoadingDelegate(true);
          const status = await ApiService.getDelegateCandidateStatus(currentUser.registrationNumber);
          setDelegateStatus(status);
        } catch (error) {
          // Silently handle 404 - student has no candidate application
          setDelegateStatus(null);
        } finally {
          setLoadingDelegate(false);
        }
      }
    };

    checkDelegateStatus();
  }, [currentUser]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        const dropdown = document.getElementById('wallet-dropdown');
        if (dropdown) dropdown.classList.add('hidden');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const getPhaseName = (phase) => {
    const phases = {
      0: 'Registration',
      1: 'Candidate Registration', 
      2: 'Delegate Voting',
      3: 'Nominee Registration',
      4: 'Party Registration',
      5: 'Council Voting',
      6: 'Results'
    };
    return phases[phase] || 'Unknown';
  };



  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 w-full">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <button 
            onClick={onGoHome}
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">V</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">BlockVote</h1>
              <p className="text-xs text-gray-500">Decentralized Voting</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-gray-900">BlockVote</h1>
            </div>
          </button>

          {/* Phase Indicator */}
          {!phaseLoading && currentPhase !== undefined && (
            <div className="hidden md:block">
              <div className={`phase-badge phase-${currentPhase}`}>
                {getPhaseName(Number(currentPhase))}
              </div>
            </div>
          )}

          {/* User Display */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="btn btn-secondary text-sm sm:text-base px-2 sm:px-6 py-2 sm:py-3 flex items-center space-x-1 sm:space-x-2"
                  onClick={() => {
                    const dropdown = document.getElementById('user-dropdown');
                    dropdown.classList.toggle('hidden');
                  }}
                >
                  <span>👤 {currentUser.name}</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div id="user-dropdown" className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 hidden z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-xs text-gray-500">Logged in as Student</p>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{currentUser.name}</p>
                    {currentUser.registrationNumber && (
                      <p className="text-xs text-gray-500 mb-3">{currentUser.registrationNumber}</p>
                    )}
                    {delegateStatus?.isCandidate && (
                      <div className={`mb-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                        delegateStatus.candidate.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : delegateStatus.candidate.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        🏃 Delegate Candidate
                        <div className="text-xs font-normal mt-1">
                          Status: {delegateStatus.candidate.status}
                        </div>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <button
                        onClick={() => {
                          onLogout();
                          document.getElementById('user-dropdown').classList.add('hidden');
                        }}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Phase Indicator */}
      {!phaseLoading && currentPhase !== undefined && (
        <div className="md:hidden px-4 pb-3 border-t border-gray-100">
          <div className={`phase-badge phase-${currentPhase} w-full justify-center`}>
            {getPhaseName(Number(currentPhase))}
          </div>
        </div>
      )}


    </nav>
  );
};