import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const LandingPage = ({ onGetStarted, onStudentLogin, onAdminLogin, onSignUp }) => {
  const [currentPhase, setCurrentPhase] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDelegates: 0,
    totalParties: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [phase, students, delegates, parties] = await Promise.all([
        ApiService.getCurrentPhase().catch(() => ({ currentPhase: 0 })),
        ApiService.getStudents().catch(() => []),
        ApiService.getAllElectedDelegates().catch(() => ({ delegates: [] })),
        ApiService.getParties().catch(() => [])
      ]);
      
      setCurrentPhase(phase);
      setStats({
        totalStudents: students.length || 0,
        totalDelegates: delegates.delegates?.length || 0,
        totalParties: parties.length || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const phases = [
    { number: 0, name: 'Registration', icon: '📝', description: 'Students register and set up accounts' },
    { number: 1, name: 'Candidate Registration', icon: '🏃', description: 'Eligible students apply to be delegates' },
    { number: 2, name: 'Delegate Voting', icon: '🗳️', description: 'Students vote for department representatives' },
    { number: 4, name: 'Party Formation', icon: '🏛️', description: 'Delegates form parties with manifestos' },
    { number: 5, name: 'Council Voting', icon: '👥', description: 'Delegates vote for council positions' },
    { number: 6, name: 'Results', icon: '🏆', description: 'Winners announced and results published' }
  ];

  const features = [
    {
      icon: '🔒',
      title: 'Secure & Transparent',
      description: 'JWT authentication, encrypted data, and complete audit trails ensure election integrity.'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Vote from anywhere using any device - desktop, tablet, or smartphone.'
    },
    {
      icon: '⚡',
      title: 'Real-time Results',
      description: 'Instant vote counting and live result updates as the election progresses.'
    },
    {
      icon: '🎯',
      title: 'Multi-Phase System',
      description: 'Structured election process from registration to final results.'
    },
    {
      icon: '👥',
      title: 'Department-Based',
      description: 'Fair representation with department-specific delegate elections.'
    },
    {
      icon: '🛡️',
      title: 'One Vote Policy',
      description: 'Strict duplicate prevention ensures one vote per student per election.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-white">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">BlockVote</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onStudentLogin()}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Student Login
                </button>
                <button
                  onClick={() => onAdminLogin()}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Admin
                </button>
                <button
                  onClick={() => onSignUp()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Secure Digital
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Student Elections
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Modern, transparent, and accessible voting platform for student council elections.
              Vote securely from anywhere, anytime.
            </p>
            
            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div 
                onClick={() => onStudentLogin()}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
                  <span className="text-2xl group-hover:text-white transition-colors">👨🎓</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Login</h3>
                <p className="text-gray-600 text-sm">Access your voting dashboard</p>
              </div>
              
              <div 
                onClick={() => onSignUp()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all text-white"
              >
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">New Student?</h3>
                <p className="text-blue-100 text-sm">Register to participate in elections</p>
              </div>
              
              <div 
                onClick={() => onAdminLogin()}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-purple-500 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 transition-colors">
                  <span className="text-2xl group-hover:text-white transition-colors">👨💼</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Access</h3>
                <p className="text-gray-600 text-sm">Manage elections and results</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Learn More
              </button>
              <button
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                className="text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                How It Works →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Election Statistics</h2>
            <p className="text-gray-600">Current election progress and participation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalStudents}</div>
              <div className="text-gray-600">Registered Students</div>
            </div>
            
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎓</span>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalDelegates}</div>
              <div className="text-gray-600">Elected Delegates</div>
            </div>
            
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏛️</span>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalParties}</div>
              <div className="text-gray-600">Registered Parties</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Phase Indicator */}
      {currentPhase && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Election Phase</h2>
              <p className="text-gray-600">Track the progress of the ongoing election</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-white">{phases.find(p => p.number === currentPhase.currentPhase)?.icon || '📊'}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Phase {currentPhase.currentPhase}: {currentPhase.phaseName}
                </h3>
                <p className="text-gray-600 text-lg">
                  {phases.find(p => p.number === currentPhase.currentPhase)?.description || 'Election in progress'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose BlockVote?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with modern technology and security best practices to ensure fair, transparent, and accessible elections.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, structured election process in 6 phases</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {phases.map((phase, index) => (
              <div key={phase.number} className="relative">
                <div className={`bg-white rounded-xl p-6 border-2 transition-all ${
                  currentPhase?.currentPhase === phase.number 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                      currentPhase?.currentPhase === phase.number
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                        : currentPhase?.currentPhase > phase.number
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}>
                      {currentPhase?.currentPhase > phase.number ? '✓' : phase.number}
                    </div>
                    <div className="text-2xl">{phase.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{phase.name}</h3>
                  <p className="text-gray-600 text-sm">{phase.description}</p>
                  {currentPhase?.currentPhase === phase.number && (
                    <div className="mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full inline-block">
                      Current Phase
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Vote?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students participating in secure, transparent elections.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Voting Now →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🗳️</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">BlockVote</h3>
            <p className="text-gray-400 mb-6">Secure Digital Democracy for Student Elections</p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500 text-sm">
                © 2024 BlockVote. Built with modern web technologies for secure, transparent elections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};