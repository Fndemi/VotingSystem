export const PHASES = {
  SETUP: 0,
  CANDIDATE_REGISTRATION: 1,
  DELEGATE_VOTING: 2,
  NOMINEE_REGISTRATION: 3,
  PARTY_REGISTRATION: 4,
  COUNCIL_VOTING: 5,
  ENDED: 6
};

export const PHASE_NAMES = {
  [PHASES.SETUP]: 'Setup',
  [PHASES.CANDIDATE_REGISTRATION]: 'Candidate Registration',
  [PHASES.DELEGATE_VOTING]: 'Delegate Voting',
  [PHASES.NOMINEE_REGISTRATION]: 'Nominee Registration (Skipped in Web2)',
  [PHASES.PARTY_REGISTRATION]: 'Party Registration',
  [PHASES.COUNCIL_VOTING]: 'Council Voting',
  [PHASES.ENDED]: 'Ended'
};

export const isPhaseSkipped = (phase) => phase === PHASES.NOMINEE_REGISTRATION;

export const getPhaseColor = (phase) => {
  const colors = {
    [PHASES.SETUP]: 'bg-gray-500',
    [PHASES.CANDIDATE_REGISTRATION]: 'bg-blue-500',
    [PHASES.DELEGATE_VOTING]: 'bg-green-500',
    [PHASES.NOMINEE_REGISTRATION]: 'bg-gray-700', // Dimmed for skipped phase
    [PHASES.PARTY_REGISTRATION]: 'bg-indigo-500',
    [PHASES.COUNCIL_VOTING]: 'bg-orange-500',
    [PHASES.ENDED]: 'bg-red-500'
  };
  return colors[phase] || 'bg-gray-500';
};

export const canAdvancePhase = (currentPhase) => {
  return currentPhase < PHASES.ENDED;
};