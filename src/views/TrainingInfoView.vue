<template>
  <div class="min-h-screen flex flex-col bg-white text-[#333333]">
    <HeaderComponent />

    <div class="flex flex-row w-full flex-grow h-full overflow-hidden">
      <RoutineAside
        class="flex-shrink-0 h-full overflow-hidden"
        style="width: 250px"
      />

      <main class="flex-grow p-8 bg-gray-50 flex overflow-y-auto">
        
        <div v-if="isLoading" class="w-full flex justify-center items-center">
             <i class="fa-solid fa-spinner fa-spin text-4xl text-[#0A2463]"></i>
        </div>

        <div v-if="apiError" class="w-full p-4 bg-red-100 text-red-700 rounded-lg h-fit">
          <strong>Erro:</strong> {{ apiError }}
        </div>

        <div v-if="exercise && !isLoading" class="flex flex-col lg:flex-row w-full">
            
            <div class="flex-grow pr-0 lg:pr-8 lg:border-r border-gray-200">
            
                <h1 class="text-4xl font-extrabold text-[#0A2463] mb-2">
                    {{ exercise.name }}
                </h1>
                <p class="text-lg text-gray-600 mb-8 flex items-center gap-2">
                    <span class="bg-[#00FFC5] text-[#0A2463] px-2 py-1 rounded text-xs font-bold uppercase">
                        {{ exercise.place === 1 ? 'Academia' : 'Casa' }}
                    </span>
                    <span>|</span>
                    <span class="font-semibold">{{ exercise.muscleGroupName || 'Geral' }}</span>
                </p>

                <div class="aspect-video bg-[#8D99AE] rounded-lg mb-8 shadow-lg overflow-hidden relative group">
                    
                    <video 
                        v-if="exercise.photoURL && exercise.photoURL.endsWith('.mp4')" 
                        class="w-full h-full object-cover" 
                        controls autoplay loop muted playsinline>
                        <source :src="exercise.photoURL" type="video/mp4">
                    </video>

                    <img 
                        v-else-if="exercise.photoURL && exercise.photoURL !== '.'" 
                        :src="exercise.photoURL" 
                        alt="Demonstração" 
                        class="w-full h-full object-cover"
                    >

                    <div v-else class="flex items-center justify-center h-full text-white text-2xl bg-gray-400">
                        <i class="fas fa-dumbbell text-6xl opacity-30"></i>
                    </div>
                </div>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-[#0A2463] mb-4 border-b border-[#00FFC5] pb-1">
                    Sobre o Exercício
                    </h2>
                    <p class="text-gray-700 leading-relaxed text-lg">
                    {{ exercise.description }}
                    </p>
                </section>

                <section>
                    <h2 class="text-2xl font-semibold text-[#0A2463] mb-4 border-b border-[#00FFC5] pb-1">
                    Recomendações Gerais
                    </h2>
                    <ul class="list-disc list-inside space-y-3 text-gray-700">
                        <li>
                            <strong>Postura:</strong> Mantenha a coluna alinhada e o abdômen contraído durante a execução.
                        </li>
                        <li>
                            <strong>Respiração:</strong> Expire ao fazer força (levantar/empurrar) e inspire ao retornar.
                        </li>
                        <li>
                            <strong>Cadência:</strong> Realize o movimento de forma controlada, sem usar impulso.
                        </li>
                        <li>
                            <strong>Carga:</strong> Priorize a execução correta antes de aumentar o peso.
                        </li>
                    </ul>
                </section>
            </div>

            <aside class="w-full lg:w-80 lg:ml-8 flex-shrink-0 mt-8 lg:mt-0">
                <div class="bg-white p-6 rounded-xl shadow-xl sticky top-4 border border-gray-100">
                    <h3 class="text-xl font-bold text-[#0A2463] mb-4 border-b pb-2">
                    Ficha Técnica
                    </h3>

                    <div class="space-y-4 mb-6">
                        <div class="flex justify-between text-gray-700 border-b border-dashed pb-2">
                            <span class="font-medium"><i class="fa-solid fa-bullseye text-red-500 mr-2"></i> Foco:</span>
                            <span class="font-bold text-[#0A2463]">{{ exercise.muscleGroupName }}</span>
                        </div>

                        <div class="flex justify-between text-gray-700 border-b border-dashed pb-2">
                            <span class="font-medium"><i class="fa-solid fa-layer-group text-blue-500 mr-2"></i> Séries Rec.:</span>
                            <span class="font-bold">3 a 4</span>
                        </div>
                        <div class="flex justify-between text-gray-700 border-b border-dashed pb-2">
                            <span class="font-medium"><i class="fa-solid fa-repeat text-green-500 mr-2"></i> Repetições:</span>
                            <span class="font-bold">8 a 12</span>
                        </div>
                         <div class="flex justify-between text-gray-700">
                            <span class="font-medium"><i class="fa-solid fa-stopwatch text-orange-500 mr-2"></i> Descanso:</span>
                            <span class="font-bold">45s - 60s</span>
                        </div>
                    </div>

                    <button
                    @click="goBack"
                    class="w-full p-3 bg-[#0A2463] text-white font-bold rounded-lg text-lg hover:bg-[#00FFC5] hover:text-[#0A2463] transition duration-300 shadow-md mb-3"
                    >
                    Voltar
                    </button>
                </div>
            </aside>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiService from "@/services/api.js";
import HeaderComponent from "../components/HeaderComponent.vue";
import RoutineAside from "../components/RoutineAsideComponent.vue";

const route = useRoute();
const router = useRouter();
const exerciseId = route.params.id;

const exercise = ref(null);
const isLoading = ref(true);
const apiError = ref(null);

onMounted(async () => {
  await fetchDetails();
});

async function fetchDetails() {
  isLoading.value = true;
  try {
    const response = await apiService.getDetailedExercise(exerciseId);
    exercise.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar exercício:", error);
    apiError.value = "Não foi possível carregar os detalhes deste exercício.";
  } finally {
    isLoading.value = false;
  }
}

function goBack() {
  router.back();
}
</script>