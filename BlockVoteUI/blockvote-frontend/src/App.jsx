import React from 'react';
import './App.css';
import { ModernNavbar } from './components/ModernNavbar';
import { ModernCard, StatusCard, FeatureCard } from './components/ModernCard';
import { Web2StudentRegistration } from './components/Web2StudentRegistration';
import { Web2CandidateRegistration } from './components/Web2CandidateRegistration';
import { DelegateVoting } from './components/DelegateVoting';
import { PartyRegistration } from './components/PartyRegistration';
import { Web2CouncilVoting } from './components/Web2CouncilVoting';
import { Results } from './components/Results';
import { ElectedDelegates } from './components/ElectedDelegates';
import { Web2Admin } from './components/Web2Admin';
import { AdminLogin } from './components/AdminLogin';
import { EnhancedLoginWithAutocomplete } from './components/EnhancedLoginWithAutocomplete';
import { EnhancedRegistrationWithAutocomplete } from './components/EnhancedRegistrationWithAutocomplete';
import { LandingPage } from './components/LandingPage';
import ApiService from './services/api';

function AppContent() {
  const [activeTab, setActiveTab] = React.useState('delegates');
  const [authMode, setAuthMode] = React.useState('select'); // 'select', 'admin', 'student', 'registration'
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isLoadingSession, setIsLoadingSession] = React.useState(true);
  const [currentPhase, setCurrentPhase] = React.useState(0);
  const [phaseLoading, setPhaseLoading] = React.useState(true);

  // Restore session and load phase on app load
  React.useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await fetch('http://localhost:5000/api/auth/validate', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData.user);
            setAuthMode('student');
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Session restore failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoadingSession(false);
      }
    };

    const loadPhase = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/phases/current');
        if (response.ok) {
          const data = await response.json();
          setCurrentPhase(data.currentPhase);
        }
      } catch (error) {
        console.error('Failed to load phase:', error);
      } finally {
        setPhaseLoading(false);
      }
    };

    restoreSession();
    loadPhase();

    // Poll for phase updates every 5 seconds
    const interval = setInterval(loadPhase, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auth handlers
  const handleWeb2Login = (user) => {
    setCurrentUser(user);
    setIsAdmin(false);
    setAuthMode('student');
  };

  const handleAdminLogin = (adminUser) => {
    setCurrentUser(adminUser);
    setIsAdmin(true);
    setAuthMode('admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setAuthMode('select');
    localStorage.removeItem('authToken');
    ApiService.logout();
  };

  const handleGoHome = () => {
    if (isAdmin) {
      // Admin stays on admin dashboard
      return;
    }
    // For students, just refresh to show current phase content
    setActiveTab('delegates');
  };

  const handleAuthModeSelect = (mode) => {
    setAuthMode(mode);
  };

  let content;

  // Show auth selection or login screens
  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (authMode === 'select') {
    return (
      <LandingPage 
        onGetStarted={() => setAuthMode('choose')}
        onStudentLogin={() => setAuthMode('student')}
        onAdminLogin={() => setAuthMode('admin')}
        onSignUp={() => setAuthMode('registration')}
      />
    );
  }

  if (authMode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <button 
              onClick={() => setAuthMode('select')}
              className="mb-4 text-blue-600 hover:text-blue-800 flex items-center mx-auto"
            >
              ← Back to Home
            </button>
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-4">BlockVote</h1>
            <p className="text-gray-600">Choose your login method</p>
          </div>

          <div className="space-y-4">
            <ModernCard className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleAuthModeSelect('student')}>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👨🎓</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Student Login</h3>
                <p className="text-gray-600 text-sm">Login with your registration number and password</p>
              </div>
            </ModernCard>

            <ModernCard className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleAuthModeSelect('admin')}>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👨💼</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Admin Login</h3>
                <p className="text-gray-600 text-sm">Login with admin credentials</p>
              </div>
            </ModernCard>
          </div>
        </div>
      </div>
    );
  }

  if (authMode === 'student' && !currentUser) {
    return (
      <EnhancedLoginWithAutocomplete
        onLogin={handleWeb2Login}
        onBack={() => setAuthMode('select')}
        onSwitchToRegistration={() => setAuthMode('registration')}
      />
    );
  }

  if (authMode === 'registration') {
    return (
      <EnhancedRegistrationWithAutocomplete
        onRegistrationComplete={() => setAuthMode('student')}
        onSwitchToLogin={() => setAuthMode('student')}
      />
    );
  }

  if (authMode === 'admin' && !isAdmin) {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
        onBack={() => setAuthMode('select')}
      />
    );
  } else if (phaseLoading) {
    content = (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-md mx-auto px-2 sm:px-4">
          <ModernCard className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading</h2>
            <p className="text-gray-600 text-sm">
              Loading election data...
            </p>
          </ModernCard>
        </div>
      </div>
    );
  } else if (authMode === 'admin' && isAdmin) {
    return <Web2Admin />;
  } else if (authMode === 'student') {
    // User dashboard based on current phase
    const phaseNum = Number(currentPhase);
    switch (phaseNum) {
      case 0: // Registration
        content = (
          <div className="p-4 sm:p-8 text-center bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">📝 Registration Phase</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Student registration is currently open. You are already registered and logged in.
            </p>
            <p className="text-blue-600 text-sm sm:text-base">Please wait for the next phase to begin.</p>
          </div>
        );
        break;
      case 1: // Candidate Registration
        content = <Web2CandidateRegistration />;
        break;
      case 2: // Delegate Voting
        content = <DelegateVoting user={currentUser} />;
        break;
      case 3: // Nominee Registration (Skipped in Web2)
        content = (
          <div className="p-4 sm:p-8 text-center bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">⏭️ Phase Transition</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Transitioning to party registration phase...
            </p>
            <p className="text-blue-600 text-sm sm:text-base">Please wait while the system updates.</p>
          </div>
        );
        break;
      case 4: // Party Registration (Admin only)
        content = (
          <div className="p-4 sm:p-8 text-center bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">🏛️ Party Registration Phase</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              The admin is currently registering parties with their nominees.
            </p>
            <p className="text-yellow-600 text-sm sm:text-base">Please check back when council voting begins.</p>
          </div>
        );
        break;
      case 5: // Council Voting
        content = <Web2CouncilVoting user={currentUser} />;
        break;
      case 6: // Ended
        content = (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('delegates')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'delegates'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
              >
                Elected Delegates
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'results'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
              >
                Council Results
              </button>
            </div>
            {activeTab === 'delegates' ? <ElectedDelegates /> : <Results />}
          </div>
        );
        break;
      default:
        content = (
          <div className="p-4 sm:p-8 bg-yellow-900 rounded-lg shadow-xl border-2 border-yellow-500">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-yellow-300">⚠️ Unexpected Phase</h2>
            <div className="space-y-2 text-yellow-200 text-sm sm:text-base">
              <p>Current phase value: <span className="font-mono bg-yellow-800 px-2 py-1 rounded">{String(currentPhase)}</span></p>
              <p>Current phase number: <span className="font-mono bg-yellow-800 px-2 py-1 rounded">{phaseNum}</span></p>
              <p>Expected range: 0-6</p>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <ModernNavbar currentUser={currentUser} onLogout={handleLogout} onGoHome={handleGoHome} />
      <main className="w-full px-2 sm:px-4 py-4 sm:py-8">
        {content}
      </main>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;