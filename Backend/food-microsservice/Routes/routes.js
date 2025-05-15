let express = require("express")
let app = express();
let router = express.Router();
const FoodController = require('../Controllers/foodController')



router.get('/foods', FoodController.GetAllFoods);
router.get('/foods/:id', FoodController.GetFoodById);
router.delete('/foods/:id', FoodController.Delete);
router.post('/foods/', FoodController.Create);
router.put('/foods/:id', FoodController.Update);



module.exports = router;