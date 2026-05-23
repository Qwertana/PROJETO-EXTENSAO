<template>
  <div class="login-page">
    
    <div class="quadro-login">
        <div class="input-grupo">
        <input v-model="cpf" type="text" placeholder="CPF sem pontos/traços" />
        <input v-model="dataNasc" type="text" placeholder="Data de Nascimento sem traços" />
        <button class="btn-entrar" @click="fazerLogin">Entrar</button>
      </div>
    </div>

    <button class="btn-registro-flutuante" @click="irParaRegistro">
      Não tem uma conta? Registre-se aqui
    </button>
  </div>
</template>

<script setup>
 import { ref } from 'vue';
 import { useRouter } from 'vue-router';
 import axios from 'axios';

 const router = useRouter();
 // Variáveis conectadas ao v-model
 const cpf = ref('');
 const dataNasc = ref(''); 

const fazerLogin = async () => {
  if (!cpf.value || !dataNasc.value) {
    return alert("Por favor, preencha o CPF e a Data de Nascimento.");
  }
  try {
    // Faz uma busca no seu back-end verificando se o usuário existe
      const response = await axios.post('https://projeto-extensao-3xkh.onrender.com/api/login', {
      cpf: cpf.value,
      dataNasc: dataNasc.value
    });

    if (response.status === 200) {
      localStorage.setItem('usuarioCPF', cpf.value);
      router.push('/mapa');
    }
  } catch (error) {
if (error.response && error.response.status === 401) {
      alert("Erro: CPF ou Data de Nascimento não encontrados. Verifique seus dados ou faça o registro.");
    } else {
      alert("Erro de conexão com o servidor. Tente novamente mais tarde.");
    }
    console.error("Erro no login:", error);
  }
}
const irParaRegistro = () => {
  router.push('/registro'); 
}

 </script>

 <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');

/* Passo 1: O Fundo */
.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/fundo-login.png') no-repeat center top;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 40vh; 
  font-family: 'Quicksand', sans-serif;
}

.quadro-login {
  background: rgba(255, 255, 255, 0.6);
  padding: 30px;
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  width: 85%;
  max-width: 400px;
  margin-bottom: 20px;
}

.titulo-alia {
  font-weight: 700;
  color: #5a5a5a;
  margin-bottom: 5px;
  font-size: 2.2rem;
}

.subtitulo {
  color: #777;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 30px;
}

.input-grupo {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 15px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.7);
  color: #5a5a5a;
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
}

input::placeholder {
  color: #aaa;
}

input:focus {
  border-color: #ff4d6d;
  outline: none;
}

.btn-entrar {
  background: #ff4d6d;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 15px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.3);
}

.btn-entrar:hover {
  background: #ff2c53;
}

.btn-registro-flutuante {
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 25px;
  border-radius: 50px;
  border: none;
  font-weight: 700;
  font-size: 0.9rem;
  color: #ff4d6d;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  cursor: pointer;
}

.btn-registro-flutuante:hover {
  transform: scale(1.02);
}
</style>