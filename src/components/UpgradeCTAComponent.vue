<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <div class="flex flex-col items-center justify-center flex-grow p-8">
      <div class="text-center mb-10 max-w-2xl">
        <h2 class="text-4xl font-extrabold text-red-600 mb-4">
          Seu plano é Básico!
        </h2>
        <p class="text-xl text-black leading-relaxed">
          Para ter contato direto e personalizado com nossos Nutricionistas e
          Personal Trainers, é necessário fazer o upgrade para um de nossos planos Premium.
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
        <div class="w-full md:w-80 bg-white border-2 border-[#0A2463] rounded-2xl p-6 text-center shadow-2xl transition duration-300 hover:scale-[1.05]">
          <div class="text-4xl text-[#0A2463] mb-4">
            <i class="fas fa-dumbbell"></i>
          </div>
          <h3 class="text-2xl font-bold text-[#0A2463] mb-2 uppercase">PRO</h3>
          <p class="h-14 text-sm mb-4 flex items-center justify-center">
            Tenha contato direto com personais para tirar dúvidas ou pedir um roteiro criado por um profissional.
          </p>
          <div class="text-4xl font-extrabold text-[#00FFC5] mb-5" style="-webkit-text-stroke: 1px darkblue;">
            R$95,00
          </div>
          <router-link
            to="/checkout/PRO"
            class="block w-full p-3 bg-[#0A2463] text-white font-bold rounded-full hover:bg-opacity-90 hover:bg-[#00FFC5] hover:text-black transition">
            Assinar Agora
          </router-link>
        </div>

        <div
          class="w-full md:w-80 bg-white border-2 border-[#0A2463] rounded-2xl p-6 text-center shadow-2xl transition duration-300 hover:scale-[1.05]">
          <div class="text-4xl text-[#0A2463] mb-4">
            <span role="img" aria-label="Tomate">🍅</span>
          </div>
          <h3 class="text-2xl font-bold text-[#0A2463] mb-2 uppercase">ULTRA</h3>
          <p class="h-14 text-sm mb-4 flex items-center justify-center">
            Tudo do Plano PRO, mais contato com profissionais da área da nutrição.
          </p>
          <div class="text-4xl font-extrabold text-[#00FFC5] mb-5" style="-webkit-text-stroke: 1px darkblue;">
            R$150,00
          </div>
          <router-link
            to="/checkout/ULTRA"
            class="block w-full p-3 bg-[#0A2463] text-white font-bold rounded-full hover:bg-opacity-90 hover:bg-[#00FFC5] hover:text-black transition">
            Assinar Agora
          </router-link>
        </div>
      </div>
    </div>

    <FooterComponent/>
  </div>
</template>

<script>
import FooterComponent from './FooterComponent.vue';
export default {
  name: "UpgradeCTAComponent",
  components: { FooterComponent }
};
</script>