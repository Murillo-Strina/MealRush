import React from 'react'

const AdminScreen = () => {
    return (
        <>
            <div className='d-flex justify-content-center align-items-center flex-column text-center p-4 mt-5'>
                <img src="src/assets/images/logo_mealrush_transparent.png" alt="" style={{ maxWidth: "350px" }} />
                <h1 className='mb-5' style={{ fontFamily: "'Century Gothic', sans-serif", fontSize: 50 }}>Área do Administrador</h1>
                <div className='d-flex flex-row'>
                    {/* <div className='d-flex justify-content-center align-items-center flex-column text-center mx-3'>
                        <input className='mb-3 border border-secondary rounded rounded-pill p-2' type="text" placeholder='Insira a região...' style={{ width: "250px", fontFamily: "'Century Gothic', sans-serif", fontSize: 15 }} />
                        <button type='button' className='btn btn-success border-dark border-rounded mb-1 hover-grow mb-3' style={{ width: "250px", fontFamily: "'Century Gothic', sans-serif", fontSize: 20 }}>Consultar regiões</button>
                    </div> */}
                    <button type='button' className='btn btn-success border-dark border-rounded mb-1 hover-grow mb-3 mx-3' style={{ width: "250px", fontFamily: "'Century Gothic', sans-serif", fontSize: 20 }}>Consultar regiões</button>
                    <button type='button' className='btn btn-success border-dark border-rounded mb-1 hover-grow mb-3 mx-3' style={{ width: "250px", fontFamily: "'Century Gothic', sans-serif", fontSize: 20 }}>Visualizar comidas</button>
                    <button type='button' className='btn btn-success border-dark border-rounded mb-1 hover-grow mb-3 mx-3' style={{ width: "250px", fontFamily: "'Century Gothic', sans-serif", fontSize: 20 }}>Visualizar feedbacks</button>
                    <button type='button' className='btn btn-success border-dark border-rounded mb-1 hover-grow mb-3 mx-3' style={{ width: "250px", fontFamily: "'Century Gothic', sans-serif", fontSize: 20 }}>Inserir/remover comida</button>
                </div>

            </div>
        </>
    )
}

export default AdminScreen