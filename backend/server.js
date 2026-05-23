const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// STRING DE CONEXÃO DO ATLAS
const MONGO_URI = "mongodb+srv://admin:extensao0378@cluster0.czbppgm.mongodb.net/seguranca_mulher?retryWrites=true&w=majority&appName=Cluster0";
// Conexão com a Nuvem
mongoose.connect(MONGO_URI)
  .then(() => console.log("CONECTADO AO MONGODB ATLAS COM SUCESSO!"))
  .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

// --- SCHEMA (Estrutura da tabela no Banco de Dados NoSQL) ---
const DesabafoSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  cpfAutor: String,
  data: { type: String, default: "Agora" },
  curtidas: { type: Number, default: 0 },
  curtidoByUser: { type: Boolean, default: false },
  mostrarRespostas: { type: Boolean, default: false },
  proprio: { type: Boolean, default: true },
  respostas: { type: Array, default: [] }
});

const Desabafo = mongoose.model('Desabafo', DesabafoSchema);

const UsuarioSchema = new mongoose.Schema({
  cpf: { type: String, required: true, unique: true },
  dataNasc: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

const MarcacaoSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  descricao: String,
  tipo: String,
  createdAt: { type: Date, default: Date.now }
});

//Apaga após 3 dias (3 dias * 24 horas * 60 min * 60 seg = 259200 segundos)
MarcacaoSchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 });
const Marcacao = mongoose.model('Marcacao', MarcacaoSchema);

// --- ROTAS DA API ---

// Rota de teste para ver se o modelo lista usuários
app.get('/api/testar-usuarios', async (req, res) => {
  try {
    const todos = await Usuario.find(); // Tenta buscar todos os usuários
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "O Modelo não está funcionando: " + error.message });
  }
});

// Rota para buscar os posts guardados no MongoDB
app.get('/api/desabafos', async (req, res) => {
  try {
    const todosDesabafos = await Desabafo.find().sort({ _id: -1 }); // Mais recentes primeiro
    res.json(todosDesabafos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/desabafos/:id/comentar', async (req, res) => {
  try {
    const { comentario } = req.body;
    const desabafo = await Desabafo.findById(req.params.id);
    
    if (!desabafo) return res.status(404).json({ error: "Post não encontrado" });

    desabafo.respostas.push(comentario);
    desabafo.markModified('respostas'); // ESSENCIAL PARA ARRAYS NO MONGOOSE
    await desabafo.save();

    res.status(200).json(desabafo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Rota para salvar o Autor
app.post('/api/desabafos', async (req, res) => {
  try {
    const { texto, cpfAutor } = req.body;
    const novoDesabafo = new Desabafo({
      texto: texto,
      cpfAutor: cpfAutor // Agora ele será salvo corretamente
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
    const cpfLogado = req.query.cpfLogado; 
    const post = await Desabafo.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post não encontrado" });

    if (post.cpfAutor !== cpfLogado) {
      return res.status(403).json({ error: "Você não tem permissão para deletar este post." });
    }

    await Desabafo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota de CADASTRO
app.post('/api/registro', async (req, res) => {
  try {
    const { cpf, dataNasc } = req.body;
    const novoUsuario = new Usuario({ cpf, dataNasc });
    await novoUsuario.save();
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao registrar. O CPF pode já estar cadastrado." });
  }
});

// Rota de LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { cpf, dataNasc } = req.body;
    const usuario = await Usuario.findOne({ cpf, dataNasc });
    
    if (usuario) {
      res.status(200).json({ message: "Login realizado com sucesso!" });
    } else {
      res.status(401).json({ error: "CPF ou Data de Nascimento inválidos." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor." });
  }
});

// Rota para TODOS verem as marcacoes
app.get('/api/mapa/marcacoes', async (req, res) => {
  const todas = await Marcacao.find(); // Busca tudo sem filtro
  res.json(todas);
});

// Rota para QUALQUER UM salvar uma marcacao
app.post('/api/mapa/marcacoes', async (req, res) => {
  try {
    const { lat, lng, descricao } = req.body; // Pega o que veio do front
    const novaMarca = new Marcacao({ 
      lat: lat, 
      lng: lng, 
      descricao: descricao // Salva no banco
    });
    await novaMarca.save();
    res.status(201).json(novaMarca); // Devolve o objeto completo
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para buscar TODAS as marcações salvas
app.get('/api/mapa/marcacoes', async (req, res) => {
  try {
    const todas = await Marcacao.find(); // Busca no banco
    res.json(todas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para adicionar um comentário a um desabafo
app.post('/api/desabafos/:id/comentar', async (req, res) => {
  try {
    const { comentario } = req.body;
    const desabafo = await Desabafo.findById(req.params.id);
    
    if (!desabafo) return res.status(404).json({ error: "Post não encontrado" });

    desabafo.respostas.push(comentario);
    desabafo.markModified('respostas'); // ESSENCIAL PARA ARRAYS NO MONGOOSE
    await desabafo.save();

    res.status(200).json(desabafo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`SERVIDOR COMPLETO RODANDO EM: http://localhost:${PORT}`);
});