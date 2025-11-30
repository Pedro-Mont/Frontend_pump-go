import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7116/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user-token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

export default {
  createRoutine(routineDto) {
    return apiClient.post('/Routine', routineDto);
  },
  getMyRoutines() {
    return apiClient.get('/Routine/minhas');
  },
  getDetailedRoutine(id) {
    return apiClient.get(`/Routine/${id}`); 
  },
  deleteRotina(id) {
    return apiClient.delete(`/Routine/${id}`)
  },
  getPublicRoutines() {
    return apiClient.get('/Routine/forum');
  },
  getRoutineById(id) {
    return apiClient.get(`/Routine/${id}`);
  },
  getDetailedExercise(id){
    return apiClient.get(`/Exercise/${id}`);
  },
  getAllExercises(pageNumber = 1, pageSize = 6) {
    return apiClient.get('/Exercise', {params: { pageNumber, pageSize }});
  },
  getAllMuscleGroup() {
    return apiClient.get('/Exercise/grupos-musculares');
  },
  register(registerDto) {
    return apiClient.post('/User/registrar', registerDto);
  },
  login(loginDto) {
    return apiClient.post('/User/login', loginDto);
  },
  getMySignature() {
    return apiClient.get('/Signature/minha-assinatura');
  },
  upgradeSignature(planName) {
    return apiClient.post('/Signature/upgrade', { planName: planName });
  },
  getConversationMessages(conversationId) {
    return apiClient.get(`/Conversation/${conversationId}/mensagens`)
  },
  getProfessional(specialty) {
    return apiClient.get('/professional', {params: { specialty }});
  },
  startConversation(professionalId) {
    return apiClient.post(`/Conversation/iniciar/${professionalId}`);
  },
  sendMessage(messageDto) {
    return apiClient.post('/Conversation/enviar-mensagem', messageDto);
  },
  updateRoutine(id, routineDto) {
    return apiClient.put(`/Routine/${id}`, routineDto);
  },
};