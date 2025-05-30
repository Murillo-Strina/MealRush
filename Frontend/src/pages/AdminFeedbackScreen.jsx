const AdminFeebackScreen = () => {
    return(
        <div style={{ minHeight: '100vh' }} className="bg-dark text-light">
            <div className="p-3">
                <button className="btn btn-secondary" onClick={() => navigate("/admin")}>Voltar</button>
            </div>

            <div className="text-center d-flex align-items-center justify-content-center p-3 font-weight-bold">
                <div className="text-center d-flex flex-column align-items-center justify-content-center p-3">
                    <img src="src/assets/images/logo_mealrush_white.png" style={{ width: "350px" }} className="mb-3" alt="Logo" />
                    <div className="border border-secondary rounded p-3 bg-secondary">
                        <h1 className="fw-bold">Feedbacks</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminFeebackScreen;