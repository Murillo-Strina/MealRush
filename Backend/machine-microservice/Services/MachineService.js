import db from "../Database/connection.js";

class MachineService {

    async findAll() {
        try {
            const [rows] = await db.promise().query("SELECT * FROM machine");
            return rows;
        } catch (err) {
            console.error("Erro no Service ao buscar todas as máquinas:", err);
            throw err;
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.promise().query("SELECT * FROM machine WHERE id = ?", [id]);
            return rows[0];
        } catch (err) {
            console.error(`Erro no Service ao buscar máquina por ID ${id}:`, err);
            throw err;
        }
    }

    async create(institutionId, amount, status, lastMaintenance, lastFill, rent) {
        try {
            const [result] = await db.promise().query(
                "INSERT INTO machine (institutionId, qtd_itens, statusId, dt_ultima_manutencao, dt_ultimo_abastecimento, aluguel) VALUES (?,?,?,?,?,?)",
                [institutionId, amount, status, lastMaintenance, lastFill, rent]
            );
            return result.insertId;
        } catch (err) {
            console.error("Erro no Service ao criar máquina:", err);
            throw err;
        }
    }

    async update(amount, status, lastMaintenance, lastFill, rent, id, institutionId) {
        try {
            const [result] = await db.promise().query(
                "UPDATE machine SET qtd_itens = ?, statusId = ?, dt_ultima_manutencao = ?, dt_ultimo_abastecimento = ?, aluguel = ? WHERE id = ? AND institutionId = ?",
                [amount, status, lastMaintenance, lastFill, rent, id, institutionId]
            );
            return result.affectedRows;
        } catch (err) {
            console.error(`Erro no Service ao atualizar máquina ID ${id}:`, err);
            throw err;
        }
    }

    async delete(id, institutionId) {
        try {
            const [result] = await db.promise().query("DELETE FROM machine WHERE id = ? AND institutionId = ?", [id, institutionId]);
            return result.affectedRows;
        } catch (err) {
            console.error(`Erro no Service ao deletar máquina ID ${id}:`, err);
            throw err;
        }
    }

    async updateStatus(statusId, id) {
        try {
            const [result] = await db.promise().query(
                "UPDATE machine SET statusId = ? WHERE id = ?",
                [statusId, id]
            );
            return result.affectedRows;
        } catch (err) {
            console.error(`Erro no Service ao atualizar status da máquina ID ${id}:`, err);
            throw err;
        }
    }

    async getMachinesByInstitution(institutionId) {
        try {
            const [rows] = await db.promise().query(`
                SELECT 
                    mach.id AS machineId,
                    mach.aluguel,
                    stat.id AS statusId,
                    stat.descricao AS statusDescricao,
                    inst.id AS institutionId,
                    inst.name AS institutionName
                FROM machine mach
                INNER JOIN status stat ON mach.statusId = stat.id
                INNER JOIN institution inst ON mach.institutionId = inst.id
                WHERE mach.institutionId = ?
            `, [institutionId]);
            return rows;
        } catch (err) {
            console.error(`Erro no Service ao buscar máquinas por instituição ID ${institutionId}:`, err);
            throw err;
        }
    }
}

export default new MachineService();