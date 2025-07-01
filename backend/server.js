const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/cafeteria', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Conectado ao MongoDB!');
});

mongoose.connection.on('error', (err) => {
  console.error('Erro na conexão MongoDB:', err);
});

const cafeSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  descricao: String,
  imagem: String,
}, { collection: 'cafes' });

const Cafe = mongoose.model('Cafe', cafeSchema);

app.get('/cafes', async (req, res) => {
  try {
    const cafes = await Cafe.find();
    res.json(cafes);
  } catch (error) {
    console.error('Erro ao buscar cafés:', error);
    res.status(500).json({ error: 'Erro ao buscar cafés' });
  }
});

const pedidoSchema = new mongoose.Schema({
  nomeCliente: { type: String, required: true },
  data: { type: Date, default: Date.now },
  itens: [
    {
      cafeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cafe',
        required: true,
      },
      quantidade: { type: Number, required: true },
    }
  ]
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

app.post('/pedidos', async (req, res) => {
  const { nomeCliente, itens } = req.body;

  if (!nomeCliente || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: 'Dados inválidos' });
  }

  try {
    const novoPedido = new Pedido({
      nomeCliente,
      itens,
      data: new Date(),
    });

    await novoPedido.save();
    res.json({ sucesso: true, pedido: novoPedido });
  } catch (error) {
    console.error('Erro ao salvar pedido:', error);
    res.status(500).json({ erro: 'Erro ao salvar pedido' });
  }
});

app.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .sort({ data: -1 })
      .populate('itens.cafeId');

    res.json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ erro: 'Erro ao buscar pedidos' });
  }
});

app.delete('/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pedidoRemovido = await Pedido.findByIdAndDelete(id);
    if (!pedidoRemovido) {
      return res.status(404).json({ erro: 'Pedido não encontrado' });
    }
    res.json({ sucesso: true, mensagem: 'Pedido removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover pedido:', error);
    res.status(500).json({ erro: 'Erro ao remover pedido' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
