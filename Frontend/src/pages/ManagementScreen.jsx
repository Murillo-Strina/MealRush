import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

const ManagementScreen = () => {
    const colors = {
        darkPrimary: '#1A202C',
        accent: '#00C9A7',
        mediumNeutral: '#00C9A7',
        tableHeaderBg: '#2D3748',
        textDark: '#2D3748',
        textLight: '#F7FAFC',
        rowDarkAlt: '#202733',
        danger: '#E53E3E',
        borderColor: '#4A5568'
    };

    const statusLabels = {
        1: "Ativa",
        2: "Em manutenção",
        3: "Aguardando abastecimento"
    };
    const navigate = useNavigate();
    const [institutions, setInstitutionsState] = useState([]);
    const [machines, setMachines] = useState([]);
    const [institutionsWithMachinesCount, setInstitutionsWithMachinesCount] = useState([]);

    useEffect(() => {
        const fetchInstitutionsData = async () => {
            try {
                const response = await axios.get('http://localhost:3005/institutions');
                const institutesFromApi = response.data;
                const formattedInstitutions = institutesFromApi.map((inst) => ({
                    id: inst.id,
                    name: inst.name,
                    registry: inst.registration_number,
                    machines: 0
                }));
                setInstitutionsState(formattedInstitutions);
            } catch (err) {
                console.error("Erro ao buscar instituições:", err);
            }
        };
        fetchInstitutionsData();
    }, []);

    useEffect(() => {
        const fetchMachinesData = async () => {
            try {
                const response = await axios.get('http://localhost:3010/machines');
                const machinesFromApi = response.data;
                const formatDate = (dateString) => {
                    if (!dateString) return '';
                    return new Date(dateString).toISOString().split('T')[0];
                };
                const formattedMachines = machinesFromApi.map((machine) => ({
                    id: machine.id,
                    institutionId: machine.institutionId,
                    stock: machine.qtd_itens,
                    status: machine.statusId,
                    lastMaintenance: formatDate(machine.dt_ultima_manutencao),
                    lastFill: formatDate(machine.dt_ultimo_abastecimento),
                    rent: machine.aluguel
                }));
                setMachines(formattedMachines);
            } catch (err) {
                console.error("Erro ao buscar máquinas:", err);
            }
        };
        fetchMachinesData();
    }, []);

    useEffect(() => {
        if (institutions.length > 0 && machines.length > 0) {
            const updatedInstitutions = institutions.map(inst => {
                const machineCount = machines.filter(machine => machine.institutionId === inst.id).length;
                return { ...inst, machines: machineCount };
            });
            setInstitutionsWithMachinesCount(updatedInstitutions);
        } else if (institutions.length > 0) {
            const updatedInstitutions = institutions.map(inst => ({ ...inst, machines: 0 }));
            setInstitutionsWithMachinesCount(updatedInstitutions);
        } else {
            setInstitutionsWithMachinesCount([]);
        }
    }, [institutions, machines]);

    const [showMachines, setShowMachines] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState(null);

    const [institutionIdInput, setInstitutionIdInput] = useState('');
    const [machineIdInput, setMachineIdInput] = useState('');

    const machineSectionRef = useRef(null);

    const goToMachine = () => {
        const inputValue = institutionIdInput.trim();
        if (inputValue === '' || isNaN(inputValue)) {
            alert("Insira um ID válido");
            return false;
        }
        const institutionId = parseInt(inputValue);
        const foundInstitution = institutions.find(inst => inst.id === institutionId);
        if (!foundInstitution) {
            alert("Instituição não encontrada");
            return false;
        }

        setSelectedInstitution(foundInstitution);
        setShowMachines(true);

        setTimeout(() => {
            if (machineSectionRef.current) {
                machineSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    };

    const [showInstitutionModal, setShowInstitutionModal] = useState(false);
    const [showMachineInputModal, setShowMachineInputModal] = useState(false);
    const [showMachineUpdateModal, setShowMachineUpdateModal] = useState(false);

    const [newInstitution, setNewInstitution] = useState({ name: '', registry: '' });

    const handleInstitutionChange = async () => {
        if (newInstitution.name.trim() === '' || newInstitution.registry.trim() === '') {
            alert("Preencha todos os campos");
            return false;
        }
        try {
            const response = await axios.post('http://localhost:3005/institutions', {
                name: newInstitution.name,
                registration_number: newInstitution.registry
            });
            const createdInstitution = {
                id: response.data.id,
                name: response.data.name,
                registry: response.data.registration_number,
                machines: 0
            };
            setInstitutionsState(prev => [...prev, createdInstitution]);
            setShowInstitutionModal(false);
            setNewInstitution({ name: '', registry: '' });
            alert("Instituição cadastrada com sucesso!");
        } catch (err) {
            console.error("Erro ao cadastrar instituição:", err);
            alert("Erro ao cadastrar instituição");
        }
    };

    const handleRemoveInstitution = async (id) => {
        if (window.confirm("Tem certeza que deseja remover esta instituição?")) {
            try {
                await axios.delete(`http://localhost:3005/institutions/${id}`);
                setInstitutionsState(prev => prev.filter(inst => inst.id !== id));
                setMachines(prev => prev.filter(machine => machine.institutionId !== id));
                if (selectedInstitution && selectedInstitution.id === id) {
                    setSelectedInstitution(null);
                    setShowMachines(false);
                }
                alert("Instituição removida com sucesso!");
            } catch (err) {
                console.error("Erro ao remover instituição:", err);
                alert("Erro ao remover instituição");
            }
        }
    };

    const handleRemoveMachine = async (id) => {
        if (!selectedInstitution) {
            alert("Nenhuma instituição selecionada!");
            return;
        }
        if (window.confirm("Tem certeza que deseja remover esta máquina?")) {
            try {
                await axios.delete(`http://localhost:3010/machines/${id}/institution/${selectedInstitution.id}`);
                setMachines(prev => prev.filter(machine => machine.id !== id));
                alert("Máquina removida com sucesso!");
            } catch (err) {
                console.error("Erro ao remover máquina:", err);
                alert("Erro ao remover máquina");
            }
        }
    };

    const [newMachine, setNewMachine] = useState({
        institutionId: '', stock: 30, status: 1,
        lastMaintenance: new Date().toISOString().split('T')[0],
        lastFill: new Date().toISOString().split('T')[0], rent: ''
    });

    const handleMachineInput = async () => {
        if (!selectedInstitution) {
            alert("É necessário selecionar uma instituição!");
            return;
        }
        if (newMachine.rent.trim() === '' || isNaN(parseFloat(newMachine.rent))) {
            alert("Preencha o valor do aluguel corretamente.");
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        try {
            const response = await axios.post('http://localhost:3010/machines', {
                institutionId: selectedInstitution.id.toString(),
                stock: newMachine.stock.toString(),
                status: newMachine.status.toString(),
                lastMaintenance: today,
                lastFill: today,
                rent: newMachine.rent.toString()
            });

            const newMachineFormatted = {
                id: response.data.id,
                institutionId: selectedInstitution.id,
                stock: newMachine.stock,
                status: newMachine.status,
                lastMaintenance: today,
                lastFill: today,
                rent: parseFloat(newMachine.rent)
            };

            setMachines(prev => [...prev, newMachineFormatted]);
            setShowMachineInputModal(false);
            setNewMachine({
                institutionId: '', stock: 30, status: 1,
                lastMaintenance: new Date().toISOString().split('T')[0],
                lastFill: new Date().toISOString().split('T')[0], rent: ''
            });
            alert("Máquina cadastrada com sucesso!");
        } catch (err) {
            console.error("Erro ao cadastrar máquina:", err);
            alert("Erro ao cadastrar máquina");
        }
    };

    const [updatedMachine, setUpdatedMachine] = useState({
        id: null, stock: '', status: '', lastMaintenance: '', lastFill: '', rent: ''
    });

    const handleMachineUpdate = async () => {
        if (!selectedInstitution) {
            alert("É necessário selecionar uma instituição!");
            return;
        }
        const id = updatedMachine.id;
        if (!id) {
            alert("ID da máquina para atualização não encontrado.");
            return;
        }
        if (updatedMachine.stock === '' || updatedMachine.status === '' || updatedMachine.lastMaintenance === '' || updatedMachine.lastFill === '' || updatedMachine.rent === '') {
            alert("Todos os campos devem ser preenchidos para atualização.");
            return;
        }
        try {
            await axios.put(`http://localhost:3010/machines/${id}/institution/${selectedInstitution.id}`, {
                qtd_itens: parseInt(updatedMachine.stock), statusId: parseInt(updatedMachine.status),
                dt_ultima_manutencao: updatedMachine.lastMaintenance, dt_ultimo_abastecimento: updatedMachine.lastFill,
                aluguel: parseFloat(updatedMachine.rent)
            });
            const updatedFormatted = {
                id, institutionId: selectedInstitution.id, stock: parseInt(updatedMachine.stock), status: parseInt(updatedMachine.status),
                lastMaintenance: updatedMachine.lastMaintenance, lastFill: updatedMachine.lastFill, rent: parseFloat(updatedMachine.rent)
            };
            setMachines(prev => prev.map(machine => machine.id === id ? updatedFormatted : machine));
            setShowMachineUpdateModal(false);
            alert("Máquina atualizada com sucesso!");
        } catch (err) {
            console.error("Erro ao atualizar máquina:", err);
            alert("Erro ao atualizar máquina");
        }
    };

    const openUpdateMachineModal = (machineId) => {
        const machineToUpdate = machines.find(m => m.id === machineId && m.institutionId === selectedInstitution.id);
        if (machineToUpdate) {
            setUpdatedMachine({
                id: machineToUpdate.id, stock: machineToUpdate.stock.toString(), status: machineToUpdate.status.toString(),
                lastMaintenance: machineToUpdate.lastMaintenance, lastFill: machineToUpdate.lastFill, rent: machineToUpdate.rent.toString()
            });
            setShowMachineUpdateModal(true);
        } else {
            alert("Máquina não encontrada para atualização.");
        }
    };

    const baseButtonStyle = {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        borderRadius: '0.3rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        fontWeight: 500,
    };

    const actionButtonStyle = (type = 'accent') => {
        let specificColors = {};
        switch (type) {
            case 'danger':
                specificColors = { backgroundColor: colors.danger, color: colors.textLight, borderColor: colors.danger };
                break;
            case 'neutral':
                specificColors = { backgroundColor: colors.mediumNeutral, color: colors.textDark, borderColor: colors.mediumNeutral };
                break;
            case 'accent':
            default:
                specificColors = { backgroundColor: colors.accent, color: colors.darkPrimary, borderColor: colors.accent };
                break;
        }
        return { ...baseButtonStyle, ...specificColors, padding: '0.65rem 1.3rem', fontSize: '1.1rem' };
    };

    const inputStyle = {
        backgroundColor: colors.inputBg,
        borderColor: colors.borderColor,
        borderRadius: '0.25rem',
        padding: '0.55rem 0.75rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        outline: 'none',
        boxShadow: 'none',
    };

    const formLabelStyle = {
        color: colors.mediumNeutral,
        fontSize: '0.9rem',
        marginBottom: '0.3rem'
    };

    const tableHeaderCellStyle = {
        color: colors.mediumNeutral,
        letterSpacing: '0.05em',
        borderBottom: `3px solid ${colors.accent}`,
        fontSize: '0.8rem',
        padding: '0.75rem',
        textTransform: 'uppercase'
    };

    const tableCellStyle = (isAltRow = false) => ({
        backgroundColor: isAltRow ? colors.rowDarkAlt : colors.darkPrimary,
        color: colors.textLight,
        borderColor: colors.borderColor,
        padding: '0.75rem',
        transition: 'background-color 0.2s ease'
    });

    const tableRowHoverStyle = (isAltRow) => ({
        backgroundColor: `${colors.accent}33`
    });
    const tableRowInitialStyle = (isAltRow) => ({
        backgroundColor: isAltRow ? colors.rowDarkAlt : colors.darkPrimary
    });

    return (
        <div style={{ minHeight: '100vh', backgroundColor: colors.darkPrimary, color: colors.textLight }} className="py-4 px-md-3">
            <div className="text-center d-flex align-items-center justify-content-center pt-3">
                <div className="text-center d-flex flex-column align-items-center justify-content-center">
                    <img src="/src/assets/images/logo_mealrush_white.png" style={{ width: "300px" }} className="mb-3" alt="Logo MealRush" />
                    <div className="border rounded p-3 shadow-sm" style={{ backgroundColor: colors.tableHeaderBg, borderColor: colors.accent }}>
                        <h1 className="fw-bolder m-0 fs-3" style={{ color: colors.accent }}>Gerenciamento de instituições e máquinas</h1>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-start align-items-center my-4 px-2">
                <button
                    className="btn rounded-pill d-flex align-items-center px-3 py-2"
                    style={{ backgroundColor: colors.textLight, color: colors.textDark, fontWeight: 500 }}
                    onClick={() => navigate("/admin")}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-left-circle-fill me-2" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                    </svg>
                    Voltar
                </button>
            </div>

            <h2 className="fw-bold fs-4 my-4 text-center" style={{ color: colors.textLight }}>Instituições</h2>
            <div className="table-responsive shadow-lg rounded-3 overflow-hidden mx-2 mb-5">
                <table className="table table-hover mb-0 align-middle" style={{ borderColor: colors.tableHeaderBg, color: colors.textLight }}>
                    <thead style={{ backgroundColor: colors.tableHeaderBg, position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr>
                            {['ID', 'Nome da Instituição', 'Número de Registro', 'Máquinas'].map(header => (
                                <th scope="col" key={header} className="py-3 px-3 text-uppercase text-nowrap" style={tableHeaderCellStyle}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {institutionsWithMachinesCount.length > 0 ? institutionsWithMachinesCount.map((item, idx) => (
                            <tr key={item.id}
                                style={tableCellStyle(idx % 2 !== 0)}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = tableRowHoverStyle(idx % 2 !== 0).backgroundColor}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = tableRowInitialStyle(idx % 2 !== 0).backgroundColor}
                            >
                                <td className="py-3 px-3">{item.id}</td>
                                <td className="py-3 px-3">{item.name}</td>
                                <td className="py-3 px-3">{item.registry}</td>
                                <td className="py-3 px-3">{item.machines}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} className="text-center py-5" style={{ backgroundColor: colors.rowDarkAlt, color: colors.textLight }}>Nenhuma instituição encontrada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="text-center d-flex flex-column align-items-center justify-content-center p-3 mb-5">
                <h3 className="mb-3 fs-5" style={{ color: colors.textLight }}>Ações da Instituição</h3>
                <input
                    type="number"
                    placeholder="ID da instituição para gerenciar/remover..."
                    className="form-control w-50 mb-3"
                    style={inputStyle}
                    value={institutionIdInput}
                    onChange={e => setInstitutionIdInput(e.target.value)}
                    required
                />
                <div className="d-flex flex-wrap justify-content-center gap-3 p-3">
                    <button style={actionButtonStyle('accent')} onClick={() => setShowInstitutionModal(true)}>Cadastrar Instituição</button>
                    <button style={actionButtonStyle('danger')} onClick={() => {
                        const id = parseInt(institutionIdInput);
                        if (!id || isNaN(id)) { alert("Insira um ID válido para remover."); return; }
                        handleRemoveInstitution(id);
                    }}>Remover Instituição</button>
                    <button style={actionButtonStyle('accent')} onClick={goToMachine}>Gerenciar Máquinas da Instituição</button>
                </div>
            </div>

            {showMachines && selectedInstitution && (
                <div id="machines-section" className="mt-5">
                    <h2 className="fw-bold fs-4 my-4 text-center" ref={machineSectionRef} style={{ color: colors.textLight }}>Máquinas da Instituição: <span style={{ color: colors.accent }}>{selectedInstitution.name}</span></h2>
                    <div className="table-responsive shadow-lg rounded-3 overflow-hidden mx-2 mb-5">
                        <table className="table table-hover mb-0 align-middle" style={{ borderColor: colors.tableHeaderBg, color: colors.textLight }}>
                            <thead style={{ backgroundColor: colors.tableHeaderBg, position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr>
                                    {['ID', 'Estoque', 'Status', 'Última Manutenção', 'Último Abastecimento', 'Aluguel'].map(header => (
                                        <th scope="col" key={header} className="py-3 px-3 text-uppercase text-nowrap" style={tableHeaderCellStyle}>
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {machines.filter(m => m.institutionId === selectedInstitution.id).length > 0 ?
                                    machines.filter(machine => machine.institutionId === selectedInstitution.id).map((item, idx) => (
                                        <tr key={item.id}
                                            style={tableCellStyle(idx % 2 !== 0)}
                                            onMouseOver={e => e.currentTarget.style.backgroundColor = tableRowHoverStyle(idx % 2 !== 0).backgroundColor}
                                            onMouseOut={e => e.currentTarget.style.backgroundColor = tableRowInitialStyle(idx % 2 !== 0).backgroundColor}
                                        >
                                            <td className="py-3 px-3">{item.id}</td>
                                            <td className="py-3 px-3">{item.stock}</td>
                                            <td className="py-3 px-3">{statusLabels[item.status]}</td>
                                            <td className="py-3 px-3">{item.lastMaintenance}</td>
                                            <td className="py-3 px-3">{item.lastFill}</td>
                                            <td className="py-3 px-3">{item.rent}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={6} className="text-center py-5" style={{ backgroundColor: colors.rowDarkAlt, color: colors.textLight }}>Nenhuma máquina encontrada para esta instituição.</td></tr>
                                    )}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center d-flex flex-column align-items-center justify-content-center p-3">
                        <h3 className="mb-3 fs-5" style={{ color: colors.textLight }}>Ações da Máquina</h3>
                        <input
                            type="number"
                            placeholder="ID da máquina para gerenciar/remover..."
                            className="form-control w-50 mb-3"
                            style={inputStyle}
                            value={machineIdInput}
                            onChange={e => setMachineIdInput(e.target.value)}
                            required
                        />
                        <div className="d-flex flex-wrap justify-content-center gap-3 p-3">
                            <button style={actionButtonStyle('accent')} onClick={() => setShowMachineInputModal(true)}>Adicionar Máquina</button>
                            <button style={actionButtonStyle('danger')} onClick={() => {
                                const id = parseInt(machineIdInput);
                                if (!id || isNaN(id)) { alert("Insira um ID válido para remover."); return; }
                                handleRemoveMachine(id);
                            }}>Remover Máquina</button>
                            <button style={actionButtonStyle('accent')} onClick={() => {
                                const id = parseInt(machineIdInput);
                                if (!id || isNaN(id)) { alert("Insira um ID válido para atualizar."); return; }
                                openUpdateMachineModal(id);
                            }}>Atualizar Máquina</button>
                        </div>
                    </div>
                </div>
            )}

            {showInstitutionModal && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content" style={{ backgroundColor: colors.darkPrimary, color: colors.textLight, border: `1px solid ${colors.borderColor}`, borderRadius: '0.5rem' }}>
                            <div className="modal-header" style={{ borderColor: colors.borderColor, borderBottomWidth: '2px' }}>
                                <h5 className="modal-title fw-bold" style={{ color: colors.accent }}>Cadastrar Instituição</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowInstitutionModal(false)}></button>
                            </div>
                            <div className="modal-body py-4">
                                <div className="form-group mb-3">
                                    <label className="form-label" style={formLabelStyle}>Nome da Instituição</label>
                                    <input type="text" className="form-control" style={inputStyle} value={newInstitution.name} onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={formLabelStyle}>Número de Registro (CNPJ)</label>
                                    <input type="text" maxLength={14} className="form-control" style={inputStyle} value={newInstitution.registry} onChange={(e) => setNewInstitution({ ...newInstitution, registry: e.target.value.replace(/\D/g, '') })} />
                                </div>
                            </div>
                            <div className="modal-footer" style={{ borderColor: colors.borderColor, borderTopWidth: '2px' }}>
                                <button style={actionButtonStyle('neutral')} onClick={() => setShowInstitutionModal(false)}>Cancelar</button>
                                <button style={actionButtonStyle('accent')} onClick={handleInstitutionChange}>Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showMachineInputModal && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content" style={{ backgroundColor: colors.darkPrimary, color: colors.textLight, border: `1px solid ${colors.borderColor}`, borderRadius: '0.5rem' }}>
                            <div className="modal-header" style={{ borderColor: colors.borderColor, borderBottomWidth: '2px' }}>
                                <h5 className="modal-title fw-bold" style={{ color: colors.accent }}>Cadastrar Máquina</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowMachineInputModal(false)}></button>
                            </div>
                            <div className="modal-body py-4">
                                <div className="form-group mb-3">
                                    <label className="form-label" style={formLabelStyle}>Aluguel (R$)</label>
                                    <input type="number" className="form-control" style={inputStyle} value={newMachine.rent} onChange={(e) => setNewMachine({ ...newMachine, rent: e.target.value })} />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label" style={formLabelStyle}>Estoque Inicial</label>
                                    <input type="number" className="form-control" style={inputStyle} value={newMachine.stock} onChange={(e) => setNewMachine({ ...newMachine, stock: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label" style={formLabelStyle}>Status Inicial</label>
                                    <select className="form-select" style={inputStyle} value={newMachine.status} onChange={(e) => setNewMachine({ ...newMachine, status: parseInt(e.target.value) })}>
                                        <option value="1">Ativa</option>
                                        <option value="2">Em manutenção</option>
                                        <option value="3">Aguardando abastecimento</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ borderColor: colors.borderColor, borderTopWidth: '2px' }}>
                                <button style={actionButtonStyle('neutral')} onClick={() => setShowMachineInputModal(false)}>Cancelar</button>
                                <button style={actionButtonStyle('accent')} onClick={handleMachineInput}>Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showMachineUpdateModal && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content" style={{ backgroundColor: colors.darkPrimary, color: colors.textLight, border: `1px solid ${colors.borderColor}`, borderRadius: '0.5rem' }}>
                            <div className="modal-header" style={{ borderColor: colors.borderColor, borderBottomWidth: '2px' }}>
                                <h5 className="modal-title fw-bold" style={{ color: colors.accent }}>Atualizar Máquina (ID: {updatedMachine.id})</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowMachineUpdateModal(false)}></button>
                            </div>
                            <div className="modal-body py-4">
                                <div className="form-group mb-3">
                                    <label className="form-label" style={formLabelStyle}>Estoque</label>
                                    <input type="number" className="form-control" style={inputStyle} value={updatedMachine.stock} onChange={(e) => setUpdatedMachine({ ...updatedMachine, stock: e.target.value })} />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label" style={formLabelStyle}>Status</label>
                                    <select className="form-select" style={inputStyle} value={updatedMachine.status} onChange={(e) => setUpdatedMachine({ ...updatedMachine, status: e.target.value })}>
                                        <option value="">Selecione...</option>
                                        <option value="1">Ativa</option>
                                        <option value="2">Em manutenção</option>
                                        <option value="3">Aguardando abastecimento</option>
                                    </select>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label" style={formLabelStyle}>Última Manutenção</label>
                                    <input type="date" className="form-control" style={inputStyle} value={updatedMachine.lastMaintenance} onChange={(e) => setUpdatedMachine({ ...updatedMachine, lastMaintenance: e.target.value })} />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label" style={formLabelStyle}>Último Abastecimento</label>
                                    <input type="date" className="form-control" style={inputStyle} value={updatedMachine.lastFill} onChange={(e) => setUpdatedMachine({ ...updatedMachine, lastFill: e.target.value })} />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label" style={formLabelStyle}>Aluguel (R$)</label>
                                    <input type="number" className="form-control" style={inputStyle} value={updatedMachine.rent} onChange={(e) => setUpdatedMachine({ ...updatedMachine, rent: e.target.value })} />
                                </div>
                            </div>
                            <div className="modal-footer" style={{ borderColor: colors.borderColor, borderTopWidth: '2px' }}>
                                <button style={actionButtonStyle('neutral')} onClick={() => setShowMachineUpdateModal(false)}>Cancelar</button>
                                <button style={actionButtonStyle('accent')} onClick={handleMachineUpdate}>Atualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagementScreen;