/*
 * script.js
 * ---------------------------------------------------------------------
 * Todo o comportamento aqui é "progressive enhancement": o site já
 * funciona sem nenhuma linha deste arquivo (menu sempre visível, FAQ
 * abre com <details> nativo, etc). O JS só adiciona uma camada extra
 * de polimento. Organizado em pequenas funções independentes para
 * ficar fácil de manter/testar cada pedaço separadamente.
 * ---------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
    atualizarAnoRodape();
    configurarToggleMenu();
    configurarAcordeaoFaq();
    configurarLinkAtivo();
});

/**
 * Mantém o ano do rodapé sempre atualizado, sem precisar editar o HTML
 * todo ano.
 */
function atualizarAnoRodape() {
    const elementoAno = document.getElementById('anoAtual');
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }
}

/**
 * Liga/desliga o botão hambúrguer (usado caso o menu passe a ficar
 * escondido em telas pequenas no futuro). Hoje o CSS mantém o nav
 * sempre visível, então esse botão fica escondido — mas o código já
 * está pronto, evitando retrabalho.
 */
function configurarToggleMenu() {
    const botao = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!botao || !menu) return;

    botao.addEventListener('click', () => {
        const aberto = botao.getAttribute('aria-expanded') === 'true';
        botao.setAttribute('aria-expanded', String(!aberto));
        menu.classList.toggle('nav--aberto');
    });
}

/**
 * Faz com que, ao abrir uma pergunta do FAQ, as outras se fechem
 * automaticamente — mesmo comportamento de um acordeão comum.
 * (O atributo "name" nos <details> já faz isso nativamente nos
 * navegadores mais recentes; este código é um reforço para os que
 * ainda não suportam.)
 */
function configurarAcordeaoFaq() {
    const itens = document.querySelectorAll('.faq__item');

    itens.forEach((itemAtual) => {
        itemAtual.addEventListener('toggle', () => {
            if (!itemAtual.open) return;

            itens.forEach((outroItem) => {
                if (outroItem !== itemAtual) {
                    outroItem.open = false;
                }
            });
        });
    });
}

/**
 * Observa qual seção está visível na tela e marca o link
 * correspondente no menu com a classe "nav__link--ativo".
 * Usa IntersectionObserver em vez de escutar o evento "scroll"
 * diretamente, que é a abordagem recomendada hoje em dia por rodar
 * de forma muito mais leve (o navegador cuida da performance).
 */
function configurarLinkAtivo() {
    const secoes = document.querySelectorAll('main [id]');
    const links = document.querySelectorAll('.nav a');
    if (!secoes.length || !links.length) return;

    const linkPorId = new Map();
    links.forEach((link) => {
        const id = link.getAttribute('href')?.replace('#', '');
        if (id) linkPorId.set(id, link);
    });

    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                const link = linkPorId.get(entrada.target.id);
                if (!link) return;

                if (entrada.isIntersecting) {
                    links.forEach((l) => l.classList.remove('nav__link--ativo'));
                    link.classList.add('nav__link--ativo');
                }
            });
        },
        { rootMargin: '-40% 0px -50% 0px' } // considera "ativa" a seção perto do meio da tela
    );

    secoes.forEach((secao) => observador.observe(secao));
}
