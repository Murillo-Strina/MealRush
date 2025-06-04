import db from "../Database/Database.js";

class ContentService{

    async findAll() {
        try {
            const [rows] = await db.query("SELECT * FROM content");
            return rows;
        } catch (err) {
            console.error("Erro ao buscar o conteúdo das máquinas:", err);
            throw err;
        }
    }

    async findById(id){
        try {
            const [rows] = await db.query("SELECT * FROM content WHERE id = ?", [id]);
            return rows[0];
        } catch (err) {
            console.error(`Erro ao buscar o conteúdo da máquina com ID ${id}:`, err);
            throw err;
        }
    }

    async findByInstitutionIdAndMachineId(institutionId, machineId) {
        try {
            const [rows] = await db.query("SELECT * FROM content WHERE institutionId = ? AND machineId = ?", [institutionId, machineId]);
            return rows;
        } catch (err) {
            console.error(`Erro ao buscar o conteúdo da máquina com Institution ID ${institutionId} e Machine ID ${machineId}:`, err);
            throw err;
        }
    }

    async create(foodName, machineId, institutionId, salePrice, purchasePrice, quantity, profit ){
        try {
            const [result] = await db.query(
                "INSERT INTO content (foodName, machineId, institutionId, salePrice, purchasePrice, quantity, profit) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [foodName, machineId, institutionId, salePrice, purchasePrice, quantity, profit]
            );
            return result.insertId;
        } catch (err) {
            console.error("Erro ao criar o conteúdo da máquina:", err);
            throw err;
        }
    }

    async update(foodName, machineId, institutionId, salePrice, purchasePrice, quantity, profit, id, machineId, institutionId) {
        try {
            const [result] = await db.query(
                "UPDATE content SET foodName = ?, machineId = ?, institutionId = ?, salePrice = ?, purchasePrice = ?, quantity = ?, profit = ? WHERE id = ? AND machineId = ? AND institutionId = ?",
                [foodName, machineId, institutionId, salePrice, purchasePrice, quantity , profit, id, machineId, institutionId]
            );
            return result.affectedRows;
        } catch (err) {
            console.error(`Erro ao atualizar o conteúdo da máquina com ID ${id}:`, err);
            throw err;
        }
    }

    async delete(id, machineId, institutionId) {
        try {
            const [result] = await db.query(
                "DELETE FROM content WHERE id = ? AND machineId = ? AND institutionId = ?",
                [id, machineId, institutionId]
            );
            return result.affectedRows;
        } catch (err) {
            console.error(`Erro ao deletar o conteúdo da máquina com ID ${id}:`, err);
            throw err;
        }
    }
}

export default new ContentService();