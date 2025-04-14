const foodService = require('../Services/FoodService.js');

class FoodController {

    async GetAllFoods(req, res) {
        try {
            const foods = await foodService.FindAll();

            if(foods.length === 0){
                return res.status(404).json({'Message': 'Nenhuma comida encontrada'}); 
            }
            res.status(200).json(foods); 
        } catch (err) {
            console.error("Erro ao buscar os alimentos:", err);
            res.status(500).send("Erro ao buscar os dados"); 
        }
    }

    async GetFoodById(req, res){
        try {
            const id = req.params.id;
            const food = await foodService.FindById(id);
            if(food.length === 0){  
                return res.status(404).json({'Message': 'A comida com id ' + id + ' não foi encontrada'}); 
            }
            res.status(200).json(food); 
        } catch (err) {
            console.error("Erro ao buscar os alimentos:", err);
            res.status(500).send("Erro ao buscar os dados"); 
        }
    }
}

module.exports = new FoodController();
