import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { AdminPartyRegistration } from './AdminPartyRegistration';
import { ModernCard } from './ModernCard';

export const Web2Admin = () => {
  const [currentPhase, setCurrentPhase] = useState(null);
  const [students, setStudents] = useState([]);
  const [delegateCandidates, setDelegateCandidates] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({});

  const web2Phases = [
    { number: 0, name: 'Registration', icon: '📝', color: 'blue' },
    { number: 1, name: 'Candidate Registration', icon: '🏃', color: 'green' },
    { number: 2, name: 'Delegate Voting', icon: '🗳️', color: 'purple' },
    { number: 4, name: 'Party Registration', icon: '🏛️', color: 'orange' },
    { number: 5, name: 'Council Voting', icon: '👥', color: 'red' },
    { number: 6, name: 'Results', icon: '🏁', color: 'gray' }
  ];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [phase, studentsData, partiesData, pendingApps, electedDelegatesData] = await Promise.all([
        ApiService.getCurrentPhase(),
        ApiService.getStudents(),
        ApiService.getParties().catch(() => []),
        ApiService.getPendingApplications().catch(() => []),
        ApiService.getAllElectedDelegates().catch(() => ({ delegates: [] }))
      ]);
      
      setCurrentPhase(phase);
      setStudents(studentsData);
      setParties(partiesData);
      setPendingApplications(pendingApps);
      setDelegateCandidates(electedDelegatesData.delegates || []);
      
      // Calculate statistics
      const registeredStudents = studentsData.filter(s => s.passwordHash);
      setStats({
        totalStudents: studentsData.length,
        registeredStudents: registeredStudents.length,
        pendingApplications: pendingApps.length,
        totalParties: partiesData.length,
        totalDelegates: electedDelegatesData.delegates?.length || 0
      });
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const setPhase = async (phaseNumber) => {
    if (phaseNumber === 3) {
      showToast('Phase 3 is automatically skipped in Web2 implementation', 'warning');
      return;
    }
    try {
      await ApiService.setPhase(phaseNumber);
      await loadData();
      const phaseName = web2Phases.find(p => p.number === phaseNumber)?.name || 'Unknown';
      showToast(`Successfully moved to ${phaseName}`, 'success');
    } catch (error) {
      showToast('Failed to change phase', 'error');
    }
  };

  const nextPhase = async () => {
    try {
      const result = await ApiService.nextPhase();
      await loadData();
      const newPhaseNum = result?.currentPhase || currentPhase?.currentPhase + 1;
      const newPhase = web2Phases.find(p => p.number === newPhaseNum);
      showToast(`Advanced to ${newPhase?.name || 'next phase'}`, 'success');
    } catch (error) {
      showToast('Failed to advance phase', 'error');
    }
  };

  const handleReviewApplication = async (applicationId, status, comments = '') => {
    try {
      await ApiService.reviewApplication(applicationId, status, comments);
      await loadData();
      showToast(`Application ${status} successfully`, 'success');
    } catch (error) {
      showToast(`Failed to ${status} application`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ModernCard className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </ModernCard>
      </div>
    );
  }

  const currentPhaseInfo = web2Phases.find(p => p.number === currentPhase?.currentPhase);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg animate-fade-in ${
          toast.type === 'success' ? 'bg-green-600 text-white' :
          toast.type === 'error' ? 'bg-red-600 text-white' :
          toast.type === 'warning' ? 'bg-yellow-600 text-white' :
          'bg-blue-600 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : toast.type === 'warning' ? '⚠' : 'ℹ'}
            </span>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Election Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Current Phase</p>
                <p className="text-xs text-gray-500">{currentPhaseInfo?.icon} {currentPhaseInfo?.name}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('phases')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'phases'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🔄 Phase Control
            </button>
            {pendingApplications.length > 0 && (
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
                  activeTab === 'applications'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📋 Applications
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingApplications.length}
                </span>
              </button>
            )}
            {currentPhase?.currentPhase === 4 && (
              <button
                onClick={() => setActiveTab('parties')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'parties'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🏛️ Parties
              </button>
            )}
            <button
              onClick={() => setActiveTab('system')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'system'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ⚙️ System
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-lg">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Registered Students</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.registeredStudents}</p>
                    <p className="text-xs text-gray-400">of {stats.totalStudents} total</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-lg">🏃</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Delegate Candidates</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalDelegates}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-lg">🏛️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Registered Parties</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalParties}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 text-lg">📊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Current Phase</p>
                    <p className="text-2xl font-semibold text-gray-900">{currentPhase?.currentPhase}</p>
                    <p className="text-xs text-gray-400">{currentPhaseInfo?.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Phase Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Election Status</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Active Phase</p>
                    <p className="text-gray-900 text-xl font-bold">
                      {currentPhaseInfo?.icon} {currentPhase?.phaseName}
                    </p>
                    <p className="text-blue-700 text-sm">Phase {currentPhase?.currentPhase}</p>
                  </div>
                  <button
                    onClick={nextPhase}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Advance Phase →
                  </button>
                </div>
              </div>
            </div>

            {/* Parties Overview */}
            {parties.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Parties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parties.map(party => (
                    <div key={party.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">{party.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">Votes: {party.totalVotes || 0}</p>
                      <div className="text-xs text-gray-500">
                        <p>President: {party.slot0?.[0]?.name || 'TBD'}</p>
                        <p>Vice President: {party.slot0?.[1]?.name || 'TBD'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Phase Control Tab */}
        {activeTab === 'phases' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Phase Management</h3>
              
              {/* Phase Flow Visualization */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Election Flow</h4>
                <div className="flex flex-wrap items-center gap-2">
                  {web2Phases.map((phase, idx) => (
                    <React.Fragment key={phase.number}>
                      <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        currentPhase?.currentPhase === phase.number
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setPhase(phase.number)}>
                        {phase.icon} {phase.name}
                      </div>
                      {idx < web2Phases.length - 1 && (
                        <span className="text-gray-400">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Phase Control Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {web2Phases.map((phase) => (
                  <button
                    key={phase.number}
                    onClick={() => setPhase(phase.number)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      currentPhase?.currentPhase === phase.number
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-2">{phase.icon}</div>
                    <div className="font-medium">Phase {phase.number}</div>
                    <div className="text-sm opacity-75">{phase.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Candidate Applications</h3>
            
            {pendingApplications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📋</div>
                <p>No pending applications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map(app => (
                  <div key={app.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{app.name}</h4>
                        <p className="text-sm text-gray-600">{app.registrationNumber}</p>
                        <p className="text-xs text-gray-500">Applied: {new Date(app.appliedAt).toLocaleString()}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        {app.status}
                      </span>
                    </div>
                    
                    {app.manifesto && (
                      <div className="mb-4 p-3 bg-white rounded border">
                        <p className="text-sm text-gray-700">
                          <strong>Manifesto:</strong> {app.manifesto}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReviewApplication(app.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => {
                          const comments = prompt('Rejection reason (optional):');
                          if (comments !== null) {
                            handleReviewApplication(app.id, 'rejected', comments);
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Party Management Tab */}
        {activeTab === 'parties' && currentPhase?.currentPhase === 4 && (
          <AdminPartyRegistration />
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Actions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={loadData}
                  className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors"
                >
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-medium text-blue-900">Refresh Data</div>
                  <div className="text-sm text-blue-700">Reload all dashboard information</div>
                </button>
                
                <button
                  onClick={() => {
                    if (confirm('This will reset all election data. Continue?')) {
                      showToast('Use backend reset script to reset election', 'warning');
                    }
                  }}
                  className="p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-left transition-colors"
                >
                  <div className="text-2xl mb-2">🗑️</div>
                  <div className="font-medium text-red-900">Reset Election</div>
                  <div className="text-sm text-red-700">Clear all votes and reset to Phase 0</div>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};