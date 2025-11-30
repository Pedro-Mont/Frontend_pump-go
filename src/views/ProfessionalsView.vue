<template>
  <div class="min-h-screen flex flex-col bg-white text-[#333333] h-screen overflow-hidden">
    <HeaderComponent class="flex-shrink-0" />

    <div class="flex flex-row w-full flex-grow overflow-hidden min-h-0">
      
      <ChatSidebarComponent
        v-if="canAccessChat"
        :user-plan="userPlan"
        @select-professional="selectProfessional"
        class="w-64 flex-shrink-0 h-full overflow-y-auto border-r border-gray-200"
      />

      <main class="flex-grow h-full overflow-hidden">
        
        <div v-if="canAccessChat" class="flex flex-col h-full">
          
          <div v-if="selectedProfessional" class="flex flex-col h-full">

            <div class="bg-gray-100 p-4 border-b border-gray-200 shadow-sm flex items-center justify-between flex-shrink-0">
              <h2 class="text-xl font-bold text-[#0A2463]">
                Conversando com: {{ selectedProfessional.name }}
              </h2>
              <span class="text-sm text-green-500">
                <i class="fas fa-circle text-xs mr-1"></i> Online
              </span>
            </div>

            <div
              ref="messagesContainer"
              class="flex-grow overflow-y-auto p-6 space-y-4"
            >
              <div v-if="isLoadingMessages" class="text-center text-gray-500">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i> Carregando histórico...
              </div>
              
              <div
                v-for="message in messages"
                :key="message.id"
                class="flex"
                :class="{ 'justify-end': message.sender === 'user' }"
              >
                <div
                  class="max-w-xs lg:max-w-md p-3 rounded-xl shadow-md text-sm"
                  :class="{
                    'bg-[#00FFC5] text-[#0A2463]': message.sender === 'user',
                    'bg-gray-200 text-[#0A2463]': message.sender === 'professional'
                  }"
                >
                  <p>{{ message.text }}</p>
                  <span
                    class="block text-right text-xs mt-1"
                    :class="{
                      'text-gray-700': message.sender === 'user',
                      'text-gray-500': message.sender === 'professional'
                    }"
                  >
                    {{ message.time }}
                  </span>
                </div>
              </div>
            </div>

            <form
              @submit.prevent="sendMessage"
              class="p-4 border-t border-gray-200 flex flex-shrink-0"
            >
              <input
                type="text"
                v-model="newMessage"
                placeholder="Escreva sua mensagem..."
                class="flex-grow p-3 border border-black-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC5]"
                :disabled="isSendingMessage"
              />
              <button
                type="submit"
                class="px-6 py-3 bg-[#0A2463] text-white font-bold rounded-r-lg hover:bg-opacity-90 transition duration-300 disabled:bg-gray-400"
                :disabled="isSendingMessage"
              >
                <span v-if="isSendingMessage">...</span>
                <span v-else>Enviar</span>
              </button>
            </form>
          </div>

          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center p-8 bg-gray-100 rounded-lg border border-gray-300">
              <h1 class="text-3xl font-bold text-[#0A2463] mb-4">Chat Premium</h1>
              <p class="text-gray-500 text-lg">
                Selecione um profissional ao lado para iniciar a conversa.
              </p>
            </div>
          </div>

        </div>
        
        <div v-else class="h-full">
          <UpgradeCTAComponent />
        </div>

      </main>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "../components/HeaderComponent.vue";
import UpgradeCTAComponent from "../components/UpgradeCTAComponent.vue";
import ChatSidebarComponent from "../components/ChatSidebarComponent.vue";
import apiService from '@/services/api.js';

export default {
  name: "ProfessionalsView",
  components: {
    HeaderComponent,
    UpgradeCTAComponent,
    ChatSidebarComponent,
  },
  data() {
    return {
      canAccessChat: false,
      isLoadingPlan: true,
      userPlan: 'BÁSICO',
      selectedProfessional: null,
      selectedConversationId: null,
      newMessage: "",
      messages: [],
      isLoadingMessages: false,
      isSendingMessage: false,
    };
  },
  created() {
    this.checkUserAccess();
  },
  methods: {
    async checkUserAccess() {
      this.isLoadingPlan = true;
      try {
        const response = await apiService.getMySignature();
        const plan = response.data?.planName;
        
        if (plan) {
            const planUpper = plan.toUpperCase().trim();
            this.userPlan = planUpper;
            this.canAccessChat = (planUpper === "PRO" || planUpper === "ULTRA");
        } else {
            this.canAccessChat = false;
            this.userPlan = 'BÁSICO';
        }
      } catch (error) {
        console.error("Erro plano:", error);
        this.canAccessChat = false;
        if(error.response && error.response.status === 401) {
            this.$router.push('/login');
        }
      } finally {
        this.isLoadingPlan = false;
      }
    },

    async selectProfessional(professional) {
      this.selectedProfessional = professional;
      this.isLoadingMessages = true;
      this.messages = [];

      try {
        const conversaResponse = await apiService.startConversation(professional.id);
        this.selectedConversationId = conversaResponse.data.id;
        this.messages = this.mapMessages(conversaResponse.data.messages);
      } catch (error) {
        console.error("Erro chat:", error);
        alert("Não foi possível iniciar o chat.");
        this.selectedProfessional = null;
      } finally {
        this.isLoadingMessages = false;
        this.scrollToBottom();
      }
    },

    async sendMessage() {
      if (!this.newMessage.trim() || !this.selectedConversationId || this.isSendingMessage) return;

      this.isSendingMessage = true;
      const userMessageText = this.newMessage.trim();
      this.newMessage = "";

      try {
        const messageDto = {
          conversationId: this.selectedConversationId,
          content: userMessageText,
        };

        await apiService.sendMessage(messageDto);

        const msgResponse = await apiService.getConversationMessages(this.selectedConversationId);
        this.messages = this.mapMessages(msgResponse.data);
      } catch (error) {
        console.error("Erro envio:", error);
        alert("Não foi possível enviar a sua mensagem.");
        this.newMessage = userMessageText;
      } finally {
        this.isSendingMessage = false;
        this.scrollToBottom();
      }
    },

    mapMessages(apiMessages) {
      if (!apiMessages) return [];
      
      return apiMessages.map(msg => ({
        id: msg.id,
        sender: (msg.senderName && msg.senderName.includes("Profissional")) ? 'professional' : 'user',
        text: msg.content, 
        time: new Date(msg.sentDate).toLocaleTimeString().substring(0, 5)
      }));
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) container.scrollTop = container.scrollHeight;
      });
    }
  },
};
</script>