<template>
  <div class="min-h-screen flex flex-col bg-white text-[#333333]">
    <HeaderComponent />

    <div class="flex flex-row w-full flex-grow h-full overflow-hidden">
      <RoutineAside
        class="flex-shrink-0 w-64 h-full overflow-y-auto"
        @add-routine-clicked="goToAddRoutine"
      />

      <main class="flex-grow p-8 max-w-5xl mx-auto overflow-y-auto">
        <div v-if="isLoading" class="text-center text-lg text-[#0A2463]">
          <i class="fa-solid fa-spinner fa-spin mr-2"></i> Carregando detalhes
          da rotina...
        </div>

        <div
          v-if="apiError && !isLoading"
          class="p-4 bg-red-100 text-red-700 rounded-lg"
        >
          <strong>Erro:</strong> {{ apiError }}
        </div>

        <div v-if="routine && !isLoading && !apiError">
          <div
            class="flex justify-between items-center mb-8 pb-4 border-b-4 border-[#00FFC5]"
          >
            <h1 class="text-4xl font-extrabold text-[#0A2463]">
              {{ routine.name }}
            </h1>
            <div class="space-x-3">
              <button
                @click="deleteCurrentRoutine"
                class="px-5 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
              >
                <i class="fas fa-trash mr-2"></i> Excluir
              </button>
              <button
                @click="editRoutine" 
                class="px-5 py-2 bg-[#0A2463] text-white font-bold rounded-lg hover:bg-[#1A3B8B] transition duration-300 shadow-md"
              >
                <i class="fas fa-edit mr-2"></i> Editar
              </button>
            </div>
          </div>

          <section
            class="mb-6 p-4 border border-gray-100 rounded-lg bg-gray-50 shadow-inner"
            v-if="routine.description"
          >
            <h2 class="text-xl font-semibold text-[#0A2463] mb-2">Descrição</h2>
            <p class="text-gray-700">{{ routine.description }}</p>
        </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#0A2463] mb-4">
              Exercícios Incluídos
            </h2>
            <div class="space-y-4">
              <div
                v-if="
                  routine &&
                  routine.routineItems &&
                  routine.routineItems.length > 0
                "
              >
                <div
                  v-for="exercise in routine.routineItems"
                  :key="exercise.exerciseId"
                  @click="goToExerciseDetails(exercise.exerciseId)" 
                  class="flex items-center justify-between p-4 bg-gray-50 border-l-4 border-[#0A2463] rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition duration-200" >
                  <span class="text-lg font-medium text-gray-800">{{
                    exercise.exerciseName
                  }}</span>
                  <span class="text-sm text-gray-600"
                    >{{ exercise.series }} Séries x
                    {{ exercise.restTime }} Reps</span
                  >
                </div>
              </div>

              <p
                v-if="
                  !routine ||
                  !routine.routineItems ||
                  routine.routineItems.length === 0
                "
                class="text-gray-500 italic"
              >
                Esta rotina ainda não tem exercícios. Clique em Editar para
                adicionar!
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import HeaderComponent from "../components/HeaderComponent.vue";
import RoutineAside from "../components/RoutineAsideComponent.vue";
import apiService from "@/services/api.js";

const route = useRoute();
const router = useRouter();

const routine = ref(null);
const isLoading = ref(false);
const apiError = ref(null);
const days = ref(["Seg", "Qua", "Sex"]);

async function fetchRoutineDetails(routineId) {
  if (!routineId) return;

  isLoading.value = true;
  apiError.value = null;
  routine.value = null;
  try {
    console.log(`Buscando detalhes para a rotina ID: ${routineId}`);
    const response = await apiService.getDetailedRoutine(routineId);
    routine.value = response.data;
    console.log("Dados da rotina recebidos:", routine.value);
  } catch (error) {
    console.error(`Erro ao buscar detalhes da rotina ${routineId}:`, error);
    apiError.value =
      error.response?.data?.message ||
      "Não foi possível carregar os detalhes desta rotina.";
  } finally {
    isLoading.value = false;
  }
}

watchEffect(() => {
  const currentId = route.params.id;
  fetchRoutineDetails(currentId);
});

async function deleteCurrentRoutine() {
  if (!routine.value) return;

  if (
    confirm(`Tem certeza que deseja excluir a rotina "${routine.value.name}"?`)
  ) {
    isLoading.value = true;
    apiError.value = null;
    try {
      await apiService.deleteRotina(routine.value.id);
      alert("Rotina excluída com sucesso!");
      router.push("/");
    } catch (error) {
      console.error(`Erro ao excluir rotina ${routine.value.id}:`, error);
      apiError.value =
        error.response?.data?.message || "Ocorreu um erro ao excluir a rotina.";
      isLoading.value = false;
    }
  }
}

function editRoutine() {
  if (!routine.value) return;

  router.push({ 
    name: 'EditRoutine', 
    params: { id: routine.value.id } 
  });
}

function goToAddRoutine() {
  router.push("/add-routine");
}

function goToExerciseDetails(exerciseId) {
  router.push({
    name: 'TrainingInfo',
    params: { id: exerciseId }
  });
}
</script>

