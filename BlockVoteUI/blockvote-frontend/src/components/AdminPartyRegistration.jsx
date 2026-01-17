import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { ModernCard } from './ModernCard';

export const AdminPartyRegistration = () => {
  const [students, setStudents] = useState([]);
  const [parties, setParties] = useState([]);
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
      const [studentsData, partiesData] = await Promise.all([
        ApiService.getStudents(),
        ApiService.getParties()
      ]);
      
      const eligibleStudents = studentsData.filter(s => s.meanScore >= 60);
      setStudents(eligibleStudents);
      setParties(partiesData);
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
      <ModernCard className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading party registration...</p>
      </ModernCard>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Party Registration Form */}
      <ModernCard className="p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🏛️ Register New Party</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Party Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Party Name
            </label>
            <input
              type="text"
              value={partyData.name}
              onChange={(e) => setPartyData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter party name"
              required
            />
          </div>

          {/* Slot 0 */}
          <ModernCard className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold">0</div>
              <h3 className="text-lg font-bold text-gray-900">Leadership Positions</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {partyData.slot0.map((member, index) => (
                <div key={index}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {member.position}
                  </label>
                  <select
                    value={member.studentId}
                    onChange={(e) => updateSlotStudent('slot0', index, e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select {member.position}</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.meanScore})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </ModernCard>

          {/* Slot 1 */}
          <ModernCard className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-lg font-bold text-gray-900">Administration</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {partyData.slot1.map((member, index) => (
                <div key={index}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {member.position}
                  </label>
                  <select
                    value={member.studentId}
                    onChange={(e) => updateSlotStudent('slot1', index, e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-green-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select {member.position}</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.meanScore})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </ModernCard>

          {/* Slot 2 */}
          <ModernCard className="p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-lg font-bold text-gray-900">Operations</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {partyData.slot2.map((member, index) => (
                <div key={index}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {member.position}
                  </label>
                  <select
                    value={member.studentId}
                    onChange={(e) => updateSlotStudent('slot2', index, e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select {member.position}</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.meanScore})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </ModernCard>

          {/* Slot 3 */}
          <ModernCard className="p-4 lg:p-6 bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-lg font-bold text-gray-900">Campus Representative</h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {partyData.slot3.position}
              </label>
              <select
                value={partyData.slot3.studentId}
                onChange={(e) => updateSlotStudent('slot3', null, e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-orange-500 focus:outline-none transition-colors"
                required
              >
                <option value="">Select {partyData.slot3.position}</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.meanScore})
                  </option>
                ))}
              </select>
            </div>
          </ModernCard>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Registering Party...
              </span>
            ) : (
              '✨ Register Party'
            )}
          </button>
        </form>
      </ModernCard>

      {/* Registered Parties */}
      <ModernCard className="p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Registered Parties ({parties.length})</h2>
        
        {parties.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🏛️</span>
            </div>
            <p className="text-gray-500">No parties registered yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {parties.map((party, idx) => (
              <ModernCard key={party.id} className="p-6 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{party.name}</h3>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl">
                    <h4 className="font-bold text-blue-600 mb-2 text-sm">Slot 0: Leadership</h4>
                    {party.slot0.map((member, index) => (
                      <p key={index} className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">{member.position}:</span><br/>
                        {member.name}
                      </p>
                    ))}
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl">
                    <h4 className="font-bold text-green-600 mb-2 text-sm">Slot 1: Administration</h4>
                    {party.slot1.map((member, index) => (
                      <p key={index} className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">{member.position}:</span><br/>
                        {member.name}
                      </p>
                    ))}
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl">
                    <h4 className="font-bold text-purple-600 mb-2 text-sm">Slot 2: Operations</h4>
                    {party.slot2.map((member, index) => (
                      <p key={index} className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">{member.position}:</span><br/>
                        {member.name}
                      </p>
                    ))}
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl">
                    <h4 className="font-bold text-orange-600 mb-2 text-sm">Slot 3: Campus</h4>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{party.slot3.position}:</span><br/>
                      {party.slot3.name}
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