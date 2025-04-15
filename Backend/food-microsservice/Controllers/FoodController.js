const foodService = require('../Services/FoodService.js');

class FoodController {

    async GetAllFoods(req, res) {
        try {
            const foods = await foodService.FindAll();

            if(foods.length === 0){
                return res.status(404).json({'Error': 'Nenhuma comida encontrada'}); 
            }
            res.status(200).json(foods); 
        } catch (err) {
            console.error("Erro ao buscar os alimentos:", err);
            return res.status(500).json({'Error': 'Erro ao buscar os dados'}); 
        }
    }

    async GetFoodById(req, res){
        try {
            const id = req.params.id;
            const food = await foodService.FindById(id);
            if(food.length === 0){  
                return res.status(404).json({'Error': 'A comida com id ' + id + ' não foi encontrada'}); 
            }
            res.status(200).json(food); 
        } catch (err) {
            console.error("Erro ao buscar os alimentos:", err);
            return res.status(500).json({'Error': 'Erro ao buscar os dados'}); 
        }
    }
}

module.exports = new FoodController();
