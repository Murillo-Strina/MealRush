const foodService = require('../Services/FoodService.js')

class FoodController {

    async GetAllFoods(req, res) {
        try {
            const foods = await foodService.FindAll()

            if(foods.length === 0){
                return res.status(404).json({'Error': 'Nenhuma comida encontrada'}) 
            }
            res.status(200).json(foods) 
        } catch (err) {
            console.error("Erro ao buscar os alimentos:", err)
            return res.status(500).json({'Error': 'Erro ao buscar os dados'}) 
        }
    }

    async GetFoodById(req, res){
        try {
            const id = req.params.id
            const food = await foodService.FindById(id)
            if(food.length === 0){  
                return res.status(404).json({'Error': 'A comida com id ' + id + ' não foi encontrada'}) 
            }
            res.status(200).json(food) 
        } catch (err) {
            console.error("Erro ao buscar o alimento:", err)
            return res.status(500).json({'Error': 'Erro ao buscar os dados'}) 
        }
    }

    async Create(req,res){
        try {
            const {name, calories, carbs, proteins, fats, weight, imageUrl} = req.body

            const foodExists = await foodService.FindByName(name)

            if(foodExists){
                res.status(400).json({'Error': 'Nao pode ter 2 comidas com o mesmo nome'})
                return
            }

            await foodService.Create(name, calories, carbs, proteins, fats, weight, imageUrl)

            if(name == undefined){
                res.status(400).json({'Error': 'O nome da comida deve ser preenchido'})
            }
            
            const createdFood = await foodService.FindByName(name)
            
            return res.status(200).json(createdFood) 
    
        } catch (error) {
            console.error("Erro ao criar o alimento:", err)
            return res.status(500).json({'Error': 'Erro ao criar o alimento'}) 
            
        }
    }

    async Delete(req,res){
        try {
            const id = req.params.id
            await foodService.Delete(id)
            return res.status(200).json({'Message': `Alimento com id ${id} deletado com sucesso`}) 
    
        } catch (error) {
            console.error("Erro ao deletar o alimento:", err)
            return res.status(500).json({'Error': 'Erro ao deletar o alimento'}) 
            
        }
    }

    async Update(req, res) {
        try {
            const id = req.params.id;
            const { name, calories, carbs, proteins, fats, weight, imageUrl } = req.body;
    
            const oldFood = await foodService.FindById(id)

            console.log(oldFood)
            if(oldFood[0].name == name){
                return res.status(400).json({ 'Error': 'Já existe uma comida com esse nome' });
            }
            await foodService.Update(id, name, calories, carbs, proteins, fats, weight, imageUrl);
    
            const updatedFood = await foodService.FindById(id);
            return res.status(200).json(updatedFood);
        } catch (error) {
            console.error("Erro ao atualizar o alimento:", error);
            return res.status(500).json({ 'Error': 'Erro ao atualizar o alimento' });
        }
    }
}

module.exports = new FoodController()
