<template>
    <div class="min-h-screen flex justify-center items-center bg-[#F0F4F8]">

        <div class="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl text-center">

            <h1 class="text-4xl font-bold text-[#0A2463] mb-6 flex justify-center items-center gap-2">
                <i class="fa-solid fa-dumbbell text-[#00FFC5]"></i>
                Pump & Go
            </h1>

            <h2 class="text-2xl font-semibold text-[#0A2463] mb-8">Crie sua conta</h2>

            <form class="space-y-5" novalidate @submit.prevent="handleRegister">

                <div class="text-left">
                    <label for="name" class="block font-bold text-gray-700 mb-1">Nome Completo</label>
                    <input 
                        type="text"
                        id="name"
                        placeholder="Seu Nome"
                        required
                        v-model="name"
                        @blur="validateField('name')"
                        class="w-full px-4 py-3 border border-[#8D99AE] rounded-lg text-base 
                               focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30 
                               transition duration-300"
                        :class="{ 'border-red-500 ring-4 ring-red-500/30': validation.nameInvalid }"
                    >
                </div>

                <div class="text-left">
                    <label for="email" class="block font-bold text-gray-700 mb-1">E-mail</label>
                    <input 
                        type="email"
                        id="email"
                        placeholder="seu.email@exemplo.com"
                        required
                        v-model="email"
                        @blur="validateField('email')"
                        class="w-full px-4 py-3 border border-[#8D99AE] rounded-lg text-base 
                               focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30 
                               transition duration-300"
                        :class="{ 'border-red-500 ring-4 ring-red-500/30': validation.emailInvalid }"
                    >
                </div>

                <div class="text-left">
                    <label for="password" class="block font-bold text-gray-700 mb-1">Senha</label>
                    <input 
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        required
                        v-model="password"
                        @blur="validateField('password')"
                        class="w-full px-4 py-3 border border-[#8D99AE] rounded-lg text-base 
                               focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30 
                               transition duration-300"
                        :class="{ 'border-red-500 ring-4 ring-red-500/30': validation.passwordInvalid }"
                    >
                    <p class="text-xs text-gray-500 mt-1 italic">
                        *A senha deve ter no mínimo 6 caracteres
                    </p>
                </div>

                <div class="text-left">
                    <label for="confirm-password" class="block font-bold text-gray-700 mb-1">Confirmar Senha</label>
                    <input 
                        type="password"
                        id="confirm-password"
                        placeholder="••••••••"
                        required
                        v-model="confirmPassword"
                        @blur="validateField('confirmPassword')"
                        class="w-full px-4 py-3 border border-[#8D99AE] rounded-lg text-base 
                               focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30 
                               transition duration-300"
                        :class="{ 'border-red-500 ring-4 ring-red-500/30': validation.confirmPasswordInvalid }"
                    >
                </div>

                <div v-if="apiError" class="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                    {{ apiError }}
                </div>

                <button 
                    type="submit"
                    class="w-full p-3 bg-[#00FFC5] text-[#0A2463] font-bold rounded-lg text-lg 
                           hover:bg-opacity-80 transition duration-300 mt-6 shadow-md"
                    :disabled="isLoading"
                >
                    <span v-if="isLoading">Criando conta...</span>
                    <span v-else>Cadastrar</span>
                </button>

                <div class="mt-5 text-sm">
                    Já tem conta?
                    <router-link 
                        to="/login" 
                        class="font-bold text-[#0A2463] hover:text-[#00FFC5] transition duration-300"
                    >
                        Faça login aqui.
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import apiService from '@/services/api.js';

export default {
    name: 'CadastroView',

    data() {
        return {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',

            validation: {
                nameInvalid: false,
                emailInvalid: false,
                passwordInvalid: false,
                confirmPasswordInvalid: false,
            },

            isLoading: false,
            apiError: null,
        };
    },

    methods: {
        validateField(fieldName) {
            let value = this[fieldName];
            let isValid = true;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (fieldName === 'name') {
                isValid = value.trim().length >= 3;
                this.validation.nameInvalid = !isValid;
            } 
            else if (fieldName === 'email') {
                isValid = emailRegex.test(value);
                this.validation.emailInvalid = !isValid;
            } 
            else if (fieldName === 'password') {
                isValid = value.length >= 6;
                this.validation.passwordInvalid = !isValid;
            } 
            else if (fieldName === 'confirmPassword') {
                isValid = value.length > 0 && value === this.password;
                this.validation.confirmPasswordInvalid = !isValid;
            }
        },

        async handleRegister() {
            this.validateField('name');
            this.validateField('email');
            this.validateField('password');
            this.validateField('confirmPassword');

            const hasError = Object.values(this.validation).some(v => v);

            if (hasError) {
                this.apiError = 'Por favor, preencha todos os campos corretamente.';
                return;
            }

            this.isLoading = true;
            this.apiError = null;

            try {
                await apiService.register({
                    name: this.name,
                    email: this.email,
                    password: this.password
                });

                alert('Cadastro bem sucedido! Você será redirecionado para o login.');
                this.$router.push('/login');

            } catch (error) {
                console.error('Erro no cadastro:', error);
                this.apiError = error.response?.data?.message || 'Ocorreu um erro desconhecido.';
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>