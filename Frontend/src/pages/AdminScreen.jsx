import axios from "axios";
import { use, useEffect, useState } from "react";

const AdminScreen = () => {
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
    // const machines = [
    //     {
    //         id: 1,
    //         stock: 20,
    //         profit: 2500,
    //         lastMaintenance: "2025-05-24",
    //         sales: 23
    //     }
    // ];
    
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
        const input = document.querySelector('input[type="number"]');
        const inputValue = input.value.trim();

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

    return (
        <div style={{ minHeight: '100vh' }} className="bg-dark text-light">
            <div className="p-3">
                <button className="btn btn-secondary">Voltar</button>
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
                <input type="number" placeholder="Insira o ID da instituição a ser gerenciada..." className="border border-secondary rounded w-25 p-1 bg-secondary text-light" required />
                <div className="d-flex flex-row gap-3 p-3">
                    <button className="btn btn-secondary btn-lg">Cadastrar Instituição</button>
                    <button className="btn btn-secondary btn-lg">Remover Instituição</button>
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
                                {machines.map((item, idx) => (
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
        </div>
    );
};

export default AdminScreen;