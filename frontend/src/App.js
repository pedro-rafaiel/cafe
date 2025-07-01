import React, { useEffect, useState } from 'react';
import api from './components/services/api.js';
import CafeCard from './components/CafeCard';
import Pedidos from './components/Pedidos';
import './App.css';

function App() {
  const [cafes, setCafes] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [abaAtiva, setAbaAtiva] = useState('cafes');

  useEffect(() => {
    carregarCafes();
  }, []);

  const carregarCafes = async () => {
    try {
      const res = await api.get('/cafes');
      setCafes(res.data);
    } catch (err) {
      console.error('Erro ao carregar cafés:', err);
    }
  };

  const handleQuantidadeChange = (id, qtd) => {
    setQuantidades(prev => ({ ...prev, [id]: qtd }));
  };

  const handlePedir = async () => {
    const nome = prompt('Digite seu nome:');
    if (!nome) return alert('Nome é obrigatório.');

    const itens = cafes
      .map(cafe => ({
        cafeId: cafe._id,
        nome: cafe.nome,
        quantidade: quantidades[cafe._id] || 0
      }))
      .filter(item => item.quantidade > 0);

    if (itens.length === 0) return alert('Adicione pelo menos um café.');

    try {
      await api.post('/pedidos', {
        nomeCliente: nome,
        itens
      });
      alert('☕ Pedido enviado com sucesso!');
      setQuantidades({});
    } catch (err) {
      alert('Erro ao enviar pedido.');
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <h1>Café-teria</h1>

      <div className="abas">
        <button onClick={() => setAbaAtiva('cafes')} className={abaAtiva === 'cafes' ? 'ativa' : ''}>Ver Cafés</button>
        <button onClick={() => setAbaAtiva('pedidos')} className={abaAtiva === 'pedidos' ? 'ativa' : ''}>Ver Pedidos</button>
      </div>

      <div className="conteudo">
        {abaAtiva === 'cafes' && (
          <>
            <div className="cafes">
              {cafes.length === 0 ? (
                <p>Carregando cafés...</p>
              ) : (
                cafes.map(cafe => (
                  <CafeCard
                    key={cafe._id}
                    cafe={cafe}
                    quantidade={quantidades[cafe._id] || ''}
                    onQuantidadeChange={handleQuantidadeChange}
                  />
                ))
              )}
            </div>

            {cafes.length > 0 && (
              <button className="btn-pedir" onClick={handlePedir}>
                Pedir
              </button>
            )}
          </>
        )}

        {abaAtiva === 'pedidos' && <Pedidos />}
      </div>
    </div>
  );
}

export default App;
