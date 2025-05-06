import React, { useState } from 'react'

const MachineScreen = ({ machine }) => {
    const mockItems = [
        {
            name: 'Comida',
            sellPrice: 15.0,
            buyPrice: 10.0,
            quantity: 20,
            sales: 5,
        },
        {
            name: 'Comida 2',
            sellPrice: 15.0,
            buyPrice: 10.0,
            quantity: 20,
            sales: 5,
        },
        {
            name: 'Comida 3',
            sellPrice: 15.0,
            buyPrice: 10.0,
            quantity: 20,
            sales: 5,
        }
    ]

    const [items] = useState(mockItems)

    return (
        <div style={{ minHeight: '100vh' }} className='bg-dark'>
            <div className='p-3 px-3'>
                <button className='btn btn-secondary'>Voltar</button>
            </div>
            <div className="text-center d-flex align-items-center justify-content-center p-3 font-weight-bold">
                <div className='border border-secondary w-auto rounded p-3 bg-secondary'>
                    <h1 className='text-light fw-bold'>Máquina {machine}</h1>
                </div>
            </div>
            <div className='p-3'>
                <table className="table table-bordered table-striped mt-3 table-dark text-center">
                    <thead>
                        <tr>
                            <th className='bg-secondary'>Nome</th>
                            <th className='bg-secondary'>Preço de venda</th>
                            <th className='bg-secondary'>Preço de compra</th>
                            <th className='bg-secondary'>Quantidade em estoque</th>
                            <th className='bg-secondary'>Vendas</th>
                            <th className='bg-secondary'>Receita</th>
                            <th className='bg-secondary'>Lucro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.name}</td>
                                <td>{item.sellPrice.toFixed(2)}</td>
                                <td>{item.buyPrice.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>{item.sales}</td>
                                <td>R$ {(item.sellPrice * item.sales).toFixed(2)}</td>
                                <td>R$ {((item.sellPrice - item.buyPrice) * item.sales).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MachineScreen
