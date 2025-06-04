import db from "../Database/connection.js";

class ContentService {
    
    async findAll() {
        try {
            const [rows] = await db.promise().query("SELECT * FROM content");
            return rows;
        } catch (err) {
            throw err;
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.promise().query("SELECT * FROM content WHERE id = ?", [id]);
            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    async create(qtdItens, sales, revenue, profit, machineId, institutionId, foodName) {
        try {
            return await db.promise().query(
                "INSERT INTO content (qtd_itens, sales, revenue, profit, machineId, institutionId, foodName) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [qtdItens, sales, revenue, profit, machineId, institutionId, foodName]
            );
        } catch (err) {
            throw err;
        }
    }

    async update(id, qtdItens, sales, revenue, profit, foodName, machineId, institutionId) {
        try {
            return await db.promise().query(
                "UPDATE content SET qtd_itens = ?, sales = ?, revenue = ?, profit = ?, foodName = ? WHERE id = ? AND machineId = ? AND institutionId = ?",
                [qtdItens, sales, revenue, profit, foodName, machineId, institutionId, id]
            );
        } catch (err) {
            throw err;
        }
    }

    async delete(id) {
        try {
            await db.promise().query("DELETE FROM content WHERE id = ?", [id]);
        } catch (err) {
            throw err;
        }
    }
}

export default new ContentService();
