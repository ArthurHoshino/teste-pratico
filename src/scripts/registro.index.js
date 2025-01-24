// #################################
// APAGAR DEPOIS. APENAS PARA TESTE
// #################################
const sample = [
    {
        'femail': 'teste@email.com',
        'fsenha': 'qwer1234'
    },
    {
        'femail': 'teste2@email.com',
        'fsenha': 'asdf5678'
    },
    {
        'femail': 'reaper@email.com',
        'fsenha': 'vaio39nf'
    },
]

import navigate from '../../global/index.js'
const btn = document.getElementById('submitBtn')

document.getElementById('femail').addEventListener('input', () => {
    let email = document.getElementById('femail').value
    let error = document.getElementById('cemail')

    if (sample.some(value => value.femail === email)) {
        error.innerHTML = 'Email já em uso'
        btn.disabled = true
    } else {
        error.innerHTML = ''
        btn.disabled = false
    }
})

document.getElementById('fsenha').addEventListener('input', () => {
    let passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%& "]).{8,}$/
    let senha = document.getElementById('fsenha').value
    let error = document.getElementById('csenha')

    if (!passwordValidation.test(senha)) {
        error.innerHTML = 'Senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais'
        btn.disabled = true
    } else {
        error.innerHTML = ''
        btn.disabled = false
    }
})

document.getElementById('fsenhaconfirma').addEventListener('input', () => {
    let senha = document.getElementById('fsenha').value
    let confirma = document.getElementById('fsenhaconfirma').value
    let error = document.getElementById('csenhaconfirma')

    if (senha !== confirma) {
        error.innerHTML = 'Senhas precisam ser iguais'
        btn.disabled = true
    } else {
        error.innerHTML = ''
        btn.disabled = false
    }
})

document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault()

    let a = new FormData(event.target)
    let data = {}

    a.forEach((v, k) => {
        data[k] = v
    })

    fetch('http://127.0.0.1:8080/user/adicionarUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        console.log("Cadastro realizado com sucesso! (pop-up)")
        navigate('../main/main.html')
    })
    .catch((error) => {
        console.log(error)
        alert('Ocorreu um erro! :(')
    })
})
