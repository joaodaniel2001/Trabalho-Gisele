import React from 'react';
import './Planilha.css';
import { Link } from 'react-router-dom';

const Planilha = () => {

    const forms = [
        { label: "Formulário Masculino", to: '/dashboard/formulario-masculino' },
        { label: "Formulário Feminino", to: '/dashboard/formulario-feminino' }
    ]

    return (
        <div className="selection-container">
            <h1 className="main-title-selection">
                Selecione a Planilha de Análise
            </h1>
            <p className="subtitle-text">
                Escolha qual formulário você deseja analisar para visualizar as estatísticas e os dados detalhados.
            </p>

            <div className="form-grid">
                {forms.map((form, i) => (
                    <Link
                        key={form.i}
                        onClick={() => handleFormSelection(form.to)}
                        className="form-card"
                        to={form.to}
                    >
                        {/* Icone SVG com classes simplificadas */}
                        <svg className="card-icon"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6"></path>
                        </svg>
                        <h2 className="card-title">
                            {form.label}
                        </h2>
                        <p className="card-description">
                            Clique para visualizar o dashboard de respostas e gráficos para esta categoria.
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Planilha