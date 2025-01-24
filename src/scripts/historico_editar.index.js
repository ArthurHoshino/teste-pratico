import navigate from '../../../global/index.js'

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

document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault()

    const urlparams = new URLSearchParams(window.location.search)
    const agendaId = Number(urlparams.get('agendaId'))

    // TODO: buscar no banco o agendamento com o agendaId e o id do usuário
    const dados = dadosTeste.filter(item => item.agendamentoId === agendaId)[0]
    const servicos = dados.servicos.split(',')

    if (dados.data !== '') {
        document.getElementById('fdata').value = dados.data
    }

    if (dados.obs !== '') {
        document.getElementById('fobs').value = dados.obs
    }

    for (let s in servicos) {
        document.getElementById(servicos[s]).checked = true
    }
})

document.getElementById('editar-form').addEventListener('submit', (event) => {
    event.preventDefault()

    let a = new FormData(event.target)
    const fieldset = document.querySelector('fieldset.nice-form-group')
    const opt = fieldset.querySelectorAll('input[type="checkbox"]:checked')
    const selected = Array.from(opt).map(check => check.id)
    let data = {}

    if (selected.length === 0) {
        alert('Selecione pelo menos um serviço')
        return
    }

    data['servicos'] = selected
    a.forEach((v, k) => {
        data[k] = v
    })

    console.log(data)

    // TODO atualizar agendamento
    // TODO verificar se existe outro agendamento na mesma semana

    alert('Atendimento editado com sucesso!')
    navigate('historico.html')
})