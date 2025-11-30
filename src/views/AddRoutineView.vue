<template>
  <div class="min-h-screen flex flex-col bg-white text-[#333333]">
    <HeaderComponent />

    <div class="flex flex-row w-full flex-grow h-full overflow-hidden">
      <RoutineAside
        class="flex-shrink-0 h-full overflow-hidden"
        style="width: 250px"
      />

      <form class="flex-grow contents" @submit.prevent="saveRoutine">
        <main class="flex-grow p-8 max-w-5xl mx-auto overflow-y-auto">
          <h1
            class="text-4xl font-extrabold text-[#0A2463] mb-8 border-b-4 border-[#00FFC5] pb-2"
          >
            Adicionar Nova Rotina
          </h1>

          <section
            class="mb-10 p-6 border border-gray-200 rounded-xl shadow-sm"
          >
            <div class="mb-6">
              <label
                for="routine-name"
                class="block font-bold text-[#0A2463] mb-2 text-lg"
                >Nome da Rotina:</label
              >
              <input
                type="text"
                id="routine-name"
                placeholder="Ex: Treino de Força A, Pernas & Glúteos"
                class="w-full px-4 py-3 border border-[#8D99AE] rounded-lg text-base focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30 transition duration-300"
                v-model="routineName"
                required
              />
            </div>

            <div class="mb-6">
              <label
                for="routine-description"
                class="block font-bold text-[#0A2463] mb-2 text-lg"
                >Descrição:</label
              >
              <textarea
                id="routine-description"
                placeholder="Opcional: Descreva o foco desta rotina..."
                class="w-full px-4 py-3 border border-[#8D99AE] rounded-lg text-base focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30 transition duration-300"
                v-model="routineDescription"
                rows="3"
              >
              </textarea>
            </div>
          </section>

          <section class="mb-10 p-6 border-t border-gray-200">
            <label
              for="search-exercises"
              class="block font-bold text-[#0A2463] mb-2 text-lg"
              >Adicionar Exercícios:</label
            >

            <div class="relative mb-5">
              <input
                type="text"
                id="search-exercises"
                placeholder="Buscar exercícios pelo nome (Ex: Supino, Agachamento...)"
                class="w-full px-4 py-3 pl-12 border border-[#8D99AE] rounded-lg focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30"
                v-model="searchQuery" 
              /> <i class="fa-solid fa-magnifying-glass absolute top-1/2 left-4 transform -translate-y-1/2 text-[#8D99AE]"></i>
            </div>

            <h3 class="text-xl font-semibold text-[#0A2463] mb-3">
              Exercícios na Rotina:
            </h3>

            <div
              class="min-h-20 border-2 border-dashed border-[#8D99AE] rounded-lg p-4 bg-gray-50 space-y-3"
            >
              <div
                v-if="routineItems.length === 0"
                class="flex items-center justify-center h-full"
              >
                <p class="text-[#8D99AE] italic">
                  Nenhum exercício adicionado. Clique nas sugestões abaixo!
                </p>
              </div>

              <div
                v-for="(item, index) in routineItems"
                :key="item.exerciseId"
                class="flex items-center justify-between p-3 bg-white rounded-lg shadow"
              >
                <span class="font-bold text-[#0A2463]"
                  >{{ index + 1 }}. {{ item.name }}</span
                >
                <div class="flex gap-2">
                  <input
                    type="text"
                    v-model="item.series"
                    placeholder="Séries (ex: 3)"
                    class="w-20 px-2 py-1 border rounded"
                  />
                  <input
                    type="text"
                    v-model="item.restTime"
                    placeholder="Reps (ex: 10)"
                    class="w-20 px-2 py-1 border rounded"
                  />
                  <button
                    @click.prevent="removeExercise(item.exerciseId)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-3xl font-semibold text-[#0A2463] mb-6 text-center">
              Sugestões
            </h2>

            <div v-if="isLoading" class="text-center text-lg text-[#0A2463]">
              <i class="fa-solid fa-spinner fa-spin mr-2"></i> Carregando
              exercícios...
            </div>

            <div class="flex justify-between" v-if="!isLoading">
              
              <div class="w-1/2 pr-6">
                <h3
                  class="text-xl font-bold text-[#0A2463] mb-4 border-b border-[#00FFC5] pb-1"
                >
                  Treinos em Casa
                </h3>
                <div class="flex flex-wrap gap-3">
                  <div
                    v-for="treino in filteredHomeWorkouts"
                    :key="treino.id"
                    class="w-[calc(33.333%-8px)]"
                  >
                    <div
                      @click="addExerciseToRoutine(treino)"
                      class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 cursor-pointer hover:border-[#00FFC5]"
                    >
                      <video 
                        v-if="treino.photoURL && treino.photoURL.endsWith('.mp4')"
                        class="h-20 w-full object-cover"
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
                        class="h-20 w-full object-cover"
                      >

                      <div v-else class="h-20 bg-[#8D99AE] w-full flex items-center justify-center">
                          <i class="fas fa-dumbbell text-white text-xl opacity-50"></i>
                      </div>
                      <div
                        class="p-2 text-center text-sm font-semibold text-[#0A2463]"
                      >
                        {{ treino.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-l border-gray-300 mx-6"></div>

              <div class="w-1/2 pl-6">
                <h3
                  class="text-xl font-bold text-[#0A2463] mb-4 border-b border-[#00FFC5] pb-1"
                >
                  Treinos na Academia
                </h3>
                <div class="flex flex-wrap gap-3">
                  <div
                    v-for="treino in filteredGymWorkouts"
                    :key="treino.id"
                    class="w-[calc(33.333%-8px)]"
                  >
                    <div
                      @click="addExerciseToRoutine(treino)"
                      class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 cursor-pointer hover:border-[#00FFC5]"
                    >
                      <video 
                        v-if="treino.photoURL && treino.photoURL.endsWith('.mp4')"
                        class="h-20 w-full object-cover"
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
                        class="h-20 w-full object-cover"
                      >

                      <div v-else class="h-20 bg-[#8D99AE] w-full flex items-center justify-center">
                          <i class="fas fa-dumbbell text-white text-xl opacity-50"></i>
                      </div>
                      <div
                        class="p-2 text-center text-sm font-semibold text-[#0A2463]"
                      >
                        {{ treino.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div class="text-center mt-12 pt-6 border-t border-gray-200">
            <button
              type="submit"
              class="p-4 px-12 bg-[#00FFC5] text-[#0A2463] font-bold rounded-full text-xl hover:bg-opacity-80 transition duration-300 shadow-xl"
            >
              Salvar Rotina
            </button>
          </div>

          <div
            v-if="apiError"
            class="text-center mt-4 p-3 bg-red-100 text-red-700 rounded-lg"
          >
            <strong>Erro:</strong> {{ apiError }}
          </div>
        </main>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import HeaderComponent from "../components/HeaderComponent.vue";
import RoutineAside from "../components/RoutineAsideComponent.vue";
import apiService from "@/services/api.js";

const router = useRouter();
const routineName = ref("");
const routineDescription = ref("");
const routineItems = ref([]);
const isLoading = ref(false);
const apiError = ref(null);
const homeWorkouts = ref([]);
const gymWorkouts = ref([]);
const searchQuery = ref("");

const filteredHomeWorkouts = computed(() => {
  if (!searchQuery.value) return homeWorkouts.value;
  
  const term = searchQuery.value.toLowerCase();
  return homeWorkouts.value.filter(exercise => 
    exercise.name.toLowerCase().includes(term)
  );
});

const filteredGymWorkouts = computed(() => {
  if (!searchQuery.value) return gymWorkouts.value;

  const term = searchQuery.value.toLowerCase();
  return gymWorkouts.value.filter(exercise => 
    exercise.name.toLowerCase().includes(term)
  );
});

onMounted(async () => {
  isLoading.value = true;
  apiError.value = null;
  try {
    const response = await apiService.getAllExercises(1, 100);

    homeWorkouts.value = response.data.items.filter((ex) => ex.place === 2);
    gymWorkouts.value = response.data.items.filter((ex) => ex.place === 1);
  } catch (error) {
    console.error("Erro ao buscar exercícios:", error);
    apiError.value = "Não foi possível carregar as sugestões de exercícios.";
  } finally {
    isLoading.value = false;
  }
});

function addExerciseToRoutine(exercise) {
  const exists = routineItems.value.find(
    (item) => item.exerciseId === exercise.id
  );
  if (exists) {
    alert("Este exercício já foi adicionado!");
    return;
  }

  const newItem = {
    exerciseId: exercise.id,
    name: exercise.name,
    order: routineItems.value.length + 1,
    series: "3",
    restTime: "10",
  };
  routineItems.value.push(newItem);
}

function removeExercise(exerciseId) {
  routineItems.value = routineItems.value.filter(
    (item) => item.exerciseId !== exerciseId
  );
  routineItems.value.forEach((item, index) => {
    item.order = index + 1;
  });
}

async function saveRoutine() {
  apiError.value = null;

  if (routineName.value.trim() === "") {
    apiError.value = "Por favor, dê um nome à sua rotina.";
    return;
  }
  if (routineItems.value.length === 0) {
    apiError.value = "Adicione pelo menos um exercício à sua rotina.";
    return;
  }

  const routineDto = {
    name: routineName.value,
    description: routineDescription.value,
    isPublic: false,
    routineItems: routineItems.value.map((item) => ({
      exerciseId: item.exerciseId,
      order: item.order,
      series: item.series,
      restTime: item.restTime,
    })),
  };

  try {
    isLoading.value = true;

    const response = await apiService.createRoutine(routineDto);

    alert(`Rotina "${response.data.name}" salva com sucesso!`);
    router.push("/");
  } catch (error) {
    console.error("Erro ao salvar rotina:", error);
    apiError.value =
      error.response?.data?.message ||
      "Ocorreu um erro desconhecido ao salvar.";
  } finally {
    isLoading.value = false;
  }
}
</script>