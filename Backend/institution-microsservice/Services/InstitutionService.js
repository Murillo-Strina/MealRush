import db from "../Database/connection.js";

class InstitutionService {
    async FindAll() {
        try {
            const [institutions] = await db.promise().query("SELECT * FROM institution");
            return institutions;
        } catch (err) {
            throw err;
        }
    }

    async FindByName(name) {
        try {
            const [rows] = await db.promise().query("SELECT * FROM institution WHERE name = ?", [name]);
            return rows[0]; 
        } catch (err) {
            throw err;
        }
    }

    async FindById(id) {
        try {
            const [rows] = await db.promise().query("SELECT * FROM institution WHERE id = ?", [id]);
            return rows[0]; 
        } catch (err) {
            throw err;
        }
    }

    async Delete(id) {
        try {
            await db.promise().query("DELETE FROM institution WHERE id = ?", [id]);
        } catch (err) {
            throw err;
        }
    }

    async Create(name, registration_number) {
        try {
            return await db.promise().query(
                "INSERT INTO institution(name, registration_number) VALUES (?, ?)",
                [name, registration_number]
            );
        } catch (err) {
            throw err;
        }
    }

    async Update(id, name, registration_number) {
        try {
            return await db.promise().query(
                "UPDATE institution SET name = ?, registration_number = ? WHERE id = ?",
                [name, registration_number, id]
            );
        } catch (err) {
            throw err;
        }
    }

    
}

export default new InstitutionService();
