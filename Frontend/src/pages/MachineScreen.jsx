import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const MachineScreen = () => {
    const { machineId } = useParams();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const colors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', lightNeutral: '#F7FAFC',
        mediumNeutral: '#E2E8F0', textDark: '#2D3748', textLight: '#F7FAFC',
        textSubtleDarkBg: '#A0AEC0', tableHeaderBg: '#2D3748', rowDarkAlt: '#202733',
        danger: '#E53E3E', successText: '#4ADE80', dangerText: '#F87171',
    };

    useEffect(() => {
        const fetchItems = async () => {
            if (!machineId) {
                setError("ID da máquina não especificado.");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3025/contents/machine/${machineId}`);
                console.log("Dados brutos da API:", response.data);
                const formattedItems = response.data.map(item => ({
                    id: item.id,
                    name: item.foodName,
                    quantity: item.qtd_itens,
                    sales: Number(item.sales),
                    sellPrice: Number(item.sellprice),
                    buyPrice: Number(item.buyprice),
                    revenue: Number(item.total_revenue),
                    profit: Number(item.profit)
                }));

                setItems(formattedItems);
                setError(null);
            } catch (err) {
                console.error("Erro ao buscar itens da máquina:", err);
                setError('Não foi possível carregar os dados da máquina.');
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [machineId]);

    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: colors.darkPrimary, color: colors.textLight }}>
                <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem', color: colors.accent }} role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="fs-5">Carregando dados da máquina {machineId || ''}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center text-center p-4" style={{ minHeight: '100vh', backgroundColor: colors.darkPrimary, color: colors.textLight }}>
                <div className="alert d-flex align-items-center shadow" role="alert" style={{ backgroundColor: '#4B1717', borderColor: colors.danger, color: '#F8D7DA', maxWidth: '500px', borderRadius: '0.75rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-octagon-fill flex-shrink-0 me-3" viewBox="0 0 16 16">
                        <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                    </svg>
                    <div>
                        <strong className="d-block fs-5">Falha ao Carregar Dados</strong>
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: colors.darkPrimary, color: colors.textLight }} className="py-4 px-md-3">
            <div className="container-fluid">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3 px-2">
                    <Link to="/management" className="btn rounded-pill d-flex align-items-center px-3 py-2" style={{ backgroundColor: colors.mediumNeutral, color: colors.textDark, fontWeight: 500, textDecoration: 'none' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-left-circle-fill me-2" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                        </svg>
                        Voltar
                    </Link>
                    <div className="p-3 rounded-3 text-center shadow-sm" style={{ backgroundColor: colors.tableHeaderBg, flexGrow: 1, maxWidth: '450px' }}>
                        <h1 className="fw-bolder m-0 fs-4 lh-base" style={{ color: colors.accent }}>Relatório da Máquina <br className="d-md-none" />{machineId}</h1>
                    </div>
                    <div style={{ minWidth: '150px' }} className="d-none d-md-block"></div>
                </div>

                <div className="table-responsive shadow-lg rounded-3 overflow-hidden mx-2">
                    <table className="table table-hover mb-0 align-middle" style={{ borderColor: colors.tableHeaderBg, color: colors.textLight }}>
                        <thead style={{ backgroundColor: colors.tableHeaderBg, position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr>
                                {['Item', 'Estoque', 'Vendas', 'Preço Venda', 'Preço Compra', 'Receita Total', 'Lucro Total'].map(header => (
                                    <th scope="col" key={header} className="py-3 px-3 text-uppercase text-nowrap" style={{ color: colors.textSubtleDarkBg, letterSpacing: '0.05em', borderBottom: `3px solid ${colors.accent}`, fontSize: '0.8rem' }}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? items.map((item, idx) => {
                                const receita = item.sellPrice * item.sales;
                                const lucro = (item.sellPrice - item.buyPrice) * item.sales;
                                const estoqueStyle = item.quantity === 0 ? { color: colors.dangerText, fontWeight: 'bold' } : {};
                                return (
                                    <tr key={item.id || idx} style={{ backgroundColor: idx % 2 === 0 ? colors.darkPrimary : colors.rowDarkAlt, transition: 'background-color 0.2s ease' }}
                                        onMouseOver={e => e.currentTarget.style.backgroundColor = `${colors.accent}2A`}
                                        onMouseOut={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? colors.darkPrimary : colors.rowDarkAlt}
                                    >
                                        <td className="py-3 px-3 fw-medium">{item.name}</td>
                                        <td className="py-3 px-3" style={estoqueStyle}>{item.quantity} un.{item.quantity === 0 ? " (Esgotado)" : ""}</td>
                                        <td className="py-3 px-3">{item.sales}</td>
                                        <td className="py-3 px-3">R$ {item.sellPrice.toFixed(2)}</td>
                                        <td className="py-3 px-3">R$ {item.buyPrice.toFixed(2)}</td>
                                        <td className="py-3 px-3" style={{ color: colors.accent, fontWeight: 'bold' }}>R$ {item.revenue.toFixed(2)}</td>
                                        <td className="py-3 px-3" style={{ color: item.profit >= 0 ? colors.successText : colors.dangerText, fontWeight: 'bold' }}>R$ {item.profit.toFixed(2)}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5" style={{ backgroundColor: colors.rowDarkAlt }}>
                                        <p className="fs-5 mb-0" style={{ color: colors.textSubtleDarkBg }}>Nenhum item encontrado para esta máquina.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MachineScreen;