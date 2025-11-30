<template>
  <div class="min-h-screen bg-white flex flex-col">
    <HeaderComponent />

    <main class="flex-grow container mx-auto p-8 flex justify-center items-center">
      <div class="w-full max-w-lg bg-gray-50 border-2 border-[#0A2463] rounded-2xl shadow-xl p-8 text-center">
        <h1 class="text-3xl font-bold text-[#0A2463] mb-4"> Resumo da Assinatura</h1>
        <p class="text-xl text-gray-700 mb-8">Você está prestes a assinar o
          <span class="font-bold text-[#0A2463]">{{ planoFormatado }}</span>.
        </p>

        <div class="border-y border-gray-300 py-6 mb-8 text-left">
          <h3 class="text-lg font-semibold text-[#0A2463] mb-3">Benefícios:</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-center">
              <i class="fas fa-check text-[#00FFC5] mr-2"></i>
              Criação de rotinas ilimitadas
            </li>
            <li class="flex items-center">
              <i class="fas fa-check text-[#00FFC5] mr-2"></i>
              Acesso aos treinos recomendados
            </li>
            <li class="flex items-center">
              <i class="fas fa-check text-[#00FFC5] mr-2"></i>
              Chat com Personal Trainers
            </li>
            <li v-if="plano === 'ULTRA'" class="flex items-center">
              <i class="fas fa-check text-[#00FFC5] mr-2"></i>
              Chat com Nutricionistas
            </li>
          </ul>
        </div>

        <div class="flex justify-between items-center mb-10">
          <span class="text-2xl font-semibold text-gray-700">Total:</span>
          <span class="text-4xl font-extrabold text-[#00FFC5]" style="-webkit-text-stroke: 1px #0a2463">{{ preco }}</span>
        </div>

        <button @click="iniciarPagamento" class="w-full p-4 bg-[#00FFC5] text-[#0A2463] text-xl font-bold rounded-full hover:bg-opacity-80 transition duration-300">Pagar com Google Play</button>

        <router-link to="/" class="block text-gray-500 hover:text-gray-700 mt-6">Cancelar e voltar</router-link>
      </div>
    </main>

    <FooterComponent />
  </div>

  <PaymentModalComponent
    v-if="mostrarModal"
    :plano="planoFormatado"
    :preco="preco"
    @fechar="fecharModal"
    @pagamentoAprovado="processarPagamento"/>
</template>

<script>
import HeaderComponent from "../components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import PaymentModalComponent from "../components/PaymentModalComponent.vue";
import apiService from '@/services/api.js';

export default {
  name: "CheckoutView",

  components: {
    HeaderComponent,
    FooterComponent,
    PaymentModalComponent,
  },

  props: {
    plano: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      mostrarModal: false,
      isLoading: false,
      apiError: null,
    };
  },

  computed: {
    planoFormatado() {
      switch (this.plano) {
        case "PRO": return "Plano PRO";
        case "ULTRA": return "Plano ULTRA";
        default: return "Plano Desconhecido";
      }
    },

    preco() {
      switch (this.plano) {
        case "PRO": return "R$95,00";
        case "ULTRA": return "R$150,00";
        default: return "R$0,00";
      }
    },
  },

  methods: {
    iniciarPagamento() {
      this.mostrarModal = true;
    },

    fecharModal() {
      this.mostrarModal = false;
    },

    async processarPagamento() {
      if (!this.plano) {
        this.apiError = "Nenhum plano selecionado.";
        return;
      }

      this.isLoading = true;
      this.apiError = null;
      this.mostrarModal = false; 

      try {
        const response = await apiService.upgradeSignature(this.plano);

        console.log("Assinatura atualizada:", response.data);
        alert("Pagamento aprovado e assinatura atualizada com sucesso!");

        this.$router.push("/");

      } catch (error) {
        console.error("Erro ao processar pagamento:", error);

        this.apiError =
          error.response?.data?.message ||
          error.message ||
          "Ocorreu um erro ao atualizar sua assinatura.";

        alert(this.apiError);

      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>