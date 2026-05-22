<template>
 <div class="login-page">
  <div class="card-login">
    <h2>★ALIA★</h2>
    <p>SUA ASSISTENTE PARA MELHORES ROTAS</p>
    <p>Acesse com seus dados</p>

    <div class="input-group">
     <label>CPF</label>
     <input v-model="cpf" type="text" placeholder="000.000.000-00">
    </div>

    <div class="input-group">
     <label>Data de Nascimento</label>
     <input v-model="nascimento" type="date">
    </div>

    <button @click="fazerLogin" class="btn-entrar">ENTRAR</button>

  <p class="footer-text">
  Não tem cadastro? 
  <RouterLink to="/registro"><span>Clique aqui</span></RouterLink>
  </p>
   </div>
  </div>
</template>

<script setup>
 import { ref } from 'vue';
 import { useRouter } from 'vue-router';

 const router = useRouter();
 const cpf = ref('');
 const nascimento = ref('');

 const fazerLogin = () => {
    if(cpf.value && nascimento.value) {
        router.push('/mapa')
    } else {
        alert("Preencha o CPF e a Data de Nascimento!")
    }
 }
 </script>

 <style scoped>
 h2 {
  color: #5a5a5a;
  font-weight: 700;
  margin-bottom: 10px;
}
 .login-page {
    height:80vh;
    display: flex;
    justify-content: center;
    aligh-items: center;
    background: #f1d7d7;
 }
 .card-login {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 350px;
    text-align: center;
 }
 .card-login p:first-of-type {
  color: #5a5a5a;
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 30px;
}
.card-login p:second-of-type{
  color: #5a5a5a;
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 30px;
}
 .input-group {
    margin-bottom: 20px;
    text-align: left;
 }
 input {
    width: 100%;
    padding: 12px;
    border: 1px solid #080808;
    border-radius: 8px;
    margin-top: 5px;
 }
 .btn-entrar {
    width: 100%;
    padding: 15px;
    background: #ff4d6d;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
 }
    label {
  color: #5a5a5a;
  font-weight: 600;
  font-size: 0.9rem;
}
.footer-text {
  color: #5a5a5a;
  margin-top: 15px;
  font-size: 0.85rem;
}
.footer-text span {
  color: #ff4d6d; 
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}
input:focus {
  outline: none;
  border-color: #ff4d6d; 
  box-shadow: 0 0 5px rgba(255, 77, 109, 0.2);
}
 </style>
