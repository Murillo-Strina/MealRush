import db from "../Database/connection.js";

class MachineService {

    async findAll() {
        try {
            const [machines] = await db.promise().query("SELECT * FROM machines");
            return machines;
        } catch (err) {
            throw err;
        }
    }
    
    async findById(id){

        try {
            const machine = await db.promise().query("SELECT * FROM machines WHERE id = ?", [id]);
            return machine[0];
        } catch (err) { 
            throw err;
        }
    }

    async findByInstitutionId(institutionId){
       try {
            const machine = await db.promise().query("SELECT * FROM machines WHERE id = ?", [institutionId]);
            return machine[0];
        } catch (err) { 
            throw err;
        }
    }

    async delete(id) {
        try {
            await db.promise().query("DELETE FROM machines WHERE id = ?", [id]);
        } catch (err) {
            throw err;
        }
    }

    async create(amountItems, statusId, lastMaintenance, lastFill, rent){
        try {
            return await db.promise().query("INSERT INTO machines(amountItems, statusId, lastMaintenance, lastFill, rent) values (?, ?, ?, ?, ?)",
                [amountItems, statusId, lastMaintenance, lastFill, rent]);  
        } catch (err) {
            throw err;
        }
    }
}

export default new MachineService();