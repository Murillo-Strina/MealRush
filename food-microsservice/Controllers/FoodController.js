const foodService = require('../services/FoodService');

class FoodController {

    async GetAllFoods(req, res) {
        try {
            const foods = await foodService.FindAll();
            res.status(200).json(foods); // Status 200 para sucesso
        } catch (err) {
            console.error("Erro ao buscar os alimentos:", err);
            res.status(500).send("Erro ao buscar os dados"); // Status 500 para erro no servidor
        }
    }
}

module.exports = new FoodController();
