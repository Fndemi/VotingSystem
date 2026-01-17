const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setAuthToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getAuthHeaders() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...this.getAuthHeaders()
      }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  }

  async post(endpoint, data) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('POST request to:', url);
    console.log('Request data:', data);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(data),
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check if the backend server is running.');
      }
      
      const result = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', result);
      
      if (!response.ok) {
        const error = new Error(result.message || result.error || `HTTP error! status: ${response.status}`);
        error.redirectToRegister = result.redirectToRegister;
        throw error;
      }
      
      return result;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:5000');
      }
      throw error;
    }
  }

  async patch(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Authentication
  async web2Login(registrationNumber, password) {
    return this.post('/auth/web2-login', { registrationNumber, password });
  }

  async changePassword(currentPassword, newPassword) {
    return this.post('/auth/change-password', { currentPassword, newPassword });
  }

  logout() {
    this.setAuthToken(null);
  }

  // Schools
  async getSchools() {
    return this.get('/schools');
  }

  async createSchool(name) {
    return this.post('/schools', { name });
  }

  // Departments
  async getDepartments() {
    return this.get('/departments');
  }

  async getDepartmentsBySchool(schoolId) {
    return this.get(`/departments/school/${schoolId}`);
  }

  async createDepartment(name, code, schoolId) {
    return this.post('/departments', { name, code, schoolId });
  }

  // Students
  async registerStudent(studentData) {
    return this.post('/students/register', studentData);
  }

  async getStudents() {
    return this.get('/students');
  }

  async getRegistrationNumbers() {
    return this.get('/students/registration-numbers');
  }

  async searchStudents(query, limit = 10) {
    return this.get(`/students/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async setupPassword(registrationNumber, password) {
    return this.post('/students/setup-password', { registrationNumber, password });
  }

  async getStudentsByDepartment(departmentId) {
    return this.get(`/students/department/${departmentId}`);
  }

  async getStudentsBySchool(schoolId) {
    return this.get(`/students/school/${schoolId}`);
  }

  async getStudentByRegistration(regNo) {
    // URL encode the registration number to handle forward slashes
    const encodedRegNo = encodeURIComponent(regNo);
    return this.get(`/students/registration/${encodedRegNo}`);
  }

  async updateStudentWallet(studentId, walletAddress) {
    return this.patch(`/students/${studentId}/wallet`, { walletAddress });
  }

  async rollbackStudentWallet(studentId) {
    return this.patch(`/rollback/student/${studentId}/wallet`, {});
  }

  // Phases
  async getCurrentPhase() {
    return this.get('/phases/current');
  }

  async setPhase(phaseNumber) {
    return this.post('/phases/set', { phaseNumber });
  }

  async nextPhase() {
    return this.post('/phases/next');
  }

  // Candidates
  async getCandidates() {
    return this.get('/candidates');
  }

  async getCandidatesByPosition(position) {
    return this.get(`/candidates/position/${position}`);
  }

  async registerCandidate(candidateData) {
    return this.post('/candidates/register', candidateData);
  }

  async getCandidateStatus(registrationNumber) {
    return this.get(`/candidates/status/${registrationNumber}`);
  }

  // Delegate candidates (Web2)
  async getDelegateCandidateStatus(registrationNumber) {
    return this.get(`/delegate-candidates/status/${registrationNumber}`);
  }

  async registerDelegateCandidate(data) {
    return this.post('/delegate-candidates/register', data);
  }

  async getDelegateCandidatesByDepartment(schoolId, departmentId) {
    return this.get(`/delegate-candidates/department/${schoolId}/${departmentId}`);
  }

  // Admin: Review candidate applications
  async getPendingApplications() {
    return this.get('/delegate-candidates/pending');
  }

  async reviewApplication(applicationId, status, adminComments, adminId = 'admin') {
    return this.patch(`/delegate-candidates/${applicationId}/review`, {
      status,
      adminComments,
      adminId,
    });
  }

  // Delegate voting (Web2 with authentication)
  async getDelegateVotingStatus() {
    return this.get('/delegate-voting/status');
  }

  async castDelegateVote(candidateId) {
    return this.post('/delegate-voting/vote', { candidateId });
  }

  async getMyDepartmentDelegateResult() {
    return this.get('/delegate-voting/my-department-result');
  }

  async getAllElectedDelegates() {
    return this.get('/delegate-voting/results');
  }

  // Voting
  async castVote(voterWallet, candidateId, position, signature) {
    return this.post('/voting/cast', {
      voterWallet,
      candidateId,
      position,
      signature
    });
  }

  async getResults() {
    return this.get('/voting/results');
  }

  async checkVoted(wallet, position) {
    return this.get(`/voting/check/${wallet}/${position}`);
  }

  // Parties
  async getParties() {
    return this.get('/parties');
  }

  async registerParty(partyData) {
    return this.post('/parties/register', partyData);
  }

  async getParty(partyId) {
    return this.get(`/parties/${partyId}`);
  }

  // Council Voting
  async getCouncilVotingStatus() {
    return this.get('/council-voting/status');
  }

  async castCouncilVotes(votes) {
    return this.post('/council-voting/vote', { votes });
  }

  async getCouncilResults() {
    return this.get('/council-voting/results');
  }

  // Admin Actions
  async resetElection() {
    return this.post('/admin/reset-election');
  }
}

export default new ApiService();