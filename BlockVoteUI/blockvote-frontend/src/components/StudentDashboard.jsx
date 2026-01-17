import React, { useState, useEffect } from 'react';
import { ModernCard } from './ModernCard';
import ApiService from '../services/api';

export const StudentDashboard = ({ currentUser, currentPhase }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      const studentData = await ApiService.getStudentByRegistration(currentUser.registrationNumber);
      setStudent(studentData);
    } catch (error) {
      console.error('Failed to load student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseInfo = (phase) => {
    const phases = {
      0: { name: 'Student Registration', icon: '📝', color: 'blue', status: 'Open for registration' },
      1: { name: 'Candidate Registration', icon: '🏃', color: 'green', status: 'Students can apply as candidates' },
      2: { name: 'Delegate Voting', icon: '🗳️', color: 'purple', status: 'Vote for delegate candidates' },
      3: { name: 'Nominee Registration', icon: '🏛️', color: 'orange', status: 'Admin registering nominees' },
      4: { name: 'Party Registration', icon: '🎉', color: 'pink', status: 'Admin setting up parties' },
      5: { name: 'Council Voting', icon: '👑', color: 'red', status: 'Delegates voting for council' },
      6: { name: 'Results', icon: '🏆', color: 'yellow', status: 'Election completed' }
    };
    return phases[phase] || { name: 'Unknown', icon: '❓', color: 'gray', status: 'Unknown phase' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const phaseInfo = getPhaseInfo(Number(currentPhase));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Header */}
      <ModernCard className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">👨🎓</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.name}!</h1>
            <p className="text-gray-600">Ready to participate in BlockVote elections</p>
          </div>
        </div>
      </ModernCard>

      {/* Current Phase */}
      <ModernCard className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-${phaseInfo.color}-100 rounded-full flex items-center justify-center`}>
              <span className="text-2xl">{phaseInfo.icon}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{phaseInfo.name}</h2>
              <p className="text-gray-600">{phaseInfo.status}</p>
            </div>
          </div>
          <div className={`px-3 py-1 bg-${phaseInfo.color}-100 text-${phaseInfo.color}-800 rounded-full text-sm font-medium`}>
            Phase {currentPhase}
          </div>
        </div>
      </ModernCard>

      {/* Student Info */}
      {student && (
        <ModernCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Registration:</strong> {student.registrationNumber}</div>
            <div><strong>Email:</strong> {student.email}</div>
            <div><strong>School:</strong> {student.schoolName}</div>
            <div><strong>Department:</strong> {student.departmentName}</div>
            <div><strong>Year:</strong> {student.yearOfStudy}</div>
            <div><strong>Score:</strong> {student.meanScore}</div>
          </div>
        </ModernCard>
      )}

      {/* Quick Actions */}
      <ModernCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">View Results</div>
            <div className="text-sm text-gray-600">Check election outcomes</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-2xl mb-2">👥</div>
            <div className="font-medium">View Candidates</div>
            <div className="text-sm text-gray-600">See who's running</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">Election Info</div>
            <div className="text-sm text-gray-600">Learn about the process</div>
          </button>
        </div>
      </ModernCard>
    </div>
  );
};