import { reactive } from "vue";

const store = reactive({
  userPlan: "BASICO",
  routines: [
    { id: 1, name: "Treino de Força A" },
    { id: 2, name: "Treino de Pernas e Cardio" },
    { id: 3, name: "Rotina de Aquecimento" },
  ],
});

export const routineActions = {
  addRoutine(newRoutineName) {
    const newId = store.routines.length + 1;
    store.routines.push({
      id: newId,
      name: newRoutineName,
    });
  },
  deleteRoutine(routineID){
    store.routines = store.routines.filter(routine => routine.id !== routineID);
  },
  updateRoutine(id, newName) {
    const routine = store.routines.find((r) => r.id === parseInt(id));
    if (routine) {
      routine.name = newName;
    }
  }
};

export default store;
