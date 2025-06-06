import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminFeedbackScreen = () => {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTermInstitution, setSearchTermInstitution] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const colors = {
    darkPrimary:    '#1A202C',
    accent:         '#00C9A7',
    mediumNeutral:  '#E2E8F0',
    textDark:       '#2D3748',
    textLight:      '#E2E8F0',
    tableHeaderBg:  '#2D3748',
    rowDarkAlt:     '#202733',
    danger:         '#E53E3E',
    dangerText:     '#F87171',
    alertDangerBg:  '#4B1717',
    borderColor:    '#4A5568',
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      let institutionMap = {};
      try {
        const instResp = await axios.get('http://localhost:3005/institutions');
        instResp.data.forEach(inst => {
          institutionMap[inst.id] = inst.name;
        });
      } catch {
        console.warn(
          'Não foi possível buscar /institutions. A coluna “Instituição” ficará vazia ou mostrará “Desconhecido”.'
        );
      }

      try {
        const respFb = await axios.get('http://localhost:3015/feedbacks');
        const feedbacksFromApi = respFb.data;

        const formatted = feedbacksFromApi.map(fb => {
          const dateOnly = fb.occurrency_date.slice(0, 10);

          return {
            id: fb.id,
            feedbackText: fb.comment,
            consumptionDate: dateOnly,
            institutionName: institutionMap[fb.institutionId] || 'Desconhecido'
          };
        });

        setFeedbacks(formatted);
      } catch (errFb) {
        console.error('Erro ao buscar feedbacks:', errFb);
        if (errFb.response) {
          setError(`Erro ${errFb.response.status}: Não foi possível carregar os feedbacks.`);
        } else if (errFb.request) {
          setError('Nenhuma resposta do servidor. Verifique sua conexão e o endpoint da API.');
        } else {
          setError('Erro ao configurar a requisição para buscar feedbacks.');
        }
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    let curr = [...feedbacks];

    if (searchTermInstitution) {
      curr = curr.filter(fb =>
        fb.institutionName.toLowerCase().includes(searchTermInstitution.toLowerCase())
      );
    }

    if (selectedDate) {
      const selectedYearMonth = selectedDate.slice(0, 7);
      curr = curr.filter(fb => fb.consumptionDate.slice(0, 7) === selectedYearMonth);
    }

    setFilteredFeedbacks(curr);
  }, [feedbacks, searchTermInstitution, selectedDate]);

  const handleClearFilters = () => {
    setSearchTermInstitution('');
    setSelectedDate('');
  };

  const filterInputBaseStyle = {
    backgroundColor: colors.inputBg,
    borderColor:     colors.borderColor,
    outline:         'none',
    boxShadow:       'none'
  };

  const formLabelStyle = {
    color:       colors.textLight,
    fontSize:    '0.9rem',
    marginBottom:'0.3rem'
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          minHeight:       '100vh',
          backgroundColor: colors.darkPrimary,
          color:           colors.textLight
        }}
      >
        <div
          className="spinner-border mb-3"
          style={{ width: '3rem', height: '3rem', color: colors.accent }}
          role="status"
        >
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="fs-5">Carregando feedbacks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center text-center p-4"
        style={{
          minHeight:       '100vh',
          backgroundColor: colors.darkPrimary,
          color:           colors.textLight
        }}
      >
        <div
          className="alert d-flex align-items-center shadow"
          role="alert"
          style={{
            backgroundColor: colors.alertDangerBg,
            borderColor:     colors.danger,
            color:           colors.dangerText,
            maxWidth:        '600px',
            borderRadius:    '0.75rem'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-exclamation-triangle-fill flex-shrink-0 me-3"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <div>
            <strong className="d-block fs-5">Falha ao Carregar Dados</strong>
            {error}
          </div>
        </div>
        <button
          className="btn rounded-pill mt-4 px-4 py-2 fw-bold"
          style={{ backgroundColor: colors.accent, color: colors.darkPrimary }}
          onClick={() => navigate('/admin')}
        >
          Voltar para Admin
        </button>
      </div>
    );
  }

  const tableHeaders = ['Feedback', 'Instituição', 'Data de Ocorrência'];

  return (
    <div
      style={{
        minHeight:       '100vh',
        backgroundColor: colors.darkPrimary,
        color:           colors.textLight
      }}
      className="py-4 px-md-3"
    >
      <div className="text-center d-flex align-items-center justify-content-center pt-3">
        <div className="text-center d-flex flex-column align-items-center justify-content-center">
          <img
            src="/src/assets/images/logo_mealrush_white.png"
            style={{ width: '300px' }}
            className="mb-3"
            alt="Logo MealRush"
          />
          <div
            className="border rounded p-3 shadow-sm"
            style={{ backgroundColor: colors.tableHeaderBg, borderColor: colors.accent }}
          >
            <h1 className="fw-bolder m-0 fs-3" style={{ color: colors.accent }}>
              Painel de Feedbacks
            </h1>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-start align-items-center mb-4 px-2">
          <button
            className="btn rounded-pill d-flex align-items-center px-3 py-2"
            style={{
              backgroundColor: colors.mediumNeutral,
              color:           colors.textDark,
              fontWeight:      500
            }}
            onClick={() => navigate('/admin')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="bi bi-arrow-left-circle-fill me-2"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
            </svg>
            Voltar
          </button>
        </div>

        <div
          className="row mb-4 mx-1 p-3 rounded shadow-sm align-items-end"
          style={{ backgroundColor: colors.rowDarkAlt }}
        >
          <div className="col-md-5 mb-3 mb-md-0">
            <label htmlFor="institutionSearch" className="form-label" style={formLabelStyle}>
              Pesquisar por Instituição
            </label>
            <input
              type="text"
              id="institutionSearch"
              className="form-control"
              style={filterInputBaseStyle}
              placeholder="Digite o nome da instituição..."
              value={searchTermInstitution}
              onChange={e => setSearchTermInstitution(e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-3 mb-md-0">
            <label htmlFor="dateSearch" className="form-label" style={formLabelStyle}>
              Pesquisar por Mês/Ano de Ocorrência
            </label>
            <input
              type="month"
              id="dateSearch"
              className="form-control"
              style={filterInputBaseStyle}
              value={selectedDate.slice(0, 7)}
              onChange={e => setSelectedDate(e.target.value + '-01')}
            />
          </div>

          <div className="col-md-3">
            <button
              className="btn w-100 d-flex align-items-center justify-content-center"
              onClick={handleClearFilters}
              style={{
                backgroundColor: colors.accent,
                color:           colors.textLight,
                fontWeight:      500,
                padding:         '0.55rem 0'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-x-lg me-2"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
              </svg>
              Limpar Filtros
            </button>
          </div>
        </div>

        <div className="table-responsive shadow-lg rounded-3 overflow-hidden mx-2">
          <table
            className="table table-hover mb-0 align-middle"
            style={{ borderColor: colors.tableHeaderBg, color: colors.textLight }}
          >
            <thead
              style={{
                backgroundColor: colors.tableHeaderBg,
                position:        'sticky',
                top:             0,
                zIndex:          1
              }}
            >
              <tr>
                {tableHeaders.map(header => (
                  <th
                    key={header}
                    scope="col"
                    className="py-3 px-3 text-uppercase text-nowrap"
                    style={{
                      color:           colors.accent,
                      letterSpacing:   '0.05em',
                      borderBottom:    `3px solid ${colors.accent}`,
                      fontSize:        '0.8rem'
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((fb, idx) => (
                  <tr
                    key={fb.id || idx}
                    style={{
                      backgroundColor:
                        idx % 2 === 0 ? colors.darkPrimary : colors.rowDarkAlt,
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={e =>
                      (e.currentTarget.style.backgroundColor = `${colors.accent}33`)
                    }
                    onMouseOut={e =>
                      (e.currentTarget.style.backgroundColor =
                        idx % 2 === 0 ? colors.darkPrimary : colors.rowDarkAlt)
                    }
                  >
                    <td
                      className="py-3 px-3"
                      style={{
                        minWidth:      '300px',
                        maxWidth:      '500px',
                        whiteSpace:    'normal',
                        overflowWrap:  'break-word',
                        wordWrap:      'break-word'
                      }}
                    >
                      {fb.feedbackText}
                    </td>
                    <td className="py-3 px-3">{fb.institutionName}</td>
                    <td className="py-3 px-3 text-nowrap">
                      {fb.consumptionDate
                        ? new Date(fb.consumptionDate).toLocaleDateString('pt-BR', {
                            day:   '2-digit',
                            month: '2-digit',
                            year:  'numeric'
                          })
                        : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableHeaders.length}
                    className="text-center py-5"
                    style={{ backgroundColor: colors.rowDarkAlt }}
                  >
                    <p className="fs-5 mb-0" style={{ color: colors.textLight }}>
                      {searchTermInstitution || selectedDate
                        ? 'Nenhum feedback encontrado para os filtros aplicados.'
                        : 'Nenhum feedback encontrado.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackScreen;
