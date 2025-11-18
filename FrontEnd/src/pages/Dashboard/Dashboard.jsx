import React, { useState, useEffect, useRef } from 'react';
// import './DashboardApp.css'; // O CSS está integrado abaixo

// --- Funções de Cálculo (puras) ---
function calculateMean(arr) {
    if (!arr || arr.length === 0) return 0;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
}

function calculateMedian(arr) {
    if (!arr || arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateMode(arr) {
    if (!arr || arr.length === 0) return ['N/A'];
    const frequency = {};
    arr.forEach(item => {
        frequency[item] = (frequency[item] || 0) + 1;
    });

    let maxFreq = 0;
    let modes = [];
    for (const key in frequency) {
        if (frequency[key] > maxFreq) {
            modes = [key];
            maxFreq = frequency[key];
        } else if (frequency[key] === maxFreq) {
            modes.push(key);
        }
    }
    
    if (modes.length === Object.keys(frequency).length) return ['N/A'];
    return modes.map(Number);
}

// Mapeia IDs de perguntas para seus títulos (Formulário Feminino)
// Todas são 'pie' (gráfico de pizza Sim/Nao)
const femininoQuestionMap = {
    'pergunta_01': { title: 'Você se considera uma pessoa feminista?', type: 'pie' },
    'pergunta_02': { title: 'Você já presenciou ou vivenciou algum ataque de viés misógino?', type: 'pie' },
    'pergunta_03': { title: 'Você se sente segura em andar sozinha na rua?', type: 'pie' },
    'pergunta_04': { title: 'Você acredita que a culpa do assédio é da vítima?', type: 'pie' },
    'pergunta_05': { title: 'Você acha que a Lei Maria da Penha é necessária?', type: 'pie' },
    'pergunta_06': { title: 'Você conhece alguma mulher que já sofreu algum tipo de violência (física ou psicológica)?', type: 'pie' },
    'pergunta_07': { title: 'Você acha que as mulheres devem ter os mesmos direitos que os homens?', type: 'pie' },
};

// !! IMPORTANTE !!
// Mapeia IDs de perguntas para seus títulos (Formulário Masculino)
// ATUALIZADO com base nas imagens. Verifique se as chaves (pergunta_01, etc.)
// correspondem corretamente às perguntas no seu banco de dados!
const masculinoQuestionMap = {
    // Da imagem image_b4bddf.png (assumindo ser pergunta_01)
    'pergunta_01': { title: 'Você se considera uma pessoa machista?', type: 'pie' }, // Única Sim/Nao
    
    // Da imagem image_b4bb1b.png (assumindo ser 02, 03, 04)
    'pergunta_02': { title: 'Em um relacionamento, você concorda que o cuidado com a casa e os filhos deve ser dividido igualmente?', type: 'bar' },
    'pergunta_03': { title: 'Qual sua reação mais comum ao ver um homem se recusando a realizar tarefas domésticas?', type: 'bar' },
    'pergunta_04': { title: 'Você já se sentiu pressionado por outros homens a Nao demonstrar emoções?', type: 'bar' },

    // Da imagem image_b4bb3a.png (assumindo ser 05, 06, 07)
    'pergunta_05': { title: 'Em uma briga de casal, você acredita que o homem tem o dever de "manter a calma"?', type: 'bar' },
    'pergunta_06': { title: 'Quando uma mulher relata ter sofrido machismo ou assédio, qual é a sua reação imediata?', type: 'bar' },
    'pergunta_07': { title: 'Você acredita que o machismo afeta negativamente a vida dos próprios homens?', type: 'bar' },

    // Da imagem image_b4bddf.png (assumindo ser 08, 09)
    'pergunta_08': { title: 'Quando rola aquela piada "clássica" que desvaloriza a mulher, qual é a sua reação?', type: 'bar' },
    'pergunta_09': { title: 'Você faz comentários ou atitudes consideradas machistas?', type: 'bar' },
};

// Objeto para trocar facilmente entre os mapas
const allQuestionMaps = {
    feminino: femininoQuestionMap,
    masculino: masculinoQuestionMap,
};

// Nova função para processar perguntas de múltipla escolha (Gráfico de Barras)
function processMultipleChoice(questionKey, allData) {
    const counts = {};
    allData.forEach(item => {
        const answer = item[questionKey];
        if (answer) { // Conta todas as respostas Nao nulas
            counts[answer] = (counts[answer] || 0) + 1;
        }
    });
    return counts;
}

// Função antiga, agora específica para Gráficos de Pizza (Sim/Nao)
function processPieChart(questionKey, allData) {
    const counts = { 'Sim': 0, 'Nao': 0 }; // 'Outro' removido
    allData.forEach(item => {
        const answer = item[questionKey];
        if (answer === 'Sim') counts['Sim']++;
        else if (answer === 'Nao') counts['Nao']++;
        // Respostas 'Outro' ou nulas são agora ignoradas
    });
    return counts;
}


// --- Componente Principal ---
export default function Dashboard() {
    // Novo estado para controlar qual formulário está selecionado
    const [selectedForm, setSelectedForm] = useState('feminino'); // 'feminino' ou 'masculino'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados para os dados dos gráficos e cards
    const [stats, setStats] = useState({ mean: 0, median: 0, mode: [0] });
    const [ageDistribution, setAgeDistribution] = useState({ labels: [], data: [] });
    // Renomeado para maior clareza
    const [questionChartData, setQuestionChartData] = useState([]);

    // Refs para os canvas dos gráficos de barras
    const statsCompareChartRef = useRef(null);
    const ageDistributionChartRef = useRef(null);
    
    // Ref para armazenar as instâncias dos gráficos de barras
    const chartInstancesRef = useRef({});

    // --- Efeito para Buscar Dados (Executa 1 vez e quando 'selectedForm' muda) ---
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            
            // Define o endpoint e o mapa de perguntas com base na seleção
            const endpoint = selectedForm === 'feminino' ? 'formulario-feminino' : 'formulario-masculino';
            const currentQuestionMap = allQuestionMaps[selectedForm];

            try {
                // Usa o endpoint dinâmico
                const response = await fetch(`http://localhost:3000/dashboard/${endpoint}`);
                
                if (!response.ok) {
                    throw new Error(`Falha na requisição: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                if (!data || data.length === 0) {
                    throw new Error("Nenhum dado recebido do servidor.");
                }

                // --- INÍCIO DA CORREÇÃO ---
                // Processar dados de idade (sem alteração)
                const ages = data
                    .map(item => parseInt(item.idade_aluno, 10))
                    .filter(age => !isNaN(age) && age > 0);
                // --- FIM DA CORREÇÃO ---

                if (ages.length > 0) {
                    setStats({
                        mean: calculateMean(ages),
                        median: calculateMedian(ages),
                        mode: calculateMode(ages)
                    });

                    const ageCounts = {};
                    ages.forEach(age => {
                        ageCounts[age] = (ageCounts[age] || 0) + 1;
                    });
                    const labels = Object.keys(ageCounts).sort((a,b) => a - b);
                    const ageData = labels.map(label => ageCounts[label]);
                    setAgeDistribution({ labels, data: ageData });
                } else {
                    // Limpa os dados se Nao houver idades (ao trocar de aba, por exemplo)
                    setStats({ mean: 0, median: 0, mode: [0] });
                    setAgeDistribution({ labels: [], data: [] });
                }

                // Processar dados das perguntas dinamicamente
                
                // Usa o mapa de perguntas correto (feminino ou masculino)
                const questionKeys = Object.keys(currentQuestionMap);
                
                const processedData = questionKeys.map(key => {
                    const questionInfo = currentQuestionMap[key];
                    // A variável local 'data' foi renomeada para 'processedCounts'
                    // A variável 'data' (do fetch) está sendo passada para as funções
                    let processedCounts; 
                    
                    // Escolhe o processador correto baseado no 'type'
                    if (questionInfo.type === 'pie') {
                        // Passa 'data' (do fetch)
                        processedCounts = processPieChart(key, data); 
                    } else { // 'bar'
                        // Passa 'data' (do fetch)
                        processedCounts = processMultipleChoice(key, data);
                    }

                    return {
                        key: key,
                        title: questionInfo.title || key,
                        type: questionInfo.type,
                        data: processedCounts // Usa a variável local renomeada
                    };
                });
                
                setQuestionChartData(processedData);

            } catch (error) {
                console.error("Erro no fetchData:", error);
                // Melhora a mensagem de erro de rede
                if (error.message.includes("Failed to fetch")) {
                    setError(`Falha ao conectar ao servidor. Verifique se o backend está rodando em http://localhost:3000 e se o endpoint /dashboard/${endpoint} está correto.`);
                } else {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        // Cleanup: Destruir todos os gráficos de BARRAS ao desmontar o componente
        return () => {
            Object.values(chartInstancesRef.current).forEach(chart => chart.destroy());
        };
    }, [selectedForm]); // <-- ATUALIZADO: 'useEffect' agora re-executa quando 'selectedForm' muda

    // --- Função auxiliar para criar/atualizar gráficos (Apenas Barras) ---
    const createChart = (chartId, canvasRef, config) => {
        // Destruir gráfico antigo, se existir
        if (chartInstancesRef.current[chartId]) {
            chartInstancesRef.current[chartId].destroy();
        }
        
        // Verificar se Chart.js está carregado
        if (typeof window.Chart === 'undefined') {
            console.error("Chart.js Nao foi carregado.");
            return;
        }

        // Criar novo gráfico
        const ctx = canvasRef.current.getContext('2d');
        chartInstancesRef.current[chartId] = new window.Chart(ctx, config);
    };

    // --- Efeitos para Renderizar Gráficos (Apenas Barras) ---

    // Gráfico 1: Média, Mediana, Moda
    useEffect(() => {
        if (!statsCompareChartRef.current || loading) return; // Nao renderiza se estiver carregando
        
        createChart('statsCompareChart', statsCompareChartRef, {
            type: 'bar',
            data: {
                labels: ['Média', 'Mediana', 'Moda'],
                datasets: [{
                    label: 'Valor da Idade',
                    data: [stats.mean, stats.median, stats.mode.length > 0 ? stats.mode[0] : 0],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(168, 85, 247, 0.7)'
                    ],
                    borderColor: ['#3b82f6', '#10b981', '#a855f7'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Idade' } } }
            }
        });
    }, [stats, loading]); // Depende de `stats` e `loading`

    // Gráfico 2: Distribuição de Idade
    useEffect(() => {
        if (!ageDistributionChartRef.current || loading) return; // Nao renderiza se estiver carregando

        createChart('ageDistributionChart', ageDistributionChartRef, {
            type: 'bar',
            data: {
                labels: ageDistribution.labels,
                datasets: [{
                    label: 'Nº de Respondentes',
                    data: ageDistribution.data,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: '#ef4444',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: true } },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Nº de Respondentes' } },
                    x: { title: { display: true, text: 'Idade' } }
                }
            }
        });
    }, [ageDistribution, loading]); // Depende de `ageDistribution` e `loading`

    return (
        <div className="dashboard-body">
            {/* O CSS foi re-integrado aqui para corrigir o erro de compilação */}
            <style>{styles}</style>
            
            <div className="dashboard-container">
                <h1 className="main-title">Análise de Respostas</h1>

                {/* ABAS DE SELEÇÃO */}
                <div className="form-selector">
                    <button 
                        className={`tab-button ${selectedForm === 'feminino' ? 'active' : ''}`}
                        onClick={() => setSelectedForm('feminino')}>
                        Formulário Feminino
                    </button>
                    <button 
                        className={`tab-button ${selectedForm === 'masculino' ? 'active' : ''}`}
                        onClick={() => setSelectedForm('masculino')}>
                        Formulário Masculino
                    </button>
                </div>

                {loading && (
                    <div className="message-box">
                        <p>Carregando dados do servidor...</p>
                    </div>
                )}

                {error && (
                    <div className="message-box error-box">
                        <p className="error-title">Erro ao buscar dados</p>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="dashboard-content">
                        {/* Cards de Estatísticas da Idade */}
                        <div>
                            <h2 className="section-title">Estatísticas de Idade (`idade_aluno`)</h2>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3 className="stat-card-title">Média</h3>
                                    <p className="stat-card-value text-blue">{stats.mean.toFixed(1)}</p>
                                </div>
                                <div className="stat-card">
                                    <h3 className="stat-card-title">Mediana</h3>
                                    <p className="stat-card-value text-green">{stats.median.toFixed(0)}</p>
                                </div>
                                <div className="stat-card">
                                    <h3 className="stat-card-title">Moda</h3>
                                    <p className="stat-card-value text-purple">{stats.mode.join(', ')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Seção de Gráficos 1 (Barras) */}
                        <div className="charts-grid">
                            <div className="chart-container">
                                <h3 className="chart-title">Média, Mediana e Moda (Idade)</h3>
                                <canvas ref={statsCompareChartRef}></canvas>
                            </div>
                            <div className="chart-container">
                                <h3 className="chart-title">Distribuição de Idade dos Respondentes</h3>
                                <canvas ref={ageDistributionChartRef}></canvas>
                            </div>
                        </div>

                        {/* Seção de Gráficos 2 (Pizzas E BARRAS - Dinâmico) */}
                        <div className="charts-grid">
                            {questionChartData.map(qData => (
                                qData.type === 'pie' ? (
                                    <PieChart
                                        key={qData.key}
                                        chartId={qData.key} 
                                        title={qData.title}
                                        data={qData.data}
                                    />
                                ) : (
                                    <BarChart
                                        key={qData.key}
                                        chartId={qData.key} 
                                        title={qData.title}
                                        data={qData.data}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Opções reutilizáveis para gráficos de pizza ---
const pieChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: { position: 'top' },
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.label || '';
                    if (label) { label += ': '; }
                    if (context.parsed !== null) {
                        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                        label += `${context.parsed} (${percentage}%)`;
                    }
                    return label;
                }
            }
        }
    }
});

// --- Componente auxiliar para Gráficos de Pizza ---
function PieChart({ chartId, title, data }) {
    const canvasRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        if (typeof window.Chart === 'undefined') {
            console.error("Chart.js Nao foi carregado.");
            return;
        }

        // Destrói gráfico anterior
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Cria novo gráfico
        const ctx = canvasRef.current.getContext('2d');
        chartInstanceRef.current = new window.Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Sim', 'Nao'], // 'Outro' removido
                datasets: [{
                    label: 'Respostas',
                    data: [data.Sim, data.Nao], // 'Outro' removido
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(239, 68, 68, 0.7)',
                    ],
                    borderColor: ['#10b981', '#ef4444'],
                    borderWidth: 1
                }]
            },
            options: pieChartOptions()
        });

        // Cleanup ao desmontar o componente
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data, title, chartId]); // Recria o gráfico se os dados ou título mudarem

    return (
        <div className="chart-container">
            <h3 className="chart-title">{title}</h3>
            <div className="pie-chart-wrapper">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
}

// --- NOVO COMPONENTE DE GRÁFICO DE BARRAS ---

// Opções reutilizáveis para gráficos de barras horizontais
const barChartOptions = () => ({
    indexAxis: 'y', // <-- Torna o gráfico horizontal
    responsive: true,
    maintainAspectRatio: false, // Permite que o gráfico cresça em altura
    plugins: {
        legend: { display: false }, // Oculta a legenda
        tooltip: {
            callbacks: {
                label: function(context) {
                    return ` ${context.formattedValue} Respostas`;
                }
            }
        }
    },
    scales: {
        x: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Nº de Respostas'
            },
            ticks: {
                // Garante que o eixo X só mostre inteiros
                stepSize: 1, 
                callback: function(value) {
                    if (value % 1 === 0) {
                        return value;
                    }
                }
            }
        },
        y: {
            grid: {
                display: false // Oculta linhas de grade no eixo Y
            }
        }
    }
});

