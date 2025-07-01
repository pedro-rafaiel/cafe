import React from 'react';
import './CafeCard.css';

const CafeCard = ({ cafe, quantidade, onQuantidadeChange }) => {
  return (
    <div className="card">
      <img src={cafe.imagem} alt={cafe.nome} className="card-img" />
      <h3 className="card-title">{cafe.nome}</h3>
      <p className="card-desc">{cafe.descricao}</p>
      <p className="card-price">R$ {cafe.preco.toFixed(2)}</p>
      <input
        type="number"
        min="0"
        placeholder="Qtd"
        value={quantidade}
        onChange={(e) =>
          onQuantidadeChange(cafe._id, parseInt(e.target.value || 0))
        }
        className="card-input"
      />
    </div>
  );
};

export default CafeCard;
