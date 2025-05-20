import db from "../Database/connection.js";

class MachineService {

    async findAll() {
        try {
            const [machines] = await db.promise().query("SELECT * FROM machine");
            return machines;
        } catch (err) {
            throw err;
        }
    }
    
    async findById(id){

        try {
            const machine = await db.promise().query("SELECT * FROM machine WHERE id = ?", [id]);
            return machine[0];
        } catch (err) { 
            throw err;
        }
    }

    async findByInstitutionId(institutionId){
       try {
            const machine = await db.promise().query("SELECT * FROM machine WHERE id = ?", [institutionId]);
            return machine[0];
        } catch (err) { 
            throw err;
        }
    }

    async delete(id) {
        try {
            await db.promise().query("DELETE FROM machine WHERE id = ?", [id]);
        } catch (err) {
            throw err;
        }
    }

    async create(amountItems, statusId, lastMaintenance, lastFill, rent){
        try {
            return await db.promise().query("INSERT INTO machine(qtd_itens, statusId, dt_ultima_manutencao, dt_ultimo_abastecimento, aluguel) values (?, ?, ?, ?, ?)",
                [amountItems, statusId, lastMaintenance, lastFill, rent]);  
        } catch (err) {
            throw err;
        }
    }

    async update(id, amountItems, statusId, lastMaintenance, lastFill, rent) {
        try {
            return await db.promise().query("UPDATE machine SET qtd_itens = ?, statusId = ?, dt_ultima_manutencao = ?, dt_ultimo_abastecimento = ?, aluguel = ? where id = ?"
                ,[amountItems, statusId, lastMaintenance, lastFill, rent, id]);
        } catch (err) {
            throw err;
        }
    }
    
}

export default new MachineService();