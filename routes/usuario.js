import express from "express";
import { createUsuario, getUsuarioByEmail } from "../db/db-functions/usuarioDb.js";
import { sessionStore } from "../db/db.js";
import dotenv from 'dotenv'

dotenv.config()

const usuarioRouter = express.Router()

usuarioRouter.get('/usuario', (req, res, next) => {
    try {
        console.log(req.session)
        const { userId } = req.session
        console.log(userId)

        if (userId !== undefined) {
            res.status(200).send({message: 'Logado', status: 200})
        } else {
            res.status(404).send({message: 'Não está logado', status: 404})
        }

    } catch (error) {
        res.status(500).send('Tente novamente mais tarde')
        next(error)
    }
})

usuarioRouter.post('/usuario/login', async (req, res, next) => {
    try {
        const email = req.body.femail
        let senha = req.body.fsenha

        const user = await getUsuarioByEmail(email)

        if (!user[0]) {
            return res.send({message: 'E-mail incorreto', status: 400})
        }

        if (user[0].senha !== senha) {
            return res.send({message: 'Senha incorreta', status: 400})
        }

        req.session.userId = user[0].idUsuario
        return res.redirect('/dashboard')
    } catch (error) {
        res.status(500).send({message: 'Tente novamente mais tarde'})
        next(error)
    }
})

usuarioRouter.post('/usuario/logout', (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(418).send("Deu algum erro")
            }

            sessionStore.close()
            res.clearCookie(process.env.SESS_NAME)
            res.status(200).send('Usuario deslogado')
        })
    } catch (error) {
        res.status(500).send('Tente novamente mais tarde')
        next(error)
    }
})

export default usuarioRouter