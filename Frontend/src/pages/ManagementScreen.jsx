import { useNavigate } from "react-router-dom";
import axios from "axios";
import { use, useEffect, useState } from "react";

const ManagementScreen = () => {
    const navigate = useNavigate();
    const [institution, setInstitutions] = useState([]);
    const [machines, setMachines] = useState([]);
    
        useEffect(() => {
            const fetchInstitutions = async () => {
                try {
                   const response = await axios.get('http://localhost:3005/institutions');
                   const institutesFromApi = response.data;
                   const formattedInstitutions = institutesFromApi.map((institution) => ({
                        id: institution.id,
                        name: institution.name,
                        registry: institution.registration_number,
                        machines:  0
                   }))
                   setInstitutions(formattedInstitutions);
                } catch (err) {
                    console.error("Erro ao buscar instituições:", err);
                }
            }
            fetchInstitutions();
        }, []);
    
    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await axios.get('http://localhost:3010/machines');
                const machinesFromApi = response.data;
                const formattedMachines = machinesFromApi.map((machine) => ({
                    id: machine.id,
                    institutionId: machine.institutionId,
                    stock: machine.qtd_itens,
                    status: machine.statusId,
                    lastMaintenance: machine.dt_ultima_manutencao,
                    lastFill: machine.dt_ultimo_abastecimento,
                    rent: machine.aluguel
                }));
                setMachines(formattedMachines);
            } catch (err) {
                console.error("Erro ao buscar máquinas:", err);
            }
        }
        fetchMachines();
    }, []);

    useEffect(() => {
        if(institution.length > 0 && machines.length > 0) {
            const updatedInstitutions = institution.map( inst => {
                const machineCount = machines.filter(machine => machine.institutionId === inst.id).length;
                return { ...inst, machines: machineCount };
            });
            setInstitutions(updatedInstitutions);
        }
    }, [institution, machines]);

    const [showMachines, setShowMachines] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState(null);

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
    }

    const [showInstitutionModal, setShowInstitutionModal] = useState(false);
    const [newInstitution, setNewInstitution] = useState({
        name: '',
        registry: ''
    })
    
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
            setInstitutions([...institution, response.data]);
            setShowInstitutionModal(false);
            setNewInstitution({ name: '', registry: '' });
        } catch (err) {
            console.error("Erro ao cadastrar instituição:", err);
            alert("Erro ao cadastrar instituição");
        }
    }

    const [institutionIdInput, setInstitutionIdInput] = useState('');
    
    const handleRemoveInstitution = async (id) => {
        if (window.confirm("Tem certeza que deseja remover esta instituição?")) {
            try {
                await axios.delete(`http://localhost:3005/institutions/${id}`);
                setInstitutions(institution.filter(inst => inst.id !== id));
                setMachines(machines.filter(machine => machine.institutionId !== id));
            } catch (err) {
                console.error("Erro ao remover instituição:", err);
                alert("Erro ao remover instituição");
            }
        }
    }

    return  (
        <div style={{ minHeight: '100vh' }} className="bg-dark text-light">
            <div className="p-3">
                <button className="btn btn-secondary" onClick={() => navigate("/admin")}>Voltar</button>
            </div>

            <div className="text-center d-flex align-items-center justify-content-center p-3 font-weight-bold">
                <div className="text-center d-flex flex-column align-items-center justify-content-center p-3">
                    <img src="src/assets/images/logo_mealrush.png" style={{ width: "200px" }} className="mb-3"/>
                    <div className="border border-secondary rounded p-3 bg-secondary">
                        <h1 className="fw-bold">Lista de Instituições</h1>
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
                        {institution.map((item, idx) => (
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
                <input type="number" placeholder="Insira o ID da instituição a ser gerenciada..." className="border border-secondary rounded w-25 p-1 bg-secondary text-light" value={institutionIdInput} onChange={e => setInstitutionIdInput(e.target.value)} required />
                <div className="d-flex flex-row gap-3 p-3">
                    <button className="btn btn-secondary btn-lg" onClick={() => setShowInstitutionModal(true)}>Cadastrar Instituição</button>
                    <button className="btn btn-secondary btn-lg" onClick={() => {
                        const id = parseInt(institutionIdInput);
                        if(!id || isNaN(id)){ alert("Insira um ID válido"); return; }
                        handleRemoveInstitution(id);
                    }}>Remover Instituição</button>
                    <button className="btn btn-secondary btn-lg" onClick={goToMachine}>Gerenciar Máquinas</button>
                </div>
            </div>

            {showMachines && (
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
                        <input type="number" placeholder="Insira o ID da máquina a ser gerenciada..." className="border border-secondary rounded w-25 p-1 bg-secondary text-light" required />
                        <div className="d-flex flex-row gap-3 p-3">
                            <button className="btn btn-secondary btn-lg">Adicionar Máquina</button>
                            <button className="btn btn-secondary btn-lg">Remover Máquina</button>
                            <button className="btn btn-secondary btn-lg">Gerenciar Máquina</button>
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
                                    className="form-control bg-secondary text-light"
                                    value={newInstitution.registry}
                                    onChange={(e) => setNewInstitution({ ...newInstitution, registry: e.target.value })}
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