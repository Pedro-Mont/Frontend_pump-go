<template>
    <div class="min-h-screen flex justify-center items-center bg-[#F0F4F8]">

        <div class="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl text-center">

            <div class="text-4xl font-bold text-[#0A2463] mb-6">
                <i class="fa-solid fa-dumbbell text-[#00FFC5] mr-2"></i> Pump & Go
            </div>

            <h1 class="text-2xl font-semibold text-[#0A2463] mb-8">Acesse sua conta</h1>

            <form class="space-y-5" novalidate @submit.prevent="handleLogin">

                <div class="text-left">
                    <label for="email" class="block font-bold text-black-700 mb-1">E-mail</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="seu.email@exemplo.com"
                        required 
                        class="w-full px-4 py-3 border border-[#8D99AE] rounded-lg text-base focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30 transition duration-300"
                        v-model="email"
                        @blur="validateField('email')" 
                        :class="{ 'border-red-500 ring-4 ring-red-500/30': validation.emailInvalid }"
                    >
                </div>

                <div class="text-left">
                    <label for="password" class="block font-bold text-black-700 mb-1">Senha</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="••••••••" 
                        required 
                        class="w-full px-4 py-3 border border-[#8D99AE] rounded-lg text-base focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30 transition duration-300"
                        v-model="password"
                        @blur="validateField('password')" 
                        :class="{ 'border-red-500 ring-4 ring-red-500/30': validation.passwordInvalid }"
                    >
                </div>

                <div v-if="apiError" class="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                    {{ apiError }}
                </div>

                <button 
                    type="submit" 
                    class="w-full p-3 bg-[#0A2463] text-white font-bold rounded-lg text-lg hover:bg-opacity-90 transition duration-300 mt-6 disabled:bg-gray-400"
                    :disabled="isLoading"
                >
                    <span v-if="isLoading">Entrando...</span>
                    <span v-else>Entrar</span>
                </button>

                <router-link to="/resetpassword" class="block text-sm text-black-600 hover:text-[#00FFC5] transition duration-300 mt-4">
                    Esqueceu sua senha?
                </router-link>

                <div class="mt-5 text-sm">
                    Não tem conta?
                    <router-link to="/cadastro" class="font-bold text-[#0A2463] hover:text-[#00FFC5] transition duration-300">
                        Crie a sua agora!
                    </router-link>
                </div>

            </form>
        </div>
    </div>
</template>

<script>
import apiService from '@/services/api.js';

export default {
    name: 'LoginPage',
    
    data() {
        return {
            email: '',
            password: '',
            validation: {
                emailInvalid: false,
                passwordInvalid: false,
            },
            isLoading: false,
            apiError: null,
        };
    },

    methods: {
        validateField(fieldName) {
            let value = this[fieldName];
            let isValid = true;

            if (fieldName === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                this.validation.emailInvalid = !isValid;
            }

            if (fieldName === 'password') {
                isValid = value.length > 0;
                this.validation.passwordInvalid = !isValid;
            }
        },

        async handleLogin() {
            this.validateField('email');
            this.validateField('password');

            if (this.validation.emailInvalid || this.validation.passwordInvalid) {
                this.apiError = 'Por favor, preencha os campos corretamente.';
                return;
            }

            this.isLoading = true;
            this.apiError = null;

            try {
                const response = await apiService.login({
                    email: this.email,
                    password: this.password
                });

                const token = response.data.token;
                localStorage.setItem('user-token', token);

                const redirectPath = this.$route.query.redirect || '/'; 
                await this.$router.push(redirectPath);
            } 
            catch (error) {
                console.error('Erro no login:', error);
                this.apiError = error.response?.data?.message || 'Ocorreu um erro desconhecido.';
            } 
            finally {
                this.isLoading = false;
            }
        }
    }
};
</script>