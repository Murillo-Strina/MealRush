import express from 'express';
const router = express.Router();
import foodController from '../Controllers/FoodController.js';



router.get('/foods', foodController.GetAllFoods);
router.get('/foods/:id', foodController.GetFoodById);
router.delete('/foods/:id', foodController.Delete);
router.post('/foods/', foodController.Create);
router.put('/foods/:id', foodController.Update);



export default router;