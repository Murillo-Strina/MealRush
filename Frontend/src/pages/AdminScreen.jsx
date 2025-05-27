import { useNavigate } from "react-router-dom";
import ButtonAdmin from "../components/ButtonAdmin";
import iconFeedback from "../assets/images/icon_feedback.png";
import iconManagement from "../assets/images/icon_management.png";
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
            <div className="container d-flex justify-content-center gap-5 mt-4">
                <ButtonAdmin router="management" text="Gerenciar Instituições" img={iconManagement} />
                <ButtonAdmin router="feedback" text="Consultar Feedbacks" img={iconFeedback} />
            </div>
        </div>
    );
}

export default AdminScreen;