<template>
  <div class="min-h-screen bg-white text-[#333333] flex flex-col">
    <HeaderComponent />

    <div class="flex flex-row w-full flex-grow h-full overflow-hidden">
      <RoutineAside
        class="flex-shrink-0 h-full overflow-hidden"
        style="width: 250px"
        @add-routine-clicked="goToAddRoutine"
      />

      <main class="flex-grow p-8 flex flex-col items-center overflow-y-auto">
        
        <div v-if="isLoadingData" class="text-center text-lg text-[#0A2463] py-10">
           <i class="fa-solid fa-spinner fa-spin mr-2"></i> Carregando dados da rotina...
        </div>

        <div v-else class="w-full max-w-4xl bg-gray-50 border-2 border-[#0A2463] rounded-2xl shadow-xl p-8">
          
          <div class="flex items-center mb-8 border-b border-gray-200 pb-4">
            <i class="fas fa-edit text-3xl text-[#00FFC5] mr-4"></i>
            <h1 class="text-3xl font-bold text-[#0A2463]">
              Editar Rotina
            </h1>
          </div>

          <form @submit.prevent="saveChanges" class="flex flex-col gap-6">
            
            <div class="flex flex-col gap-2">
              <label for="name" class="font-bold text-[#0A2463]">Nome da Rotina</label>
              <input
                id="name"
                v-model="routineName"
                type="text"
                placeholder="Ex: Treino de Força A"
                class="p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#00FFC5] focus:ring-1 focus:ring-[#00FFC5] transition"
                required/>
            </div>

            <div class="flex flex-col gap-2">
              <label for="description" class="font-bold text-[#0A2463]">Descrição</label>
              <textarea
                id="description"
                v-model="routineDescription"
                placeholder="Descrição da rotina..."
                class="p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#00FFC5] focus:ring-1 focus:ring-[#00FFC5] transition"
                rows="3"
              ></textarea>
            </div>

            <div class="border-t border-gray-200 pt-6">
                <h3 class="text-xl font-bold text-[#0A2463] mb-4">Exercícios</h3>
                
                <div v-if="routineItems.length === 0" class="text-gray-500 italic mb-4">
                    Nenhum exercício nesta rotina. Adicione abaixo.
                </div>

                <div v-for="(item, index) in routineItems" :key="item.exerciseId" class="flex items-center justify-between p-3 bg-white rounded-lg shadow mb-3">
                    <span class="font-bold text-[#0A2463]">{{ index + 1 }}. {{ item.name }}</span>
                    <div class="flex gap-2 items-center">
                        <input type="text" v-model="item.series" placeholder="Séries" class="w-16 px-2 py-1 border rounded text-center">
                        <span class="text-gray-500">x</span>
                        <input type="text" v-model="item.restTime" placeholder="Reps" class="w-16 px-2 py-1 border rounded text-center">
                        <button type="button" @click="removeExercise(item.exerciseId)" class="ml-2 text-red-500 hover:text-red-700">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
                <label class="block font-bold text-[#0A2463] mb-2">Adicionar Mais Exercícios:</label>
                <div class="relative mb-4">
                    <input type="text" placeholder="Filtrar lista abaixo..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00FFC5]">
                    <i class="fa-solid fa-search absolute top-3 right-3 text-gray-400"></i>
                </div>
                
                <div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-white">
                    <div v-for="treino in allExercises" :key="treino.id" 
                         @click="addExerciseToRoutine(treino)"
                         class="cursor-pointer px-3 py-1 bg-gray-100 hover:bg-[#00FFC5] hover:text-[#0A2463] rounded-full text-sm transition duration-200 border border-gray-200">
                         + {{ treino.name }}
                    </div>
                </div>
            </div>

            <div class="flex gap-4 mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="cancelEdit"
                class="w-1/2 p-3 bg-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-400 transition">
                Cancelar
              </button>
              
              <button
                type="submit"
                :disabled="isSaving"
                class="w-1/2 p-3 bg-[#0A2463] text-white font-bold rounded-full hover:bg-[#00FFC5] hover:text-[#0A2463] transition duration-300 disabled:bg-gray-400">
                <span v-if="isSaving">Salvando...</span>
                <span v-else>Salvar Alterações</span>
              </button>
            </div>

            <div v-if="apiError" class="text-center text-red-600 mt-2 font-semibold">
                {{ apiError }}
            </div>

          </form>
        </div>
      </main>
    </div>
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import RoutineAside from "../components/RoutineAsideComponent.vue";
import apiService from "@/services/api.js";

const props = defineProps(['id']);
const router = useRouter();

const routineName = ref("");
const routineDescription = ref("");
const routineItems = ref([]);
const allExercises = ref([]);
const isLoadingData = ref(true);
const isSaving = ref(false);
const apiError = ref(null);

onMounted(async () => {
  await loadData();
});

async function loadData() {
  try {
    const exercisesResponse = await apiService.getAllExercises(1, 100);
    allExercises.value = exercisesResponse.data.items;

    const routineResponse = await apiService.getDetailedRoutine(props.id);
    const routine = routineResponse.data;

    routineName.value = routine.name;
    routineDescription.value = routine.description;
    
    routineItems.value = routine.routineItems.map(item => ({
        exerciseId: item.exerciseId,
        name: item.exerciseName, 
        order: item.order,
        series: item.series,
        restTime: item.restTime
    }));

  } catch (error) {
    console.error("Erro ao carregar edição:", error);
    apiError.value = "Erro ao carregar dados da rotina.";
  } finally {
    isLoadingData.value = false;
  }
}

function addExerciseToRoutine(exercise) {
  const exists = routineItems.value.find(i => i.exerciseId === exercise.id);
  if (exists) return alert("Este exercício já está na lista!");

  routineItems.value.push({
    exerciseId: exercise.id,
    name: exercise.name,
    order: routineItems.value.length + 1,
    series: "3",
    restTime: "10"
  });
}

function removeExercise(id) {
  routineItems.value = routineItems.value.filter(i => i.exerciseId !== id);
}

async function saveChanges() {
    isSaving.value = true;
    apiError.value = null;
    
    const updateDto = {
        name: routineName.value,
        description: routineDescription.value,
        isPublic: false,
        routineItems: routineItems.value.map((item, index) => ({
            exerciseId: item.exerciseId,
            order: index + 1,
            series: item.series,
            restTime: item.restTime
        }))
    };

    try {
        await apiService.updateRoutine(props.id, updateDto);
        
        alert("Rotina atualizada com sucesso!");
        
        router.push(`/routine/${props.id}`);

    } catch (error) {
        console.error("Erro ao salvar:", error);
        apiError.value = error.response?.data?.message || "Ocorreu um erro ao tentar salvar as alterações.";
    } finally {
        isSaving.value = false;
    }
}

function cancelEdit() {
  router.back();
}

function goToAddRoutine() {
  router.push("/add-routine");
}
</script>