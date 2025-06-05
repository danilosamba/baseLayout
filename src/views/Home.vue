<template>
  <div>
    <!-- Cabeçalho com logotipo e navegação -->
    <header>
      <router-link to="/" class="logo">LOGO</router-link>
      <nav>
        <!-- Links de navegação entre páginas -->
        <router-link to="/" class="active">Page 1</router-link>
        <router-link to="/races">Page 2</router-link>
      </nav>
    </header>

    <!-- Seção principal do slider/carrossel -->
    <section class="slider">
      <!-- Contêiner dos slides, movido dinamicamente com CSS -->
      <div class="slides" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(slide, i) in slides" :key="i" class="slide">
          <div class="overlay"></div> <!-- Escurece a imagem para realçar o texto -->
          <img class="slide-image full" :src="slide.img1" alt="Slide image 1" />

          <!-- Texto animado aparece somente no slide ativo -->
          <transition name="fade-slide">
            <h1 v-if="i === currentIndex" class="slide-text">{{ slide.text }}</h1>
          </transition>
        </div>
      </div>

      <!-- Botões de navegação manual -->
      <button id="prevBtn" @click="prevSlide"></button>
      <button id="nextBtn" @click="nextSlide"></button>
    </section>

    <!-- Seção com blocos de conteúdo alternando texto e imagem -->
    <section class="content">
      <div class="row">
        <div class="block text left">
          <h2>Lorem ipsum</h2>
          <p class="text-right">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse.</p>
        </div>
        <div class="block image right hoverable"></div>
      </div>

      <div class="row">
        <div class="block image left hoverable"></div>
        <div class="block text right">
          <h2>Lorem ipsum</h2>
          <p class="text-right">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse.</p>
        </div>
      </div>
    </section>

    <!-- Rodapé com logotipo e direitos -->
    <footer>
      <div class="footer-logo">LOGO</div>
      <div class="footer-copy">[name] 2025</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Lista de slides com texto e imagem
const slides = [
  { text: 'Slide 1 - Lorem ipsum', img1: '/assets/images/slide1.jpg' },
  { text: 'Slide 2 - Dolor sit amet', img1: '/assets/images/slide2.jpg' },
  { text: 'Slide 3 - Consectetur elit', img1: '/assets/images/slide3.jpg' }
]

// Índice do slide atualmente visível
const currentIndex = ref(0)

// Variável para armazenar o intervalo do autoplay
let interval = null

// Função para avançar o slide (com retorno ao primeiro)
function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % slides.length
}

// Função para retroceder o slide (volta ao último se estiver no primeiro)
function prevSlide() {
  currentIndex.value = currentIndex.value > 0 ? currentIndex.value - 1 : slides.length - 1
}

// Inicia o autoplay ao montar o componente
onMounted(() => {
  interval = setInterval(nextSlide, 5000) 
})

// Limpa o intervalo ao desmontar o componente
onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
/* ----- SLIDER PRINCIPAL ----- */
.slider {
  /*Apenas Seguindo a base com esta margem particularmente prefiro slide junto ao header */
  margin: 1rem 0 0 0;
  width: 100%;
  height: 420px;
  background: #111;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  position: relative;
  overflow: hidden; 
}

.slides {
  display: flex;
  transition: transform 1s ease;
}

.slide {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100%;
  height: 420px;
  position: relative;
  overflow: hidden;
}

.slide-image.full {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.slide-text {
  font-size: 2rem;
  text-align: center;
  position: relative;
  z-index: 2;
  color: white;
  padding: 1rem;
  animation: fadeIn 1s ease-in-out forwards;
}

/* ----- TRANSIÇÕES ENTRE SLIDES ----- */
.fade-slide-enter-active {
  animation: fadeIn 1s ease forwards;
}
.fade-slide-leave-active {
  animation: fadeOut 1s ease forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-30px); }
}

/* ----- BOTÕES DE NAVEGAÇÃO ----- */
button#prevBtn, button#nextBtn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 3;
  transition: transform 0.3s ease;
}
#prevBtn { left: 20px; }
#nextBtn { right: 20px; }
button:hover {
  transform: translateY(-50%) scale(1.1);
}

/* ----- Conteúdo em dois blocos ----- */
.content {
  padding: 2rem;
}
.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.block {
  width: 48%;
}

/* Bloco de imagem com efeito hover */
.block.image {
  height: 320px;
  background: url('/assets/images/placeholder.jpg') center/cover no-repeat;
  transition: transform 0.3s ease, filter 0.3s ease;
}
.block.image.hoverable:hover {
  transform: scale(1.05);
  filter: brightness(1.2);
}

/* Alinhamentos de texto */
.block.text.left { text-align: left; }
.block.text.right { text-align: right; }

.block.text h2 {
  margin-bottom: 1rem;
}
.block.text p {
  text-align: justify;
}

/* ----- Rodapé ----- */
.footer-logo {
  font-size: 1.5rem;
}
.footer-copy {
  font-size: 0.9rem;
  opacity: 0.7;
}
</style>
