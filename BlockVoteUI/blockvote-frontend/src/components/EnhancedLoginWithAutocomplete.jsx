import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/api';

export const EnhancedLoginWithAutocomplete = ({ onLogin, onBack, onSwitchToRegistration }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced search for autocomplete
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const results = await ApiService.searchStudents(query, 8);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setQuery(student.registrationNumber);
    setShowSuggestions(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear selected student if user modifies the input significantly
    if (selectedStudent && value !== selectedStudent.registrationNumber) {
      setSelectedStudent(null);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const registrationNumber = selectedStudent ? selectedStudent.registrationNumber : query.trim();
      const response = await ApiService.web2Login(registrationNumber, password);
      ApiService.setAuthToken(response.token);
      onLogin(response.user);
    } catch (error) {
      if (error.message.includes('status: 401')) {
        setError('Invalid registration number or password');
      } else if (error.message.includes('status: 202') || error.message.includes('Password not set') || error.message.includes('requiresPasswordSetup')) {
        setError('You need to register first to create your password. Redirecting to registration...');
        if (onSwitchToRegistration) {
          setTimeout(() => onSwitchToRegistration(), 2000);
        }
      } else if (error.message.includes('status: 404') || error.message.includes('Student not found')) {
        setError('Student not found. Please register first. Redirecting to registration...');
        if (onSwitchToRegistration) {
          setTimeout(() => onSwitchToRegistration(), 2000);
        }
      } else if (error.message.includes('status: 423')) {
        setError('Account temporarily locked. Try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Home Button */}
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className="text-xl">←</span>
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">BlockVote Login</h1>
            <p className="text-gray-600">Sign in to participate in elections</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Registration Number with Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                placeholder="Type or search your registration number..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  {suggestions.map((student, index) => (
                    <div
                      key={index}
                      onClick={() => handleStudentSelect(student)}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900 text-sm">
                        {student.registrationNumber}
                      </div>
                      <div className="text-xs text-gray-600">
                        {student.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Student Confirmation */}
            {selectedStudent && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm">
                  <span className="font-medium text-blue-800">Logging in as:</span>
                  <div className="text-blue-700">{selectedStudent.name}</div>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !query.trim() || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 text-sm"
              disabled={loading}
            >
              ← Back
            </button>
            
            {onSwitchToRegistration && (
              <button
                type="button"
                onClick={onSwitchToRegistration}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                disabled={loading}
              >
                Don't have an account? Register →
              </button>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Quick Login Tips:</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Start typing to see suggestions</li>
              <li>• Click on your name to auto-fill</li>
              <li>• Or type your full registration number</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};