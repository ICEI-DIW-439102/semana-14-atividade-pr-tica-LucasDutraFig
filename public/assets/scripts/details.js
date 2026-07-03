// ============================================================
//  CineWorld — details.js (Página de Detalhes)
//  Lê o id via URLSearchParams e busca o item no JSON Server
// ============================================================

const API_URL = 'http://localhost:3000';

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
//  Mostra a mensagem de erro e esconde o conteúdo normal
// ------------------------------------------------------------
function mostrarErro(mensagem) {
  const conteudo = document.getElementById('detalheConteudo');
  const erroBox = document.getElementById('detalheErro');
  if (conteudo) conteudo.classList.add('d-none');
  if (erroBox) {
    erroBox.textContent = mensagem;
    erroBox.classList.remove('d-none');
  }
}

// ------------------------------------------------------------
//  Busca um item específico: GET /filmes/:id
// ------------------------------------------------------------
async function fetchItemById(id) {
  const resposta = await fetch(`${API_URL}/filmes/${id}`);
  if (resposta.status === 404) {
    return null;
  }
  if (!resposta.ok) {
    throw new Error(`Erro ao buscar o filme: ${resposta.status}`);
  }
  return resposta.json();
}

// ------------------------------------------------------------
//  Renderiza os dados do filme na tela
// ------------------------------------------------------------
function renderDetalhe(filme) {
  document.title = `${filme.titulo} — CineWorld`;

  document.getElementById('detalheHero').style.backgroundImage = `url('${filme.imagem}')`;
  document.getElementById('detalheTitulo').textContent = filme.titulo;
  document.getElementById('detalheGenero').textContent = filme.categoria;
  document.getElementById('detalheAno').textContent = filme.ano;
  document.getElementById('detalheDuracao').textContent = filme.duracao;
  document.getElementById('detalheClassificacao').textContent = filme.classificacao;
  document.getElementById('detalheNota').innerHTML = `${renderEstrelas(filme.nota)} <strong>${filme.nota}</strong>/10`;

  document.getElementById('detalheDiretor').textContent = filme.diretor;
  document.getElementById('detalheAno2').textContent = filme.ano;
  document.getElementById('detalheDuracao2').textContent = filme.duracao;
  document.getElementById('detalheClassificacao2').textContent = filme.classificacao;
  document.getElementById('detalheGenero2').textContent = filme.categoria;
  document.getElementById('detalheNota2').textContent = `${filme.nota} / 10`;
  document.getElementById('detalheSinopse').textContent = filme.descricaoCompleta;

  // Tags (chips)
  const tagsContainer = document.getElementById('detalheTags');
  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    (filme.tags || []).forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.textContent = tag;
      tagsContainer.appendChild(chip);
    });
  }

  // Elenco
  const grid = document.getElementById('elencoGrid');
  if (grid) {
    grid.innerHTML = '';
    (filme.elenco || []).forEach(ator => {
      const card = document.createElement('div');
      card.className = 'col-6 col-md-3';
      card.innerHTML = `
        <div class="ator-card">
          <div class="ator-foto">
            <img src="${ator.imagem}" alt="${ator.nome}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/200x280?text=${encodeURIComponent(ator.nome)}'">
          </div>
          <div class="ator-info">
            <h4>${ator.nome}</h4>
            <p class="ator-personagem"><i class="bi bi-mask"></i> ${ator.personagem}</p>
            <p class="ator-detalhe"><i class="bi bi-globe2"></i> ${ator.nacionalidade}</p>
            <p class="ator-detalhe"><i class="bi bi-calendar-heart"></i> Nascido em ${ator.nascimento}</p>
            <p class="ator-premio"><i class="bi bi-trophy-fill"></i> ${ator.premiacao}</p>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }
}

// ------------------------------------------------------------
//  init — lê o id na URL e busca o item correspondente
// ------------------------------------------------------------
async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    mostrarErro('Nenhum filme foi informado na URL. Volte ao catálogo e escolha um filme para ver os detalhes.');
    return;
  }

  try {
    const filme = await fetchItemById(id);
    if (!filme) {
      mostrarErro(`Não encontramos nenhum filme com o id "${id}". Ele pode ter sido removido do catálogo.`);
      return;
    }
    renderDetalhe(filme);
  } catch (erro) {
    console.error(erro);
    mostrarErro(`Não foi possível carregar os dados do filme. Verifique se o JSON Server está rodando em ${API_URL}.`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('detalheHero')) {
    init();
  }
});
