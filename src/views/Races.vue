<template>
  <!-- Pre-load
  (*) Nota: Preloader exibido enquanto os dados estão sendo carregados via fetch. 
  Usei um v-if vinculado à variável 'isLoading' para mostrar o carregamento
  apenas durante a requisição dos dados da API. Ao final do carregamento,
  o preloader desaparece suavemente com uma transição (fade), e o conteúdo
  principal é exibido.
   -->

   <transition name="fade" appear>
    <div v-if="isLoading" class="preloader">
      <i class="fas fa-spinner fa-spin fa-3x"></i>
      <p>Please Wait</p>
    </div>
  </transition>

  <transition name="fade">
    <div v-show="!isLoading">

    <div>
      <!-- Header -->
      <header>
        <router-link to="/" class="logo">LOGO</router-link>
        <nav>
          <router-link to="/">Page 1</router-link>
          <router-link to="/races" class="active">Page 2</router-link>
        </nav>
      </header>

      <!-- body -->
      <main>
        <div class="controls">
          <div class="left-control">
            <label for="year">Year:</label>
            <select v-model="selectedYear" @change="fetchRaces" class="year-select">
              <option v-for="year in years" :key="year">{{ year }}</option>
            </select>
          </div>

          <div class="right-control">
            <button @click="toggleSort" class="sort-button">
              <i :class="['fas', sortOrder === 'asc' ? 'fa-sort-amount-up' : 'fa-sort-amount-down', 'sort-icon']"></i>
            </button>
          </div>
        </div>

        <!-- Accordion -->
        <div class="accordion">
          <div v-for="race in sortedRaces" :key="race.round" class="accordion-item">
            <div class="accordion-header" @click="toggleRace(race.round)">
              <span class="race-title">{{ race.raceName }}</span>
              <span class="race-date">{{ formatDateHeader(race.date, race.time) }}</span>
              <span :class="['arrow-icon', { open: openRace === race.round }]">
                <i class="fa-solid fa-chevron-down"></i>
              </span>
            </div>

            <!-- Corpo transição -->
            <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
              <div v-if="openRace === race.round" class="accordion-body">
                <div class="session-grid">
                  <div v-for="session in getSessions(race)" :key="session.name" class="session">
                    <span class="session-name">{{ session.name }}</span>
                    <span class="session-time">{{ formatDate(session.date) }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </main>

      <footer>
        <div class="footer-logo">LOGO</div>
        <div class="footer-copy">[name] 2025</div>
      </footer>
    </div>


      </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const races = ref([])
const isLoading = ref(true)
const selectedYear = ref(2024)
const openRace = ref(null)
const sortOrder = ref('asc')

const years = [2020, 2021, 2022, 2023, 2024]

function fetchRaces() {
  fetch(`https://api.jolpi.ca/ergast/f1/${selectedYear.value}.json`)
    .then(r => r.json())
    .then(d => {
      races.value = d.MRData.RaceTable.Races
    })
    .catch(err => {
      console.error('Erro ao buscar dados:', err)
      races.value = []
    })
}

const sortedRaces = computed(() => {
  return [...races.value].sort((a, b) => {
    const da = new Date(a.date)
    const db = new Date(b.date)
    return sortOrder.value === 'asc' ? da - db : db - da
  })
})

function toggleRace(round) {
  openRace.value = openRace.value === round ? null : round
}

function toggleSort() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

function getSessions(race) {
  const sessions = [
    { name: 'FP1', raw: race.FirstPractice },
    { name: 'FP2', raw: race.SecondPractice },
    { name: 'FP3', raw: race.ThirdPractice },
    { name: 'QUALIFYING', raw: race.Qualifying }
  ]
  return sessions.map(s => {
    if (!s.raw?.date || !s.raw?.time) return null
    return { name: s.name, date: `${s.raw.date}T${s.raw.time}` }
  }).filter(Boolean)
}

function fmt(dateStr, opts) {
  const date = new Date(dateStr)
  return isNaN(date) ? 'Data inválida' : date.toLocaleString('pt-BR', opts).replace(',', ' -')
}

function formatDate(d) {
  return fmt(d, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatDateHeader(date, time) {
  return fmt(`${date}T${time}`, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
}

function beforeEnter(el) {
  el.style.height = '0'
  el.style.opacity = '0'
}
function enter(el) {
  const h = el.scrollHeight
  el.style.transition = 'all 0.1s'
  el.style.height = h + 'px'
  el.style.opacity = '1'
  el.addEventListener('transitionend', () => { el.style.height = 'auto' }, { once: true })
}
function leave(el) {
  el.style.height = el.scrollHeight + 'px'
  void el.offsetHeight
  el.style.transition = 'all 0.1s'
  el.style.height = '0'
  el.style.opacity = '0'
}

onMounted(async () => {
  try {
    const res = await fetch('https://ergast.com/api/f1/2023.json')
    const data = await res.json()
    races.value = data.MRData.RaceTable.Races
  } catch (e) {
    console.error('Erro ao carregar dados:', e)
  } finally {
    isLoading.value = false
  }
})

onMounted(fetchRaces)
</script>

<style scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-size: 1rem;
  color: #444;
}

/* Transição fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
