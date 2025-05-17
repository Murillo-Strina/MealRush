var express = require("express")
var app = express();
var router = express.Router();
const FoodController = require('../Controllers/FoodController')



router.get('/foods', FoodController.GetAllFoods);
router.get('/foods/:id', FoodController.GetFoodById);
router.delete('/foods/:id', FoodController.Delete);
router.post('/foods/', FoodController.Create);
router.put('/foods/:id', FoodController.Update);



module.exports = router;