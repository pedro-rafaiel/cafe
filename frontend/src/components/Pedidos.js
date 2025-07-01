import React, { useEffect, useState } from 'react';
import api from './services/api.js';
import { jsPDF } from 'jspdf';
import './Pedidos.css';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const res = await api.get('/pedidos');
      setPedidos(res.data);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    }
  };

  const gerarPDF = (pedido) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('☕ Nota de Pedido', 105, 20, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Cliente: ${pedido.nomeCliente}`, 20, 40);
    doc.text(`Data: ${new Date(pedido.data).toLocaleString()}`, 20, 50);

    doc.text('Itens:', 20, 65);

    let y = 75;
    pedido.itens.forEach(item => {
      const nomeCafe = item.cafeId.nome || 'Café';
      const quantidade = item.quantidade;
      doc.text(`- ${nomeCafe} x ${quantidade}`, 30, y);
      y += 10;
    });

    doc.text('Obrigado pela preferência!', 105, y + 20, null, null, 'center');

    doc.save(`Pedido_${pedido._id}.pdf`);
  };

  const confirmarPedido = async (id) => {
    const pedido = pedidos.find(p => p._id === id);
    if (!pedido) return;

    if (!window.confirm(`Confirmar que o pedido de ${pedido.nomeCliente} foi entregue?`)) return;

    try {
      await api.delete(`/pedidos/${id}`);
      alert('Pedido confirmado e removido com sucesso!');
      gerarPDF(pedido);
      carregarPedidos();
    } catch (error) {
      alert('Erro ao confirmar pedido.');
      console.error(error);
    }
  };

  return (
    <div className="pedidos-container">
      <h2>📋 Pedidos Pendentes</h2>
      {pedidos.length === 0 ? (
        <p>Nenhum pedido por enquanto.</p>
      ) : (
        <ul className="pedidos-lista">
          {pedidos.map(pedido => (
            <li key={pedido._id} className="pedido-item">
              <div className="pedido-info">
                <strong>Cliente:</strong> {pedido.nomeCliente} <br />
                <strong>Data:</strong> {new Date(pedido.data).toLocaleString()}
                <ul className="pedido-itens">
                  {pedido.itens.map((item, index) => (
                    <li key={index}>
                      {item.cafeId.nome || 'Café'} — Quantidade: {item.quantidade}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => confirmarPedido(pedido._id)}>✅ Marcar como feito</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Pedidos;
