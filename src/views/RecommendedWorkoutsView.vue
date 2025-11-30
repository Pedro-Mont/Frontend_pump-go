<template>
  <div class="min-h-screen bg-white text-[#333333] flex flex-col">
    <HeaderComponent />

    <div class="flex flex-row w-full flex-grow h-full overflow-hidden">
      <RoutineAsideComponent class="flex-shrink-0 h-full overflow-hidden" style="width: 250px" />

      <main class="flex-grow p-8 flex flex-col gap-10 overflow-y-auto">
        <section>
          <h2 class="text-3xl font-semibold text-[#0A2463] mb-6">
            {{ pageTitle }}
          </h2>

          <div v-if="isLoading" class="text-center text-lg text-[#0A2463]">
            <i class="fa-solid fa-spinner fa-spin mr-2"></i> Carregando treinos...
          </div>

          <div v-if="apiError" class="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {{ apiError }}
          </div>

          <div class="flex flex-wrap gap-5" v-if="!isLoading && !apiError">

            <router-link
              v-for="treino in filteredWorkouts"
              :key="treino.id"
              :to="treino.link"
              class="w-full sm:w-1/2 lg:w-[calc(33.333%-14px)] transform transition duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl overflow-hidden shadow-md">
              <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  
                  <video 
                    v-if="treino.photoURL && treino.photoURL.endsWith('.mp4')"
                    class="h-40 w-full object-cover"
                    autoplay 
                    loop 
                    muted 
                    playsinline
                  >
                     <source :src="treino.photoURL" type="video/mp4">
                  </video>

                  <img 
                    v-else-if="treino.photoURL && treino.photoURL !== '.'" 
                    :src="treino.photoURL" 
                    alt="Imagem do treino" 
                    class="h-40 w-full object-cover"
                  >

                  <div v-else class="h-40 bg-[#8D99AE] w-full flex items-center justify-center">
                      <i class="fas fa-dumbbell text-white text-2xl opacity-50"></i>
                  </div>

                  <div class="p-3 text-center font-bold text-[#0A2463]">
                    {{ treino.name }}
                  </div>
                </div>
            </router-link>
            
            <p v-if="filteredWorkouts.length === 0" class="text-gray-500 italic">
              Nenhum treino encontrado para esta categoria.
            </p>

          </div>
        </section>
      </main>
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import apiService from '@/services/api.js';
import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import RoutineAsideComponent from "../components/RoutineAsideComponent.vue";

export default {
  name: "RecommendedWorkoutsView",
  components: {
    HeaderComponent,
    RoutineAsideComponent,
    FooterComponent,
  },
  data() {
    return {
      allWorkouts: [],
      isLoading: false,
      apiError: null
    }
  },
  created() {
    this.fetchWorkouts();
  },
  computed: {
    workoutType() {
      return this.$route.params.tipo;
    },
    pageTitle() {
      if (this.workoutType === "recomendados") return "Todos os Treinos Recomendados";
      if (this.workoutType === "caseiros") return "Todos os Treinos Caseiros";
      return "Todos os Treinos";
    },
    filteredWorkouts() {
      const typeMap = {
        recomendados: "recomendado",
        caseiros: "caseiro"
      };
      const correctType = typeMap[this.workoutType];
      return this.allWorkouts.filter(treino => treino.type === correctType);
    }
  },
  methods: {
    async fetchWorkouts() {
      this.isLoading = true;
      this.apiError = null;
      try {
        const response = await apiService.getAllExercises(1, 100);
        this.allWorkouts = response.data.items.map(treino => {
          const tipo = treino.place === 1 ? 'recomendado' : 'caseiro';
          return {
            id: treino.id,
            name: treino.name,
            type: tipo,
            photoURL: treino.photoURL,
            link: `/training/${treino.id}`
          };
        });
      } catch (error) {
        this.apiError = "Não foi possível carregar os treinos.";
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

<style scoped>
</style>