import db from "../Database/connection.js";

class ContentService {

    async findAll() {
        try {
            const [rows] = await db.promise().query("SELECT * FROM content");
            return rows;
        } catch (err) {
            console.error("Erro ao buscar o conteúdo das máquinas:", err);
            throw err;
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.promise().query("SELECT * FROM content WHERE id = ?", [id]);
            return rows[0];
        } catch (err) {
            console.error(`Erro ao buscar o conteúdo da máquina com ID ${id}:`, err);
            throw err;
        }
    }

    async findByInstitutionIdAndMachineId(institutionId, machineId) {
        try {
            const [rows] = await db.promise().query(
                "SELECT * FROM content WHERE institutionId = ? AND machineId = ?",
                [institutionId, machineId]
            );
            return rows;
        } catch (err) {
            console.error(`Erro ao buscar o conteúdo da máquina com Institution ID ${institutionId} e Machine ID ${machineId}:`, err);
            throw err;
        }
    }

    async create(foodName, machineId, institutionId, salePrice, purchasePrice, quantity, profit) {
        try {
            const [result] = await db.promise().query(
                "INSERT INTO content (food_name, machine_id, institution_id, sale_price, purchase_price, quantity, profit) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [foodName, machineId, institutionId, salePrice, purchasePrice, quantity, profit]
            );
            return result.insertId;
        } catch (err) {
            console.error("Erro ao criar o conteúdo da máquina:", err);
            throw err;
        }
    }

    async update(foodName, salePrice, purchasePrice, quantity, profit, id, machineId, institutionId) {
        try {
            const [result] = await db.promise().query(
                "UPDATE content SET foodName = ?, salePrice = ?, purchasePrice = ?, quantity = ?, profit = ? WHERE id = ? AND machineId = ? AND institutionId = ?",
                [foodName, salePrice, purchasePrice, quantity, profit, id, machineId, institutionId]
            );
            return result.affectedRows;
        } catch (err) {
            console.error(`Erro ao atualizar o conteúdo da máquina com ID ${id}:`, err);
            throw err;
        }
    }

    async delete(id, machineId, institutionId) {
        try {
            const [result] = await db.promise().query(
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
