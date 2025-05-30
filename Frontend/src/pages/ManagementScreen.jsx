import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const ManagementScreen = () => {
    const navigate = useNavigate();
    const [institution, setInstitutions] = useState([]);
    const [machines, setMachines] = useState([]);
    const [institutionsWithMachinesCount, setInstitutionsWithMachinesCount] = useState([]);

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await axios.get('http://localhost:3005/institutions');
                const institutesFromApi = response.data;
                const formattedInstitutions = institutesFromApi.map((institution) => ({
                    id: institution.id,
                    name: institution.name,
                    registry: institution.registration_number,
                    machines: 0
                }));
                setInstitutions(formattedInstitutions);
            } catch (err) {
                console.error("Erro ao buscar instituições:", err);
            }
        };
        fetchInstitutions();
    }, []);

    useEffect(() => {
        const fetchMachines = async () => {
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
        fetchMachines();
    }, []);

    useEffect(() => {
        if (institution.length > 0 && machines.length > 0) {
            const updatedInstitutions = institution.map(inst => {
                const machineCount = machines.filter(machine => machine.institutionId === inst.id).length;
                return { ...inst, machines: machineCount };
            });
            setInstitutionsWithMachinesCount(updatedInstitutions);
        } else if (institution.length > 0) {
            const updatedInstitutions = institution.map(inst => ({ ...inst, machines: 0 }));
            setInstitutionsWithMachinesCount(updatedInstitutions);
        }
    }, [institution, machines]);

    const [showMachines, setShowMachines] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState(null);

    const [institutionIdInput, setInstitutionIdInput] = useState('');
    const [machineIdInput, setMachineIdInput] = useState('');

    const goToMachine = () => {
        const inputValue = institutionIdInput.trim();

        if (inputValue === '' || isNaN(inputValue)) {
            alert("Insira um ID válido");
            return false;
        }

        const institutionId = parseInt(inputValue);
        const foundInstitution = institution.find(inst => inst.id === institutionId);

        if (!foundInstitution) {
            alert("Instituição não encontrada");
            return false;
        }

        setSelectedInstitution(foundInstitution);
        setShowMachines(true);
    };

    const [showInstitutionModal, setShowInstitutionModal] = useState(false);
    const [showMachineInputModal, setShowMachineInputModal] = useState(false);
    const [showMachineUpdateModal, setShowMachineUpdateModal] = useState(false);

    const [newInstitution, setNewInstitution] = useState({
        name: '',
        registry: ''
    });

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
            setInstitutions(prev => [...prev, response.data]);
            setShowInstitutionModal(false);
            setNewInstitution({ name: '', registry: '' });
        } catch (err) {
            console.error("Erro ao cadastrar instituição:", err);
            alert("Erro ao cadastrar instituição");
        }
    };

    const handleRemoveInstitution = async (id) => {
        if (window.confirm("Tem certeza que deseja remover esta instituição?")) {
            try {
                await axios.delete(`http://localhost:3005/institutions/${id}`);
                setInstitutions(prev => prev.filter(inst => inst.id !== id));
                setMachines(prev => prev.filter(machine => machine.institutionId !== id));
                if (selectedInstitution && selectedInstitution.id === id) {
                    setSelectedInstitution(null);
                    setShowMachines(false);
                }
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
            } catch (err) {
                console.error("Erro ao remover máquina:", err);
                alert("Erro ao remover máquina");
            }
        }
    };

    const [newMachine, setNewMachine] = useState({
        institutionId: '',
        stock: 30,
        status: 1,
        lastMaintenance: new Date().toISOString().split('T')[0],
        lastFill: new Date().toISOString().split('T')[0],
        rent: ''
    });

    const handleMachineInput = async () => {
        if (!selectedInstitution) {
            alert("É necessário selecionar uma instituição!");
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        try {
            const response = await axios.post('http://localhost:3010/machines', {
                institutionId: selectedInstitution.id,
                stock: newMachine.stock,
                status: newMachine.status,
                lastMaintenance: today,
                lastFill: today,
                rent: newMachine.rent
            });

            const newMachineFormatted = {
                id: response.data.id,
                institutionId: selectedInstitution.id,
                stock: newMachine.stock,
                status: newMachine.status,
                lastMaintenance: newMachine.lastMaintenance,
                lastFill: newMachine.lastFill,
                rent: newMachine.rent
            };

            setMachines(prev => [...prev, newMachineFormatted]);
            setShowMachineInputModal(false);
            alert("Máquina cadastrada com sucesso!");
        } catch (err) {
            console.error("Erro ao cadastrar máquina:", err);
            alert("Erro ao cadastrar máquina");
        }
    };

    const [updatedMachine, setUpdatedMachine] = useState({
        stock: '',
        status: '',
        lastMaintenance: '',
        lastFill: '',
        rent: ''
    });

    const handleMachineUpdate = async () => {
        if (!selectedInstitution) {
            alert("É necessário selecionar uma instituição!");
            return;
        }

        const id = parseInt(machineIdInput);
        if (!id || isNaN(id)) {
            alert("Insira um ID válido");
            return;
        }

        const existingMachine = machines.find(machine => machine.id === id && machine.institutionId === selectedInstitution.id);
        if (!existingMachine) {
            alert("Máquina não encontrada na instituição selecionada");
            return;
        }

        try {
            await axios.put(`http://localhost:3010/machines/${id}/institution/${selectedInstitution.id}`, {
                institutionId: selectedInstitution.id,
                stock: updatedMachine.stock,
                status: updatedMachine.status,
                lastMaintenance: updatedMachine.lastMaintenance,
                lastFill: updatedMachine.lastFill,
                rent: updatedMachine.rent
            });

            const updatedFormatted = {
                id,
                institutionId: selectedInstitution.id,
                stock: updatedMachine.stock,
                status: updatedMachine.status,
                lastMaintenance: updatedMachine.lastMaintenance,
                lastFill: updatedMachine.lastFill,
                rent: updatedMachine.rent
            };

            setMachines(prev => prev.map(machine => machine.id === id ? updatedFormatted : machine));
            setShowMachineUpdateModal(false);
            alert("Máquina atualizada com sucesso!");
        } catch (err) {
            console.error("Erro ao atualizar máquina:", err);
            alert("Erro ao atualizar máquina");
        }
    };

    return (
        <div style={{ minHeight: '100vh' }} className="bg-dark text-light">
            <div className="p-3">
                <button className="btn btn-secondary" onClick={() => navigate("/admin")}>Voltar</button>
            </div>

            <div className="text-center d-flex align-items-center justify-content-center p-3 font-weight-bold">
                <div className="text-center d-flex flex-column align-items-center justify-content-center p-3">
                    <img src="src/assets/images/logo_mealrush_white.png" style={{ width: "350px" }} className="mb-3" alt="Logo" />
                    <div className="border border-secondary rounded p-3 bg-secondary">
                        <h1 className="fw-bold">Instituições</h1>
                    </div>
                </div>
            </div>

            <div className="p-3">
                <table className="table table-bordered table-striped table-dark text-center">
                    <thead>
                        <tr>
                            <th className="bg-secondary">ID</th>
                            <th className="bg-secondary">Nome da Instituição</th>
                            <th className="bg-secondary">Número de Registro</th>
                            <th className="bg-secondary">Número de Máquinas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {institutionsWithMachinesCount.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.registry}</td>
                                <td>{item.machines}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-center d-flex flex-column align-items-center justify-content-center p-3">
                <h2 className="mb-3">Ações</h2>
                <input
                    type="number"
                    placeholder="Insira o ID da instituição a ser gerenciada..."
                    className="border border-secondary rounded w-25 p-1 bg-secondary text-light"
                    value={institutionIdInput}
                    onChange={e => setInstitutionIdInput(e.target.value)}
                    required
                />
                <div className="d-flex flex-row gap-3 p-3">
                    <button className="btn btn-secondary btn-lg" onClick={() => setShowInstitutionModal(true)}>Cadastrar Instituição</button>
                    <button className="btn btn-secondary btn-lg" onClick={() => {
                        const id = parseInt(institutionIdInput);
                        if (!id || isNaN(id)) {
                            alert("Insira um ID válido");
                            return;
                        }
                        handleRemoveInstitution(id);
                    }}>Remover Instituição</button>
                    <button className="btn btn-secondary btn-lg" onClick={goToMachine}>Gerenciar Máquinas</button>
                </div>
            </div>

            {showMachines && selectedInstitution && (
                <div id="machines-section">
                    <div className="text-center d-flex align-items-center justify-content-center p-3 font-weight-bold">
                        <div className="text-center d-flex flex-column align-items-center justify-content-center p-3">
                            <div className="border border-secondary rounded p-3 bg-secondary">
                                <h1 className="fw-bold">Máquinas da Instituição: {selectedInstitution.name}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="p-3">
                        <table className="table table-bordered table-striped table-dark text-center">
                            <thead>
                                <tr>
                                    <th className="bg-secondary">ID</th>
                                    <th className="bg-secondary">Estoque</th>
                                    <th className="bg-secondary">Status</th>
                                    <th className="bg-secondary">Última Manutenção</th>
                                    <th className="bg-secondary">Último abastecimento</th>
                                    <th className="bg-secondary">Aluguel</th>
                                </tr>
                            </thead>
                            <tbody>
                                {machines.filter(machine => machine.institutionId === selectedInstitution.id).map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.id}</td>
                                        <td>{item.stock}</td>
                                        <td>{item.status}</td>
                                        <td>{item.lastMaintenance}</td>
                                        <td>{item.lastFill}</td>
                                        <td>{item.rent}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center d-flex flex-column align-items-center justify-content-center p-3">
                        <h2 className="mb-3">Ações</h2>
                        <input
                            type="number"
                            placeholder="Insira o ID da máquina a ser gerenciada..."
                            className="border border-secondary rounded w-25 p-1 bg-secondary text-light"
                            value={machineIdInput}
                            onChange={e => setMachineIdInput(e.target.value)}
                            required
                        />
                        <div className="d-flex flex-row gap-3 p-3">
                            <button className="btn btn-secondary btn-lg" onClick={() => setShowMachineInputModal(true)}>Adicionar Máquina</button>
                            <button className="btn btn-secondary btn-lg" onClick={() => {
                                const id = parseInt(machineIdInput);
                                if (!id || isNaN(id)) {
                                    alert("Insira um ID válido");
                                    return;
                                }
                                handleRemoveMachine(id);
                            }}>Remover Máquina</button>
                            <button className="btn btn-secondary btn-lg" onClick={() => {
                                const id = parseInt(machineIdInput);
                                if (!id || isNaN(id)) {
                                    alert("Insira um ID válido");
                                    return;
                                }
                                const existingMachine = machines.find(machine => machine.id === id && machine.institutionId === selectedInstitution.id);
                                if (!existingMachine) {
                                    alert("Máquina não encontrada na instituição selecionada");
                                    return;
                                }
                                setUpdatedMachine(existingMachine);
                                setShowMachineUpdateModal(true);
                            }}>Atualizar Máquina</button>
                        </div>
                    </div>
                </div>
            )}

            {showMachineInputModal && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content bg-dark text-light">
                            <div className="modal-header">
                                <h5 className="modal-title">Cadastrar Máquina</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowMachineInputModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group mb-3">
                                    <label>Aluguel</label>
                                    <input
                                        type="number"
                                        className="form-control bg-secondary text-light"
                                        value={newMachine.rent}
                                        onChange={(e) => setNewMachine({ ...newMachine, rent: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowMachineInputModal(false)}>Cancelar</button>
                                <button className="btn btn-primary" onClick={handleMachineInput}>Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showMachineUpdateModal && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content bg-dark text-light">
                            <div className="modal-header">
                                <h5 className="modal-title">Atualizar Máquina</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowMachineUpdateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group mb-3">
                                    <label>Estoque</label>
                                    <input
                                        type="number"
                                        className="form-control bg-secondary text-light"
                                        value={updatedMachine.stock}
                                        onChange={(e) => setUpdatedMachine({ ...updatedMachine, stock: e.target.value })}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Status</label>
                                    <select
                                        className="form-control bg-secondary text-light"
                                        value={updatedMachine.status}
                                        onChange={(e) => setUpdatedMachine({ ...updatedMachine, status: parseInt(e.target.value) })}
                                    >
                                        <option value="">Selecione o estado da máquina</option>
                                        <option value="1">Ativa</option>
                                        <option value="2">Em manutenção</option>
                                        <option value="3">Aguardando abastecimento</option>
                                    </select>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Última Manutenção</label>
                                    <input
                                        type="date"
                                        className="form-control bg-secondary text-light"
                                        value={updatedMachine.lastMaintenance}
                                        onChange={(e) => setUpdatedMachine({ ...updatedMachine, lastMaintenance: e.target.value })}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Último Abastecimento</label>
                                    <input
                                        type="date"
                                        className="form-control bg-secondary text-light"
                                        value={updatedMachine.lastFill}
                                        onChange={(e) => setUpdatedMachine({ ...updatedMachine, lastFill: e.target.value })}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Aluguel</label>
                                    <input
                                        type="number"
                                        className="form-control bg-secondary text-light"
                                        value={updatedMachine.rent}
                                        onChange={(e) => setUpdatedMachine({ ...updatedMachine, rent: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowMachineUpdateModal(false)}>Cancelar</button>
                                <button className="btn btn-primary" onClick={handleMachineUpdate}>Atualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showInstitutionModal && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content bg-dark text-light">
                            <div className="modal-header">
                                <h5 className="modal-title">Cadastrar Instituição</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowInstitutionModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group mb-3">
                                    <label>Nome da Instituição</label>
                                    <input
                                        type="text"
                                        className="form-control bg-secondary text-light"
                                        value={newInstitution.name}
                                        onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Número de Registro</label>
                                    <input
                                        type="text"
                                        maxLength={14}
                                        className="form-control bg-secondary text-light"
                                        value={newInstitution.registry}
                                        onChange={(e) => {
                                            const onlyNumbers = e.target.value.replace(/\D/g, '');
                                            setNewInstitution({ ...newInstitution, registry: onlyNumbers });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowInstitutionModal(false)}>Cancelar</button>
                                <button className="btn btn-primary" onClick={handleInstitutionChange}>Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagementScreen;
