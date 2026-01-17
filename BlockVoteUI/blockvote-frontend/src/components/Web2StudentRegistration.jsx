import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { ModernCard } from './ModernCard';

export const Web2StudentRegistration = ({ currentUser, onPasswordSet }) => {
  const [student, setStudent] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser?.registrationNumber) {
      loadStudentData();
    }
  }, [currentUser]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const studentData = await ApiService.getStudentByRegistration(currentUser.registrationNumber);
      setStudent(studentData);
    } catch (error) {
      setError('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSetup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

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
      await ApiService.changePassword(currentUser.registrationNumber.slice(-4), password);
      setMessage('Password set successfully! You can now participate in elections.');
      setPassword('');
      setConfirmPassword('');
      // Notify parent component that password is set
      if (onPasswordSet) {
        setTimeout(() => onPasswordSet(), 2000); // Show success message for 2 seconds
      }
    } catch (error) {
      setError(error.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
        <ModernCard className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your registration...</p>
        </ModernCard>
      </div>
    );
  }

  // If student has already set password, show only confirmation
  if (student?.hasSetPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <ModernCard className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Registered</h2>
              <p className="text-gray-600">Welcome back, {currentUser?.name}!</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-4">Your Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-800">
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Registration:</strong> {student.registrationNumber}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>School:</strong> {student.schoolName}</p>
                <p><strong>Department:</strong> {student.departmentName}</p>
                <p><strong>Year:</strong> {student.yearOfStudy}</p>
                <p><strong>Score:</strong> {student.meanScore}</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">You're All Set!</h3>
              <p className="text-green-700 text-sm">
                Your account is active and ready. You can participate in elections when the appropriate phases are open.
              </p>
            </div>
          </ModernCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <ModernCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete</h2>
            <p className="text-gray-600">Welcome to BlockVote, {currentUser?.name}!</p>
          </div>

          {student && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-4">Your Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-800">
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Registration:</strong> {student.registrationNumber}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>School:</strong> {student.schoolName}</p>
                <p><strong>Department:</strong> {student.departmentName}</p>
                <p><strong>Year:</strong> {student.yearOfStudy}</p>
                <p><strong>Score:</strong> {student.meanScore}</p>
              </div>
            </div>
          )}

          <form onSubmit={handlePasswordSetup} className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Set Your Password</h3>
              <p className="text-yellow-700 text-sm">
                Create a secure password for future logins. This replaces the default password.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min 4 characters)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md"
            >
              {loading ? 'Setting Password...' : 'Set Password & Complete Registration'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">You're All Set!</h3>
            <p className="text-green-700 text-sm">
              Your account is now active. You can participate in elections when the appropriate phases are open.
            </p>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};