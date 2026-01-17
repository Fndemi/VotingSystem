import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/api';

export const EnhancedRegistrationWithAutocomplete = ({ onRegistrationComplete, onSwitchToLogin }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced search for autocomplete
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const results = await ApiService.searchStudents(query, 10);
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
    setQuery(`${student.registrationNumber} - ${student.name}`);
    setShowSuggestions(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear selected student if user modifies the input
    if (selectedStudent && value !== `${selectedStudent.registrationNumber} - ${selectedStudent.name}`) {
      setSelectedStudent(null);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!selectedStudent) {
      setError('Please select a valid student from the suggestions');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      // Try to set password for existing student first
      try {
        await ApiService.setupPassword(selectedStudent.registrationNumber, password);
        setMessage('Password set successfully! You can now log in.');
      } catch (setupError) {
        // If setup fails, try to register as new student
        await ApiService.registerStudent({
          registrationNumber: selectedStudent.registrationNumber,
          name: selectedStudent.name,
          email: selectedStudent.email || `${selectedStudent.registrationNumber}@student.edu`,
          password: password
        });
        setMessage('Registration successful! You can now log in.');
      }

      // Clear form
      setQuery('');
      setSelectedStudent(null);
      setPassword('');
      setConfirmPassword('');
      
      // Notify parent component
      if (onRegistrationComplete) {
        setTimeout(() => onRegistrationComplete(), 2000);
      }
      
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Home Button */}
        {onSwitchToLogin && (
          <button
            onClick={onSwitchToLogin}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">Back to Login</span>
          </button>
        )}

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
            <p className="text-gray-600">Create your BlockVote account to participate in elections</p>
          </div>

          <form onSubmit={handleRegistration} className="space-y-6">
            {/* Autocomplete Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search for your Registration Number or Name
              </label>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                placeholder="Type your registration number or name..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {suggestions.map((student, index) => (
                    <div
                      key={index}
                      onClick={() => handleStudentSelect(student)}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {student.registrationNumber}
                      </div>
                      <div className="text-sm text-gray-600">
                        {student.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showSuggestions && query.length >= 2 && suggestions.length === 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3"
                >
                  <div className="text-gray-500 text-sm">No students found</div>
                </div>
              )}
            </div>

            {/* Selected Student Display */}
            {selectedStudent && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Selected Student:</h3>
                <div className="text-sm text-green-700">
                  <p><strong>Name:</strong> {selectedStudent.name}</p>
                  <p><strong>Registration:</strong> {selectedStudent.registrationNumber}</p>
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 4 characters)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading || !selectedStudent}
                minLength={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading || !selectedStudent}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedStudent || !password || !confirmPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>

          {onSwitchToLogin && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                disabled={loading}
              >
                Already registered? Sign in →
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Registration Steps:</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Search for your registration number or name</li>
              <li>• Select your details from the suggestions</li>
              <li>• Create a secure password for your account</li>
              <li>• Complete registration to start voting!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};