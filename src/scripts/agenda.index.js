import navigate from '../../../global/index.js'

document.getElementById('agenda-form').addEventListener('submit', (event) => {
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

    // TODO criar agendamento
    // TODO verificar se existe outro agendamento na mesma semana

    alert('Atendimento agendado com sucesso!')
    navigate('../main/main.html')
})