// Componente auxiliar para Gráficos de Barras Horizontais
function BarChart({ chartId, title, data }) {
    const canvasRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // Extrai labels (respostas) e valores (contagens)
    const labels = Object.keys(data);
    const values = Object.values(data);
    
    // Calcula uma altura dinâmica para o canvas baseado no número de respostas
    const chartHeight = labels.length * 40 + 80; // 40px por barra + 80px de margem

    useEffect(() => {
        if (!canvasRef.current) return;
        if (typeof window.Chart === 'undefined') {
            console.error("Chart.js Nao foi carregado.");
            return;
        }

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        chartInstanceRef.current = new window.Chart(ctx, {
            type: 'bar', // Tipo barra
            data: {
                labels: labels, // Respostas (ex: "Eu ignoro...")
                datasets: [{
                    label: 'Nº de Respostas',
                    data: values, // Contagens
                    backgroundColor: 'rgba(59, 130, 246, 0.7)', // Azul
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }]
            },
            options: barChartOptions()
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data, title, chartId]);

    return (
        <div className="chart-container">
            <h3 className="chart-title">{title}</h3>
            {/* Wrapper com altura dinâmica para o gráfico de barras */}
            <div className="bar-chart-wrapper" style={{ height: `${chartHeight}px`, position: 'relative' }}>
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
}


// --- Estilos CSS (Re-integrados) ---
// O CSS foi movido de volta para cá para corrigir o erro de importação.
const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .dashboard-body {
        font-family: 'Inter', sans-serif;
        color: #1f2937; /* text-gray-800 */
        margin: 0;
        padding: 0;
    }
    .dashboard-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 1rem; /* p-4 */
    }
    @media (min-width: 768px) {
        .dashboard-container {
            padding: 2rem; /* md:p-8 */
        }
    }
    .main-title {
        font-size: 1.875rem; /* text-3xl */
        font-weight: 700;
        margin-bottom: 1.5rem; /* mb-6 */
        color: #111827; /* text-gray-900 */
    }
    .message-box {
        text-align: center;
        padding: 2rem;
        border-radius: 0.5rem; /* rounded-lg */
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
    }
    .message-box p {
        font-size: 1.125rem; /* text-lg */
        font-weight: 500;
    }
    .error-box {
        background-color: #fee2e2; /* bg-red-100 */
        color: #b91c1c; /* text-red-700 */
    }
    .error-box p.error-title {
        font-weight: 700;
    }
    .dashboard-content {
        display: flex;
        flex-direction: column;
        gap: 2rem; /* space-y-8 */
    }
    .section-title {
        font-size: 1.5rem; /* text-2xl */
        font-weight: 600;
        margin-bottom: 1rem; /* mb-4 */
    }
    .stats-grid {
        display: grid;
        gap: 1.5rem; /* gap-6 */
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    @media (min-width: 768px) { /* md: */
        .stats-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }
    .stat-card {
        background-color: #ffffff;
        padding: 1.5rem; /* p-6 */
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .stat-card-title {
        font-size: 0.875rem; /* text-sm */
        font-weight: 500;
        color: #6b7280; /* text-gray-500 */
        text-transform: uppercase;
        letter-spacing: 0.05em; /* tracking-wider */
    }
    .stat-card-value {
        font-size: 2.25rem; /* text-4xl */
        font-weight: 700;
        margin-top: 0.5rem; /* mt-2 */
    }
    .text-blue { color: #2563eb; } /* text-blue-600 */
    .text-green { color: #059669; } /* text-green-600 */
    .text-purple { color: #9333ea; } /* text-purple-600 */

    .charts-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    @media (min-width: 1024px) { /* lg: */
        .charts-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
    .chart-container {
        background-color: #ffffff;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .chart-title {
        font-size: 1.25rem; /* text-xl */
        font-weight: 600;
        margin-bottom: 1rem;
    }
    .pie-chart-wrapper {
        max-width: 384px; /* max-w-sm */
        margin-left: auto;
        margin-right: auto;
    }

    /* Estilo para o wrapper do gráfico de barras */
    .bar-chart-wrapper {
        width: 100%;
        position: relative; /* Necessário para Chart.js responsive/maintainAspectRatio:false */
    }
    
    /* Estilos para as Abas/Tabs */
    .form-selector {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #e5e7eb; /* Bordar inferior */
    }
    .tab-button {
        padding: 0.75rem 1.25rem;
        font-size: 1rem;
        font-weight: 600;
        color: #6b7280; /* Cor do texto inativo */
        background-color: transparent;
        border: none;
        border-bottom: 3px solid transparent; /* Borda inferior transparente */
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
        margin-bottom: -2px; /* Alinha com a borda do container */
    }
    .tab-button:hover {
        color: #1f2937; /* Cor do texto ao passar o mouse */
    }
    .tab-button.active {
        color: #2563eb; /* Cor do texto ativo (azul) */
        border-bottom-color: #2563eb; /* Cor da borda ativa (azul) */
    }
`;