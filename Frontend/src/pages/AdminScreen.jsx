import { useNavigate } from "react-router-dom";

const AdminScreen = () => {
    const machines = [
        {
            name: "Centro Universitário FEI",
            id: 1111,
            registry: 11111111111111,
            machines: 1,
        },
        {
            name: "Instituto Mauá de Tecnologia - IMT",
            id: 2222,
            registry: 22222222222222,
            machines: 1,
        },
        {
            name: "Estação Prefeito Walter Braido",
            id: 3333,
            registry: 33333333333333,
            machines: 1,
        },
        {
            name: "Universidade Municipal de São Caetano do Sul",
            id: 4444,
            registry: 44444444444444,
            machines: 1,
        },
        {
            name: "Parque Chico Mendes",
            id: 5555,
            registry: 55555555555555,
            machines: 1,
        }
    ]

    const navigate = useNavigate();

    const click = () => {
        const input = document.querySelector('input[type="number"]');
        const inputValue = input.value.trim();

        if (inputValue === '' || isNaN(inputValue)) {
            alert("Insira um ID válido");
            return false;
        }

        const route = "institution";
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
                        {machines.map((item, idx) => (
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
                    <button className="btn btn-secondary btn-lg" onClick={click}>Gerenciar Máquinas</button>
                </div>
            </div>
        </div>
    );
};

export default AdminScreen;