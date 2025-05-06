import React, { useState } from 'react'

const MachineScreen = ({ machine }) => {
    const mockItems = [
        {
            name: 'Comida',
            sellPrice: 15.0,
            buyPrice: 10.0,
            quantity: 20,
            sales: 5,
        }
    ]

    const [items] = useState(mockItems)

    return (
        <div>
            <div className="text-center d-flex align-items-center justify-content-center p-3 font-weight-bold">
                <h1 className='fw-bold'>Máquina {machine}</h1>
            </div>
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
                                <td>{item.name}</td>
                                <td>{item.sellPrice.toFixed(2)}</td>
                                <td>{item.buyPrice.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>{item.sales}</td>
                                <td>{(item.sellPrice * item.sales).toFixed(2)}</td>
                                <td>{((item.sellPrice - item.buyPrice) * item.sales).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MachineScreen
