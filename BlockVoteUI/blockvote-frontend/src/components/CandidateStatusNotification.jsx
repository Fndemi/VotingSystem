import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { ModernCard } from './ModernCard';

export const CandidateStatusNotification = ({ user }) => {
  const [candidateStatus, setCandidateStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkCandidateStatus(user.registrationNumber);
    }
  }, [user]);

  const checkCandidateStatus = async (regNo) => {
    try {
      console.log('Checking candidate status for:', regNo);
      const status = await ApiService.getDelegateCandidateStatus(regNo);
      console.log('Raw API response:', JSON.stringify(status, null, 2));
      console.log('Candidate status response:', status);
      
      // Additional debugging
      if (status && status.candidate) {
        console.log('Candidate status field:', status.candidate.status);
        console.log('Candidate adminComments field:', status.candidate.adminComments);
        console.log('Type of status:', typeof status.candidate.status);
        console.log('Type of adminComments:', typeof status.candidate.adminComments);
      }
      
      setCandidateStatus(status);
    } catch (error) {
      console.log('No candidate application found for:', regNo);
      console.error('Error details:', error);
      setCandidateStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Add a refresh function that can be called externally
  const refreshStatus = () => {
    if (user) {
      setLoading(true);
      checkCandidateStatus(user.registrationNumber);
    }
  };

  // Expose refresh function globally for debugging
  React.useEffect(() => {
    window.refreshCandidateStatus = refreshStatus;
    return () => {
      delete window.refreshCandidateStatus;
    };
  }, [user]);

  if (loading) return null;
  if (!candidateStatus || !candidateStatus.isCandidate) return null;

  console.log('Rendering candidate status:', candidateStatus);
  console.log('Candidate object:', candidateStatus.candidate);
  console.log('Status value:', candidateStatus.candidate?.status);
  console.log('Admin comments:', candidateStatus.candidate?.adminComments);

  return (
    <ModernCard className={`p-4 mb-6 ${
      candidateStatus.candidate?.status === 'approved' ? 'bg-green-50 border-green-200' :
      candidateStatus.candidate?.status === 'rejected' ? 'bg-red-50 border-red-200' :
      'bg-yellow-50 border-yellow-200'
    }`}>
      <h3 className={`font-semibold mb-2 text-sm ${
        candidateStatus.candidate?.status === 'approved' ? 'text-green-900' :
        candidateStatus.candidate?.status === 'rejected' ? 'text-red-900' :
        'text-yellow-900'
      }`}>
        📋 Delegate Candidate Status
      </h3>
      <div className={`text-xs ${
        candidateStatus.candidate?.status === 'approved' ? 'text-green-800' :
        candidateStatus.candidate?.status === 'rejected' ? 'text-red-800' :
        'text-yellow-800'
      }`}>
        <p className="mb-2">
          <span className="font-medium">Status:</span> 
          <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
            candidateStatus.candidate?.status === 'approved' ? 'bg-green-200 text-green-800' :
            candidateStatus.candidate?.status === 'rejected' ? 'bg-red-200 text-red-800' :
            'bg-yellow-200 text-yellow-800'
          }`}>
            {candidateStatus.candidate?.status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </p>
        {candidateStatus.candidate?.status === 'rejected' && (
          <div className="mt-2 p-2 bg-red-100 rounded border border-red-200">
            <p className="font-medium text-red-900 mb-1">Rejection Reason:</p>
            <p className="text-red-800">
              {candidateStatus.candidate?.adminComments || 'No reason provided'}
            </p>
          </div>
        )}
        {candidateStatus.candidate?.status === 'approved' && (
          <p className="text-green-700">✓ You are an approved delegate candidate.</p>
        )}
        {candidateStatus.candidate?.status === 'pending' && (
          <p className="text-yellow-700">⏳ Your application is pending admin review.</p>
        )}
      </div>
    </ModernCard>
  );
};