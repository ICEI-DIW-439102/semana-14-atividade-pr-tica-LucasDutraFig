// ============================================================
//  CineWorld — script.js (Home)
//  Consome o JSON Server via Fetch API
// ============================================================

const API_URL = 'http://localhost:3000';

// ------------------------------------------------------------
//  Helpers
// ------------------------------------------------------------
function renderEstrelas(nota) {
  const cheias = Math.floor(nota / 2);
  const meia = nota % 2 >= 0.5;
  let html = '';
  for (let i = 0; i < cheias; i++) html += '<i class="bi bi-star-fill"></i>';
  if (meia) html += '<i class="bi bi-star-half"></i>';
  const vazias = 5 - cheias - (meia ? 1 : 0);
  for (let i = 0; i < vazias; i++) html += '<i class="bi bi-star"></i>';
  return html;
}

// ------------------------------------------------------------
//  1) fetchItems — busca todos os filmes no JSON Server
// ------------------------------------------------------------
async function fetchItems() {
  const resposta = await fetch(`${API_URL}/filmes`);
  if (!resposta.ok) {
    throw new Error(`Erro ao buscar filmes: ${resposta.status}`);
  }
  const itens = await resposta.json();
  return itens;
}

// ------------------------------------------------------------
//  2) createCard — cria o elemento do card de um filme
// ------------------------------------------------------------
function createCard(item) {
  const col = document.createElement('div');
  col.className = 'col-sm-6 col-lg-4';
  col.innerHTML = `
    <div class="card-filme">
      <a href="details.html?id=${item.id}">
        <div class="card-poster">
          <img src="${item.imagem}" alt="${item.titulo}" loading="lazy">
          <div class="card-overlay">
            <span class="overlay-nota"><i class="bi bi-star-fill"></i> ${item.nota}</span>
          </div>
        </div>
      </a>
      <div class="card-info">
        <span class="card-genero">${item.categoria}</span>
        <h3><a href="details.html?id=${item.id}">${item.titulo}</a></h3>
        <p class="card-desc">${item.descricaoCurta.substring(0, 90)}...</p>
        <div class="card-footer-meta">
          <span><i class="bi bi-calendar3"></i> ${item.ano}</span>
          <span><i class="bi bi-person-video2"></i> ${item.diretor}</span>
        </div>
        <a href="details.html?id=${item.id}" class="btn-ver btn-ver-card">Ver detalhes</a>
      </div>
    </div>
  `;
  return col;
}

// ------------------------------------------------------------
//  3) renderCards — limpa a lista e adiciona os cards na tela
// ------------------------------------------------------------
function renderCards(items) {
  const container = document.getElementById('listaFilmes');
  if (!container) return;

  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <p class="mensagem-erro">Nenhum filme encontrado no momento.</p>
      </div>
    `;
    return;
  }

  items.forEach(item => {
    container.appendChild(createCard(item));
  });
}

// ------------------------------------------------------------
//  Slider de destaques (usa os itens já carregados)
// ------------------------------------------------------------
function renderSlider(items) {
  const inner = document.getElementById('sliderInner');
  const indicators = document.getElementById('sliderIndicators');
  if (!inner) return;

  const destaques = items.filter(item => item.destaque);

  inner.innerHTML = '';
  indicators.innerHTML = '';

  destaques.forEach((filme, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-bs-target', '#carouselDestaques');
    btn.setAttribute('data-bs-slide-to', i);
    btn.setAttribute('aria-label', filme.titulo);
    if (i === 0) { btn.classList.add('active'); btn.setAttribute('aria-current', 'true'); }
    indicators.appendChild(btn);

    const slide = document.createElement('div');
    slide.className = 'carousel-item' + (i === 0 ? ' active' : '');
    slide.innerHTML = `
      <div class="slide-bg" style="background-image: url('${filme.imagem}')"></div>
      <div class="carousel-caption-custom">
        <span class="badge-genero">${filme.categoria}</span>
        <h2>${filme.titulo}</h2>
        <p>${filme.descricaoCurta}</p>
        <div class="slide-meta">
          <span><i class="bi bi-calendar3"></i> ${filme.ano}</span>
          <span><i class="bi bi-clock"></i> ${filme.duracao}</span>
          <span class="estrelas">${renderEstrelas(filme.nota)} ${filme.nota}</span>
        </div>
        <a href="details.html?id=${filme.id}" class="btn-ver">Ver Detalhes</a>
      </div>
    `;
    inner.appendChild(slide);
  });
}

// ------------------------------------------------------------
//  4) init — orquestra o carregamento da Home
// ------------------------------------------------------------
async function init() {
  const container = document.getElementById('listaFilmes');
  if (container) {
    container.innerHTML = '<div class="col-12"><p class="mensagem-carregando"><i class="bi bi-arrow-repeat"></i> Carregando filmes...</p></div>';
  }

  try {
    const items = await fetchItems();
    renderSlider(items);
    renderCards(items);
  } catch (erro) {
    console.error(erro);
    if (container) {
      container.innerHTML = `
        <div class="col-12">
          <p class="mensagem-erro">
            <i class="bi bi-exclamation-triangle-fill"></i>
            Não foi possível carregar os filmes. Verifique se o JSON Server está rodando em
            <code>${API_URL}</code> e tente novamente.
          </p>
        </div>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('listaFilmes')) {
    init();
  }
});
