<template>
    <div class="min-h-screen flex justify-center items-center bg-[#F0F4F8]">
        
        <div class="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl text-center">
            
            <div class="text-4xl font-bold text-[#0A2463] mb-6">
                <i class="fas fa-dumbbell text-[#00FFC5] mr-2"></i> Pump & Go
            </div>
            
            <h1 class="text-2xl font-semibold text-[#0A2463] mb-3">Redefinir Senha</h1> 
            
            <p class="text-gray-600 mb-8 text-sm">
                Crie uma nova senha para sua conta.
            </p> <form class="space-y-5" novalidate @submit.prevent="handleReset">
                
                <div class="text-left">
                    <label for="email" class="block font-bold text-gray-700 mb-1">E-mail</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="seu.email@exemplo.com" 
                        required 
                        class="w-full px-4 py-3 border border-[#8D99AE] rounded-lg text-base focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30 transition duration-300"
                        v-model="email" @blur="validateField('email')" :class="{ 'border-red-500 ring-4 ring-red-500/30': validation.emailInvalid }">
                </div>

                <div class="text-left">
                    <label for="new-password" class="block font-bold text-gray-700 mb-1">Nova Senha (Mín. 6 caracteres)</label>
                    <input 
                        type="password" 
                        id="new-password" 
                        placeholder="••••••••" 
                        required 
                        class="w-full px-4 py-3 border border-[#8D99AE] rounded-lg text-base focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30 transition duration-300"
                        v-model="newPassword" @blur="validateField('newPassword')" :class="{ 'border-red-500 ring-4 ring-red-500/30': validation.newPasswordInvalid }">
                </div>
                
                <div class="text-left">
                    <label for="confirm-password" class="block font-bold text-gray-700 mb-1">Confirmar Senha</label>
                    <input 
                        type="password" 
                        id="confirm-password" 
                        placeholder="••••••••" 
                        required 
                        class="w-full px-4 py-3 border border-[#8D99AE] rounded-lg text-base focus:outline-none focus:border-[#00FFC5] focus:ring-4 focus:ring-[#00FFC5]/30 transition duration-300"
                        v-model="confirmPassword" @blur="validateField('confirmPassword')" :class="{ 'border-red-500 ring-4 ring-red-500/30': validation.confirmPasswordInvalid }">
                </div>

                <button type="submit" class="w-full p-3 bg-[#0A2463] text-white font-bold rounded-lg text-lg hover:bg-opacity-90 transition duration-300 mt-6 shadow-md">
                    Salvar Nova Senha
                </button>

                <router-link to="/login" class="block text-sm text-gray-600 hover:text-[#00FFC5] transition duration-300 mt-4">
                    <i class="fa-solid fa-arrow-left mr-1"></i> Voltar ao Login
                </router-link>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ResetPasswordView',
    data() {
        return {
            email: '',
            newPassword: '',
            confirmPassword: '',
            validation: {
                emailInvalid: false,
                newPasswordInvalid: false,
                confirmPasswordInvalid: false,
            }
        };
    },
    methods: {
        validateField(fieldName) {
            let isValid = true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (fieldName === 'email') {
                isValid = emailRegex.test(this.email);
                this.validation.emailInvalid = !isValid;
            } 
            
            else if (fieldName === 'newPassword') {
                isValid = this.newPassword.length >= 6;
                this.validation.newPasswordInvalid = !isValid;
                
                if (this.confirmPassword.length > 0) {
                    this.validateField('confirmPassword');
                }
            } 
            
            else if (fieldName === 'confirmPassword') {
                const isMatch = this.confirmPassword === this.newPassword;
                isValid = isMatch && this.confirmPassword.length > 0;
                this.validation.confirmPasswordInvalid = !isValid;
            }

            if (isValid) {
                 this.validation[fieldName + 'Invalid'] = false;
            }
        },
        
        handleReset() {
            this.validateField('email');
            this.validateField('newPassword');
            this.validateField('confirmPassword');
            
            const hasError = Object.values(this.validation).some(isInvalid => isInvalid);

            if (hasError) {
                alert('Por favor, preencha todos os campos corretamente.');
                return;
            }
                        alert('Senha redefinida com sucesso!');

            this.$router.push('/login');
        }
    }
}
</script>