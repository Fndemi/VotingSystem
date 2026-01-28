import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { ModernCard } from './ModernCard';

export const Web2CandidateRegistration = ({ user }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (user) {
      // Auto-load the logged-in user's data
      loadStudentData(user.registrationNumber);
      // Check candidate status
      checkCandidateStatus(user.registrationNumber);
    }
  }, [user]);

  const [candidateStatus, setCandidateStatus] = useState(null);

  const checkCandidateStatus = async (regNo) => {
    try {
      console.log('Web2CandidateRegistration - Checking status for:', regNo);
      const status = await ApiService.getDelegateCandidateStatus(regNo);
      console.log('Web2CandidateRegistration - Status response:', JSON.stringify(status, null, 2));
      setCandidateStatus(status);
    } catch (error) {
      console.log('Web2CandidateRegistration - No application found for:', regNo, error.message);
      setCandidateStatus(null);
    }
  };

  const loadStudentData = async (regNo) => {
    try {
      const student = await ApiService.getStudentByRegistration(regNo);
      setStudentData(student);
    } catch (error) {
      setError('Failed to load student data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      await ApiService.registerDelegateCandidate({
        registrationNumber: user.registrationNumber,
        manifesto: ''
      });
      
      setSuccess('Candidate registration successful! Your application is pending admin approval.');
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header */}
        <ModernCard className="p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">📝 Delegate Candidate Registration</h2>
          <p className="text-sm sm:text-base text-gray-600">Register to become a delegate candidate for your department</p>
        </ModernCard>

        {/* Candidate Status */}
        {candidateStatus && candidateStatus.isCandidate && candidateStatus.candidate && candidateStatus.candidate.status && (
          <ModernCard className={`p-4 sm:p-6 ${
            candidateStatus.candidate.status === 'approved' ? 'bg-green-50 border-green-200' :
            candidateStatus.candidate.status === 'rejected' ? 'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <h3 className={`font-semibold mb-3 text-sm sm:text-base ${
              candidateStatus.candidate.status === 'approved' ? 'text-green-900' :
              candidateStatus.candidate.status === 'rejected' ? 'text-red-900' :
              'text-yellow-900'
            }`}>
              📋 Application Status
            </h3>
            <div className={`text-xs sm:text-sm ${
              candidateStatus.candidate.status === 'approved' ? 'text-green-800' :
              candidateStatus.candidate.status === 'rejected' ? 'text-red-800' :
              'text-yellow-800'
            }`}>
              <p className="mb-2">
                <span className="font-medium">Status:</span> 
                <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                  candidateStatus.candidate.status === 'approved' ? 'bg-green-200 text-green-800' :
                  candidateStatus.candidate.status === 'rejected' ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {candidateStatus.candidate.status?.toUpperCase()}
                </span>
              </p>
              {candidateStatus.candidate.status === 'rejected' && candidateStatus.candidate.adminComments && (
                <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-200">
                  <p className="font-medium text-red-900 mb-1">Rejection Reason:</p>
                  <p className="text-red-800">{candidateStatus.candidate.adminComments}</p>
                </div>
              )}
              {candidateStatus.candidate.status === 'approved' && (
                <p className="text-green-700">✓ Your application has been approved! You are now a candidate.</p>
              )}
              {candidateStatus.candidate.status === 'pending' && (
                <p className="text-yellow-700">⏳ Your application is pending admin review.</p>
              )}
            </div>
          </ModernCard>
        )}

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
            {success}
          </div>
        )}

        {/* Form - only show if no existing application */}
        {(!candidateStatus || !candidateStatus.isCandidate) && (
          <ModernCard className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                value={user?.registrationNumber || ''}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-sm sm:text-base"
                disabled
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Your registration number (cannot be changed)</p>
            </div>

            {/* Student Details */}
            {studentData && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-blue-900 font-medium mb-3">Student Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <p><span className="text-gray-600">Name:</span> <span className="text-blue-800 font-medium">{studentData.name}</span></p>
                  <p><span className="text-gray-600">Email:</span> <span className="text-blue-800 font-medium">{studentData.email}</span></p>
                  <p><span className="text-gray-600">School:</span> <span className="text-blue-800 font-medium">{studentData.schoolName}</span></p>
                  <p><span className="text-gray-600">Department:</span> <span className="text-blue-800 font-medium">{studentData.departmentName}</span></p>
                  <p><span className="text-gray-600">Year:</span> <span className="text-blue-800 font-medium">{studentData.yearOfStudy}</span></p>
                  <p><span className="text-gray-600">Mean Score:</span> 
                    <span className={`font-bold ml-1 ${
                      studentData.meanScore >= 60 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {studentData.meanScore} {studentData.meanScore >= 60 ? '✓ Eligible' : '✗ Not Eligible'}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !studentData || studentData.meanScore < 60}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md"
            >
              {submitting ? 'Registering...' : 'Register as Delegate Candidate'}
            </button>
          </form>
        </ModernCard>
        )}

        {/* Info Card */}
        <ModernCard className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Requirements</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Minimum mean score of 60 required</li>
            <li>• Must be a registered student</li>
            <li>• Application requires admin approval</li>
            <li>• One candidacy per student</li>
          </ul>
        </ModernCard>
      </div>
    </div>
  );
};