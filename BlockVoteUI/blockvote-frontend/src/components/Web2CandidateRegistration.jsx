import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { ModernCard } from './ModernCard';

export const Web2CandidateRegistration = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegistrationNumberChange = async (regNo) => {
    setRegistrationNumber(regNo);
    setError('');
    setStudentData(null);
    
    if (regNo.trim()) {
      try {
        const student = await ApiService.getStudentByRegistration(regNo);
        setStudentData(student);
      } catch (error) {
        setError('Student not found');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      await ApiService.registerDelegateCandidate({
        registrationNumber,
        manifesto: ''
      });
      
      setSuccess('Candidate registration successful! Your application is pending admin approval.');
      setRegistrationNumber('');
      setStudentData(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <ModernCard className="p-6">
          <h2 className="text-3xl font-bold gradient-text mb-2">📝 Delegate Candidate Registration</h2>
          <p className="text-gray-600">Register to become a delegate candidate for your department</p>
        </ModernCard>

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

        {/* Form */}
        <ModernCard className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => handleRegistrationNumberChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your registration number"
                required
              />
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