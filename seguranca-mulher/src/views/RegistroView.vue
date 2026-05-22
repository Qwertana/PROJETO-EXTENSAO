<template>
  <div class="registro-page">
    <div class="card-registro">
      <h2>Criar Conta</h2>
      <p>Cadastre-se para fazer parte da rede.</p>

      <div class="scroll-area">
        <div class="input-group">
          <label>Nome Completo</label>
          <input v-model="form.nome" type="text" placeholder="Seu nome">
        </div>

        <div class="input-group">
          <label>CPF</label>
          <input v-model="form.cpf" type="text" placeholder="000.000.000-00">
        </div>

        <div class="input-group">
          <label>Data de Nascimento</label>
          <input v-model="form.nascimento" type="date">
        </div>

        <hr>
        <h3>Rede de Apoio</h3>
        <p class="sub-label">Contatos que receberão seu alerta de emergência.</p>

        <div class="input-group">
          <label>Nome do Contato 1</label>
          <input v-model="form.contato1" type="text" placeholder="Nome do contato">
        </div>
        <div class="input-group">
          <label>WhatsApp do Contato 1</label>
          <input v-model="form.tel1" type="text" placeholder="(00) 00000-0000">
        </div>
      </div>

      <button @click="salvarRegistro" class="btn-finalizar">FINALIZAR CADASTRO</button>
      <RouterLink to="/" class="voltar">Já tenho conta? Voltar</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  nome: '', cpf: '', nascimento: '',
  contato1: '', tel1: ''
})

const salvarRegistro = () => {
  alert("Cadastro realizado com sucesso! Agora você faz parte da rede de proteção.")
  router.push('/')
}
</script>

<style scoped>
.registro-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fdf2f2;
}
.card-registro {
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.scroll-area {
  overflow-y: auto;
  text-align: left;
  padding-right: 10px;
  margin-bottom: 20px;
}
h2, h3 { 
  color: #5a5a5a; 
  margin-bottom: 5px; 
  }
.sub-label { 
  font-size: 0.8rem; 
  color: #000000; 
  margin-bottom: 15px; 
  }
.input-group { 
  margin-bottom: 15px; 
  }
label { 
  color: #5a5a5a; 
  font-weight: 600; 
  font-size: 0.9rem; 
  }
input { 
  width: 100%; 
  padding: 10px; 
  border: 1px solid #000000; 
  border-radius: 8px; 
  margin-top: 5px; 
  }
.btn-finalizar { 
  width: 100%; 
  padding: 15px; 
  background: #ff4d6d; 
  color: white; 
  border: none; 
  border-radius: 8px; 
  font-weight: bold; 
  cursor: pointer; 
  }
.voltar { 
  display: block; 
  margin-top: 15px; 
  color: #ff4d6d; 
  text-decoration: none; 
  font-size: 0.9rem; 
  }
hr { 
  border: 0; 
  border-top: 1px solid #ff0062; 
  margin: 20px 0; 
  }
  
</style>