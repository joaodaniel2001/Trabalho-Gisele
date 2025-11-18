import React from 'react';
import { Link } from 'react-router-dom';

// --- PÁGINA 'HomePage' ---
// Esta é agora a exportação principal
export default function Home() {
    return (
        <div className="dashboard-body">
            {/* Os estilos agora estão incluídos aqui */}
            <style>{styles}</style>

            <div className="home-container">
                <div className="home-content">
                    <h1 className="home-title">Compreendendo o Machismo Através de Dados</h1>
                    <p className="home-intro">
                        O machismo é um sistema de discriminação estrutural que se baseia na crença da superioridade do gênero masculino, resultando em estereótipos, preconceito e opressão contra mulheres e identidades de gênero dissidentes. Ele se manifesta de formas sutis e explícitas em nossa sociedade, cultura e instituições.
                    </p>
                    <h2 className="home-subtitle">Sobre Este Site</h2>
                    <p className="home-description">
                        Este site é um dashboard interativo criado para visualizar e analisar dados reais coletados em pesquisas sobre a percepção e a vivência do machismo. 
                        Nosso objetivo é usar a visualização de dados para trazer clareza a este tema complexo, comparando as perspectivas dos formulários feminino e masculino e destacando a prevalência de atitudes e experiências machistas.
                    </p>
                    {/* O botão agora é estático, pois não há para onde navegar */}
                    <Link to="/dashboard" className="home-cta-button">
                        Explorar o Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}


// --- Estilos CSS (Apenas Home) ---
const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .dashboard-body {
        font-family: 'Inter', sans-serif;
        color: #1f2937; /* text-gray-800 */
        margin: 0;
        padding: 0;
        /* O padding-top foi removido, pois não há mais navbar */
    }
    
    /* --- ESTILOS DA HOME PAGE --- */
    .home-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
    }
    .home-content {
        background-color: #ffffff; /* Fundo branco, como pedido */
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        padding: 2rem;
        max-width: 900px;
        margin: 2rem auto; /* Centraliza o card da home */
    }
    .home-title {
        font-size: 2.25rem; /* text-4xl */
        font-weight: 700;
        color: #111827;
        margin-bottom: 1.5rem;
    }
    .home-intro {
        font-size: 1.125rem; /* text-lg */
        color: #374151;
        line-height: 1.75;
        margin-bottom: 2rem;
    }
    .home-subtitle {
        font-size: 1.5rem; /* text-2xl */
        font-weight: 600;
        color: #111827;
        margin-bottom: 1rem;
        border-top: 1px solid #e5e7eb;
        padding-top: 1.5rem;
    }
    .home-description {
        font-size: 1rem;
        color: #4b5563;
        line-height: 1.6;
        margin-bottom: 2rem;
    }
    .home-cta-button {
        display: inline-block;
        font-size: 1.125rem;
        font-weight: 600;
        color: #ffffff;
        background-color: #2563eb; /* bg-blue-600 */
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .home-cta-button:hover {
        background-color: #1d4ed8; /* bg-blue-700 */
    }
`;