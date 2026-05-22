<template>
  <div class="forum-container">
    <header class="forum-header">
      <h2 class="titulo-amigavel">Espaço Seguro</h2>

      <div class="abas-navegacao">
        <button @click="abaAtiva = 'feed'" :class="{ 'aba-ativa': abaAtiva === 'feed' }">Feed</button>
        <button @click="abaAtiva = 'perfil'" :class="{ 'aba-ativa': abaAtiva === 'perfil' }">Meu Perfil</button>
      </div>

      <RouterLink to="/mapa" class="btn-voltar">🗺️ Mapa</RouterLink>
      <button @click="deslogar" class="btn-sair">Sair</button>
    </header>

  <main class="feed-mensagens">
      <div v-if="postsFiltrados.length === 0" class="card-aviso-vazio">
        <p>Você ainda não fez nenhuma publicação anônima. Suas postagens aparecerão aqui!</p>
      </div>

      <div v-for="(post, index) in postsFiltrados" :key="index" class="card-desabafo">
        <div class="main-post-layout">
          <div class="avatar-anonimo">{{ post.proprio ? '👤' : '✨' }}</div>
          <div class="conteudo-post">
            <p class="texto-post">{{ post.texto }}</p>
            <button v-if="post.proprio" @click="excluirPost(post._id)" class="btn-excluir" title="Excluir publicação">
                🗑️
              </button>

            <span class="data-post">
              {{ post.data }} • {{ post.proprio ? 'Postado por você (Anônimo)' : 'Anônimo' }}
            </span>
            
            <div class="interacoes">
              <button @click="curtir(post)" class="btn-interagir" :class="{ 'curtido': post.curtidoByUser }">
                <span class="icone-coracao">{{ post.curtidoByUser ? '❤️' : '🤍' }}</span> 
                {{ post.curtidas }}
              </button>
              <button @click="post.mostrarRespostas = !post.mostrarRespostas" class="btn-interagir">
                💬 {{ post.respostas ? post.respostas.length : 0 }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="post.mostrarRespostas" class="secao-respostas">
          <div class="lista-respostas">
            <div v-for="(resp, rIndex) in post.respostas" :key="rIndex" class="card-resposta">
              <p class="texto-resposta">{{ resp.texto }}</p>
              <span class="data-post">Anônima</span>
            </div>
          </div>
          
          <div class="input-resposta-wrapper">
            <input 
              v-model="post.novaResposta" 
              type="text" 
              placeholder="Envie uma palavra de apoio..." 
              @keyup.enter="adicionarResposta(index)"
            />
            <button @click="adicionarResposta(index)" class="btn-enviar-resposta">Responder</button>
          </div>
        </div>
      </div>
    </main>

    <footer class="input-container">
      <div class="input-wrapper">
        <input 
          v-model="novoDesabafo" 
          type="text" 
          placeholder="Compartilhe seu desabafo ou dica de segurança..." 
          @keyup.enter="postar"
        />
        <button @click="postar" class="btn-enviar">✨</button>
      </div>
      <p class="aviso-seguranca">Sua identidade está protegida aqui.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const abaAtiva = ref('feed')
const novoDesabafo = ref('')
const desabafos = ref([]) // Começa vazio e puxa do backend

// Busca os posts assim que a tela abre
onMounted(async () => {
  try {
    const response = await axios.get('https://projeto-extensao-3xkh.onrender.com/api/desabafos')
    desabafos.value = response.data
  } catch (error) {
    console.error("Erro ao buscar dados do backend:", error)
  }
})

// Função de Postar ÚNICA e conectada ao Axios
const postar = async () => {
  if (novoDesabafo.value.trim() !== '') {
    try {
      const response = await axios.post('https://projeto-extensao-3xkh.onrender.com/api/desabafos', {
        texto: novoDesabafo.value
      })
      desabafos.value.unshift(response.data)
      novoDesabafo.value = ''
    } catch (error) {
      alert("Erro ao salvar sua publicação no servidor.")
    }
  }
}

// Função de Excluir ÚNICA e conectada ao Axios
const excluirPost = async (id) => {
  const confirmar = confirm("Tem certeza de que deseja apagar permanentemente esta publicação?")
  if (confirmar) {
    try {
      await axios.delete(`https://projeto-extensao-3xkh.onrender.com/api/desabafos/${id}`)
      desabafos.value = desabafos.value.filter(post => post._id !== id)
    } catch (error) {
      alert("Erro ao deletar post do servidor.")
    }
  }
}

const curtir = (post) => {
  if (post.curtidoByUser) {
    post.curtidas--
    post.curtidoByUser = false
  } else {
    post.curtidas++
    post.curtidoByUser = true
  }
}

const adicionarResposta = (post) => {
  if (!post.respostas) post.respostas = []
  if (post.novaResposta.trim() !== '') {
    post.respostas.push({ texto: post.novaResposta })
    post.novaResposta = ''
  }
}

const deslogar = () => {
  router.push('/')
}

const postsFiltrados = computed(() => {
  if (abaAtiva.value === 'perfil') {
    return desabafos.value.filter(post => post.proprio === true)
  }
  return desabafos.value
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');

.forum-container {
  width: 100vw;
  height: 100vh;
  background-color: #fff0f2;
  font-family: 'Quicksand', sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.forum-header {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  max-width: 600px;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  border-radius: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px);
}

.titulo-amigavel {
  color: #5a5a5a;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.abas-navegacao {
  display: flex;
  background: #f0f0f0;
  padding: 4px;
  border-radius: 20px;
}

.abas-navegacao button {
  background: transparent;
  border: none;
  padding: 6px 14px;
  border-radius: 16px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  color: #777;
  cursor: pointer;
  transition: all 0.2s;
}

.abas-navegacao button.aba-ativa {
  background: white;
  color: #ff4d6d;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.btn-voltar {
  text-decoration: none;
  background: #ff4d6d;
  color: white;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.feed-mensagens {
  flex: 1;
  padding: 110px 20px 180px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.card-desabafo {
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 20px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}

.card-aviso-vazio {
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.6);
  padding: 30px;
  border-radius: 24px;
  text-align: center;
  color: #888;
  border: 2px dashed #ffd6dc;
}

.main-post-layout {
  display: flex;
  gap: 15px;
}

.avatar-anonimo {
  width: 45px;
  height: 45px;
  background: #fff0f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.conteudo-post {
  flex: 1;
  text-align: left;
}

.topo-card-post {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.texto-post {
  color: #444;
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0 0 8px 0;
}

.btn-excluir {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 2px 6px;
  border-radius: 8px;
  transition: background 0.2s;
  opacity: 0.5;
}

.data-post {
  color: #aaa;
  font-size: 0.75rem;
  font-weight: 700;
}

.interacoes {
  margin-top: 10px;
  display: flex;
  gap: 15px;
}

.btn-interagir {
  background: #f8f8f8;
  border: none;
  padding: 6px 14px;
  border-radius: 15px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-interagir.curtido {
  color: #ff4d6d;
  background: #fff0f2;
}

.secao-respostas {
  border-top: 1px dashed #ffd6dc;
  padding-top: 12px;
  margin-top: 5px;
}

.lista-respostas {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.card-resposta {
  background: #fafafa;
  padding: 10px 15px;
  border-radius: 16px;
  border-left: 3px solid #ff4d6d;
}

.texto-resposta {
  font-size: 0.88rem;
  color: #555;
  margin: 0 0 4px 0;
}

.input-resposta-wrapper {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.input-resposta-wrapper input {
  flex: 1;
  background: #fdfdfd;
  border: 1px solid #eee;
  padding: 8px 15px;
  border-radius: 15px;
  font-family: 'Quicksand', sans-serif;
  font-size: 0.85rem;
  outline: none;
}

.btn-enviar-resposta {
  background: #ff4d6d;
  color: white;
  border: none;
  padding: 0 15px;
  border-radius: 15px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
}

.input-container {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.98);
  padding: 15px;
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.input-wrapper {
  display: flex;
  gap: 10px;
  background: #f8f8f8;
  padding: 5px 5px 5px 20px;
  border-radius: 25px;
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: 'Quicksand', sans-serif;
  font-size: 0.9rem;
  color: #555;
}

.btn-enviar {
  background: #ff4d6d;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.aviso-seguranca {
  font-size: 0.7rem;
  color: #ffb3c1;
  margin: 8px 0 0;
  font-weight: 700;
  text-align: center;
}

.acoes-header {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-voltar {
  text-decoration: none;
  background: #ff4d6d;
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  transition: opacity 0.2s;
}

.btn-sair {
  background: #f0f0f0;
  color: #666;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-family: 'Quicksand', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sair:hover {
  background: #ffe5e9;
  color: #ff4d6d;
}
</style>