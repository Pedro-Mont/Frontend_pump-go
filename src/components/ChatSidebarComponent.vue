<template>
  <aside
    class="w-64 bg-[#0A2463] h-full flex flex-col p-4 shadow-xl flex-shrink-0 overflow-y-auto"
  >
    <h3 class="text-sm font-semibold text-[#00FFC5] mb-4 pl-1">
      MINHAS CONVERSAS
    </h3>

    <div v-if="isLoading" class="text-center text-white py-4">
      <i class="fa-solid fa-spinner fa-spin mr-2"></i>
    </div>

    <div v-if="apiError" class="p-2 bg-red-100 text-red-700 rounded-lg text-sm">
      {{ apiError }}
    </div>

    <div class="mb-4" v-if="!isLoading && !apiError">
      <button
        class="flex items-center w-full p-3 rounded-lg text-white bg-transparent hover:bg-[#00FFC5]/20 transition duration-300"
      >
        <i class="fas fa-dumbbell text-[#00FFC5] text-2xl mr-4 flex-shrink-0"></i>
        <span class="text-white font-semibold">Personal Trainers</span>
      </button>

      <div class="mt-2 space-y-1 pl-3">
        <a
          v-for="pro in personals"
          :key="pro.id"
          @click.prevent="$emit('select-professional', pro)"
          href="#"
          class="block text-sm text-gray-300 font-bold hover:text-white transition duration-200"
        >
          • {{ pro.name }}
        </a>

        <p
          v-if="personals.length === 0"
          class="text-sm text-gray-500 italic"
        >
          Nenhum personal encontrado.
        </p>
      </div>
    </div>

    <div class="border-t border-gray-700 my-4" v-if="userPlan === 'ULTRA'"></div>

    <div v-if="normalizedPlan === 'ULTRA' && !isLoading && !apiError">
      <button
        class="flex items-center w-full p-3 rounded-lg text-white bg-transparent hover:bg-[#00FFC5]/20 transition duration-300"
      >
        <span class="text-2xl mr-4 flex-shrink-0">🍅</span>
        <span class="text-white font-semibold">Nutricionistas</span>
      </button>

      <div class="mt-2 space-y-1 pl-3">
        <a
          v-for="nutri in nutricionistas"
          :key="nutri.id"
          @click.prevent="$emit('select-professional', nutri)"
          href="#"
          class="block text-sm text-gray-300 hover:text-white font-bold transition duration-200"
        >
          • {{ nutri.name }}
        </a>

        <p
          v-if="nutricionistas.length === 0"
          class="text-sm text-gray-500 italic"
        >
          Nenhum nutricionista encontrado.
        </p>
      </div>
    </div>
  </aside>
</template>

<script>
import apiService from '@/services/api.js';

export default {
  name: "ChatSidebarComponent",
  emits: ["select-professional"],
  props: {
    userPlan: {
      type: String,
      default: 'BAv-ifSICO'
    }
  },
  data() {
    return {
      personals: [],
      nutricionistas: [],
      isLoading: false,
      apiError: null,
      normalizedPlan: 'BASICO'
    }
  },
  watch: {
    userPlan: {
      immediate: true, 
      handler(newVal) {
        console.log("ChatSidebar recebeu plano:", newVal);
        this.normalizedPlan = (newVal || 'BASICO').toUpperCase().trim();
        this.fetchProfessionals();
      }
    }
  },
  methods: {
    async fetchProfessionals() {
      this.isLoading = true;
      this.apiError = null;
      try {
        this.personals = [];
        this.nutricionistas = [];
        
        const personalResponse = await apiService.getProfessional('Personal');
        this.personals = personalResponse.data;

        console.log("Plano Normalizado:", this.normalizedPlan); 

        if (this.normalizedPlan === 'ULTRA') {
          console.log("Buscando nutricionistas...");
          const nutriResponse = await apiService.getProfessional('Nutricionista');
          this.nutricionistas = nutriResponse.data;
        }

      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
        this.apiError = "Erro ao carregar listas.";
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
