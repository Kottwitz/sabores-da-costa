// ==========================================
// CONFIGURAÇÃO DOS DADOS PADRÃO (SANDBOX)
// ==========================================
const PRODUTOS_PADRAO = [
    {
        id: 1,
        nome: "Casquinha de Siri",
        descricao: "Siri desfiado temperado com ervas frescas, leite de coco e gratinada com farofa.",
        preco: 29.90,
        categoria: "Entradas",
        disponivel: true,
        imagem_url: "https://blog.ceraflame.com.br/wp-content/uploads/2021/02/siri-500x500.jpg"
    },
    {
        id: 2,
        nome: "Sequência de Camarão para 2",
        descricao: "Camarão à milanesa, ao alho e óleo, bobó, arroz e fritas.",
        preco: 149.90,
        categoria: "Pratos Principais",
        disponivel: true,
        imagem_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4c3AA0fqgZZOLIjDqlusgZYAC6jRQTTEELDJWYWzM4w&s=1024"
    },
    {
        id: 3,
        nome: "Tainha na Telha",
        descricao: "Tainha fresca recheada com farofa de camarão, acompanhada de pirão.",
        preco: 119.00,
        categoria: "Pratos Principais",
        disponivel: true,
        imagem_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlrXxo6aWlfg2C-xtnhokTtsg2PSV7wOjkTc47p_RjuQ&s=10"
    },
    {
        id: 4,
        nome: "Caipirinha de Limão Taiti",
        descricao: "Cachaça artesanal, limão fresco e açúcar.",
        preco: 18.00,
        categoria: "Bebidas",
        disponivel: true,
        imagem_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAXzSqpxSUNm8Bz2cOy06fvhf77oEb8siyFRr3X_IGFg&s=10"
    },
    {
        id: 5,
        nome: "Pavê de Doce de Leite com Côco",
        descricao: "Camadas suaves de creme de doce de leite artesanal, biscoito champagne e côco ralado.",
        preco: 22.00,
        categoria: "Sobremesas",
        disponivel: true,
        imagem_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxQcfhFjV40kneSTzemlBqlJ2jTe5Jljy-hlf5nu36Vw&s=10"
    }
];

const MESAS_PADRAO = ["Mesa 01", "Mesa 02", "Mesa 03", "Mesa 04"];
const ORDEM_CATEGORIAS = ["Entradas", "Pratos Principais", "Sobremesas", "Bebidas"];

let carrinho = [];

function obterProdutosSandbox() {
    const dadosSalvos = localStorage.getItem("sabores_da_costa_sandbox");
    if (!dadosSalvos) {
        localStorage.setItem("sabores_da_costa_sandbox", JSON.stringify(PRODUTOS_PADRAO));
        return PRODUTOS_PADRAO;
    }
    return JSON.parse(dadosSalvos);
}

function salvarProdutosSandbox(produtos) {
    localStorage.setItem("sabores_da_costa_sandbox", JSON.stringify(produtos));
}

function obterMesasSandbox() {
    let mesas = JSON.parse(localStorage.getItem("sabores_da_costa_mesas"));
    if (!mesas || mesas.length === 0) {
        mesas = MESAS_PADRAO;
        localStorage.setItem("sabores_da_costa_mesas", JSON.stringify(mesas));
    }
    return mesas;
}

function salvarMesasSandbox(mesas) {
    localStorage.setItem("sabores_da_costa_mesas", JSON.stringify(mesas));
}

// ==========================================
// INICIALIZAÇÃO DA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("produtosGrid")) {
        carregarCardapioPublicoSandbox();
        carregarSelectMesasPublico();
    }
    if (document.getElementById("gridMesasAdmin") || document.getElementById("listaAdminProdutos")) {
        carregarPainelAdminSandbox();
        carregarGestaoMesasAdmin();
    }
});

