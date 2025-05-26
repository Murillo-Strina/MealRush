import { useNavigate } from "react-router-dom";

const AdminScreen = () => {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh' }} className="bg-dark text-light">
            <div className="p-3">
                <button className="btn btn-secondary" onClick={() => navigate("/")}>Voltar ao menu principal</button>
            </div>

            <div className="text-center d-flex align-items-center justify-content-center p-3 font-weight-bold">
                <div className="text-center d-flex flex-column align-items-center justify-content-center p-3">
                    <img src="src/assets/images/logo_mealrush.png" style={{ width: "200px" }} className="mb-3" />
                    <div className="border border-secondary rounded p-3 bg-secondary">
                        <h1 className="fw-bold">Bem vindo ao menu de administrador, o que deseja fazer?</h1>
                    </div>
                </div>
            </div>
            <div className="container align-items-center col-xl-10 px-4 py-5">
                <button className="btn btn-secondary" onClick={() => navigate("/management")} style={{ backgroundColor: "#00C9A7"}}>Gerenciar Instituições</button>
                <button className="btn btn-secondary">Consultar Feedbacks</button>
            </div>
        </div>
    );
}

export default AdminScreen;