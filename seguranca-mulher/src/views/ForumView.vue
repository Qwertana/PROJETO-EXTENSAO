<template>
  <div class="forum-container registro-page">
    <header class="forum-header">
      <h2 class="titulo-amigavel">Espaço Seguro</h2>

      <div class="abas-navegacao">
        <button @click="abaAtiva = 'feed'" :class="{ 'aba-ativa': abaAtiva === 'feed' }">Feed</button>
        <button @click="abaAtiva = 'perfil'" :class="{ 'aba-ativa': abaAtiva === 'perfil' }">Meu Perfil</button>
        <button @click="abaAtiva = 'editar'" :class="{ 'aba-ativa': abaAtiva === 'editar' }">Editar Perfil</button>
      </div>

      <div class="acoes-header">
        <RouterLink to="/mapa" class="btn-voltar">Mapa</RouterLink>
        <button @click="deslogar" class="btn-sair">Sair</button>
      </div>
    </header>

    <main class="feed-mensagens">
      <template v-if="abaAtiva !== 'editar'">
        <div v-if="postsFiltrados.length === 0" class="card-aviso-vazio">
          <p>Nenhuma publicação encontrada aqui!</p>
        </div>

        <div v-for="(post, index) in postsFiltrados" :key="post._id || index" class="card-desabafo">
          <div class="main-post-layout">
            <div class="avatar-anonimo">{{ post.proprio ? '👤' : '✨' }}</div>
            <div class="conteudo-post">
              <p class="texto-post">{{ post.texto }}</p>
              
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="data-post">{{ post.data || 'Agora' }} • {{ post.proprio ? 'Postado por você' : 'Anônimo' }}</span>
                <button v-if="post.proprio" @click="excluirPost(post._id)" class="btn-excluir" title="Excluir">🗑️</button>
              </div>

              <div class="interacoes">
                <button @click="curtir(post)" class="btn-interagir" :class="{ 'curtido': post.curtidoByUser }">
                  <span>{{ post.curtidoByUser ? '❤️' : '🤍' }}</span> {{ post.curtidas || 0 }}
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
              </div>
            </div>
            <div class="input-resposta-wrapper">
              <input v-model="post.novaResposta" type="text" placeholder="Apoie este desabafo..." @keyup.enter="adicionarResposta(post)" />
              <button @click="adicionarResposta(post)" class="btn-enviar-resposta">Enviar</button>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="card-editar-perfil">
        <h3 class="titulo-sessao">Configurações de Segurança</h3>
        <p class="texto-instrucao">O número abaixo receberá um alerta se você acionar o SOS.</p>
        
        <div class="input-grupo">
          <label>Número de Emergência (DDD + Telefone):</label>
          <input v-model="telefoneConfianca" type="text" placeholder="Ex: 21999999999" maxlength="11" />
        </div>
        
        <div class="botoes-perfil-container">
          <button @click="salvarPerfil" class="btn-salvar-perfil">Salvar Alterações</button>
          <button @click="excluirNumero" class="btn-deletar-perfil">Remover Número</button>
        </div>

        <button @click="excluirConta" class="btn-excluir-conta-dentro">
          Excluir minha conta permanentemente
        </button>
      </div>
    </main>

    <footer v-if="abaAtiva !== 'editar'" class="input-container">
      <div class="input-wrapper">
        <input v-model="novoDesabafo" type="text" placeholder="Compartilhe seu desabafo..." @keyup.enter="postar" />
        <button @click="postar" class="btn-enviar">✨</button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const desabafos = ref([])
const novoDesabafo = ref('')
const abaAtiva = ref('feed')
const telefoneConfianca = ref('')

// Sistema de segurança extra: tenta pegar qualquer variação de nome de CPF salva no login
const cpfLogado = localStorage.getItem('cpfUsuario') || localStorage.getItem('cpf') || localStorage.getItem('usuarioCpf') || '';

// ==========================================
// 1. CONFIGURAÇÕES DE PERFIL E CONTA
// ==========================================
const salvarPerfil = () => {
  if (telefoneConfianca.value.length < 10) {
    return alert("Digite um número válido com DDD.")
  }
  localStorage.setItem('numeroConfiancaAlia', telefoneConfianca.value)
  alert("Número de emergência atualizado com sucesso!")
}

const excluirNumero = () => {
  localStorage.removeItem('numeroConfiancaAlia')
  telefoneConfianca.value = ''
  alert("Número removido com sucesso!")
}

