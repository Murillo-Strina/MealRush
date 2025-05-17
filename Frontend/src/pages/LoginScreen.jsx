import React from 'react'

const LoginScreen = () => {
    return (
        <>
            <div className='d-flex justify-content-center align-items-center flex-column text-center p-4 mt-5'>
                <img src="src/assets/images/logo_mealrush_transparent.png" alt="" style={{maxWidth:"350px"}}/>
                {/* <h1 className='mb-5' style={{fontFamily: "'Century Gothic', sans-serif", fontSize: 50}}>MealRush</h1> */}
                <input className='mb-3 border border-secondary rounded rounded-pill p-2' type="text" placeholder='Insira seu e-mail...' style={{width:"250px", fontFamily: "'Century Gothic', sans-serif", fontSize: 15 }}/>
                <input className='mb-3 border border-secondary rounded rounded-pill p-2' type="password" placeholder='Insira sua senha...' style={{width:"250px", fontFamily: "'Century Gothic', sans-serif", fontSize: 15 }}/>
                <button type='button' className='btn btn-success border-dark rounded rounded-pill border-rounded mb-1 hover-grow' style={{width: "250px", fontFamily: "'Century Gothic', sans-serif", fontSize: 20 }}>Entrar</button>
                <button type='button' className='btn btn-link' style={{width: "250px",}}>Esqueci minha senha</button>
            </div>
        </>
    )
}

export default LoginScreen