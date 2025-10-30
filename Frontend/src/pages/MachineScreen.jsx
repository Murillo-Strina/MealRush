import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Modal from '../components/ModalMachine.jsx';

const MachineScreen = () => {
    const { machineId } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [updateQuantity, setUpdateQuantity] = useState('');
    const [allFoodItems, setAllFoodItems] = useState([]);

    const colors = {
        darkPrimary: '#1A202C', accent: '#00C9A7', lightNeutral: '#F7FAFC',
        mediumNeutral: '#E2E8F0', textDark: '#2D3748', textLight: '#F7FAFC',
        textSubtleDarkBg: '#00C9A7', tableHeaderBg: '#2D3748', rowDarkAlt: '#202733',
        danger: '#E53E3E', successText: '#4ADE80', dangerText: '#F87171',
    };

    const formInputStyle = {
        backgroundColor: colors.tableHeaderBg, color: colors.textLight,
        border: `1px solid ${colors.mediumNeutral}`, borderRadius: '0.375rem',
        padding: '0.5rem 1rem', width: '100%'
    };

    const fetchItems = useCallback(async () => {
        if (!machineId) {
            setError("ID da máquina não especificado.");
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3025/contents/machine/${machineId}`);
            const formattedItems = response.data.map(item => ({
                id: item.id, name: item.foodName, quantity: item.qtd_itens,
                sales: Number(item.sales), sellPrice: Number(item.sellprice),
                buyPrice: Number(item.buyprice), revenue: Number(item.total_revenue),
                profit: Number(item.profit)
            }));
            setItems(formattedItems);
            setError(null);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setItems([]);
                setError(null);
            } else {
                setError('Não foi possível carregar os dados da máquina.');
                setItems([]);
            }
        } finally {
            setLoading(false);
        }
    }, [machineId]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    useEffect(() => {
        const fetchAllFoods = async () => {
            if (showRestockModal) {
                try {
                    const response = await axios.get('http://localhost:32718/foods');
                    setAllFoodItems(response.data);
                } catch (err) {
                    console.error("Erro ao buscar a lista de alimentos:", err);
                    setError("Falha ao carregar lista de alimentos para abastecimento.");
                }
            }
        };
        fetchAllFoods();
    }, [showRestockModal]);

    const handleOpenUpdateModal = (item) => {
        setSelectedItem(item);
        setUpdateQuantity(item.quantity);
        setShowUpdateModal(true);
    };

    const handleCloseModals = () => {
        setShowRestockModal(false);
        setShowUpdateModal(false);
        setSelectedItem(null);
        setUpdateQuantity('');
    };

    const handleUpdateStockSubmit = async () => {
        if (!selectedItem || updateQuantity === '') return;
        try {
            const payload = {
                qtdItens: Number(updateQuantity),
                sales: selectedItem.sales,
                foodName: selectedItem.name,
                sellprice: selectedItem.sellPrice,
                buyprice: selectedItem.buyPrice,
            };
            await axios.put(`http://localhost:3025/contents/${selectedItem.id}/machine/${machineId}`, payload);
            handleCloseModals();
            await fetchItems();
        } catch (err) {
            console.error("Erro ao atualizar o estoque:", err);
            let errorMessage = "Falha ao atualizar o estoque.";
            if (err.response && err.response.data && err.response.data.Error) {
                errorMessage += `\nMotivo do servidor: ${err.response.data.Error}`;
            }
            window.alert(errorMessage);
        }
    };

    const handleRestockSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const foodNameFromForm = formData.get('foodName');
        const quantity = formData.get('quantity');

        if (!foodNameFromForm || !quantity) {
            window.alert("Por favor, selecione um item e informe a quantidade.");
            return;
        }

        const selectedFood = allFoodItems.find(food => food.name === foodNameFromForm);

        if (!selectedFood) {
            window.alert("Comida selecionada não encontrada. Tente novamente.");
            return;
        }

        try {
            const payload = {
                qtdItens: Number(quantity),
                sales: 0,
                machineId: machineId,
                foodName: selectedFood.name,
                sellprice: selectedFood.sellprice,
                buyprice: selectedFood.buyprice
            };
            await axios.post(`http://localhost:3025/contents`, payload);
            handleCloseModals();
            await fetchItems();
        } catch (err) {
            console.error("Erro ao cadastrar abastecimento:", err);
            let errorMessage = "Falha ao cadastrar abastecimento.";
            if (err.response && err.response.data && err.response.data.Error) {
                errorMessage += `\nMotivo do servidor: ${err.response.data.Error}`;
            }
            window.alert(errorMessage);
        }
    };

    if (loading && items.length === 0) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: colors.darkPrimary, color: colors.textLight }}>
                <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem', color: colors.accent }} role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="fs-5">Carregando dados da máquina {machineId || ''}...</p>
            </div>
        );
    }

    if (error && items.length === 0) {
        return (
            <div
                className="d-flex flex-column justify-content-center align-items-center text-center p-4"
                style={{
                    minHeight: '100vh',
                    backgroundColor: colors.darkPrimary,
                    color: colors.textLight
                }}
            >
                <div
                    className="alert d-flex align-items-center shadow"
                    role="alert"
                    style={{
                        backgroundColor: '#4B1717',
                        borderColor: colors.danger,
                        color: '#F8D7DA',
                        maxWidth: '500px',
                        borderRadius: '0.75rem'
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-x-octagon-fill flex-shrink-0 me-3"
                        viewBox="0 0 16 16"
                    >
                    <path
                        d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"
                    />
                    </svg>

                    <div>
                        <strong className="d-block fs-5">
                            Falha ao Carregar Dados
                        </strong>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-left-circle-fill me-2" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" /></svg>
                        Voltar
                    </Link>
                    <h1 className="fw-bolder m-0 fs-4 lh-base text-center" style={{ color: colors.accent }}>Relatório da Máquina <br className="d-md-none" />{machineId}</h1>
                    <div style={{ minWidth: '220px' }} className="text-end">
                        <button className="btn rounded-pill d-flex align-items-center gap-2 px-3 py-2" style={{ backgroundColor: colors.accent, color: colors.darkPrimary, fontWeight: 'bold' }} onClick={() => setShowRestockModal(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" /></svg>
                            Cadastrar Abastecimento
                        </button>
                    </div>
                </div>
                {error && items.length > 0 && (
                    <div className="alert alert-danger mx-2" role="alert" style={{ backgroundColor: '#4B1717', color: '#F8D7DA', borderColor: colors.danger }}>
                        Ocorreu um erro: {error}. Alguns dados podem não estar atualizados.
                    </div>
                )}
                <div className="table-responsive shadow-lg rounded-3 overflow-hidden mx-2">
                    <table className="table table-hover mb-0 align-middle" style={{ borderColor: colors.tableHeaderBg, color: colors.textLight }}>
                        <thead style={{ backgroundColor: colors.tableHeaderBg, position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr>
                                {['Item', 'Estoque', 'Vendas', 'Preço Venda', 'Preço Compra', 'Receita Total', 'Lucro Total', 'Ações'].map(header => (
                                    <th scope="col" key={header} className="py-3 px-3 text-uppercase text-nowrap" style={{ color: colors.textSubtleDarkBg, letterSpacing: '0.05em', borderBottom: `3px solid ${colors.accent}`, fontSize: '0.8rem' }}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? (
                                items.map((item, idx) => {
                                    const estoqueStyle = item.quantity === 0 ? { color: colors.dangerText, fontWeight: 'bold' } : {};
                                    return (
                                        <tr key={item.id} style={{ backgroundColor: idx % 2 === 0 ? colors.darkPrimary : colors.rowDarkAlt, transition: 'background-color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.backgroundColor = `${colors.accent}2A`} onMouseOut={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? colors.darkPrimary : colors.rowDarkAlt}>
                                            <td className="py-3 px-3 fw-medium">{item.name}</td>
                                            <td className="py-3 px-3" style={estoqueStyle}>{item.quantity} un.{item.quantity === 0 ? " (Esgotado)" : ""}</td>
                                            <td className="py-3 px-3">{item.sales}</td>
                                            <td className="py-3 px-3">R$ {item.sellPrice.toFixed(2)}</td>
                                            <td className="py-3 px-3">R$ {item.buyPrice.toFixed(2)}</td>
                                            <td className="py-3 px-3" style={{ color: colors.accent, fontWeight: 'bold' }}>R$ {item.revenue.toFixed(2)}</td>
                                            <td className="py-3 px-3" style={{ color: item.profit >= 0 ? colors.successText : colors.dangerText, fontWeight: 'bold' }}>R$ {item.profit.toFixed(2)}</td>
                                            <td className="py-3 px-3">
                                                <button className="btn btn-sm rounded-pill" style={{ backgroundColor: colors.mediumNeutral, color: colors.textDark, fontWeight: '500' }} onClick={() => handleOpenUpdateModal(item)}>Atualizar</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-5" style={{ backgroundColor: colors.rowDarkAlt }}>
                                        <p className="fs-5 mb-0" style={{ color: colors.textSubtleDarkBg }}>Nenhum item encontrado para esta máquina.</p>
                                        {loading && <p className="fs-6 mt-2" style={{ color: colors.textLight }}>Verificando...</p>}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={showRestockModal} onClose={handleCloseModals} title="Cadastrar Novo Abastecimento">
                <form onSubmit={handleRestockSubmit}>
                    <div className="mb-3">
                        <label htmlFor="food-select" className="form-label">Item</label>
                        <select name="foodName" id="food-select" style={formInputStyle} required>
                            <option value="" key="default-option-key">Selecione um item...</option>
                            {allFoodItems.map((foodItem) => (
                                <option key={foodItem.Id} value={foodItem.name}>
                                    {foodItem.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="quantity-input" className="form-label">Quantidade</label>
                        <input type="number" name="quantity" id="quantity-input" style={formInputStyle} placeholder="Ex: 50" min="1" required />
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn" style={{ backgroundColor: colors.mediumNeutral, color: colors.textDark }} onClick={handleCloseModals}>Cancelar</button>
                        <button type="submit" className="btn" style={{ backgroundColor: colors.accent, color: colors.darkPrimary, fontWeight: 'bold' }}>Salvar</button>
                    </div>
                </form>
            </Modal>

            {selectedItem && (
                <Modal show={showUpdateModal} onClose={handleCloseModals} title={`Atualizar Estoque: ${selectedItem.name}`}>
                    <div>
                        <div className="mb-3">
                            <label htmlFor="update-quantity-input" className="form-label">Nova Quantidade em Estoque</label>
                            <input type="number" id="update-quantity-input" style={formInputStyle} value={updateQuantity} onChange={(e) => setUpdateQuantity(e.target.value)} min="0" required />
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button type="button" className="btn" style={{ backgroundColor: colors.mediumNeutral, color: colors.textDark }} onClick={handleCloseModals}>Cancelar</button>
                            <button type="button" className="btn" style={{ backgroundColor: colors.accent, color: colors.darkPrimary, fontWeight: 'bold' }} onClick={handleUpdateStockSubmit}>Atualizar</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MachineScreen;