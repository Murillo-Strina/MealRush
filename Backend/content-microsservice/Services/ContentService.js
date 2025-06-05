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

    async create(qtdItens, sales, machineId, institutionId, foodName, sellprice, buyprice) {
        const totalRevenue = sales * sellprice;
        const profit = totalRevenue - (buyprice * qtdItens);
        try {
            const [result] = await db.promise().query(
                `INSERT INTO content 
                (qtd_itens, sales, machineId, institutionId, foodName, sellprice, buyprice, total_revenue, profit)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [qtdItens, sales, machineId, institutionId, foodName, sellprice, buyprice, totalRevenue, profit]
            );
            return result.insertId;
        } catch (err) {
            throw err;
        }
    }

    async update(qtdItens, sales, foodName, sellprice, buyprice, id, machineId, institutionId) {
        const totalRevenue = sales * sellprice;
        const profit = totalRevenue - (buyprice * qtdItens);
        try {
            const [result] = await db.promise().query(
                `UPDATE content 
                SET qtd_itens = ?, sales = ?, foodName = ?, sellprice = ?, buyprice = ?, 
                    total_revenue = ?, profit = ?
                WHERE id = ? AND machineId = ? AND institutionId = ?`,
                [qtdItens, sales, foodName, sellprice, buyprice, totalRevenue, profit, id, machineId, institutionId]
            );
            return result;
        } catch (err) {
            throw err;
        }
    }

    async delete(id) {
        try {
            const [result] = await db.promise().query("DELETE FROM content WHERE id = ?", [id]);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async findContentByMachineId(machineId) {
        try {
            const [rows] = await db.promise().query("SELECT cont.id, cont.foodName, cont.qtd_itens, cont.sales, cont.total_revenue, cont.profit, mach.id as machineId, mach.institutionId FROM content cont INNER JOIN machine mach ON (cont.machineId = mach.id) WHERE cont.machineId = ?", [machineId]);
            return rows;
        } catch (err) {
            throw err;
        }
    }
}

export default new ContentService();
