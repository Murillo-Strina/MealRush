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

    async findMachineByInstitutionId(institutionId){
       try {
            const machinesInstitute = await db.promise().query("SELECT * FROM machine WHERE institutionId = ?", [institutionId]);
            return machinesInstitute;
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

    async create(institutionId, aluguel){
        try {
            return await db.promise().query("INSERT INTO machine(institutionId, aluguel) values (?, ?)",
                [institutionId, aluguel]);  
        } catch (err) {
            throw err;
        }
    }

    async update(institutionId, aluguel, id) {
        try {
            return await db.promise().query("UPDATE machine SET institutionId = ?, aluguel = ? where id = ?"
                ,[institutionId, aluguel, id]);
        } catch (err) {
            throw err;
        }
    }
    
    async updateStatus(statusId, id) {
        try {
            return await db.promise().query("UPDATE machine SET statusId = ? where id = ?"
                ,[statusId, id]);
        } catch (err) {
            throw err;
        }
    }

    async GetMachinesByInstitution(institutionId) {
        try {
            const [machines] = await db.promise().query(`
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
            `);
            return machines;
        } catch (err) {
            throw err;
        }
    }

    
}

export default new MachineService();