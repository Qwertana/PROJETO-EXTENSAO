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
import { onMounted } from 'vue'
import L from 'leaflet'

// Nova função MVP conectada ao WhatsApp
const emitirAlerta = () => {
  //Tenta buscar o número salvo na memória do celular/navegador
  let telefoneConfianca = localStorage.getItem('numeroConfiancaAlia');

  //Se a usuária ainda não tiver cadastrado um número
  if (!telefoneConfianca) {
    const numeroDigitado = prompt("Configure seu SOS: Digite o número de confiança com DDD (ex: 21999999999):");
    
    // Se ela digitou algo, limpa os espaços/traços e salva
    if (numeroDigitado) {
      telefoneConfianca = numeroDigitado.replace(/\D/g, ''); // Remove tudo que não for número
      localStorage.setItem('numeroConfiancaAlia', telefoneConfianca);
      alert("Número salvo com sucesso! O seu botão de SOS já está configurado.");
    }
    
    // Interrompo aqui para ela não mandar um alerta acidental logo após configurar
    return; 
  }

  // Se o número já existe na memória, dispara o alerta direto!
  const ddi = "55"; // Código do Brasil
  const mensagem = "🚨 SOS ALIA! Este é um alerta de emergência. Estou no Andaraí, preciso de ajuda urgente. Por favor, entre em contato.";

  const url = `https://wa.me/${ddi}${telefoneConfianca}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

onMounted(() => {
  const map = L.map('map', { zoomControl: false }).setView([-22.9223, -43.2477], 15)

  // Move o controle de zoom (+/-) para o canto inferior direito
  L.control.zoom({ position: 'bottomright' }).addTo(map)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map)

  map.on('click', (e) => {
    const { lat, lng } = e.latlng
    const desc = prompt("Descreva o risco neste local (ex: Falta de iluminação, Ponto isolado):")
    
    if (desc) {
      L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>Risco sinalizado:</b><br>${desc}`)
        .openPopup()
    }
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');

.mapa-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Quicksand', sans-serif;
}

#map {
  width: 100%;
  height: 100%;
  z-index: 1;
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