<template>
  <div class="mapa-container">
    <header class="mapa-header">
      <h2 class="titulo-amigavel">Diga: "MAPA!"</h2>
      <button class="btn-sos-feminino" @click="emitirAlerta">SOS</button>
    </header>

    <div id="map"></div>

    <div class="controles-mapa">
      <p class="texto-suave">Toque no mapa para sinalizar um ponto de risco.</p>
      <RouterLink to="/desabafos" class="btn-comunidade">Ir para Espaço Seguro</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import axios from 'axios'

const marcacoes = ref([]) //Variável para guardar as marcações do banco

// Função que dispara o SOS
const emitirAlerta = () => {
  //Pega o número salvo
  let telefone = localStorage.getItem('numeroConfiancaAlia');
  //Se não tiver número, pede para configurar
  if (!telefone) {
    const novoNum = prompt("Configure seu SOS: Digite o número com DDD (ex: 21999999999):");
    if (novoNum) {
      telefone = novoNum.replace(/\D/g, '');
      localStorage.setItem('numeroConfiancaAlia', telefone);
      alert("Número salvo! Agora clique no SOS novamente para enviar o alerta.");
    }
    return;
  }
  //Tenta pegar a localização e enviar
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const link = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        const msg = `🚨ALIA ALERT!🚨 Preciso de ajuda. Minha localização: ${link}`;
        
        abrirWhatsApp(telefone, msg);
      },
      () => {
        const msg = "🚨ALIA ALERT!🚨 Preciso de ajuda urgente!";
        abrirWhatsApp(telefone, msg);
      }
    );
  }
}

// Função auxiliar para forçar a abertura do App
const abrirWhatsApp = (telefone, msg) => {
  const mensagemCodificada = encodeURIComponent(msg);
  
  // O formato whatsapp://send tenta abrir o app diretamente no mobile
  // O link https://wa.me é o fallback caso o primeiro falhe
  const urlApp = `whatsapp://send?phone=55${telefone}&text=${mensagemCodificada}`;
  const urlWeb = `https://wa.me/55${telefone}?text=${mensagemCodificada}`;

  // Tenta abrir o protocolo do App
  window.location.href = urlApp;

  // Se o dispositivo não conseguir abrir o app em 1 segundo, abre na web
  setTimeout(() => {
    window.open(urlWeb, '_blank');
  }, 1000);
}

onMounted(async () => {
  const map = L.map('map', { zoomControl: false }).setView([-22.9223, -43.2477], 15)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map)
  //Carregar marcações salvas ao abrir o mapa
  try {
    const res = await axios.get('https://projeto-extensao-3xkh.onrender.com/api/mapa/marcacoes')
    marcacoes.value = res.data
    //Desenha cada marcação salva no mapa
    marcacoes.value.forEach(m => {
      L.marker([m.lat, m.lng]).addTo(map).bindPopup(`<b>Risco:</b><br>${m.descricao}`)
    })
  } catch (err) { console.error("Erro ao carregar:", err) }

//Salvar nova marcação
  map.on('click', async (e) => {
    const { lat, lng } = e.latlng
    const desc = prompt("Descreva o risco neste local:")
    if (desc) {
      try {
        const novaMarca = { lat, lng, descricao: desc }
        const res = await axios.post('https://projeto-extensao-3xkh.onrender.com/api/mapa/marcacoes', novaMarca)
        
        // Adiciona o pino visualmente após o sucesso no banco
        L.marker([lat, lng]).addTo(map).bindPopup(`<b>Risco:</b><br>${desc}`).openPopup()
      } catch (e) { alert("Erro ao salvar marcação.") }
    }
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');

* {
  box-sizing: border-box !important;
  max-width: 100% !important;
}

.mapa-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

:global(html, body) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
}

.mapa-header {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 500px;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.92);
  padding: 12px 20px;
  border-radius: 30px; /* Cantos bem arredondados */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(5px);
}

.titulo-amigavel {
  color: #5a5a5a;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.btn-sos-feminino {
  background: #ff4d6d; /* Vermelho/rosa vivo do tema */
  color: white;
  border: none;
  padding: 8px 22px;
  border-radius: 25px; /* Bordas totalmente curvas */
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.3);
  transition: all 0.2s ease;
}

.btn-sos-feminino:active {
  transform: scale(0.95);
  box-shadow: 0 2px 6px rgba(255, 77, 109, 0.3);
}

.controles-mapa {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  max-width: 400px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.texto-suave {
  color: #777;
  font-size: 0.9rem;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.btn-comunidade {
  display: inline-block;
  width: 100%;
  padding: 12px;
  background: #fff0f2;
  color: #ff4d6d;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 18px;
  transition: background 0.2s;
}

.btn-comunidade:hover {
  background: #ffd6dc;
}
</style>