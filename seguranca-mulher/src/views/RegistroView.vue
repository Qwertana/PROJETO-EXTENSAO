<template>
  <div class="registro-page">
    
    <div class="quadro-registro">
      <h1 class="titulo-pagina">Criar Conta</h1>
      
      <div class="input-grupo">
        <input v-model="nome" type="text" placeholder="Nome Completo" />
        <input v-model="cpf" type="text" placeholder="CPF (99999999999)" />
        <input v-model="dataNasc" type="text" placeholder="Data de Nascimento (ddmmaaaa)" />
        <input v-model="telefoneSeguranca" type="tel" placeholder="Nº de Segurança (com DDD)" />
        <button @click="registrar" class="btn-registrar">Finalizar Cadastro</button>
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
import axios from 'axios';

const router = useRouter();
const nome = ref('');
const cpf = ref('');
const dataNasc = ref('');
const telefoneSeguranca = ref('');

const registrar = async () => {
  if (!cpf.value || !dataNasc.value || !telefoneSeguranca.value) {
    return alert("Por favor, preencha os campos obrigatórios.");
  }
  try {
    // Enviando para a sua rota de registro no servidor
    await axios.post('https://projeto-extensao-3xkh.onrender.com/api/registro', {
      cpf: cpf.value,
      dataNasc: dataNasc.value
    })

    //Salva o contato de segurança no celular do usuário
    const numeroLimpo = telefoneSeguranca.value.replace(/\D/g, '');
    localStorage.setItem('numeroConfiancaAlia', numeroLimpo);

    alert("Cadastro realizado com sucesso! Agora você pode fazer login.");
    router.push('/'); // Volta para a tela de login
  } catch (error) {
    alert("Erro ao cadastrar. Verifique se o CPF já não está registrado.");
    console.error(error);
  }
}

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
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.3);
  transition: all 0.2s; /* Adicione isso para um efeito suave */
}

.btn-registrar:hover {
  background: #ff2c53;
  transform: translateY(-2px);
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