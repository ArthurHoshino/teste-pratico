import express from 'express'
import { getServicos, getServico, createServico, updateServico, deletarServico } from '../db/db-functions/serviceDb.js'

const servicosRouter = express.Router()

servicosRouter.get('/servicos', async (req, res, next) => {
    try {
        const servicos = await getServicos()
        res.send(servicos)
    } catch (error) {
        res.status(500).send('Tente novamente mais tarde')
        next(error)
    }
})

servicosRouter.get('/servicos/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const servico = await getServico(id)
        res.send(servico)
    } catch (error) {
        res.status(500).send('Tente novamente mais tarde')
        next(error)
    }
})

servicosRouter.post('/servicos', async (req, res, next) => {
    try {
        const data = req.body
        const result = await createServico(data)
        res.status(201).send(result)
    } catch (error) {
        res.status(500).send('Tente novamente mais tarde')
        next(error)
    }
})

servicosRouter.put('/servicos/:id', async (req, res, next) => {
    try {
        const data = req.body
        const idServico = req.params.id

        const result = await updateServico(idServico, data)

        res.status(200).send(result)
    } catch (error) {
        res.status(500).send('Tente novamente mais tarde')
        next(error)
    }
})

servicosRouter.delete('/servicos', async (req, res, next) => {
    try {
        const result = await deletarServico(req.body)

        res.status(200).send(result)
    } catch (error) {
        res.status(500).send('Tente novamente mais tarde')
        next(error)
    }
})

export default servicosRouter