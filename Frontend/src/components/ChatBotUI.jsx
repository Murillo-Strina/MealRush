import React from 'react';

const ChatBotUI = ({
  messages,
  userInput,
  handleSubmit,
  setUserInput,
  messagesEndRef,
  institutions, // nova prop
  step          // nova prop
}) => {
  return (
    <div className='d-flex justify-content-center align-items-center'
      style={{
        minHeight: '100vh',
        backgroundColor: '#1A1A1A'
      }}>
      <div style={{
        width: '500px',
        height: '600px',
        backgroundColor: '#2D2D2D',
        borderRadius: '15px',
        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
      }}>
        {/* Cabeçalho */}
        <div className='p-3 border-bottom text-center'
          style={{ borderColor: '#424242' }}>
          <h5 style={{
            fontFamily: "'Century Gothic', sans-serif",
            fontWeight: 'bold',
            marginBottom: '0.25rem',
            fontSize: '30px',
            color: '#00C853'
          }}>
            MealRush ChatBot
          </h5>
          <small style={{
            fontFamily: "'Century Gothic', sans-serif",
            color: '#9E9E9E',
            fontSize: '15px'
          }}>
            Conte com a gente para otimizar sua experiência!
          </small>
        </div>

        {/* Área de Mensagens */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          backgroundColor: '#8c8c8c'
        }}>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.isBot ? '' : 'd-flex justify-content-end'}`}>
              <div style={{
                backgroundColor: msg.isBot ? '#37474F' : '#2E7D32',
                borderRadius: '15px',
                padding: '0.5rem 1rem',
                maxWidth: '80%',
                color: '#E0E0E0',
              }}>
                <p style={{
                  marginBottom: '0',
                  fontFamily: "'Century Gothic', sans-serif",
                  fontSize: '15px'
                }}>
                  {msg.text}
                </p>
                <small style={{
                  fontSize: '12px',
                  color: msg.isBot ? '#757575' : '#BDBDBD'
                }}>
                  {msg.time}
                </small>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Área de Input */}
        <div className='p-3 border-top'
          style={{ borderColor: '#424242' }}>
          <form className='d-flex gap-2' onSubmit={handleSubmit}>
            {step === 1 ? (
              <select
                className='form-control'
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{
                  boxShadow: "none",
                  backgroundColor: '#E0E0E0',
                  color: 'black',
                  borderColor: '#424242',
                  borderRadius: '20px',
                  fontFamily: "'Century Gothic', sans-serif",
                  fontSize: '15px',
                  padding: '0.5rem 1rem'
                }}
                required
              >
                <option value="" disabled>Selecione a instituição...</option>
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.name}>
                    {inst.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type='text'
                className='form-control'
                placeholder='Escreva sua mensagem...'
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{
                  boxShadow:"none",
                  backgroundColor: '#E0E0E0',
                  color: 'black',
                  borderColor: '#424242',
                  borderRadius: '20px',
                  fontFamily: "'Century Gothic', sans-serif",
                  fontSize: '15px',
                  padding: '0.5rem 1rem'
                }}
                disabled={step === -1}
              />
            )}
            <button
              type="submit"
              className='btn d-flex align-items-center'
              style={{
                backgroundColor: '#008000',
                color: '#E0E0E0',
                borderRadius: '20px',
                fontFamily: "'Century Gothic', sans-serif",
                padding: '0.5rem 1.5rem',
                border: 'none',
                transition: '0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#006400'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#008000'}
              disabled={step === -1 || (step === 1 && !userInput)}
            >
              ENVIAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBotUI;
