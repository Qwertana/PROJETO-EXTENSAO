<template>
  <div class="registro-page">
    
    <div class="quadro-registro">
      <h1 class="titulo-pagina">Criar Conta</h1>
      
      <div class="input-grupo">
        <input v-model="nome" type="text" placeholder="Nome Completo" />
        <input v-model="cpf" type="text" placeholder="CPF (99999999999)" />
        <input v-model="senha" type="password" placeholder="Data de nascimento (99999999999)" />
        <input v-model="telefoneSeguranca" type="tel" placeholder="Nº de Segurança (com DDD)" />
        <button class="btn-registrar" @click="finalizarCadastro">Cadastrar</button>
      </div>
    </div>

    <button class="btn-voltar-flutuante" @click="voltarLogin">
      Já tenho conta? Entrar
    </button>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const nome = ref('');
const cpf = ref('');
const senha = ref('');
const telefoneSeguranca = ref('');

const finalizarCadastro = () => {
  if(nome.value && cpf.value && senha.value && telefoneSeguranca.value) {
    const numeroLimpo = telefoneSeguranca.value.replace(/\D/g, '');
    localStorage.setItem('numeroConfiancaAlia', numeroLimpo);
    alert("Cadastro realizado e número de segurança salvo!");
    router.push('/'); // Volta para o login
  } else {
    alert("Por favor, preencha todos os campos.");
  }
};

const voltarLogin = () => {
  router.push('/');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');

.registro-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/fundo-comum.png') no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* No registro, vamos deixar bem no meio da tela */
  font-family: 'Quicksand', sans-serif;
}

.quadro-registro {
  background: rgba(255, 255, 255, 0.45);
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 85%;
  max-width: 400px;
  text-align: center;
  margin-bottom: 20px;
}

.titulo-pagina {
  color: #5a5a5a;
  font-weight: 700;
  margin-bottom: 25px;
  font-size: 1.8rem;
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
}

input:focus {
  border-color: #ff4d6d;
  outline: none;
}

.btn-registrar {
  background: #ff4d6d;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.3);
}

.btn-voltar-flutuante {
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 25px;
  border-radius: 50px;
  border: none;
  font-weight: 700;
  color: #ff4d6d;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  cursor: pointer;
}
</style>