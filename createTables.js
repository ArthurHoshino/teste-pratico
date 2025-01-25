import fs from 'fs'
import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

async function executarSQL(filePath) {
    const connection = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    }).promise()

    try {
        const sqlContent = fs.readFileSync(filePath, 'utf8')
        await connection.query(sqlContent)

        console.log('Tabelas criadas com sucesso!')
    } catch (error) {
        console.log('Erro ao executar o arquivo SQL:', error)
    } finally {
        await connection.end()
    }
}

executarSQL('tables.sql')