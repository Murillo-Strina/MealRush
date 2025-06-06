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

    async create(qtdItens, sales, machineId, foodName, sellprice, buyprice) {
        const totalRevenue = sales * sellprice;
        const profit = (sales * sellprice) - (sales * buyprice);
        try {
            const [result] = await db.promise().query(
                `INSERT INTO content 
                (qtd_itens, sales, machineId, foodName, sellprice, buyprice, total_revenue, profit)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [qtdItens, sales, machineId, foodName, sellprice, buyprice, totalRevenue, profit]
            );
            return result.insertId;
        } catch (err) {
            throw err;
        }
    }

    async update(qtdItens, sales, foodName, sellprice, buyprice, id, machineId) {
        const totalRevenue = sales * sellprice;
        const profit = (sales * sellprice) - (sales * buyprice);
        try {
            const [result] = await db.promise().query(
                `UPDATE content 
                SET qtd_itens = ?, sales = ?, foodName = ?, sellprice = ?, buyprice = ?, 
                    total_revenue = ?, profit = ?
                WHERE id = ? AND machineId = ?`,
                [qtdItens, sales, foodName, sellprice, buyprice, totalRevenue, profit, id, machineId]
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
            const [rows] = await db.promise().query(
                `SELECT * FROM content WHERE machineId = ?`, 
                [machineId]
            );
            return rows;
        } catch (err) {
            throw err;
        }
    }

    async findContentByMachineIdAndFoodName(machineId, foodName) {
        try {
            const [rows] = await db.promise().query(
                `SELECT * FROM content WHERE machineId = ? AND foodName = ?`,
                [machineId, foodName]
            );
            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    async updateSales(id, newSalesQuantity) {
        try {
            const [rows] = await db.promise().query("SELECT sellprice, buyprice FROM content WHERE id = ?", [id]);
            
            if (!rows || rows.length === 0) {
                throw new Error("Item não encontrado.");
            }
            const item = rows[0];

            const totalRevenue = newSalesQuantity * item.sellprice;
            const profit = (newSalesQuantity * item.sellprice) - (newSalesQuantity * item.buyprice);
            
            const [result] = await db.promise().query(
                `UPDATE content 
                 SET sales = ?, total_revenue = ?, profit = ?
                 WHERE id = ?`,
                [newSalesQuantity, totalRevenue, profit, id]
            );

            return result;

        } catch (err) {
            throw err;
        }
    }
}

export default new ContentService();