// ==========================================
// 1. CARDÁPIO PÚBLICO, MESAS E CARRINHO
// ==========================================
function carregarCardapioPublicoSandbox() {
    const produtos = obterProdutosSandbox();
    const grid = document.getElementById("produtosGrid");
    if (!grid) return;

    produtos.sort((a, b) => {
        let indexA = ORDEM_CATEGORIAS.indexOf(a.categoria);
        let indexB = ORDEM_CATEGORIAS.indexOf(b.categoria);
        if (indexA === -1) indexA = 99;
        if (indexB === -1) indexB = 99;
        return indexA - indexB;
    });

    grid.innerHTML = produtos.map(p => `
        <div class="produto-card">
            <div class="produto-img" style="background-image: url('${p.imagem_url}')"></div>
            <div class="produto-info">
                <span class="categoria-tag">${p.categoria}</span>
                <h3>${p.nome}</h3>
                <p>${p.descricao}</p>
                <div class="produto-footer">
                    <span class="preco">R$ ${p.preco.toFixed(2)}</span>
                    <button class="btn-pedir" onclick="adicionarAoCarrinho(${p.id})">Adicionar</button>
                </div>
            </div>
        </div>
    `).join('');
}

function carregarSelectMesasPublico() {
    const select = document.getElementById("numeroMesa");
    if (!select) return;

    const mesas = obterMesasSandbox();
    select.innerHTML = `
        <option value="" disabled selected>Selecione a sua mesa...</option>
        ${mesas.map(m => `<option value="${m}">${m}</option>`).join('')}
    `;
}

function adicionarAoCarrinho(id) {
    const produtos = obterProdutosSandbox();
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    carrinho.push(produto);
    atualizarBadgeCarrinho();
    alert(`${produto.nome} adicionado ao carrinho!`);
}

function atualizarBadgeCarrinho() {
    const badge = document.getElementById("cart-badge");
    if (badge) badge.textContent = carrinho.length;
}

function abrirCarrinho() {
    const modal = document.getElementById("modalCarrinho");
    const lista = document.getElementById("itensCarrinhoLista");
    const totalEl = document.getElementById("carrinhoTotal");
    if (!modal) return;

    if (carrinho.length === 0) {
        lista.innerHTML = "<p>O seu carrinho está vazio.</p>";
        totalEl.textContent = "R$ 0,00";
    } else {
        let total = 0;
        lista.innerHTML = carrinho.map((item) => {
            total += item.preco;
            return `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
                    <span>${item.nome}</span>
                    <span>R$ ${item.preco.toFixed(2)}</span>
                </div>
            `;
        }).join('');
        totalEl.textContent = `R$ ${total.toFixed(2)}`;
    }
    modal.style.display = "flex";
}

function fecharCarrinho() {
    const modal = document.getElementById("modalCarrinho");
    if (modal) modal.style.display = "none";
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("O carrinho está vazio!");
        return;
    }

    const mesaSelect = document.getElementById("numeroMesa");
    const mesa = mesaSelect ? mesaSelect.value : "";

    if (!mesa) {
        alert("Por favor, selecione o número da mesa antes de finalizar o pedido!");
        if (mesaSelect) mesaSelect.focus();
        return;
    }

    const novoPedido = {
        id: Date.now(),
        mesa: mesa,
        itens: [...carrinho],
        total: carrinho.reduce((acc, item) => acc + item.preco, 0),
        horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let pedidos = JSON.parse(localStorage.getItem("sabores_da_costa_pedidos") || "[]");
    pedidos.unshift(novoPedido);
    localStorage.setItem("sabores_da_costa_pedidos", JSON.stringify(pedidos));

    alert(`Pedido enviado com sucesso para a ${mesa}!`);
    carrinho = [];
    atualizarBadgeCarrinho();
    fecharCarrinho();
    if (mesaSelect) mesaSelect.value = "";
}

