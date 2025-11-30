<template>
  <div class="min-h-screen flex flex-col bg-white text-[#333333]">
    <HeaderComponent />

    <div class="flex flex-row w-full flex-grow h-full overflow-hidden">
      <RoutineAside
        @add-routine-clicked="goToAddRoutine"
        class="flex-shrink-0 h-full overflow-hidden"
        style="width: 250px"
      />

      <main class="flex-grow p-8 flex flex-col gap-10 overflow-y-auto">

        <div v-if="isLoading" class="text-center text-lg text-[#0A2463]">
          <i class="fa-solid fa-spinner fa-spin mr-2"></i> Carregando dados da home...
        </div>

        <div v-if="apiError" class="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ apiError }}
        </div>

        <template v-if="!isLoading && !apiError">

          <section>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-3xl font-semibold text-[#0A2463]">
                Treinos Recomendados (Academia)
              </h2>
              <router-link 
                to="/treinos/recomendados"
                class="text-lg font-semibold text-[#0A2463] hover:text-[#00FFC5] transition-colors duration-200">
                Ver mais
              </router-link>
            </div>

            <div class="flex flex-wrap gap-5">
              <router-link
                v-for="treino in recommendedWorkouts"
                :key="treino.id"
                :to="`/training/${treino.id}`"
                class="w-full sm:w-1/2 lg:w-[calc(33.333%-14px)] transform transition duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl overflow-hidden shadow-md"
              >
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

              <p v-if="recommendedWorkouts.length === 0" class="text-gray-500 italic">
                Nenhum treino de academia encontrado.
              </p>
            </div>
          </section>

          <section>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-3xl font-semibold text-[#0A2463]">
                Treinos Caseiros
              </h2>
              <router-link 
                to="/treinos/caseiros"
                class="text-lg font-semibold text-[#0A2463] hover:text-[#00FFC5] transition-colors duration-200">
                Ver mais
              </router-link>
            </div>

            <div class="flex flex-wrap gap-5">
              <router-link
                v-for="treino in homeWorkouts"
                :key="treino.id"
                :to="`/training/${treino.id}`"
                class="w-full sm:w-1/2 lg:w-[calc(33.333%-14px)] transform transition duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl overflow-hidden shadow-md"
              >
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

              <p v-if="homeWorkouts.length === 0" class="text-gray-500 italic">
                Nenhum treino caseiro encontrado.
              </p>
            </div>
          </section>

          <section class="text-center" v-if="userPlan !== 'ULTRA'">
            <h2 class="text-3xl font-semibold text-[#0A2463] mb-8">
              Nossos Planos
            </h2>

            <div class="flex flex-wrap justify-center gap-6">

              <div
                v-if="userPlan === 'BASICO'"
                class="w-full md:w-80 bg-gray-50 border-2 border-[#0A2463] rounded-2xl p-6 text-center shadow-xl transition duration-300 hover:scale-[1.05]"
              >
                <div class="text-4xl text-[#0A2463] mb-4">
                  <i class="fas fa-dumbbell"></i>
                </div>
                <h3 class="text-2xl font-bold text-[#0A2463] mb-2 uppercase">PRO</h3>
                <p class="text-black h-14 text-sm mb-4 flex items-center justify-center">
                  Tenha contato direto com personais para tirar dúvidas ou pedir um roteiro criado por um profissional.
                </p>
                <div class="text-4xl font-extrabold text-[#00FFC5] mb-5" style="-webkit-text-stroke: 1px darkblue">
                  R$95,00
                </div>
                <router-link 
                  to="/checkout/PRO" 
                  class="block w-full p-3 bg-[#0A2463] text-white font-bold rounded-full hover:bg-[#00FFC5] hover:text-black transition">
                  Assinar Agora
                </router-link>
              </div>

              <div
                class="w-full md:w-80 bg-gray-50 border-2 border-[#0A2463] rounded-2xl p-6 text-center shadow-xl transition duration-300 hover:scale-[1.05]"
              >
                <div class="text-4xl text-[#00ffff] mb-4">🍅</div>
                <h3 class="text-2xl font-bold text-[#0A2463] mb-2 uppercase">ULTRA</h3>
                <p class="text-black h-14 text-sm mb-4 flex items-center justify-center">
                  Tudo do Plano PRO, mais contato com profissionais da área da nutrição.
                </p>
                <div class="text-4xl font-extrabold text-[#00FFC5] mb-5" style="-webkit-text-stroke: 1px darkblue">
                  R$150,00
                </div>
                <router-link 
                  to="/checkout/ULTRA" 
                  class="block w-full p-3 bg-[#0A2463] text-white font-bold rounded-full hover:bg-[#00FFC5] hover:text-black transition">
                  Assinar Agora
                </router-link>
              </div>

            </div>
          </section>

        </template>

      </main>
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import apiService from '@/services/api.js';
import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import RoutineAside from "../components/RoutineAsideComponent.vue";

export default {
  name: "HomePage",
  components: {
    HeaderComponent,
    RoutineAside,
    FooterComponent,
  },

  data() {
    return {
      recommendedWorkouts: [],
      homeWorkouts: [],
      userPlan: 'BÁSICO',
      isLoading: false,
      apiError: null,
    };
  },

  created() {
    this.fetchHomePageData();
  },

  methods: {
    goToAddRoutine() {
      this.$router.push("/add-routine");
    },

    async fetchHomePageData() {
      this.isLoading = true;
      this.apiError = null;

      try {
        const exerciseResponse = await apiService.getAllExercises(1, 50);
        const exercises = exerciseResponse.data.items;

        this.recommendedWorkouts = exercises.filter(ex => ex.place === 1).slice(0, 3);
        this.homeWorkouts = exercises.filter(ex => ex.place === 2).slice(0, 3)    ;

        const signatureResponse = await apiService.getMySignature();
        let planName = signatureResponse.data.planName || 'Básico';
        this.userPlan = planName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        console.log("Plano do Usuário (Processado):", this.userPlan);

      } catch (error) {
        this.apiError = "Não foi possível carregar os dados da página.";
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
.home-layout {
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  display: flex;
  flex: 1;
}
</style>
