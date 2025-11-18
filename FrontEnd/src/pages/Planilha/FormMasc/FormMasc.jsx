import React, { useEffect, useState } from 'react';
// IMPORTANTE: Em um projeto real, você importaria o CSS assim:
import './FormMasc.css';

// Função auxiliar para agrupar dados para o gráfico
const getChartData = (data, categoryKey) => {
  if (!data || data.length === 0 || !categoryKey) return { labels: [], counts: [] };
  const counts = data.reduce((acc, item) => {
    const key = String(item[categoryKey] || 'N/A');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const labels = Object.keys(counts).sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    return isNaN(numA) || isNaN(numB) ? a.localeCompare(b) : numA - numB;
  });
  const chartCounts = labels.map(label => counts[label]);
  const total = chartCounts.reduce((sum, count) => sum + count, 0);
  return { labels, counts: chartCounts, total };
};

// Componente simulado de Gráfico de Barras
const MockBarChart = ({ labels, counts, total, title, categoryName }) => {
  if (labels.length < 2) {
    return <div className="data-message">Dados insuficientes para o gráfico ({categoryName}).</div>;
  }
  const maxCount = Math.max(...counts);
  return (
    <div className="card-chart">
      <h3 className="chart-title">
        {title} <span className="chart-subtitle">({categoryName.replace(/_/g, ' ').toUpperCase()})</span>
      </h3>
      <div className="chart-bar-list">
        {labels.map((label, index) => {
          const count = counts[index];
          const percentage = (count / maxCount) * 100;
          const displayPercentage = ((count / total) * 100).toFixed(1);
          return (
            <div key={label} className="bar-chart-item">
              <div className="bar-label-data">
                <span className="bar-label" title={label}>{label}</span>
                <span>{count} registos ({displayPercentage}%)</span>
              </div>
              <div className="bar-background">
                <div
                  className="bar-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const FormMasc = () => {
  const [planilha, setPlanilha] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const allColumns = planilha && planilha.length > 0 ? Object.keys(planilha[0]) : [];

  const columns = allColumns.slice(1);

  const categoryKeyForChart = columns.length > 0 ? columns[0] : null;

  const chartData = getChartData(planilha, categoryKeyForChart);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/dashboard/formulario-masculino');

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          const errorMessage = errorBody.error || errorBody.details || `Erro do servidor: Status ${response.status}`;
          setError(errorMessage);
          return;
        }

        const results = await response.json();

        if (Array.isArray(results)) {
          setPlanilha(results);
        } else {
          setError("Resposta da API inválida: esperava-se uma lista de dados (array).");
        }

      } catch (e) {
        setError(`Erro de conexão ao servidor: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-message">A Carregar os dados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-alert">
        <h2 className="error-title">Erro ao carregar dados:</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!planilha || planilha.length === 0) {
    return (
      <div className="warning-alert">
        Nenhum dado encontrado para o formulário masculino.
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="main-title">
        Formulário Masculino
      </h1>

      <div className="dashboard-grid">

        <div className="card-summary">
          <p className="summary-count">{planilha.length}</p>
          <p className="summary-label">Total de Registos</p>
        </div>
      </div>

      <h2 className="section-subtitle">Dados Detalhados</h2>

      <div className="table-wrapper">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="table-header-cell"
                >
                  {col.replace(/_/g, ' ').toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body">
            {planilha.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="table-data-row"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="table-data-cell"
                  >
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormMasc;