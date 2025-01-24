import { pool } from '../db.js'

export async function getServicos() {
    const [rows] = await pool.query("SELECT * FROM Servico WHERE deletado = 0")
    return rows
}

export async function getServico(idServico) {
    const [rows] = await pool.query(`
    SELECT * FROM Servico
    WHERE idServico = ?
    `, [idServico])

    return rows[0]
}

export async function getServicoByNome(servico) {
    const [row] = await pool.query(`
    SELECT idServico FROM Servico
    WHERE nome_servico = ?    
    `, [servico])

    return row
}

export async function getServicoPreco() {
    const [result] = await pool.query(`
    SELECT nome_servico, preco_servico
    FROM Servico    
    `)

    return result
}

export async function createServico(data) {
    const [result] = await pool.query(`
    INSERT INTO Servico(nome_servico, preco_servico)
    VALUES(?, ?)
    `, [data.nome, data.preco])

    return result
}

export async function updateServico(idServico, data) {
    const query = Object.keys(data).map(key => `${key} = ?`).join(", ")
    const parametros = [...Object.values(data), idServico]

    const result = await pool.query(`
    UPDATE Servico
    SET ${query}, updatedAt = NOW()
    WHERE idServico = ?
    `, parametros)

    return result
}

export async function deletarServico(data) {
    const result = await pool.query(`
    UPDATE Servico
    SET deletado = 1, updatedAt = NOW()
    WHERE idServico = ?
    `, [data.idServico])

    return result
}