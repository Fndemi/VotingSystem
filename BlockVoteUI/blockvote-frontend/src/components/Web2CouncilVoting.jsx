import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { ModernCard } from './ModernCard';

export const Web2CouncilVoting = ({ user }) => {
  const [parties, setParties] = useState([]);
  const [votingStatus, setVotingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedParties, setSelectedParties] = useState({
    0: '', // Slot 0: Chairperson & Vice
    1: '', // Slot 1: Secretary General & Gender/Disability
    2: '', // Slot 2: Treasurer & Sports
    3: ''  // Slot 3: Town Campus
  });

  const slotNames = [
    'Chairperson & Vice Chairperson',
    'Secretary General & Gender/Disability Secretary', 
    'Treasurer & Sports Secretary',
    'Town Campus Secretary'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [partiesData, statusData] = await Promise.all([
        ApiService.getParties(),
        ApiService.getCouncilVotingStatus()
      ]);
      
      console.log('Loaded parties:', partiesData);
      partiesData.forEach(p => console.log('Party:', p.name, 'ID:', p.id));
      console.log('Voting status:', statusData);
      
      setParties(partiesData);
      setVotingStatus(statusData);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('❌ Failed to load voting data');
    } finally {
      setLoading(false);
    }
  };

  const handlePartySelection = (slotId, partyId) => {
    console.log('Selecting:', { slotId, partyId });
    setSelectedParties(prev => {
      const newState = {
        ...prev,
        [slotId]: prev[slotId] === partyId ? '' : partyId
      };
      console.log('New selection state:', newState);
      return newState;
    });
  };

  const getSelectedSlotsCount = () => {
    return Object.values(selectedParties).filter(partyId => partyId !== '').length;
  };

  const handleSubmitVotes = async () => {
    const selectedCount = getSelectedSlotsCount();
    if (selectedCount !== 4) {
      setMessage('❌ You must select a party for all 4 slots');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const votes = Object.entries(selectedParties)
      .map(([slotId, partyId]) => ({ slotId: parseInt(slotId), partyId }));

    console.log('=== VOTE SUBMISSION DEBUG ===');
    console.log('Selected parties state:', selectedParties);
    console.log('Votes to submit:', votes);
    console.log('Party IDs:', votes.map(v => v.partyId));
    console.log('Available parties:', parties.map(p => ({ id: p.id, name: p.name })));

    setSubmitting(true);
    setMessage('');

    try {
      const result = await ApiService.castCouncilVotes(votes);
      console.log('Vote result:', result);
      setMessage('✅ Votes cast successfully!');
      await loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Vote submission error:', error);
      console.error('Error details:', error.message);
      setMessage(`❌ ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ModernCard className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading council voting...</p>
      </ModernCard>
    );
  }

  if (!votingStatus?.isDelegate) {
    return (
      <ModernCard className="p-8 text-center border-2 border-red-300">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">🚫</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Delegate Access Required</h2>
        <p className="text-gray-600 mb-2">
          Only elected delegates can vote in the council voting phase.
        </p>
      </ModernCard>
    );
  }

  const hasVoted = votingStatus?.hasVoted;
  const selectedCount = getSelectedSlotsCount();
  const remainingSlots = 4 - selectedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <ModernCard className="p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🏛️ Council Voting</h2>
          <p className="text-gray-600 mb-4">
            Select one party for each of the 4 slots
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
            <span className="text-green-600 font-semibold">✓ Verified Delegate</span>
          </div>
        </div>
      </ModernCard>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl font-medium shadow-lg animate-fade-in ${
          message.includes('✅') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Voting Complete */}
      {hasVoted && (
        <ModernCard className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-2xl flex items-center justify-center">
              <span className="text-3xl text-white">✓</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Votes Cast!</h3>
            <p className="text-gray-600 mb-4">You selected parties for {selectedCount} slots:</p>
            <div className="space-y-2">
              {votingStatus.votes.map((vote, idx) => (
                <p key={idx} className="text-gray-700">
                  <span className="font-semibold">{slotNames[vote.slotId]}:</span> {vote.partyName}
                </p>
              ))}
            </div>
          </div>
        </ModernCard>
      )}

      {/* Party-based Selection */}
      {!hasVoted && (
        <>
          <ModernCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Select One Party Per Slot</h3>
              <div className={`px-4 py-2 rounded-full font-semibold ${
                remainingSlots === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {remainingSlots} slots remaining
              </div>
            </div>
            
            <div className="space-y-6">
              {parties.map(party => (
                <div key={party.id} className="p-4 border-2 border-gray-200 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">{party.name}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {slotNames.map((slotName, slotId) => {
                      const slotNominees = party[`slot${slotId}`];
                      const isSelected = selectedParties[slotId] === party.id;
                      
                      return (
                        <div
                          key={`${party.id}-${slotId}`}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => handlePartySelection(slotId, party.id)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              isSelected ? 'border-green-500 bg-green-500' : 'border-gray-400'
                            }`}></div>
                            <span className="font-medium text-sm">Slot {slotId}</span>
                          </div>
                          
                          <h5 className="font-semibold text-sm mb-2">{slotName}</h5>
                          
                          <div className="text-xs text-gray-600">
                            {Array.isArray(slotNominees) ? (
                              slotNominees.map((nominee, idx) => (
                                <p key={`${party.id}-${slotId}-${idx}`}>• {nominee.position}: {nominee.name}</p>
                              ))
                            ) : slotNominees ? (
                              <p key={`${party.id}-${slotId}-single`}>• {slotNominees.position}: {slotNominees.name}</p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>

          <ModernCard className="p-6">
            <button
              onClick={handleSubmitVotes}
              disabled={selectedCount !== 4 || submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {submitting ? 'Casting Votes...' : `Cast Votes for ${selectedCount}/4 Slots`}
            </button>
          </ModernCard>
        </>
      )}
    </div>
  );
};
