import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MachineScreen = ({ machine }) => {
  // items: array de objetos vindo da API
  const [items, setItems] = useState([]);
  // loading: controla exibição enquanto busca
  const [loading, setLoading] = useState(true);
  // error: caso algo dê errado na requisição
  const [error, setError] = useState(null);

  useEffect(() => {
    // Busca os foods na API assim que o componente monta
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:3000/foods');
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5 text-light">
        Carregando dados da máquina {machine}…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5 text-danger">
        {error}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }} className="bg-dark text-light">
      <div className="p-3">
        <button className="btn btn-secondary">Voltar</button>
      </div>

      <div className="text-center d-flex align-items-center justify-content-center p-3 font-weight-bold">
        <div className="border border-secondary rounded p-3 bg-secondary">
          <h1 className="fw-bold">Máquina {machine}</h1>
        </div>
      </div>

      <div className="p-3">
        <table className="table table-bordered table-striped table-dark text-center">
          <thead>
            <tr>
              <th className="bg-secondary">Nome</th>
              <th className="bg-secondary">Preço de venda</th>
              <th className="bg-secondary">Preço de compra</th>
              <th className="bg-secondary">Estoque</th>
              <th className="bg-secondary">Vendas</th>
              <th className="bg-secondary">Receita</th>
              <th className="bg-secondary">Lucro</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{/*item.sellPrice.toFixed(2*/}R$ 5.00</td>
                <td>{/*item.buyPrice.toFixed(2*/}R$ 2.00</td>
                <td>{/*item.quantity*/}2</td>
                <td>{/*item.sales*/}5</td>
                <td>R$ {/*(item.sellPrice * item.sales).toFixed(2)*/}R$ 25.00</td>
                <td>R$ {/*((item.sellPrice - item.buyPrice) * item.sales).toFixed(2)*/}R$ 15.00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MachineScreen;
