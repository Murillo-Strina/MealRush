var express = require("express")
var app = express();
var router = express.Router();
const FoodController = require('../Controllers/FoodController')



router.get('/foods', FoodController.GetAllFoods);
router.get('/foods/:id', FoodController.GetFoodById);



module.exports = router;