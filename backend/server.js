const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//STRING DE CONEXÃO DO ATLAS CONSTRUÍDA
const MONGO_URI = "mongodb+srv://admin:<db_password>@cluster0.czbppgm.mongodb.net/?appName=Cluster0";
// Conexão com a Nuvem
mongoose.connect(MONGO_URI)
  .then(() => console.log("🔌 CONECTADO AO MONGODB ATLAS COM SUCESSO!"))
  .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

// --- SCHEMA (Estrutura da tabela no Banco de Dados NoSQL) ---
const DesabafoSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  data: { type: String, default: "Agora" },
  curtidas: { type: Number, default: 0 },
  curtidoByUser: { type: Boolean, default: false },
  mostrarRespostas: { type: Boolean, default: false },
  proprio: { type: Boolean, default: true },
  respostas: { type: Array, default: [] }
});

const Desabafo = mongoose.model('Desabafo', DesabafoSchema);

// --- ROTAS DA API ---

// Rota para buscar os posts guardados no MongoDB
app.get('/api/desabafos', async (req, res) => {
  try {
    const todosDesabafos = await Desabafo.find().sort({ _id: -1 }); // Mais recentes primeiro
    res.json(todosDesabafos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para salvar um desabafo na nuvem
app.post('/api/desabafos', async (req, res) => {
  try {
    const novoDesabafo = new Desabafo({
      texto: req.body.texto
    });
    const salvo = await novoDesabafo.save();
    res.status(201).json(salvo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para deletar do banco por ID
app.delete('/api/desabafos/:id', async (req, res) => {
  try {
    await Desabafo.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deletado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SERVIDOR COMPLETO RODANDO EM: http://localhost:${PORT}`);
});