const excluirConta = async () => {
  if (!confirm("Tem certeza? Esta ação apagará seus dados permanentemente e deixará seus posts anônimos.")) return;
  try {
    if (!cpfLogado) return alert("Erro: Usuária não identificada no navegador.");
    
    const res = await fetch(`https://projeto-extensao-3xkh.onrender.com/api/usuarios/${cpfLogado}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) throw new Error("Erro ao deletar conta no servidor.");
    
    localStorage.clear();
    alert("Sua conta foi excluída. Seus posts agora são 100% anônimos.");
    router.push('/login');
  } catch (error) {
    console.error(error);
    alert("Erro ao excluir conta. Verifique sua conexão.");
  }
};

const deslogar = () => {
  localStorage.clear();
  router.push('/login');
};

// ==========================================
// 2. CARREGAMENTO DOS POSTS (NATIVE FETCH)
// ==========================================
const carregarPosts = async () => {
  try {
    const res = await fetch('https://projeto-extensao-3xkh.onrender.com/api/desabafos');
    if (res.ok) {
      desabafos.value = await res.json();
    }
  } catch (err) {
    console.error("Erro ao carregar desabafos", err);
  }
};

onMounted(() => {
  const salvo = localStorage.getItem('numeroConfiancaAlia')
  if (salvo) telefoneConfianca.value = salvo
  carregarPosts();
})

// ==========================================
// 3. LÓGICA DE FILTRAGEM (CORRIGE O "POSTADO POR VOCÊ")
// ==========================================
const postsFiltrados = computed(() => {
  return desabafos.value.map(post => {
    // Força a comparação real de CPFs ignorando qualquer bug de true/false do banco
    const souDona = Boolean(
      post.cpfAutor && 
      cpfLogado && 
      String(post.cpfAutor).trim() === String(cpfLogado).trim() &&
      post.cpfAutor !== 'excluido'
    );

    // Identifica se você já curtiu baseado na lista de CPFs do back-end
    const jaCurtiu = Array.isArray(post.usuariosQueCurtiram) && post.usuariosQueCurtiram.includes(cpfLogado);

    return {
      ...post,
      proprio: souDona,
      curtidoByUser: jaCurtiu
    };
  }).filter(post => {
    if (abaAtiva.value === 'perfil') return post.proprio;
    return true;
  });
});

// ==========================================
// 4. AÇÕES DOS POSTS
// ==========================================
const postar = async () => {
  if (!novoDesabafo.value.trim()) return;
  try {
    const res = await fetch('https://projeto-extensao-3xkh.onrender.com/api/desabafos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: novoDesabafo.value, cpfAutor: cpfLogado })
    });
    if (res.ok) {
      const novo = await res.json();
      desabafos.value.unshift(novo);
      novoDesabafo.value = '';
    }
  } catch (e) {
    alert("Erro ao postar.");
  }
};

const excluirPost = async (id) => {
  if (!confirm("Excluir esta publicação?")) return;
  try {
    const res = await fetch(`https://projeto-extensao-3xkh.onrender.com/api/desabafos/${id}?cpfLogado=${cpfLogado}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      desabafos.value = desabafos.value.filter(p => p._id !== id);
      alert("Publicação excluída.");
    } else {
      alert("Você não tem permissão para excluir este post.");
    }
  } catch (e) {
    alert("Erro ao excluir.");
  }
};

const curtir = async (post) => {
  if (post.proprio) return alert("Você não pode curtir sua própria publicação.");
  try {
    const res = await fetch(`https://projeto-extensao-3xkh.onrender.com/api/desabafos/${post._id}/curtir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpfUsuario: cpfLogado })
    });
    if (res.ok) {
      const dados = await res.json();
      post.curtidas = dados.curtidas;
      
      // Ajuste visual imediato na lista local
      if (!post.usuariosQueCurtiram) post.usuariosQueCurtiram = [];
      if (post.usuariosQueCurtiram.includes(cpfLogado)) {
        post.usuariosQueCurtiram = post.usuariosQueCurtiram.filter(c => c !== cpfLogado);
      } else {
        post.usuariosQueCurtiram.push(cpfLogado);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const adicionarResposta = async (post) => {
  if (!post.novaResposta?.trim()) return;
  try {
    const res = await fetch(`https://projeto-extensao-3xkh.onrender.com/api/desabafos/${post._id}/comentar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comentario: { texto: post.novaResposta } })
    });
    if (res.ok) {
      const dados = await res.json();
      post.respostas = dados.respostas;
      post.novaResposta = '';
      post.mostrarRespostas = true;
    }
  } catch (e) {
    alert("Erro ao comentar.");
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');
:global(body, html) {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.btn-excluir-conta {
  flex: 1;
  background: #ffeded;
  color: #d90429;
  border: 1px solid #d90429;
  padding: 14px;
  border-radius: 18px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;
}
.btn-excluir-conta:hover {
  background: #d90429;
  color: white;
}
.forum-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.registro-page {
  background: url('@/assets/fundo-comum.png') no-repeat center center fixed; /* "fixed" ajuda a imagem a preencher tudo */
  background-size: cover
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
.card-editar-perfil {
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  text-align: left;
  margin-top: 10px;
}
.titulo-sessao {
  color: #5a5a5a;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 10px 0;
}
.texto-instrucao {
  color: #888;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 25px;
}
.input-grupo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}
.input-grupo label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #ff4d6d;
  padding-left: 5px;
}
.input-grupo input {
  background: #f8f8f8;
  border: 1px solid #eee;
  padding: 12px 15px;
  border-radius: 15px;
  font-family: 'Quicksand', sans-serif;
  font-size: 0.95rem;
  outline: none;
  color: #444;
  transition: border-color 0.2s;
}
.input-grupo input:focus {
  border-color: #ff4d6d;
}
.botoes-perfil-container {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  width: 100%;
}
.btn-salvar-perfil {
  flex: 2;
  background: #ff4d6d;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 18px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s
}
.btn-salvar-perfil:hover {
  background: #ff3355;
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(255, 77, 109, 0.2);
}
.btn-deletar-perfil {
  flex: 1;
  background: #f0f0f0;
  color: #666;
  border: none;
  padding: 14px;
  border-radius: 18px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-deletar-perfil:hover {
  background: #ffe5e9;
  color: #ff4d6d;
}
.card-desabafo, .card-editar-perfil, .card-aviso-vazio, .forum-header, .input-container {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(5px);
}
.container-exclusao-flutuante {
  position: fixed;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 100;
}
.btn-excluir-conta-dentro {
  width: 100%;
  margin-top: 20px; 
  background: transparent;
  color: #d90429;
  border: 1px solid #ff4d6d;
  padding: 12px;
  border-radius: 18px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-excluir-conta-dentro:hover {
  background: #ffeded;
  border-color: #d90429;
}
</style> 

