import express from 'express'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { getUsuarioByEmail, createUsuario } from '../db/db-functions/usuarioDb.js'
import { getServicoPreco } from '../db/db-functions/serviceDb.js'

import moment from 'moment'
import { getAgendaByDate } from '../db/db-functions/agendaDb.js'

const paginaRouter = express.Router()

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}

const redirectDashboard = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/dashboard')
    } else {
        next()
    }
}

paginaRouter.get('/', (req, res) => {
    res.render('index')
})

paginaRouter.get('/login', redirectDashboard, (req, res, next) => {
    const data = {
        emailError: '',
        senhaError: ''
    }
    res.render('login', data)
})

paginaRouter.get('/registro', redirectDashboard, (req, res) => {
    const data = {
        emailError: ''
    }

    res.render('registro', data)
})

paginaRouter.get('/dashboard', redirectLogin, (req, res) => {
    res.render('dashboard')
})

paginaRouter.get('/agenda', redirectLogin, async (req, res) => {
    const precos = await getServicoPreco()
    let data = {
        servicoError: '',
        dataError: '',
        horaError: '',
        userConfirmacao: false,
        agendaMesmaData: false
    }
    precos.forEach(item => {data[`${item.nome_servico}Preco`] = item.preco_servico})

    res.render('agenda', data)
})

paginaRouter.get('/historico', redirectLogin, (req, res) => {
    res.render('historico')
})

paginaRouter.get('/historico-detalhe', redirectLogin, (req, res) => {
    res.render('historico_detalhe')
})

paginaRouter.get('/historico-editar', redirectLogin, (req, res) => {
    res.render('historico_editar')
})


paginaRouter.post('/login', async (req, res, next) => {
    try {
        const email = req.body.femail
        let senha = req.body.fsenha
        const data = {
            emailError: 'E-mail incorreto',
            senhaError: ''
        }

        const user = await getUsuarioByEmail(email)

        if (user[0]) {
            data.emailError = ''

            if (user[0].senha !== senha) {
                data.senhaError = 'Senha incorreta'
            }
        }

        if (data.emailError === '' && data.senhaError === '') {
            req.session.userId = user[0].idUsuario
            return res.render('dashboard')
        } else {
            return res.render('login', data)
        }
    } catch (error) {
        res.status(500).send({message: 'Tente novamente mais tarde'})
        next(error)
    }
})

paginaRouter.post('/registro', async (req, res, next) => {
    try {
        const data = {
            'nome_user': req.body.fnome,
            'email': req.body.femail,
            'senha': req.body.fsenha
        }
        const verificacao = await getUsuarioByEmail(req.body.femail)

        if (verificacao[0] !== undefined) {
            const errorMessage = {emailError: 'E-mail já em uso'}
            return res.render('registro', errorMessage)
        }

        const result = await createUsuario(data)

        req.session.userId = result.insertId
        res.redirect('/registro')
    } catch (error) {
        res.status(500).send({message: 'Tente novamente mais tarde'})
        next(error)
    }
})

paginaRouter.post('/agenda', async (req, res, next) => {
    try {
        if (req.body.fconfirm === 'true') {
            console.log('formdata', req.session.formData)
            req.session.formData.fconfirm = 'true'
            req.body = req.session.formData
        }

        const precos = await getServicoPreco()
        const hoje = moment(moment().format('YYYY-MM-DD'))
        let errorMessage = {
            servicoError: '',
            dataError: '',
            horaError: '',
            userConfirmacao: false,
            agendaMesmaData: false
        }
        precos.forEach(item => {errorMessage[`${item.nome_servico}Preco`] = item.preco_servico})
        
        if (!req.body.opcoes) {
            errorMessage.servicoError = 'Selecione pelo menos um serviço'
            return res.render('agenda', errorMessage)
        }
        if (req.body.fdata === '') {
            errorMessage.dataError = 'Selecione uma data'
            return res.render('agenda', errorMessage)
        } else if ( hoje.diff( moment(moment(req.body.fdata)), 'days') >= 0 ) {
            errorMessage.dataError = 'Seleciona uma data válida'
            return res.render('agenda', errorMessage)
        }
        if (req.body.fhora === '') {
            errorMessage.horaError = 'Selecione um horário'
            return res.render('agenda', errorMessage)
        }

        const { userId } = req.session
        const data = {
            'Usuario_idUsuario': userId,
            'servico': req.body.opcoes,
            'data_atendimento': `${req.body.fdata} ${req.body.fhora}`,
            'obs': req.body.fobs
        }

        // Verificar se existe algum outro agendamento na mesma semana
        if (req.body.fconfirm === 'false') {
            let semana = moment(req.body.fdata)
            let semanaInterval = { 
                userId: userId,
                inicio: moment(semana.clone().startOf('week')).format('YYYY-MM-DD'),
                final: moment(semana.clone().endOf('week')).format('YYYY-MM-DD')
            }
            const semanaResult = await getAgendaByDate(semanaInterval)
    
            if (semanaResult[0] !== undefined) {
                let dataSelecionada = moment(moment(req.body.fdata))
                
                // TODO trocar isso para um for, para eu sair dele e conseguir fazer o return
                // com o foreach ele continua e não para como eu quero
                semanaResult.forEach(item => {
                    let dataAtendimento = moment(moment(item.data_atendimento).format('YYYY-MM-DD'))
                    let diferencaHoje = dataAtendimento.diff(hoje, 'days')
    
                    // se ele aceitar, temos que, de alguma forma, salvar a data mais perto do
                    // inicio da semana, acho que jogar no session é uma boa...
                    if ( diferencaHoje >= 2 ) {
                        errorMessage.agendaMesmaData = true
                        req.session.formData = req.body
                        return res.render('agenda', errorMessage)
                    }
                })
            }
        }

        // const result = await createAgenda(data)

        // res.redirect('/dashboard')
    } catch (error) {
        res.status(500).redirect('/dashboard')
        next(error)
    }
})


paginaRouter.post('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if(err){
            return res.redirect('/')
        }
        sessionStore.close()
        res.clearCookie(process.env.SESS_NAME)
        res.redirect('/login')
    })
})

export default paginaRouter