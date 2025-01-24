import { pool } from "../db.js";

export async function createUsuario(data) {
    const query = Object.keys(data).map(key => key).join(", ")
    const parametros = [...Object.values(data)]
    const values = Object.keys(data).map(key => `?`).join(", ")

    const [result] = await pool.query(`
    INSERT INTO Usuario(${query})
    VALUES(${values})
    `, parametros)

    return result
}

export async function getUsuarioById(idUsuario) {
    const [rows] = await pool.query(`
        SELECT * FROM Usuario
        WHERE idUsuario = ?
    `, [idUsuario])

    return rows[0]
}

export async function getUsuarioByEmail(email) {
    const [row] = await pool.query(`
    SELECT * FROM Usuario
    WHERE email = ?    
    `, [email])

    return row
}

export async function updateUsuario(idUsuario, data) {
    const query = Object.keys(data).map(key => `${key} = ?`).join(", ")
    const parametros = [...Object.values(data), idUsuario]

    const result = await pool.query(`
    UPDATE Usuario
    SET ${query}, updatedAt = NOW()
    WHERE idUsuario = ?
    `, parametros)

    return result
}

export async function deletarUsuario(data) {
    const result = await pool.query(`
    UPDATE Usuario
    SET deletado = 1, updatedAt = NOW()
    WHERE idUsuario = ?
    `, [data.idUsuario])

    return result
}