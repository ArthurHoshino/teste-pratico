document.addEventListener('DOMContentLoaded', () => {
    // TODO procurar por agendamentos no id do usuário e que estejam ativos,
    // se não existir, renderizar uma mensagem dizendo que não tem nada

    let mainContent = document.getElementById('main-panel')
    mainContent.innerHTML = `<p>Você não tem nenhum agendamento ativo</p>`
})