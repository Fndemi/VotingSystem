import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const PhaseIndicator = () => {
  const [currentPhase, setCurrentPhase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhase = async () => {
      try {
        const data = await apiService.get('/phases/current');
        setCurrentPhase(data);
      } catch (error) {
        console.error('Error fetching phase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhase();
    // Poll every 30 seconds for phase updates
    const interval = setInterval(fetchPhase, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-3 sm:p-4 text-center bg-gray-700 text-white shadow-inner">
      <h2 className="text-base sm:text-lg font-medium">
        Current Phase:{" "}
        {isLoading ? (
          <span className="font-bold text-yellow-400">Loading...</span>
        ) : (
          <span className="font-bold text-green-400">
            {currentPhase?.phaseName || 'Unknown Phase'}
          </span>
        )}
      </h2>
      {currentPhase?.web2Note && (
        <p className="text-xs sm:text-sm text-yellow-300 mt-1">
          ⚠️ {currentPhase.web2Note}
        </p>
      )}
    </div>
  );
};