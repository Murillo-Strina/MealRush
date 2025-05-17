import machineService from '../Services/MachineService.js';

class MachineController{

   async GetAllMachines(req, res) {
       try {
        const machines = await machineService.findAll();

        if (machines.length === 0){
            return res.status(404).json({'Error': 'Nenhuma maquina encontrada'});
        }
        res.status(200).json(machines);
       } catch (err) {
        console.error("Erro ao buscar as maquinas:", err);
        return res.status(500).json({'Error': 'Erro ao buscar os dados'});
       }
    } 

    async GetMachineById(req, res){
        try {
            const id = req.params.id;
            const machine = await machineService.findById(id);
            if (machine.length === 0) {
                return res.status(404).json({'Error': 'A maquina com id ' + id + ' não foi encontrada'});
            }
            res.status(200).json(machine);
        } catch (err) {
            console.error("Erro ao buscar a maquina:", err);
            return res.status(500).json({'Error': 'Erro ao buscar os dados'});
        }
    }

    async Create(req, res){
        try {
           const {amountItems, statusId, lastMaintenance, lastFill, rent} = req.body;
           const machineExists = await machineService.findById(id);

        if (machineExists) {
               res.status(400).json({'Error': 'Nao pode ter 2 maquinas com o mesmo id'});
               return;
           }

        await machineService.create(amountItems, statusId, lastMaintenance, lastFill, rent);

        if (amountItems == undefined) {
                res.status(400).json({'Error': 'A quantidade de itens da maquina deve ser preenchida'});
        }

        const createdMachine = await machineService.findById(id);

        return res.status(200).json(createdMachine);
        } catch (err) {
            console.error("Erro ao criar a maquina:", err);
            return res.status(500).json({'Error': 'Erro ao criar a maquina'});
        }
    }

    async Delete(req, res) {
       try {
        const id = req.params.id;
        await machineService.delete(id);
        return res.status(200).json({'Message': 'Maquina de id: ' +id+ 'deletada com sucesso'});
       } catch (err) {
        console.error("Erro ao deletar a maquina:", err);
        return res.status(500).json({'Error': 'Erro ao deletar a maquina'});
       }
    }

    async Update(req, res) {
        try {
          const id = req.params.id;
          const {amountItems, statusId, lastMaintenance, lastFill, rent} = req.body;
          
        const machineExists = await machineService.findById(id);
        if (machineExists.length === 0) {
            return res.status(404).json({'Error': 'A maquina com id ' + id + ' não foi encontrada'});
        }
        await machineService.update(id, amountItems, statusId, lastMaintenance, lastFill, rent);

        const updatedMachine = await machineService.findById(id);
        return res.status(200).json(updatedMachine);

        } catch (err) {
            console.error("Erro ao atualizar a maquina:", err);
            return res.status(500).json({'Error': 'Erro ao atualizar a maquina'});
            
        }
    }

}

export default new MachineController();