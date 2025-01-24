const dadosTeste = [
    {
        'agendamentoId': 0,
        'userId': 2,
        'servicos': 'corte,progressiva,depilacao',
        'data': '2025-02-15',
        'obs': ''
    },
    {
        'agendamentoId': 1,
        'userId': 3,
        'servicos': 'unha',
        'data': '2025-01-18',
        'obs': ''
    },
    {
        'agendamentoId': 2,
        'userId': 4,
        'servicos': 'sobrancelha,maquiagem',
        'data': '2025-02-23',
        'obs': 'Pagamento em dinheiro'
    }
]

const porPagina = 2
let paginaAtual = 1

function dataFormatada(data = '') {
    // TODO adicionar as horas na formataçõa
    const date = data === '' ? new Date() : new Date(data)
    const ano = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const dia = date.getDate().toString().padStart(2, '0');

    return data === '' ? `${ano}-${mes}-${dia}` : `${dia}/${mes}/${ano}`;
}

function exibirItens() {
    // TODO pegar os itens que estão no banco e não aqui

    const agora = new Date(dataFormatada())
    const inicio = (paginaAtual - 1) * porPagina
    const final = inicio + porPagina
    const itensPagina = dadosTeste.slice(inicio, final)

    const tabela = document.getElementById('tabela-itens')
    tabela.innerHTML = `
    <tr>
        <th>ID</th>
        <th>Data do agendamento</th>
        <th>Status</th>
        <th>Ações</th>
    </tr>
    `

    itensPagina.forEach(item => {
        let acao = `<a href="historico_detalhe.html?agendaId=${item.agendamentoId}">Detalhes</a>`
        let status = 'Concluído'
        const row = tabela.insertRow()
        const idCelula = row.insertCell(0)
        const dataCelula = row.insertCell(1)
        const statusCelula = row.insertCell(2)
        const acaoCelula = row.insertCell(3)

        if ( ((new Date(item.data) - agora) / (1000 * 60 * 60 * 24)) >= 2 ) {
            acao += `<a href="historico_editar.html?agendaId=${item.agendamentoId}">Editar</a>`
        }

        if ( ((new Date(item.data) - agora) / (1000 * 60 * 60 * 24)) >= 0 ) {
            status = 'Ativo'
        }

        idCelula.innerHTML = item.agendamentoId
        dataCelula.innerHTML = dataFormatada(item.data)
        statusCelula.innerHTML = status
        acaoCelula.innerHTML = acao
    })

    atualizarControles()
}

function atualizarControles() {
    const totalPaginas = Math.ceil(dadosTeste.length / porPagina)

    document.getElementById('pagina-atual').textContent = paginaAtual
    document.getElementById('total-paginas').textContent = totalPaginas

    document.getElementById('anterior').disabled = paginaAtual === 1
    document.getElementById('proximo').disabled = paginaAtual === totalPaginas
}

function irParaPagina(page) {
    paginaAtual = page
    exibirItens()
}

function paginaAnterior() {
    if (paginaAtual > 1) {
        irParaPagina(paginaAtual - 1)
    }
}

function proximaPagina() {
    const totalPaginas = Math.ceil(dadosTeste.length / porPagina)
    if (paginaAtual < totalPaginas) {
        irParaPagina(paginaAtual + 1)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    exibirItens()
})
