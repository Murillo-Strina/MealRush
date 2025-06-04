import contentService from '../Services/ContentService.js';
import foodService from '../../food-microsservice/Services/FoodService.js';
import { publishEvent } from '../../event-bus/index.js';

class ContentController {

    async GetAllContents(req, res){
        try {
            const contents = await contentService.findAll();
            if (contents.length === 0) {
                return res.status(404).json({ 'error': 'Nenhum conteúdo de máquina encontrado' });
            }
            res.status(200).json(contents);
        } catch (err) {
            console.error("Erro ao buscar o conteúdo das máquinas:", err);
            return res.status(500).json({ 'error': 'Erro ao buscar os dados' });
        }
    }

    async GetContentById(req, res) {
        try {
            const id = req.params.id;
            const content = await contentService.findById(id);
            if (!content) {
                return res.status(404).json({ 'error': `O conteúdo da máquina com ID ${id} não foi encontrado` });
            }
            res.status(200).json(content);
        } catch (err) {
            console.error("Erro ao buscar o conteúdo da máquina:", err);
            return res.status(500).json({ 'error': 'Erro ao buscar os dados' });
        }
    }

    async Create(req, res) {
        try {
            const { foodName, machineId, institutionId, salePrice, purchasePrice, quantity, profit } = req.body;

            if (!foodName || foodName.trim() === "" || !machineId || !institutionId || salePrice === undefined || purchasePrice === undefined || quantity === undefined || profit === undefined) {
                return res.status(400).json({ 'error': 'Todos os campos são obrigatórios' });
            }

            if (salePrice < 0 || purchasePrice < 0 || quantity < 0 || profit < 0) {
                return res.status(400).json({ 'error': 'Os valores de preço, quantidade e lucro não podem ser negativos' });
            }

            const foodExists = await foodService.FindByName(foodName.trim());
            if (!foodExists) {
                return res.status(404).json({ 'error': `Comida com nome ${foodName.trim()} não encontrada` });
            }

            const insertedId = await contentService.create(foodName.trim(), machineId, institutionId, salePrice, purchasePrice, quantity, profit);

            if (!insertedId) {
                return res.status(500).json({ 'error': 'Falha ao criar o conteúdo da máquina, ID não retornado.' });
            }

            const createdContent = await contentService.findById(insertedId);

            if (!createdContent) {
                return res.status(500).json({ 'error': 'Conteúdo criado mas não pôde ser encontrado.' });
            }

            publishEvent('content.created', createdContent);
            return res.status(201).json(createdContent);
        } catch (err) {
            console.error("Erro ao criar o conteúdo da máquina:", err);
            return res.status(500).json({ 'error': 'Erro ao criar o conteúdo' });
        }
    }

    async Update(req, res) {
        try {
            const { foodName, salePrice, purchasePrice, quantity, profit } = req.body;
            const { id, machineId, institutionId } = req.params;

            if (!foodName && !salePrice && !purchasePrice && !quantity && !profit) {
                return res.status(400).json({ 'error': 'Nenhum dado fornecido para atualização' });
            }

            if (salePrice < 0 || purchasePrice < 0 || quantity < 0 || profit < 0) {
                return res.status(400).json({ 'error': 'Os valores de preço, quantidade e lucro não podem ser negativos' });
            }

            const updatedRows = await contentService.update(foodName.trim(), machineId, institutionId, salePrice, purchasePrice, quantity, profit, id, machineId, institutionId);

            if (updatedRows === 0) {
                return res.status(404).json({ 'error': `Conteúdo com ID ${id} não encontrado ou não foi atualizado` });
            }

            const updatedContent = await contentService.findById(id);

            if (!updatedContent) {
                return res.status(500).json({ 'error': 'Conteúdo atualizado mas não pôde ser encontrado.' });
            }

            publishEvent('content.updated', updatedContent);
            return res.status(200).json(updatedContent);
        } catch (err) {
            console.error("Erro ao atualizar o conteúdo da máquina:", err);
            return res.status(500).json({ 'error': 'Erro ao atualizar o conteúdo' });
        }
    }

    async Delete(req, res) {
        try {
            const { id, machineId, institutionId } = req.params;

            const deletedRows = await contentService.delete(id, machineId, institutionId);

            if (deletedRows === 0) {
                return res.status(404).json({ 'error': `Conteúdo com ID ${id} não encontrado` });
            }

            publishEvent('content.deleted', { id, machineId, institutionId });
            return res.status(204).send();
        } catch (err) {
            console.error("Erro ao deletar o conteúdo da máquina:", err);
            return res.status(500).json({ 'error': 'Erro ao deletar o conteúdo' });
        }
    }

    async GetContentByInstitutionIDAndMachineID(req, res) {
        try {
            const { institutionId, machineId } = req.params;
            const contents = await contentService.findByInstitutionIdAndMachineId(institutionId, machineId);
            if (contents.length === 0) {
                return res.status(404).json({ 'error': `Nenhum conteúdo encontrado para a máquina ID ${machineId} na instituição ID ${institutionId}` });
            }
            res.status(200).json(contents);
        } catch (err) {
            console.error("Erro ao buscar o conteúdo da máquina por instituição e máquina:", err);
            return res.status(500).json({ 'error': 'Erro ao buscar os dados' });
        }
    }
}

export default new ContentController();