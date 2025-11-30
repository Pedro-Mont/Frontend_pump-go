import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../views/HomePageView.vue";
import LoginPage from "../views/LoginPageView.vue";
import CadastroView from "../views/RegisterView.vue";
import ResetPasswordView from "@/views/ResetPasswordView.vue";
import TrainingInfoView from "@/views/TrainingInfoView.vue";
import AddRoutineView from "@/views/AddRoutineView.vue";
import RoutineList from "../store/routineList";
import ProfessionalsView from "@/views/ProfessionalsView.vue";
import RoutineDetailView from "@/views/RoutineDetailView.vue";
import RecommendedWorkoutsView from "../views/RecommendedWorkoutsView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import EditRoutineView from "../views/EditRoutineView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
      meta: { requiresAuth: true }
    },
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
    },
    {
      path: "/cadastro",
      name: "Cadastro",
      component: CadastroView,
    },
    {
      path: "/resetpassword",
      name: "ResetPassword",
      component: ResetPasswordView,
    },
    {
      path: "/training/:id",
      name: "TrainingInfo",
      component: TrainingInfoView,
      props: true,
    },
    {
      path: "/add-routine",
      name: "AddRoutine",
      component: AddRoutineView,
      meta: { requiresAuth: true }
    },
    {
      path: "/routine/:id",
      name: "RoutineDetail",
      component: RoutineDetailView,
      props: true,
    },
    {
      path: "/routine/id:",
      name: "TrainingDetail",
      component: TrainingInfoView,
      props: true,
    },
    {
      path: "/profissionais",
      name: "Profissionais",
      component: ProfessionalsView,
    },
    {
      path: "/treinos/:tipo",
      name: "RecommendedWorkouts",
      component: RecommendedWorkoutsView,
    },
    {
      path: "/checkout/:plano",
      name: "Checkout",
      component: CheckoutView,
      props: true,
    },
    {
      path:"/routine/edit/:id",
      name: "EditRoutine",
      component: EditRoutineView,
      props: true,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('user-token');

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  
  } else if ((to.name === 'Login' || to.name === 'Cadastro') && isLoggedIn) {
    next({ name: 'Home' });
  
  } else {
    next();
  }
});

export default router;
