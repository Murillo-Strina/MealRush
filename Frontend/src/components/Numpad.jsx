import React, { Component } from 'react';

export default class Numpad extends Component {
    render() {
        const { buttonSize = "70px", fontSize = "1.5rem" } = this.props;
        const keys = [
            "1", "2", "3",
            "4", "5", "6",
            "7", "8", "9",
            "✓", "0", "X"
        ];
        
        return (
            <div className='container bg-dark p-3'>
                <div className='container justify-content-center text-center align-items-center' style={{
                    width: "250px",
                    height: "75px",
                    background: "white"
                }}>Mensagem</div>
                <p></p>
                <div className='row row-cols-3 g-2'>
                    {keys.map((element, index) => (
                        <div className='col p-1' key={index}>
                            <button 
                                className={`btn ${element === '✓' ? 'btn-success' :
                                        element === 'X' ? 'btn-danger' :
                                        'btn-secondary'} 
                                        d-flex align-items-center justify-content-center`}
                                style={{
                                    width: buttonSize,
                                    height: buttonSize,
                                    fontSize: fontSize,
                                    margin: "0 auto",
                                    transition: 'transform 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {element}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}