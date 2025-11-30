<template>
  <aside class="w-64 bg-gray-50 p-5 border-r border-gray-200 flex flex-col gap-4 h-full overflow-y-auto">

    <h2 class="text-2xl font-bold text-[#0A2463] border-b-2 border-[#00FFC5] pb-1">
      Minhas Rotinas
    </h2>

    <button 
      class="bg-[#00FFC5] text-[#0A2463] p-2 rounded-lg font-bold text-base hover:bg-opacity-80 transition duration-300 shadow-md"
      @click="$emit('add-routine-clicked')"
    >
      + Adicionar Rotina
    </button>

    <div v-if="isLoading" class="text-center text-[#0A2463] py-4 text-lg font-semibold">
      <i class="fa-solid fa-spinner fa-spin mr-2"></i> Carregando...
    </div>

    <div v-if="apiError" class="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
      {{ apiError }}
    </div>

      <div v-if="!isLoading && !apiError" class="space-y-3 flex-grow mt-4">
      
      <router-link 
        v-for="routine in routines" 
        :key="routine.id"
        :to="`/routine/${routine.id}`"
        class="block w-full text-left p-3 bg-white border border-[#0A2463] text-[#0A2463] rounded-lg font-semibold transition duration-200 shadow-sm"
        :class="{
          'hover:bg-[#00FFC5] hover:border-[#00FFC5] hover:text-[#0A2463]': true
        }"
      >
        <i class="fa-solid fa-clipboard-list mr-2"></i> 
        {{ routine.name }}
      </router-link>

      <p
        v-if="routines.length === 0"
        class="text-center text-gray-500 italic text-sm pt-4"
      >
        Nenhuma rotina criada.
      </p>

    </div>

  </aside>
</template>

<script>
import apiService from '@/services/api.js';

export default {
  name: 'RoutineAside',
  emits: ['add-routine-clicked'],

  data() {
    return {
      routines: [],
      isLoading: false,
      apiError: null
    };
  },

  created() {
    this.fetchRoutines();
  },

  methods: {
    async fetchRoutines() {
      this.isLoading = true;
      this.apiError = null;

      try {
        const response = await apiService.getMyRoutines();

        this.routines = Array.isArray(response.data) ? response.data : [];

      } catch (error) {
        console.error("Erro ao buscar rotinas:", error);

        this.apiError = "Não foi possível carregar suas rotinas.";

        if (error?.response?.status === 401) {
          this.$router.push('/login');
        }

      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
</style>