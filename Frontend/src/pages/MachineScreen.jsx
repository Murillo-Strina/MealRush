import React, { useState } from 'react'

const MachineScreen = ({ machine }) => {
    // 1) Defina aqui seu item mockado
    const mockItems = [
        {
            nome: 'Produto Mock',
            precoVenda: 15.0,
            precoCompra: 10.0,
            quantidadeEstoque: 20,
            vendas: 5,
            // receita = precoVenda * vendas
            receita: 15.0 * 5,
            // lucro = (precoVenda - precoCompra) * vendas
            lucro: (15.0 - 10.0) * 5,
        }
    ]

    // 2) Inicialize o estado já com esse array
    const [items] = useState(mockItems)

    return (
        <div>
            <div className="text-center d-flex align-items-center justify-content-center p-3 font-weight-bold">
                <p className='font-weight-bold'>Máquina {machine}</p>
            </div>

            {/* Tabela com o item mockado */}
            <div className='p-3'>
                <table className="table table-bordered mt-3">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Preço de venda</th>
                            <th>Preço de compra</th>
                            <th>Quantidade em estoque</th>
                            <th>Vendas</th>
                            <th>Receita</th>
                            <th>Lucro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.nome}</td>
                                <td>{item.precoVenda.toFixed(2)}</td>
                                <td>{item.precoCompra.toFixed(2)}</td>
                                <td>{item.quantidadeEstoque}</td>
                                <td>{item.vendas}</td>
                                <td>{item.receita.toFixed(2)}</td>
                                <td>{item.lucro.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MachineScreen
