import { pool } from "../db.js";
import { getServicoByNome } from "./serviceDb.js";

export async function createAgenda(data) {
    let result = []
    for (let s in data.servico) {
        const servicoInfo = await getServicoByNome(data.servico[s])
        const verif = await getAgendaVerif({
            Usuario_idUsuario: data.Usuario_idUsuario,
            Servico_idServico: servicoInfo[0].idServico,
            dataAtendimento: data.data_atendimento
        })

        if (verif[0] !== undefined) {
            continue
        }

        let query = `INSERT INTO Usuario_has_Servico(
        Usuario_idUsuario,
        Servico_idServico,
        data_atendimento${data.obs !== '' ? ", obs)" : ")"}
        VALUES(?, ?, ?${data.obs !== '' ? ", ?)" : ")"}`
        
        let parametros = [data.Usuario_idUsuario, servicoInfo[0].idServico, data.data_atendimento]
        if (data.obs !== '') {
            parametros.push(data.obs)
        }

        const agendamento = await pool.query(query, parametros)
        result.push(agendamento)
    }

    return result
}

export async function getAllAgendaPag(data) {
    let retorno = {}
    const countQuery = 'SELECT COUNT(*) as total FROM Usuario_has_Servico WHERE Usuario_idUsuario = ?'
    const dataQuery = `
    SELECT
        idAgenda,
        DATE_FORMAT(data_atendimento, '%d/%m/%Y %H:%i') as data_atendimento,
        ativo
    FROM Usuario_has_Servico
    WHERE Usuario_idUsuario = ? LIMIT ? OFFSET ?
    `
    
    const [contagem] = await pool.query(countQuery, [data.userId])
    
    if (contagem[0] !== undefined) {
        const totalItens = contagem[0].total
        const totalPaginas = Math.ceil(totalItens / data.porPagina)

        const [result] = await pool.query(dataQuery, [data.userId, data.porPagina, data.offset])
        retorno['result'] = result
        retorno['totalPaginas'] = totalPaginas
    }

    return retorno
}

export async function getAgendaByDateEditar(data) {
    const [result] = await pool.query(`
    SELECT
        uhs.idAgenda,
        uhs.Servico_idServico,
        uhs.data_atendimento,
        s.nome_servico
    FROM Usuario_has_Servico AS uhs
    INNER JOIN Servico AS s ON s.idServico = uhs.Servico_idServico
    WHERE uhs.Usuario_idUsuario = ?
    AND uhs.data_atendimento = ?
    AND uhs.deletado = 0
    `, [data.Usuario_idUsuario, data.oldData])

    return result
}

export async function getAgendaByDateInterval(data) {
    const [result] = await pool.query(`
    SELECT
        Usuario_idUsuario,
        Servico_idServico,
        data_atendimento
    FROM Usuario_has_Servico
    WHERE Usuario_idUsuario = ?
    AND data_atendimento BETWEEN ? AND ?
    AND ativo = 1
    AND deletado = 0
    `, [data.userId, data.inicio, data.final])

    return result
}

export async function getAgendaByDateDetalhe(data) {
    const [agendas] = await pool.query(`
    SELECT
        uhs.*,
        s.nome_servico
    FROM Usuario_has_Servico as uhs
    INNER JOIN Servico as s ON s.idServico = uhs.Servico_idServico
    WHERE uhs.Usuario_idUsuario = ?
    AND uhs.deletado = 0
    AND uhs.data_atendimento BETWEEN ? AND ?
    `, [data.userId, data.atendInicio, data.atendFinal])

    return agendas
}

export async function getAgendaByIdPag(data) {
    let retorno = {}
    const countQuery = `
    SELECT COUNT(*) as total
    FROM Usuario_has_Servico AS uhs
    INNER JOIN (
        SELECT data_atendimento, MIN(idAgenda) as min_coluna
        FROM Usuario_has_Servico
        WHERE Usuario_idUsuario = ?
        AND deletado = 0
        ${data.onlyAtivo ? 'AND ativo = 1' : ''}
        GROUP BY data_atendimento
    ) sub ON uhs.data_atendimento = sub.data_atendimento AND uhs.idAgenda = sub.min_coluna
    WHERE uhs.Usuario_idUsuario = ?
    `
    const dataQuery = `
    SELECT
        uhs.idAgenda,
        DATE_FORMAT(uhs.data_atendimento, '%d/%m/%Y %H:%i') as data_atendimento,
        uhs.ativo
    FROM Usuario_has_Servico AS uhs
    INNER JOIN (
        SELECT data_atendimento, MIN(idAgenda) as min_coluna
        FROM Usuario_has_Servico
        WHERE Usuario_idUsuario = ?
        AND deletado = 0
        ${data.onlyAtivo ? 'AND ativo = 1' : ''}
        GROUP BY data_atendimento
    ) sub ON uhs.data_atendimento = sub.data_atendimento AND uhs.idAgenda = sub.min_coluna
    WHERE uhs.Usuario_idUsuario = ? AND uhs.deletado = 0
    ORDER BY uhs.data_atendimento DESC
    LIMIT ? OFFSET ?
    `

    const [contagem] = await pool.query(countQuery, [data.userId, data.userId])
    
    if (contagem[0] !== undefined) {
        const totalItens = contagem[0].total
        const totalPaginas = Math.ceil(totalItens / data.porPagina)

        const [result] = await pool.query(dataQuery, [data.userId, data.userId, data.porPagina, data.offset])
        retorno['result'] = result
        retorno['totalPaginas'] = totalPaginas
    }

    return retorno
}

export async function getAgendaVerif(data) {
    const [result] = await pool.query(`
    SELECT
        Usuario_idUsuario,
        Servico_idServico,
        data_atendimento
    FROM Usuario_has_Servico
    WHERE Usuario_idUsuario = ?
    AND Servico_idServico = ?
    AND data_atendimento = ?
    AND ativo = 1
    AND deletado = 0
    `, [data.Usuario_idUsuario, data.Servico_idServico, data.dataAtendimento])

    return result
}

export async function updateAgenda(data) {
    const [result] = await pool.query(`
    UPDATE Usuario_has_Servico
    SET ativo = 0, updatedAt = NOW()
    WHERE Usuario_idUsuario = ?
    AND ativo = 1
    AND data_atendimento < ?
    `, [data.userId, data.dataAtendimento])

    return result
}

export async function updateAgendaEditar(data) {
    const result = await pool.query(`
    UPDATE Usuario_has_Servico
    SET data_atendimento = ?, updatedAt = NOW()
    WHERE Usuario_idUsuario = ?
    AND data_atendimento = ?
    `, [data.data_atendimento, data.Usuario_idUsuario, data.oldData])

    return result
}

export async function deletarAgenda(data) {
    let result = []
    const serv = await getAgendaByDateEditar(data)

    for (let s in serv) {
        if (!data.servico.includes(serv[s].nome_servico)) {
            const [row] = await pool.query(`
            UPDATE Usuario_has_Servico
            SET deletado = 1, updatedAt = NOW()
            WHERE Usuario_idUsuario = ?
            AND Servico_idServico = ?
            AND data_atendimento = ?
            `, [data.Usuario_idUsuario, serv[s].Servico_idServico, data.oldData])

            result.push(row[0])
        }
    }

    return result
}
