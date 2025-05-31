import db from "../Database/connection.js";

class FeedbackService {
    async findAll() {
        try {
            const [rows] = await db.promise().query("SELECT id, `comment`, occurrency_date, institutionId FROM feedback");
            return rows;
        } catch (err) {
            console.error("Erro no Service ao buscar todos os feedbacks:", err);
            throw err;
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.promise().query("SELECT id, `comment`, occurrency_date, institutionId FROM feedback WHERE id = ?", [id]);
            return rows[0];
        } catch (err) {
            console.error(`Erro no Service ao buscar feedback por ID ${id}:`, err);
            throw err;
        }
    }

    async findByInstitutionId(institutionId) {
        try {
            const [rows] = await db.promise().query("SELECT id, `comment`, occurrency_date, institutionId FROM feedback WHERE institutionId = ?", [institutionId]);
            return rows;
        } catch (err) {
            console.error(`Erro no Service ao buscar feedbacks pela institutionId ${institutionId}:`, err);
            throw err;
        }
    }

    async findByInstitutionName(name) {
        try {
            const query = `
                SELECT 
                    inst.name AS institutionName,
                    f.id AS feedbackId,
                    f.comment,
                    f.occurrency_date,
                    f.institutionId 
                FROM 
                    institution inst
                INNER JOIN 
                    feedback f ON inst.id = f.institutionId
                WHERE 
                    inst.name = ?`;
            const [rows] = await db.promise().query(query, [name]);
            return rows;
        } catch (err) {
            console.error(`Erro no Service ao buscar feedbacks pelo nome da instituição "${name}":`, err);
            throw err;
        }
    }

    async create({ comment, occurrency_date, institutionId }) {
        try {
            const [result] = await db.promise().query(
                "INSERT INTO feedback (`comment`, occurrency_date, institutionId) VALUES (?, ?, ?)",
                [comment, occurrency_date, institutionId]
            );
            return result.insertId;
        } catch (err) {
            console.error("Erro no Service ao criar feedback:", err);
            throw err;
        }
    }

    async update(id, { comment, occurrency_date, institutionId }) {
        try {
            let query = "UPDATE feedback SET ";
            const params = [];
            const fieldsToUpdate = [];

            if (comment !== undefined) {
                fieldsToUpdate.push("`comment` = ?");
                params.push(comment);
            }
            if (occurrency_date !== undefined) {
                fieldsToUpdate.push("occurrency_date = ?");
                params.push(occurrency_date);
            }
            if (institutionId !== undefined) {
                fieldsToUpdate.push("institutionId = ?");
                params.push(institutionId);
            }

            if (fieldsToUpdate.length === 0) {
                return 0;
            }

            query += fieldsToUpdate.join(", ");
            query += " WHERE id = ?";
            params.push(id);

            const [result] = await db.promise().query(query, params);
            return result.affectedRows;
        } catch (err) {
            console.error(`Erro no Service ao atualizar feedback ID ${id}:`, err);
            throw err;
        }
    }

    async delete(id) {
        try {
            const [result] = await db.promise().query("DELETE FROM feedback WHERE id = ?", [id]);
            return result.affectedRows;
        } catch (err) {
            console.error(`Erro no Service ao deletar feedback ID ${id}:`, err);
            throw err;
        }
    }
}

export default new FeedbackService();