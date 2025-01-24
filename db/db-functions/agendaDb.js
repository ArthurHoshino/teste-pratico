import { pool } from "../db.js";
import { getServicoByNome } from "./serviceDb.js";

export async function createAgenda(data) {
    let result = []
    for (let s in data.servico) {
        let servicoId = await getServicoByNome(data.servico[s])

        let query = `INSERT INTO Usuario_has_Servico(
        Usuario_idUsuario,
        Servico_idServico,
        data_atendimento${data.obs !== '' ? ", obs)" : ")"}
        VALUES(?, ?, ?${data.obs !== '' ? ", ?)" : ")"}`
        
        let parametros = [data.Usuario_idUsuario, servicoId[0].idServico, data.data_atendimento]
        if (data.obs !== '') {
            parametros.push(data.obs)
        }

        const agendamento = await pool.query(query, parametros)
        result.push(agendamento)
    }

    return result
}

export async function getAgendaByDate(data) {
    const [result] = await pool.query(`
    SELECT
        Usuario_idUsuario,
        Servico_idServico,
        data_atendimento
    FROM Usuario_has_Servico
    WHERE Usuario_idUsuario = ?
    AND data_atendimento BETWEEN ? AND ?
    AND ativo = 1
    `, [data.userId, data.inicio, data.final])

    return result
}
