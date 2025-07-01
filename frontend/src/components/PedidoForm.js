import React, { useState } from 'react';
import api from './services/api';

function PedidoForm({ cafeId }) {
  const [nomeCliente, setNomeCliente] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  async function fazerPedido() {
    try {
      const res = await api.post('/pedidos', { cafeId, nomeCliente, quantidade });
      if (res.data.sucesso) {
        alert('Pedido realizado com sucesso!');
        setNomeCliente('');
        setQuantidade(1);
      }
    } catch (err) {
      alert('Erro ao fazer pedido. Tente novamente.');
      console.error(err);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fazerPedido();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <input
        type="text"
        placeholder="Seu nome"
        value={nomeCliente}
        onChange={(e) => setNomeCliente(e.target.value)}
        required
      />
      <input
        type="number"
        min="1"
        value={quantidade}
        onChange={(e) => setQuantidade(Number(e.target.value))}
        required
      />
      <button type="submit">Fazer Pedido</button>
    </form>
  );
}

export default PedidoForm;
