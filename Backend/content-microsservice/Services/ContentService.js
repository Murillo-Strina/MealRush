import db from "../Database/connection.js";
import axios from "axios";

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
            const [contentsFromDB] = await db.promise().query(
                `SELECT * FROM content WHERE machineId = ?`, 
                [machineId]
            );

            if (contentsFromDB.length === 0) {
                return [];
            }

            const enrichedContents = await Promise.all(
                contentsFromDB.map(async (content) => {
                    try {
                        const foodResponse = await axios.get(`http://localhost:3000/foods/name/${encodeURIComponent(content.foodName)}`);
                        const foodDetails = foodResponse.data;

                        return {
                            ...content,
                            food_image_url: foodDetails.image_url,
                            food_weight: foodDetails.weight,
                            food_calories: foodDetails.calories,
                            food_carbs: foodDetails.carbohydrates,
                            food_proteins: foodDetails.proteins,
                            food_fats: foodDetails.fats
                        };
                    } catch (error) {
                        return content;
                    }
                })
            );

            return enrichedContents;

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

    async getDetailsWithInstitution(contentId) {
        try {
            const content = await this.findById(contentId);

            if (!content) {
                throw new Error(`Conteúdo com ID ${contentId} não encontrado.`);
            }

            const machineId = content.machineId;
            const machineResponse = await axios.get(`http://localhost:3010/machines/${machineId}`);
            const institutionId = machineResponse.data.institutionId;
            return {
                ...content,
                institutionId: institutionId
            };

        } catch (err) {
            throw err;
        }
    }
}

export default new ContentService();