// ==========================================
// 2. PAINEL ADMIN: GESTÃO DE MESAS, DRAG & DROP E PEDIDOS
// ==========================================
function carregarGestaoMesasAdmin() {
    const container = document.getElementById("gridMesasAdmin");
    if (!container) return;

    const mesas = obterMesasSandbox();
    const pedidos = JSON.parse(localStorage.getItem("sabores_da_costa_pedidos") || "[]");

    if (mesas.length === 0) {
        container.innerHTML = "<p style='color: var(--text-muted);'>Nenhuma mesa registada no sistema.</p>";
        carregarHistoricoConcluidos();
        return;
    }

    container.innerHTML = mesas.map((mesa, index) => {
        const pedidosMesa = pedidos.filter(p => p.mesa === mesa);
        const temPedidos = pedidosMesa.length > 0;

        return `
            <div draggable="true" 
                 ondragstart="esquemaDragStart(event, ${index})" 
                 ondragover="esquemaDragOver(event)" 
                 ondrop="esquemaDrop(event, ${index})"
                 style="background: var(--shell); border: 2px solid ${temPedidos ? '#10b981' : 'var(--border-color)'}; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; cursor: grab; user-select: none;">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
                        <strong style="color: var(--deep-ocean); font-size: 1.1rem;">
                            <i class="fas fa-grip-vertical" style="color: var(--text-muted); margin-right: 0.3rem;"></i> 
                            <i class="fas fa-chair"></i> ${mesa}
                        </strong>
                        <button onclick="removerMesaSandbox('${mesa}')" title="Remover Mesa" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 1rem;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>

                    <div style="font-size: 0.9rem; margin-bottom: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: var(--text-main);">Pedidos Ativos (${pedidosMesa.length}):</span>
                        ${temPedidos ? '<span style="background: #10b981; color: #fff; font-size: 0.75rem; padding: 0.1rem 0.4rem; border-radius: 4px;">Ocupada</span>' : '<span style="color: var(--text-muted); font-size: 0.75rem;">Livre</span>'}
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                        ${pedidosMesa.map(pedido => `
                            <div style="background: var(--white); border: 1px solid var(--border-color); padding: 0.6rem; border-radius: 6px; font-size: 0.85rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem; color: var(--text-muted);">
                                    <span>🕒 ${pedido.horario}</span>
                                    <strong style="color: var(--cerulean);">R$ ${pedido.total.toFixed(2)}</strong>
                                </div>
                                <ul style="margin: 0 0 0.5rem 1rem; padding: 0; color: var(--text-main);">
                                    ${pedido.itens.map(i => `<li>${i.nome} (R$ ${i.preco.toFixed(2)})</li>`).join('')}
                                </ul>
                                <div style="display: flex; gap: 0.4rem;">
                                    <button onclick="concluirPedido(${pedido.id})" style="flex: 2; background: #10b981; color: #fff; border: none; padding: 0.3rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                                        <i class="fas fa-check"></i> Concluir
                                    </button>
                                    <button onclick="imprimirComanda(${pedido.id})" title="Imprimir Comanda para Cozinha" style="flex: 1; background: var(--deep-ocean); color: #fff; border: none; padding: 0.3rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                                        <i class="fas fa-print"></i> Cozinha
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    carregarHistoricoConcluidos();
}

let indiceMesaOrigem = null;

function esquemaDragStart(event, index) {
    indiceMesaOrigem = index;
    event.dataTransfer.effectAllowed = "move";
}

function esquemaDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function esquemaDrop(event, indexDestino) {
    event.preventDefault();
    if (indiceMesaOrigem === null || indiceMesaOrigem === indexDestino) return;

    let mesas = obterMesasSandbox();
    const [mesaMovida] = mesas.splice(indiceMesaOrigem, 1);
    mesas.splice(indexDestino, 0, mesaMovida);

    salvarMesasSandbox(mesas);
    carregarGestaoMesasAdmin();
    indiceMesaOrigem = null;
}

function adicionarMesaSandbox(event) {
    event.preventDefault();
    const input = document.getElementById("inputNovaMesa");
    if (!input) return;
    
    const nomeMesa = input.value.trim();
    if (!nomeMesa) return;

    let mesas = obterMesasSandbox();
    if (mesas.includes(nomeMesa)) {
        alert("Esta mesa já existe!");
        return;
    }

    mesas.push(nomeMesa);
    salvarMesasSandbox(mesas);
    input.value = "";
    carregarGestaoMesasAdmin();
    alert(`Mesa "${nomeMesa}" adicionada com sucesso!`);
}

function removerMesaSandbox(mesaNome) {
    if (!confirm(`Tem certeza que deseja remover a ${mesaNome}?`)) return;

    let mesas = obterMesasSandbox();
    mesas = mesas.filter(m => m !== mesaNome);
    salvarMesasSandbox(mesas);
    carregarGestaoMesasAdmin();
}

// ==========================================
// 3. HISTÓRICO DE PEDIDOS E FATURAMENTO
// ==========================================
function concluirPedido(id) {
    let pedidos = JSON.parse(localStorage.getItem("sabores_da_costa_pedidos") || "[]");
    const index = pedidos.findIndex(p => p.id === id);
    if (index === -1) return;

    const [pedidoConcluido] = pedidos.splice(index, 1);
    pedidoConcluido.horarioConclusao = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let historico = JSON.parse(localStorage.getItem("sabores_da_costa_historico") || "[]");
    historico.unshift(pedidoConcluido);

    localStorage.setItem("sabores_da_costa_pedidos", JSON.stringify(pedidos));
    localStorage.setItem("sabores_da_costa_historico", JSON.stringify(historico));

    carregarGestaoMesasAdmin();
}

function carregarHistoricoConcluidos() {
    const container = document.getElementById("listaHistoricoPedidos");
    const totalFaturadoEl = document.getElementById("faturamentoTotalDia");
    if (!container) return;

    let historico = JSON.parse(localStorage.getItem("sabores_da_costa_historico") || "[]");
    let faturamentoTotal = historico.reduce((acc, p) => acc + p.total, 0);
    
    if (totalFaturadoEl) totalFaturadoEl.textContent = `R$ ${faturamentoTotal.toFixed(2)}`;

    if (historico.length === 0) {
        container.innerHTML = "<p style='color: var(--text-muted); font-style: italic; font-size: 0.9rem;'>Nenhum pedido concluído ainda hoje.</p>";
        return;
    }

    container.innerHTML = historico.map(pedido => `
        <div style="background: var(--shell); border: 1px solid var(--border-color); padding: 0.6rem 1rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;">
            <div>
                <strong style="color: var(--deep-ocean);">${pedido.mesa}</strong> 
                <span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 0.5rem;">(Pedido às ${pedido.horario} • Concluído às ${pedido.horarioConclusao})</span>
                <div style="font-size: 0.85rem; color: var(--text-main); margin-top: 0.2rem;">
                    ${pedido.itens.map(i => i.nome).join(', ')}
                </div>
            </div>
            <strong style="color: #10b981;">R$ ${pedido.total.toFixed(2)}</strong>
        </div>
    `).join('');
}

function limparHistoricoConcluidos() {
    if (!confirm("Tem certeza que deseja limpar o histórico de pedidos concluídos e zerar o faturamento?")) return;
    localStorage.removeItem("sabores_da_costa_historico");
    carregarHistoricoConcluidos();
}

function imprimirComanda(id) {
    const pedidos = JSON.parse(localStorage.getItem("sabores_da_costa_pedidos") || "[]");
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;

    const areaImpressao = document.getElementById("comandaImpressaoArea");
    if (!areaImpressao) return;

    areaImpressao.style.display = "block";
    areaImpressao.innerHTML = `
        <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
            <h2>SABORES DA COSTA</h2>
            <h3>COMANDA DE COZINHA</h3>
        </div>
        <p><strong>Mesa:</strong> ${pedido.mesa}</p>
        <p><strong>Horário do Pedido:</strong> ${pedido.horario}</p>
        <hr style="border: 0.5px dashed #000;">
        <ul style="list-style: none; padding: 0;">
            ${pedido.itens.map(i => `<li style="margin-bottom: 8px; font-size: 1.1rem;">• <strong>${i.nome}</strong><br><span style="font-size: 0.9rem; color: #444;">${i.descricao || ''}</span></li>`).join('')}
        </ul>
        <hr style="border: 0.5px dashed #000;">
        <p style="text-align: right; font-size: 1rem;"><strong>Total de Itens:</strong> ${pedido.itens.length}</p>
    `;

    window.print();
    areaImpressao.style.display = "none";
}

// ==========================================
// 4. GESTÃO DE PRODUTOS (ADMIN)
// ==========================================
function carregarPainelAdminSandbox() {
    const produtos = obterProdutosSandbox();
    const container = document.getElementById("listaAdminProdutos");
    if (!container) return;

    produtos.sort((a, b) => {
        let indexA = ORDEM_CATEGORIAS.indexOf(a.categoria);
        let indexB = ORDEM_CATEGORIAS.indexOf(b.categoria);
        if (indexA === -1) indexA = 99;
        if (indexB === -1) indexB = 99;
        return indexA - indexB;
    });

    if (produtos.length === 0) {
        container.innerHTML = "<p style='color: var(--text-muted);'>Nenhum prato registado no sandbox.</p>";
        return;
    }

    container.innerHTML = produtos.map(p => `
        <div class="admin-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; border-bottom: 1px solid var(--border-color);">
            <div>
                <strong style="color: var(--deep-ocean); display: block; margin-bottom: 0.2rem;">${p.nome}</strong>
                <span class="item-preco" style="font-size: 0.85rem; color: var(--text-muted);">R$ ${p.preco.toFixed(2)} • <span style="color: var(--cerulean); font-weight: 500;">${p.categoria}</span></span>
            </div>
            <button class="btn-delete" onclick="deletarProdutoSandbox(${p.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 1rem;">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');
}

function adicionarProdutoSandbox(event) {
    event.preventDefault();
    
    const inputArquivo = document.getElementById("inputImagemFile");
    const arquivo = inputArquivo ? inputArquivo.files[0] : null;

    if (!arquivo) {
        alert("Por favor, selecione uma imagem do seu dispositivo!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imagemBase64 = e.target.result;
        
        const produtos = obterProdutosSandbox();
        const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;

        const novoPrato = {
            id: novoId,
            nome: document.getElementById("inputNome").value,
            descricao: document.getElementById("inputDesc").value,
            preco: parseFloat(document.getElementById("inputPreco").value),
            categoria: document.getElementById("inputCategoria").value,
            imagem_url: imagemBase64,
            disponivel: true
        };

        produtos.push(novoPrato);
        salvarProdutosSandbox(produtos);
        
        document.getElementById("formAdicionarProduto").reset();
        carregarPainelAdminSandbox();
        alert("Prato e imagem adicionados com sucesso ao seu sandbox!");
    };

    reader.readAsDataURL(arquivo);
}

function deletarProdutoSandbox(id) {
    if (!confirm("Tem certeza que deseja remover este prato?")) return;
    let produtos = obterProdutosSandbox();
    produtos = produtos.filter(p => p.id !== id);
    salvarProdutosSandbox(produtos);
    carregarPainelAdminSandbox();
}

function restaurarPadraoSandbox() {
    if (confirm("Deseja restaurar o cardápio, mesas e limpar todos os pedidos e histórico?")) {
        localStorage.removeItem("sabores_da_costa_sandbox");
        localStorage.removeItem("sabores_da_costa_pedidos");
        localStorage.removeItem("sabores_da_costa_mesas");
        localStorage.removeItem("sabores_da_costa_historico");
        carregarPainelAdminSandbox();
        carregarGestaoMesasAdmin();
        alert("Sandbox totalmente restaurado para o padrão!");
    }
}

// Força a execução imediata se carregado diretamente no admin
if (document.getElementById("gridMesasAdmin")) {
    carregarGestaoMesasAdmin();
}