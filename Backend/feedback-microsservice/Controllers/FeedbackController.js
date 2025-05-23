import feedbackService from '../Services/FeedbackService.js';

class FeedbackController {
    async getAllFeedbacks(req, res) {
        try {
            const feedbacks = await feedbackService.findAll();
            if (feedbacks.length === 0) {
                return res.status(404).json({ message: 'Nenhum feedback encontrado' });
            }
            res.status(200).json(feedbacks);
        } catch (err) {
            console.error("Erro no Controller ao buscar todos os feedbacks:", err.message);
            return res.status(500).json({ error: 'Erro interno ao buscar os dados dos feedbacks' });
        }
    }

    async getFeedbackById(req, res) {
        try {
            const { id } = req.params;
            const feedback = await feedbackService.findById(id);
            if (!feedback) {
                return res.status(404).json({ message: `Feedback com id ${id} não encontrado` });
            }
            res.status(200).json(feedback);
        } catch (err) {
            console.error(`Erro no Controller ao buscar feedback por ID ${req.params.id}:`, err.message);
            return res.status(500).json({ error: 'Erro interno ao buscar os dados do feedback' });
        }
    }

    async getFeedbacksByInstitutionId(req, res) {
        try {
            const { institutionId } = req.params;
            const feedbacks = await feedbackService.findByInstitutionId(institutionId);
            if (feedbacks.length === 0) {
                return res.status(404).json({ message: `Nenhum feedback encontrado para a instituição com id ${institutionId}` });
            }
            res.status(200).json(feedbacks);
        } catch (err) {
            console.error(`Erro no Controller ao buscar feedbacks por institutionId ${req.params.institutionId}:`, err.message);
            return res.status(500).json({ error: 'Erro interno ao buscar os dados dos feedbacks' });
        }
    }

    // NOVO MÉTODO ADICIONADO
    async getFeedbacksByInstitutionName(req, res) {
        try {
            const { name } = req.params; // Espera o nome como parâmetro de rota
            const feedbacks = await feedbackService.findByInstitutionName(name);

            if (!feedbacks || feedbacks.length === 0) {
                return res.status(404).json({ message: `Nenhum feedback encontrado para a instituição com nome '${name}'` });
            }
            res.status(200).json(feedbacks);
        } catch (err) {
            console.error(`Erro no Controller ao buscar feedbacks pelo nome da instituição "${req.params.name}":`, err.message);
            return res.status(500).json({ error: 'Erro interno ao buscar os dados dos feedbacks' });
        }
    }

    async createFeedback(req, res) {
        try {
            const { comment, occurrency_date, institutionId } = req.body;
            if (institutionId === undefined || occurrency_date === undefined) {
                return res.status(400).json({ error: 'Campos occurrency_date e institutionId são obrigatórios' });
            }

            const insertedId = await feedbackService.create({ comment, occurrency_date, institutionId });
            if (!insertedId) {
                return res.status(500).json({ error: 'Falha ao criar o feedback, ID não retornado.' });
            }
            
            const createdFeedback = await feedbackService.findById(insertedId);
            if (!createdFeedback) {
                return res.status(500).json({ error: 'Feedback criado mas não pôde ser encontrado.' });
            }
            return res.status(201).json(createdFeedback);
        } catch (err) {
            console.error("Erro no Controller ao criar feedback:", err.message);
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ error: `Falha ao criar feedback: institutionId '${req.body.institutionId}' não existe ou é inválido.` });
            }
            if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' || err.code === 'WARN_DATA_TRUNCATED' || err.message.includes('Incorrect date value')) {
                 return res.status(400).json({ error: `Formato de data inválido para o campo 'occurrency_date'. Use YYYY-MM-DD.` });
            }
            return res.status(500).json({ error: 'Erro interno ao criar o feedback' });
        }
    }

    async updateFeedback(req, res) {
        try {
            const { id } = req.params;
            const { comment, occurrency_date, institutionId } = req.body;

            if (comment === undefined && occurrency_date === undefined && institutionId === undefined) {
                return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
            }
            
            const existingFeedback = await feedbackService.findById(id);
            if (!existingFeedback) {
                return res.status(404).json({ message: `Feedback com id ${id} não encontrado para atualizar` });
            }

            await feedbackService.update(id, { comment, occurrency_date, institutionId });
            
            const updatedFeedback = await feedbackService.findById(id);
            return res.status(200).json(updatedFeedback);
        } catch (err) {
            console.error(`Erro no Controller ao atualizar o feedback ${req.params.id}:`, err.message);
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ error: `Falha ao atualizar feedback: institutionId '${req.body.institutionId}' não existe ou é inválido.` });
            }
            if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' || err.code === 'WARN_DATA_TRUNCATED' || err.message.includes('Incorrect date value')) {
                 return res.status(400).json({ error: `Formato de data inválido para o campo 'occurrency_date'. Use YYYY-MM-DD.` });
            }
            return res.status(500).json({ error: 'Erro interno ao atualizar o feedback' });
        }
    }

    async deleteFeedback(req, res) {
        try {
            const { id } = req.params;
            const existingFeedback = await feedbackService.findById(id);
             if (!existingFeedback) {
                return res.status(404).json({ message: `Feedback com id ${id} não encontrado para deletar` });
            }

            const affectedRows = await feedbackService.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: `Feedback com id ${id} encontrado, mas não pôde ser deletado (affectedRows = 0). Verifique o banco.` });
            }
            return res.status(200).json({ message: `Feedback com id ${id} deletado com sucesso` });
        } catch (err) {
            console.error(`Erro no Controller ao deletar o feedback ${req.params.id}:`, err.message);
            return res.status(500).json({ error: 'Erro interno ao deletar o feedback' });
        }
    }
}

export default new FeedbackController();