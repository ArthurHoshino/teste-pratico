import mysql from 'mysql2'
import dotenv from 'dotenv'
import session from 'express-session'
import MySQLStore from 'express-mysql-session'

dotenv.config()

const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}
const pool = mysql.createPool(options).promise()

const mysqlStore = MySQLStore(session)
const sessionStore = new mysqlStore(options, pool)

export {pool, sessionStore}