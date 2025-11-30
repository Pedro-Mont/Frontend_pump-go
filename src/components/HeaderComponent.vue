<template>
  <header class="bg-[#0A2463] text-white p-4 shadow-md flex justify-between items-center z-50">
    <div class="flex items-center cursor-pointer" @click="$router.push('/')">
      <i class="fa-solid fa-dumbbell text-[#00FFC5] text-2xl mr-2"></i>
      <span class="text-xl font-bold tracking-wide">Pump & Go</span>
    </div>

    <nav class="hidden md:flex gap-8">
      <router-link 
        to="/" 
        class="font-semibold hover:text-[#00FFC5] transition duration-200"
        active-class="text-[#00FFC5] border-b-2 border-[#00FFC5]"
      >
        Minhas Rotinas
      </router-link>
      
      <router-link 
        to="/profissionais" 
        class="font-semibold hover:text-[#00FFC5] transition duration-200"
        active-class="text-[#00FFC5] border-b-2 border-[#00FFC5]"
      >
        Profissionais
      </router-link>
    </nav>
    <div class="flex items-center gap-4">
      <div class="w-10 h-10 rounded-full bg-[#00FFC5] flex items-center justify-center text-[#0A2463] font-bold cursor-pointer hover:opacity-90 transition">
        <i class="fas fa-user"></i>
      </div>

      <button 
        @click="logout" 
        class="text-sm font-semibold text-white hover:text-[#00FFC5] transition duration-200 flex items-center gap-2">
        <span>Sair</span>
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent",
  methods: {
    logout() {
      localStorage.removeItem('user-token');
      this.$router.push('/login');
    }
  }
};
</script>