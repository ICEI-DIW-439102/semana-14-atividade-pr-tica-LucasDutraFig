// ============================================================
//  CineWorld — graficos.js
//  Apresentação dinâmica de dados com Chart.js
//  Busca os filmes diretamente do JSON Server via Fetch API
// ============================================================

const API_URL = 'http://localhost:3000';

// ------------------------------------------------------------
//  0) Busca os filmes no JSON Server
// ------------------------------------------------------------
async function fetchFilmes() {
  const resposta = await fetch(`${API_URL}/filmes`);
  if (!resposta.ok) {
    throw new Error(`Erro ao buscar filmes: ${resposta.status}`);
  }
  return resposta.json();
}

// ------------------------------------------------------------
//  1) Processamento: quantidade de filmes por categoria
// ------------------------------------------------------------
function calcularFilmesPorGenero(filmes) {
  const contagem = {};

  filmes.forEach((filme) => {
    contagem[filme.categoria] = (contagem[filme.categoria] || 0) + 1;
  });

  const entradas = Object.entries(contagem).sort((a, b) => b[1] - a[1]);

  return {
    labels: entradas.map((e) => e[0]),
    valores: entradas.map((e) => e[1]),
  };
}

// ------------------------------------------------------------
//  2) Processamento: nota média por ano de lançamento
// ------------------------------------------------------------
function calcularNotaMediaPorAno(filmes) {
  const soma = {};
  const total = {};

  filmes.forEach((filme) => {
    const ano = filme.ano;
    soma[ano] = (soma[ano] || 0) + filme.nota;
    total[ano] = (total[ano] || 0) + 1;
  });

  const anos = Object.keys(soma).sort((a, b) => a - b);
  const medias = anos.map((ano) => +(soma[ano] / total[ano]).toFixed(1));

  return { labels: anos, valores: medias };
}

// ------------------------------------------------------------
//  3) Paleta e configuração visual compartilhada (tema CineWorld)
// ------------------------------------------------------------
const CORES = {
  vermelho: '#e50914',
  dourado: '#c9a227',
  creme: '#f5f0e8',
  cinza: '#9090a0',
  grade: 'rgba(245, 240, 232, 0.08)',
};

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = CORES.cinza;

// ------------------------------------------------------------
//  4) Gráfico 1 — Barras: Filmes por Gênero
// ------------------------------------------------------------
function montarGraficoGeneros(filmes) {
  const canvas = document.getElementById('graficoGeneros');
  if (!canvas) return;

  const { labels, valores } = calcularFilmesPorGenero(filmes);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Quantidade de filmes',
          data: valores,
          backgroundColor: CORES.vermelho,
          hoverBackgroundColor: '#ff2430',
          borderRadius: 4,
          maxBarThickness: 56,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a24',
          titleColor: CORES.creme,
          bodyColor: CORES.creme,
          borderColor: CORES.vermelho,
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y} filme(s)`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: CORES.creme },
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0, color: CORES.cinza },
          grid: { color: CORES.grade },
        },
      },
    },
  });
}

// ------------------------------------------------------------
//  5) Gráfico 2 — Barras: Nota Média por Ano
// ------------------------------------------------------------
function montarGraficoNotas(filmes) {
  const canvas = document.getElementById('graficoNotas');
  if (!canvas) return;

  const { labels, valores } = calcularNotaMediaPorAno(filmes);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Nota média',
          data: valores,
          backgroundColor: CORES.dourado,
          hoverBackgroundColor: '#e0b840',
          borderRadius: 4,
          maxBarThickness: 56,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a24',
          titleColor: CORES.creme,
          bodyColor: CORES.creme,
          borderColor: CORES.dourado,
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => ` Nota média: ${ctx.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: CORES.creme },
        },
        y: {
          beginAtZero: true,
          suggestedMax: 10,
          ticks: { color: CORES.cinza },
          grid: { color: CORES.grade },
        },
      },
    },
  });
}

// ------------------------------------------------------------
//  6) Init
// ------------------------------------------------------------
async function initGraficos() {
  try {
    const filmes = await fetchFilmes();
    montarGraficoGeneros(filmes);
    montarGraficoNotas(filmes);
  } catch (erro) {
    console.error(erro);
    const container = document.querySelector('.secao-graficos-topo .container');
    if (container) {
      const aviso = document.createElement('p');
      aviso.className = 'mensagem-erro mt-3';
      aviso.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Não foi possível carregar os dados dos gráficos. Verifique se o JSON Server está rodando em ${API_URL}.`;
      container.appendChild(aviso);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initGraficos();
});
