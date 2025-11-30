<template>
    <footer class="bg-[#0A2463] text-white p-6 mt-auto">
        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            
            <div class="w-full lg:w-1/3 text-center lg:text-left">
                <h3 class="text-lg font-bold mb-2 text-[#00FFC5]">Sobre Nós</h3>
                <p class="text-sm text-black-300 max-w-sm mx-auto lg:mx-0">
                    Sua plataforma completa de treinos. Conectamos você aos melhores planos e profissionais para atingir seus objetivos, baseados em confiança e tecnologia.
                </p>
            </div>

            <div class="w-full lg:w-1/3 text-center">
                <h3 class="text-lg font-bold mb-2 text-[#00FFC5]">Contato</h3>
                <div class="flex justify-center space-x-4">
                    <a href="#" target="_blank" title="Instagram" class="text-black-300 hover:text-[#00FFC5] transition duration-200">
                        <i class="fab fa-instagram text-2xl"></i>
                    </a>
                    <a href="#" target="_blank" title="Facebook" class="text-black-300 hover:text-[#00FFC5] transition duration-200">
                        <i class="fab fa-facebook-f text-2xl"></i>
                    </a>
                </div>
            </div>

            <div class="w-full lg:w-1/3 text-center lg:text-right">
                <h3 class="text-lg font-bold mb-2 text-[#00FFC5]">Suporte</h3>
                <a href="#" class="text-black-300 hover:text-[#00FFC5] font-semibold transition duration-200">Precisa de ajuda?</a>
            </div>

        </div>
        
        <div class="text-center text-xs text-black-400 mt-6 pt-4 border-t border-black-700">&copy; {{ currentYear }} Pump & Go. Todos os direitos reservados.</div>
    </footer>
</template>

<script>
export default {
    name: 'FooterComponent',
    data() {
        return {
            currentYear: new Date().getFullYear()
        }
    }
}
</script>

<style scoped>
</style>