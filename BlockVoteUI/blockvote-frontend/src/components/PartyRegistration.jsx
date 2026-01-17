import React from 'react';

// This component is for admin use only - shown in Admin dashboard
// Regular users see a message that admin is registering parties
export const PartyRegistration = () => {
  return (
    <div className="p-4 sm:p-8 text-center bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">🏛️ Party Registration Phase</h2>
      <p className="text-gray-300 mb-4 text-sm sm:text-base">
        The admin is currently registering parties with their nominees.
      </p>
      <p className="text-yellow-400 text-sm sm:text-base">
        Please check back when council voting begins.
      </p>
    </div>
  );
};

