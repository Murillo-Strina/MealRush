import institutionService from '../Services/InstitutionService.js';
import { publishEvent } from '../../event-bus/index.js';

class InstitutionController {

    async GetAllInstitutions(req, res) {
        try {
            const institutions = await institutionService.FindAll();

            if (institutions.length === 0) {
                return res.status(404).json({ 'Error': 'Nenhuma instituição encontrada' });
            }

            res.status(200).json(institutions);
        } catch (err) {
            console.error("Erro ao buscar instituições:", err);
            return res.status(500).json({ 'Error': 'Erro ao buscar os dados' });
        }
    }

    async GetInstitutionById(req, res) {
        try {
            const id = req.params.id;
            const institution = await institutionService.FindById(id);

            if (!institution) {
                return res.status(404).json({ 'Error': `Instituição com id ${id} não encontrada` });
            }

            res.status(200).json(institution);
        } catch (err) {
            console.error("Erro ao buscar instituição:", err);
            return res.status(500).json({ 'Error': 'Erro ao buscar os dados' });
        }
    }

    // async GetInstitutionByName(req, res) {
    //     try {
    //         const name = req.params.name.trim();
    //         if (!name) {
    //             return res.status(400).json({ 'Error': 'O nome da instituição deve ser preenchido' });
    //         }

    //         const institution = await institutionService.FindByName(name);
    //         if (!institution) {
    //             return res.status(404).json({ 'Error': `Instituição com nome "${name}" não encontrada` });
    //         }

    //         res.status(200).json(institution);
    //     } catch (err) {
    //         console.error("Erro ao buscar instituição pelo nome:", err);
    //         return res.status(500).json({ 'Error': 'Erro ao buscar os dados' });
    //     }
    // }

    async Create(req, res) {
        try {
            const { name, registration_number } = req.body;

            if (!name || name.trim() === "") {
                return res.status(400).json({ 'Error': 'O nome da instituição deve ser preenchido' });
            }

            if (!registration_number || registration_number.length !== 14) {
                return res.status(400).json({ 'Error': 'O número de registro deve conter exatamente 14 dígitos numéricos' });
            }

            const existingInstitution = await institutionService.FindByName(name.trim());

            if (existingInstitution) {
                return res.status(409).json({ 'Error': 'Já existe uma instituição com esse nome' });
            }

            await institutionService.Create(name.trim(), registration_number);

            const createdInstitution = await institutionService.FindByName(name.trim());

            publishEvent('institution.created', createdInstitution);
            return res.status(201).json(createdInstitution);
        } catch (error) {
            console.error("Erro ao criar a instituição:", error);
            return res.status(500).json({ 'Error': 'Erro ao criar a instituição' });
        }
    }

    async Delete(req, res) {
        try {
            const id = req.params.id;
            await institutionService.Delete(id);

            publishEvent('institution.deleted', { id });
            return res.status(200).json({ 'Message': `Instituição com id ${id} deletada com sucesso` });
        } catch (error) {
            console.error("Erro ao deletar a instituição:", error);
            return res.status(500).json({ 'Error': 'Erro ao deletar a instituição' });
        }
    }

    async Update(req, res) {
        try {
            const id = req.params.id;
            const { name, registration_number } = req.body;

            const institutionToUpdate = await institutionService.FindById(id);

            if (!institutionToUpdate) {
                return res.status(404).json({ 'Error': 'Instituição não encontrada para atualização' });
            }

            if (name) { 
                const existingInstitution = await institutionService.FindByName(name.trim());
                if (existingInstitution && existingInstitution.id !== Number(id)) {
                    return res.status(409).json({ 'Error': 'Já existe outra instituição com esse nome' });
                }
            }

            const newName = name ? name.trim() : institutionToUpdate.name;
            const newRegistrationNumber = registration_number || institutionToUpdate.registration_number;

            await institutionService.Update(id, newName, newRegistrationNumber);

            const updatedInstitution = await institutionService.FindById(id);
            publishEvent('institution.updated', updatedInstitution);
            return res.status(200).json(updatedInstitution);
        } catch (error) {
            console.error("Erro ao atualizar a instituição:", error);
            return res.status(500).json({ 'Error': 'Erro ao atualizar a instituição' });
        }
    }
}

export default new InstitutionController();
