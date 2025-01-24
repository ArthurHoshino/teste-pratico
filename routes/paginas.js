import express from 'express'
import moment from 'moment'

import { getUsuarioByEmail, createUsuario } from '../db/db-functions/usuarioDb.js'
import { getServicoPreco } from '../db/db-functions/serviceDb.js'
import { getAgendaByDateInterval, createAgenda, updateAgenda, getAgendaByIdPag, getAgendaByDateDetalhe, updateAgendaEditar, deletarAgenda } from '../db/db-functions/agendaDb.js'

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

const redirectConfirmacao = async (req, res, next) => {
    if (req.body.fconfirm === '') {
        const hoje = moment(moment().format('YYYY-MM-DD'))
        let semana = moment(req.body.fdata)
        let semanaInterval = { 
            userId: req.session.userId,
            inicio: moment(semana.clone().startOf('week')).format('YYYY-MM-DD'),
            final: moment(semana.clone().endOf('week')).format('YYYY-MM-DD')
        }
        const semanaResult = await getAgendaByDateInterval(semanaInterval)

        if (semanaResult[0] !== undefined) {
            for (let item in semanaResult) {
                let dataAtendimento = moment(moment(semanaResult[item].data_atendimento).format('YYYY-MM-DD'))
                let diferencaHoje = dataAtendimento.diff(hoje, 'days')

                if ( diferencaHoje >= 2 ) {
                    let agendaAnterior = moment(semanaResult[item].data_atendimento).format('DD/MM/YYYY')
                    let mesmaData = `Você já possui um atendimento no dia ${agendaAnterior}, gostaria de marcar no mesmo dia?`
                    
                    req.session.formData = req.body
                    req.session.agendaAnterior = moment(semanaResult[item].data_atendimento).format('YYYY-MM-DD HH:mm')
                    
                    return res.render('confirmacao', {agendaMesmaData: mesmaData})
                }
            }
        }
        next()
    } else {
        next()
    }
}

const atualizarAgenda = async (req, res, next) => {
    const hoje = moment().format('YYYY-MM-DD')

    await updateAgenda({userId: req.session.userId, dataAtendimento: hoje})

    next()
}

const historicoTemplateData = async (req) => {
    const precos = await getServicoPreco()
    const atend = moment(req.query.dataatendimento.split(' ')[0], 'DD/MM/YYYY').format('YYYY-MM-DD')
    const data = {
        atendInicio: `${atend} 00:00:00`,
        atendFinal: `${atend} 23:59:59`,
        userId: req.session.userId
    }

    const result = await getAgendaByDateDetalhe(data)
    const atendData = moment(result[0].data_atendimento).format('YYYY-MM-DD')
    const atendHora = moment(result[0].data_atendimento).format('HH:mm')

    let info = {
        servicoError: '',
        dataError: '',
        horaError: '',
        userConfirmacao: '',
        agendaMesmaData: '',
        data: result,
        atendData: atendData,
        atendHora: atendHora
    }
    precos.forEach(item => {info[`${item.nome_servico}Preco`] = item.preco_servico})
    
    return info
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

paginaRouter.get('/dashboard', redirectLogin, atualizarAgenda, async (req, res) => {
    const pag = parseInt(req.query.pagina) || 1
    const perPage = 5
    const data = {
        pagina: pag,
        porPagina: perPage,
        offset: (pag - 1) * perPage,
        userId: req.session.userId,
        onlyAtivo: true
    }

    const result = await getAgendaByIdPag(data)

    res.render('dashboard', {
        itens: result.result,
        paginaAtual: pag,
        totalPaginas: result.totalPaginas
    })
})

paginaRouter.get('/agenda', redirectLogin, async (req, res) => {
    const precos = await getServicoPreco()
    let data = {
        servicoError: '',
        dataError: '',
        horaError: '',
        userConfirmacao: '',
        agendaMesmaData: ''
    }
    precos.forEach(item => {data[`${item.nome_servico}Preco`] = item.preco_servico})

    res.render('agenda', data)
})

paginaRouter.get('/historico', redirectLogin, async (req, res) => {
    const pag = parseInt(req.query.pagina) || 1
    const perPage = 5
    const data = {
        pagina: pag,
        porPagina: perPage,
        offset: (pag - 1) * perPage,
        userId: req.session.userId,
        onlyAtivo: false
    }

    const result = await getAgendaByIdPag(data)
    const dataHoje = moment().format('YYYY-MM-DD HH:mm')

    res.render('historico', {
        itens: result.result,
        paginaAtual: pag,
        totalPaginas: result.totalPaginas,
        dataHoje: dataHoje
    })
})

paginaRouter.get('/historico-detalhe', redirectLogin, async (req, res) => {
    const info = await historicoTemplateData(req)

    res.render('historico_detalhe', info)
})

paginaRouter.get('/historico-editar', redirectLogin, async (req, res) => {
    req.session.oldData = req.query.dataatendimento
    const info = await historicoTemplateData(req)

    res.render('historico_editar', info)
})

paginaRouter.get('/confirmacao', redirectLogin, (req, res) => {
    res.render('confirmacao', {agendaMesmaData: ''})
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
            return res.redirect('/dashboard')
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

paginaRouter.post('/agenda', redirectConfirmacao, async (req, res, next) => {
    try {
        if (req.body.fconfirm !== '') {
            req.session.formData.fconfirm = req.body.fconfirm
            req.body = req.session.formData
            
            if (req.body.fconfirm === 'true') {
                req.body.fdata = req.session.agendaAnterior.split(' ')[0]
                req.body.fhora = req.session.agendaAnterior.split(' ')[1]
            }

            delete req.session.formData
            delete req.session.agendaAnterior
        }

        const precos = await getServicoPreco()
        const hoje = moment(moment().format('YYYY-MM-DD'))
        let errorMessage = {
            servicoError: '',
            dataError: '',
            horaError: '',
            userConfirmacao: '',
            agendaMesmaData: ''
        }
        precos.forEach(item => {errorMessage[`${item.nome_servico}Preco`] = item.preco_servico})
        
        if (!req.body.opcoes) {
            errorMessage.servicoError = 'Selecione pelo menos um serviço'
            return res.render('agenda', errorMessage)
        }
        if ( hoje.diff( moment(moment(req.body.fdata)), 'days') > 0 ) {
            errorMessage.dataError = 'Seleciona uma data futura'
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

        const result = await createAgenda(data)

        res.redirect('/dashboard')
    } catch (error) {
        res.status(500).redirect('/dashboard')
        next(error)
    }
})

paginaRouter.post('/historico-editar', async (req, res) => {
    let info = await historicoTemplateData(req)

    if (!req.body.opcoes) {
        info.servicoError = 'Selecione pelo menos um serviço'
        return res.render('historico_editar', info)
    }
    const oldData = moment(moment(req.session.oldData, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm'))
    const newData = moment(`${req.body.fdata} ${req.body.fhora}`)

    let data = {
        Usuario_idUsuario: req.session.userId,
        oldData: moment(req.session.oldData, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm'),
        servico: req.body.opcoes,
        data_atendimento: `${req.body.fdata} ${req.body.fhora}`,
        obs: req.body.fobs
    }

    await deletarAgenda(data)

    if (!oldData.isSame(newData)) {
        await updateAgendaEditar(data)
    }

    await createAgenda(data)

    delete req.session.oldData

    res.redirect('/historico')
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