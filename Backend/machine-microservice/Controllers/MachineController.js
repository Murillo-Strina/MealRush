import machineService from '../Services/MachineService.js';

class MachineController {

    async GetAllMachines(req, res) {
        try {
            const machines = await machineService.findAll();

            if (machines.length === 0) {
                return res.status(404).json({ 'message': 'Nenhuma máquina encontrada' });
            }

            res.status(200).json(machines);
            
    } catch (err) {
        console.error("Erro no Controller ao buscar as máquinas:", err.message); // VERIFIQUE ESTA SAÍDA NO SEU CONSOLE
        return res.status(500).json({ 'error': 'Erro interno ao buscar os dados das máquinas' });
    }
    }

    async GetMachineById(req, res) {
        try {
            const { id } = req.params;
            const machine = await machineService.findById(id);

            if (!machine) {
                return res.status(404).json({ 'message': `A máquina com id ${id} não foi encontrada` });
            }

            res.status(200).json(machine);
        } catch (err) {
            console.error(`Erro no Controller ao buscar a máquina ${id}:`, err.message);
            return res.status(500).json({ 'error': 'Erro interno ao buscar os dados da máquina' });
        }
    }

    async Create(req, res) {
        try {
            const { institutionId, stock, status, lastMaintenance, lastFill, rent } = req.body;

            if (institutionId === undefined || stock === undefined || status === undefined || lastMaintenance === undefined || lastFill === undefined || rent === undefined) {
                return res.status(400).json({ 'error': 'Todos os campos são obrigatórios' });
            }

            const insertedId = await machineService.create(institutionId, stock, status, lastMaintenance, lastFill, rent);

            if (!insertedId) {
                return res.status(500).json({ 'error': 'Falha ao criar a máquina, ID não retornado.' });
            }
            
            const createdMachine = await machineService.findById(insertedId);

            if (!createdMachine) {
                return res.status(500).json({ 'error': 'Máquina criada mas não pôde ser encontrada.' });
            }

            return res.status(201).json(createdMachine);
        } catch (err) {
            console.error("Erro no Controller ao criar a máquina:", err.message);
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ 'error': `Falha ao criar máquina: institutionId '${req.body.institutionId}' não existe ou é inválido.` });
            }
            return res.status(500).json({ 'error': 'Erro interno ao criar a máquina' });
        }
    }

    async Delete(req, res) {
        try {
            const { id, institutionId } = req.params;
            const affectedRows = await machineService.delete(id, institutionId);

            if (affectedRows === 0) {
                return res.status(404).json({ 'message': `Máquina com id ${id} não encontrada para deletar` });
            }

            return res.status(200).json({ 'message': `Máquina com id ${id} deletada com sucesso` });
        } catch (err) {
            console.error(`Erro no Controller ao deletar a máquina ${req.params.id}:`, err.message);
            return res.status(500).json({ 'error': 'Erro interno ao deletar a máquina' });
        }
    }

    async Update(req, res) {
        try {
            const { id , institutionId} = req.params;
            const { stock, status, lastMaintenance, lastFill, rent } = req.body;

            if (stock === undefined && status === undefined && lastMaintenance === undefined && lastFill === undefined && rent === undefined) {
                return res.status(400).json({ 'error': 'Nenhum dado fornecido para atualização.' });
            }
            
            const existingMachine = await machineService.findById(id);
            if (!existingMachine) {
                return res.status(404).json({ 'message': `A máquina com id ${id} não foi encontrada para atualizar` });
            }

            const newstock = stock !== undefined ? stock : existingMachine.stock;
            const newStatus = status !== undefined ? status : existingMachine.status;
            const newLastMaintenance = lastMaintenance !== undefined ? lastMaintenance : existingMachine.lastMaintenance;
            const newLastFill = lastFill !== undefined ? lastFill : existingMachine.lastFill;
            const newRent = rent !== undefined ? rent : existingMachine.rent;

            const affectedRows = await machineService.update(newstock, newStatus, newLastMaintenance, newLastFill, newRent, id, institutionId);

            if (affectedRows === 0) {
                 const notActuallyUpdatedMachine = await machineService.findById(id);
                 return res.status(200).json(notActuallyUpdatedMachine);
            }
            
            const updatedMachine = await machineService.findById(id);
            return res.status(200).json(updatedMachine);
        } catch (err) {
            console.error(`Erro no Controller ao atualizar a máquina ${req.params.id}:`, err.message);
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ 'error': `Falha ao atualizar máquina: institutionId '${req.body.institutionId}' não existe ou é inválido.` });
            }
            return res.status(500).json({ 'error': 'Erro interno ao atualizar a máquina' });
        }
    }

    async GetMachinesByInstitutionId(req, res) {
        try {
            const { institutionId } = req.params;
            const machines = await machineService.getMachinesByInstitution(institutionId);

            if (machines.length === 0) {
                return res.status(404).json({ 'message': `Nenhuma máquina encontrada para a instituição com id ${institutionId}` });
            }

            res.status(200).json(machines);
        } catch (err) {
            console.error(`Erro no Controller ao buscar máquinas por instituição ${req.params.institutionId}:`, err.message);
            return res.status(500).json({ 'error': 'Erro interno ao buscar os dados das máquinas por instituição' });
        }
    }
}

export default new MachineController();