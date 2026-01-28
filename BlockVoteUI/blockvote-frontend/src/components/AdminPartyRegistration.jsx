import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { ModernCard } from './ModernCard';
import { SearchableStudentSelect } from './SearchableStudentSelect';

export const AdminPartyRegistration = () => {
  const [students, setStudents] = useState([]);
  const [parties, setParties] = useState([]);
  const [electedDelegates, setElectedDelegates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const [partyData, setPartyData] = useState({
    name: '',
    slot0: [
      { studentId: '', position: 'Chairperson' },
      { studentId: '', position: 'Vice Chairperson' }
    ],
    slot1: [
      { studentId: '', position: 'Secretary General' },
      { studentId: '', position: 'Gender/Disability Secretary' }
    ],
    slot2: [
      { studentId: '', position: 'Treasurer' },
      { studentId: '', position: 'Sports/Security/Entertainment Secretary' }
    ],
    slot3: { studentId: '', position: 'Town Campus Secretary' }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsData, partiesData, delegatesData] = await Promise.all([
        ApiService.getStudents(),
        ApiService.getParties(),
        ApiService.getElectedDelegates()
      ]);
      
      const eligibleStudents = studentsData.filter(s => s.meanScore >= 60);
      setStudents(eligibleStudents);
      setParties(partiesData);
      
      // Handle different possible structures for delegates data
      let delegates = [];
      if (delegatesData && Array.isArray(delegatesData.delegates)) {
        delegates = delegatesData.delegates;
      } else if (Array.isArray(delegatesData)) {
        delegates = delegatesData;
      }
      
      console.log('Elected delegates:', delegates);
      setElectedDelegates(delegates);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('❌ Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    
    try {
      await ApiService.registerParty(partyData);
      setMessage('✅ Party registered successfully!');
      
      setPartyData({
        name: '',
        slot0: [
          { studentId: '', position: 'Chairperson' },
          { studentId: '', position: 'Vice Chairperson' }
        ],
        slot1: [
          { studentId: '', position: 'Secretary General' },
          { studentId: '', position: 'Gender/Disability Secretary' }
        ],
        slot2: [
          { studentId: '', position: 'Treasurer' },
          { studentId: '', position: 'Sports/Security/Entertainment Secretary' }
        ],
        slot3: { studentId: '', position: 'Town Campus Secretary' }
      });
      
      await loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  // Get all currently selected student IDs to prevent duplicates
  const getSelectedStudentIds = () => {
    const selected = [];
    partyData.slot0.forEach(member => member.studentId && selected.push(member.studentId));
    partyData.slot1.forEach(member => member.studentId && selected.push(member.studentId));
    partyData.slot2.forEach(member => member.studentId && selected.push(member.studentId));
    if (partyData.slot3.studentId) selected.push(partyData.slot3.studentId);
    return selected;
  };

  // Get excluded student IDs (delegates + already in parties + currently selected)
  const getExcludedStudentIds = (currentSlot, currentIndex) => {
    const excluded = [];
    
    // Add elected delegates by registration number since that's what we have
    if (Array.isArray(electedDelegates)) {
      electedDelegates.forEach(delegate => {
        // Find the student ID by registration number
        const student = students.find(s => s.registrationNumber === delegate.registrationNumber);
        if (student) {
          excluded.push(student._id);
        }
      });
    }
    
    // Add students already in other parties
    parties.forEach(party => {
      party.slot0.forEach(member => member.studentId && excluded.push(member.studentId));
      party.slot1.forEach(member => member.studentId && excluded.push(member.studentId));
      party.slot2.forEach(member => member.studentId && excluded.push(member.studentId));
      if (party.slot3.studentId) excluded.push(party.slot3.studentId);
    });
    
    // Add currently selected students (except the current position being edited)
    const currentlySelected = getSelectedStudentIds();
    currentlySelected.forEach((id, idx) => {
      // Don't exclude the current position being edited
      const isCurrentPosition = 
        (currentSlot === 'slot0' && idx < 2 && idx === currentIndex) ||
        (currentSlot === 'slot1' && idx >= 2 && idx < 4 && idx - 2 === currentIndex) ||
        (currentSlot === 'slot2' && idx >= 4 && idx < 6 && idx - 4 === currentIndex) ||
        (currentSlot === 'slot3' && idx === 6);
      
      if (!isCurrentPosition && id) {
        excluded.push(id);
      }
    });
    
    return excluded;
  };

  const updateSlotStudent = (slotName, index, studentId) => {
    if (slotName === 'slot3') {
      setPartyData(prev => ({
        ...prev,
        slot3: { ...prev.slot3, studentId }
      }));
    } else {
      setPartyData(prev => ({
        ...prev,
        [slotName]: prev[slotName].map((item, i) => 
          i === index ? { ...item, studentId } : item
        )
      }));
    }
  };

  if (loading) {
    return (
      <ModernCard className="p-4 sm:p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
        <p className="text-sm sm:text-base text-gray-600">Loading party registration...</p>
      </ModernCard>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-3 sm:p-4 rounded-xl font-medium shadow-lg animate-fade-in ${
          message.includes('✅') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="text-sm sm:text-base">{message}</div>
        </div>
      )}

      {/* Party Registration Form */}
      <ModernCard className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">🏛️ Register New Party</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Party Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Party Name
            </label>
            <input
              type="text"
              value={partyData.name}
              onChange={(e) => setPartyData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 sm:px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
              placeholder="Enter party name"
              required
            />
          </div>

          {/* Slot 0 */}
          <ModernCard className="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">0</div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Leadership Positions</h3>
            </div>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {partyData.slot0.map((member, index) => (
                <div key={index}>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    {member.position}
                  </label>
                  <SearchableStudentSelect
                    students={students}
                    value={member.studentId}
                    onChange={(studentId) => updateSlotStudent('slot0', index, studentId)}
                    placeholder={`Select ${member.position}`}
                    excludeIds={getExcludedStudentIds('slot0', index)}
                    required
                  />
                </div>
              ))}
            </div>
          </ModernCard>

          {/* Slot 1 */}
          <ModernCard className="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">1</div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Administration</h3>
            </div>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {partyData.slot1.map((member, index) => (
                <div key={index}>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    {member.position}
                  </label>
                  <SearchableStudentSelect
                    students={students}
                    value={member.studentId}
                    onChange={(studentId) => updateSlotStudent('slot1', index, studentId)}
                    placeholder={`Select ${member.position}`}
                    excludeIds={getExcludedStudentIds('slot1', index)}
                    required
                  />
                </div>
              ))}
            </div>
          </ModernCard>

          {/* Slot 2 */}
          <ModernCard className="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">2</div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Operations</h3>
            </div>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {partyData.slot2.map((member, index) => (
                <div key={index}>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    {member.position}
                  </label>
                  <SearchableStudentSelect
                    students={students}
                    value={member.studentId}
                    onChange={(studentId) => updateSlotStudent('slot2', index, studentId)}
                    placeholder={`Select ${member.position}`}
                    excludeIds={getExcludedStudentIds('slot2', index)}
                    required
                  />
                </div>
              ))}
            </div>
          </ModernCard>

          {/* Slot 3 */}
          <ModernCard className="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">3</div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Campus Representative</h3>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                {partyData.slot3.position}
              </label>
              <SearchableStudentSelect
                students={students}
                value={partyData.slot3.studentId}
                onChange={(studentId) => updateSlotStudent('slot3', null, studentId)}
                placeholder={`Select ${partyData.slot3.position}`}
                excludeIds={getExcludedStudentIds('slot3', null)}
                required
              />
            </div>
          </ModernCard>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                <span className="text-sm sm:text-base">Registering Party...</span>
              </span>
            ) : (
              '✨ Register Party'
            )}
          </button>
        </form>
      </ModernCard>

      {/* Registered Parties */}
      <ModernCard className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">📋 Registered Parties ({parties.length})</h2>
        
        {parties.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <span className="text-2xl sm:text-3xl">🏛️</span>
            </div>
            <p className="text-sm sm:text-base text-gray-500">No parties registered yet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {parties.map((party, idx) => (
              <ModernCard key={party.id} className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{party.name}</h3>
                </div>
                
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white p-3 sm:p-4 rounded-xl">
                    <h4 className="font-bold text-blue-600 mb-2 text-xs sm:text-sm">Slot 0: Leadership</h4>
                    {party.slot0.map((member, index) => (
                      <p key={index} className="text-xs sm:text-sm text-gray-700 mb-1">
                        <span className="font-medium">{member.position}:</span><br/>
                        <span className="break-words">{member.name}</span>
                      </p>
                    ))}
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-xl">
                    <h4 className="font-bold text-green-600 mb-2 text-xs sm:text-sm">Slot 1: Administration</h4>
                    {party.slot1.map((member, index) => (
                      <p key={index} className="text-xs sm:text-sm text-gray-700 mb-1">
                        <span className="font-medium">{member.position}:</span><br/>
                        <span className="break-words">{member.name}</span>
                      </p>
                    ))}
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-xl">
                    <h4 className="font-bold text-purple-600 mb-2 text-xs sm:text-sm">Slot 2: Operations</h4>
                    {party.slot2.map((member, index) => (
                      <p key={index} className="text-xs sm:text-sm text-gray-700 mb-1">
                        <span className="font-medium">{member.position}:</span><br/>
                        <span className="break-words">{member.name}</span>
                      </p>
                    ))}
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-xl">
                    <h4 className="font-bold text-orange-600 mb-2 text-xs sm:text-sm">Slot 3: Campus</h4>
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-medium">{party.slot3.position}:</span><br/>
                      <span className="break-words">{party.slot3.name}</span>
                    </p>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        )}
      </ModernCard>
    </div>
  );
};