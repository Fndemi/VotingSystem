import React from 'react';

export const LandingPage = ({ onStudentLogin, onAdminLogin, onSignUp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">BlockVote</span>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <button
                onClick={onStudentLogin}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={onAdminLogin}
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-white font-bold text-3xl">🗳️</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Welcome to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              DeKUT BlockVote
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Cast your vote securely in the digital age
          </p>
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div 
              onClick={onStudentLogin}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-100 hover:border-blue-200"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-500 group-hover:to-blue-600 transition-all">
                <span className="text-3xl group-hover:text-white transition-colors">👨🎓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Student Login</h3>
              <p className="text-gray-600">Access your voting dashboard and participate in elections</p>
            </div>
            
            <div 
              onClick={onSignUp}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer text-white"
            >
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Register Now</h3>
              <p className="text-blue-100">New student? Create your account to get started</p>
            </div>
            
            <div 
              onClick={onAdminLogin}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-100 hover:border-purple-200"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500 group-hover:to-purple-600 transition-all">
                <span className="text-3xl group-hover:text-white transition-colors">👨💼</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Admin Access</h3>
              <p className="text-gray-600">Manage elections, candidates, and view results</p>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure</h4>
              <p className="text-gray-600 text-sm">Advanced encryption and authentication</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fast</h4>
              <p className="text-gray-600 text-sm">Real-time results and instant voting</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Accessible</h4>
              <p className="text-gray-600 text-sm">Vote from any device, anywhere</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2026 DeKUT BlockVote. Secure digital democracy for student elections.
          </div>
        </div>
      </footer>
    </div>
  );
};