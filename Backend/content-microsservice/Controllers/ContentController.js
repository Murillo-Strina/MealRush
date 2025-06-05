import contentService from '../Services/ContentService.js';
import foodService from '../../food-microsservice/Services/FoodService.js';
import { publishEvent } from '../../event-bus/index.js';

class ContentController {
    async getAllContents(req, res) {
        try {
            const contents = await contentService.findAll();
            if (contents.length === 0) {
                return res.status(404).json({ 'Error': 'Nenhum conteúdo encontrado' });
            }
            return res.status(200).json(contents);
        } catch (err) {
            console.error("Erro ao buscar os conteúdos:", err);
            return res.status(500).json({ 'Error': 'Erro ao buscar os dados' });
        }
    }

    async getContentById(req, res) {
        try {
            const id = req.params.id;
            const content = await contentService.findById(id);
            if (!content) {
                return res.status(404).json({ 'Error': `Conteúdo com id ${id} não encontrado` });
            }
            return res.status(200).json(content);
        } catch (err) {
            console.error("Erro ao buscar o conteúdo:", err);
            return res.status(500).json({ 'Error': 'Erro ao buscar os dados' });
        }
    }

    async create(req, res) {
        try {
            const { qtdItens, sales, machineId, institutionId, foodName, sellprice, buyprice } = req.body;

            if ([qtdItens, sales, sellprice, buyprice, machineId, institutionId].some(v => v < 0)) {
                return res.status(400).json({ 'Error': 'Valores não podem ser negativos' });
            }

            const food = await foodService.FindByName(foodName.trim());
            if (!food) {
                return res.status(404).json({ 'Error': `Comida com nome '${foodName}' não encontrada` });
            }

            if (Number(food.sellprice) !== Number(sellprice) || Number(food.buyprice) !== Number(buyprice)) {
                return res.status(400).json({
                    'Error': `Preços inválidos para a comida '${foodName}'.`
                });
            }

            const insertedId = await contentService.create(qtdItens, sales, machineId, institutionId, foodName, sellprice, buyprice);

            const contentCreated = await contentService.findById(insertedId);
            if (!contentCreated) {
                return res.status(500).json({ 'Error': 'Conteúdo criado mas não pôde ser localizado.' });
            }

            publishEvent('content.created', contentCreated);
            return res.status(201).json(contentCreated);
        } catch (err) {
            console.error("Erro ao criar o conteúdo:", err);
            return res.status(500).json({ 'Error': 'Erro ao criar o conteúdo' });
        }
    }


   async update(req, res) {
        try {
            const { id, machineId, institutionId } = req.params;
            const { qtdItens, sales, foodName, sellprice, buyprice } = req.body;

            const content = await contentService.findById(id);
            if (!content) {
                return res.status(404).json({ 'Error': `Conteúdo com id ${id} não encontrado` });
            }

            if ([qtdItens, sales, sellprice, buyprice].some(v => v < 0)) {
                return res.status(400).json({ 'Error': 'Valores não podem ser negativos' });
            }

            const food = await foodService.FindByName(foodName.trim());
            if (!food) {
                return res.status(404).json({ 'Error': `Comida com nome '${foodName}' não encontrada` });
            }

            if (Number(food.sellprice) !== Number(sellprice) || Number(food.buyprice) !== Number(buyprice)) {
                return res.status(400).json({
                    'Error': `Preços inválidos para a comida '${foodName}'.`
                });
            }

            await contentService.update(qtdItens, sales, foodName, sellprice, buyprice, id, machineId, institutionId);
            const updatedContent = await contentService.findById(id);

            publishEvent('content.updated', updatedContent);
            return res.status(200).json(updatedContent);
        } catch (err) {
            console.error("Erro ao atualizar o conteúdo:", err);
            return res.status(500).json({ 'Error': 'Erro ao atualizar o conteúdo' });
        }
    }



    async delete(req, res) {
        try {
            const id = req.params.id;
            await contentService.delete(id);
            publishEvent('content.deleted', { id });
            return res.status(200).json({ 'Message': `Conteúdo com id ${id} deletado com sucesso` });
        } catch (err) {
            console.error("Erro ao deletar o conteúdo:", err);
            return res.status(500).json({ 'Error': 'Erro ao deletar o conteúdo' });
        }
    }
}

export default new ContentController();
