<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
  >
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
      <div v-if="estadoPagamento === 'inicial'">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-[#0A2463] text-center">
            Pagar com Google
          </h2>
        </div>

        <div class="p-8 space-y-6">
          <div
            class="p-4 bg-gray-100 rounded-lg flex items-center justify-between"
          >
            <span class="text-gray-600">Plano:</span>
            <span class="font-bold text-[#0A2463]">{{ plano }}</span>
          </div>

          <div
            class="p-4 bg-gray-100 rounded-lg flex items-center justify-between"
          >
            <span class="text-gray-600">Forma de Pagamento:</span>
            <span class="font-bold text-[#0A2463] flex items-center">
              <i class="fab fa-cc-visa text-2xl mr-2"></i>
              Visa **** 1234
            </span>
          </div>

          <div class="text-center">
            <span class="text-lg text-gray-700">Total:</span>
            <h3
              class="text-4xl font-extrabold text-[#00FFC5]"
              style="-webkit-text-stroke: 1px #0a2463"
            >
              {{ preco }}
            </h3>
          </div>
        </div>

        <div class="p-6 bg-gray-50 flex gap-4">
          <button
            @click="$emit('fechar')"
            class="w-1/2 p-3 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            @click="processar"
            class="w-1/2 p-3 bg-[#00FFC5] text-[#0A2463] font-bold rounded-full hover:bg-opacity-80 transition"
          >
            Confirmar Pagamento
          </button>
        </div>
      </div>

      <div
        v-if="estadoPagamento === 'processando'"
        class="flex flex-col items-center justify-center p-16 h-64"
      >
        <i class="fas fa-spinner fa-spin text-5xl text-[#0A2463]"></i>
        <span class="text-xl text-[#0A2463] font-semibold mt-6"
          >Processando...</span
        >
      </div>

      <div
        v-if="estadoPagamento === 'sucesso'"
        class="flex flex-col items-center justify-center p-16 h-64"
      >
        <i class="fas fa-check-circle text-5xl text-green-500"></i>
        <span class="text-xl text-[#0A2463] font-semibold mt-6"
          >Pagamento Aprovado!</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaymentModalComponent",
  props: {
    plano: String,
    preco: String,
  },
  emits: ["fechar", "pagamentoAprovado"],
  data() {
    return {
      estadoPagamento: "inicial",
    };
  },
  methods: {
    processar() {
      this.estadoPagamento = "processando";

      setTimeout(() => {
        this.estadoPagamento = "sucesso";

        setTimeout(() => {
          this.$emit("pagamentoAprovado");
        }, 1500);
      }, 2000);
    },
  },
};
</script>
