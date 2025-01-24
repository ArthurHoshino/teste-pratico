import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'

import servicosRouter from './routes/servicos.js'
import usuarioRouter from './routes/usuario.js'
import paginaRouter from './routes/paginas.js'
import { sessionStore } from './db/db.js'

dotenv.config()
const PORT = process.env.PORT
const ONE_HOUR = 1000 * 60 * 60
const IN_PROD = process.env.NODE_ENV === 'production'

const app = express()
app.set('view engine', 'ejs')

app.use(express.static('src/'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: ONE_HOUR,
        sameSite: true,
        secure: IN_PROD
    }
}))

// Rotas
app.use(servicosRouter)
app.use(usuarioRouter)
app.use(paginaRouter)

app.listen(PORT, () => {
    console.log(`Server running on: ${PORT}`)
})