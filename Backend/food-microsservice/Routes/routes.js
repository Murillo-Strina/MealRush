import express, { Router } from "express";
const router = Router();
import { GetAllFoods, GetFoodById, Delete, Create, Update } from '../Controllers/foodController';



router.get('/foods', GetAllFoods);
router.get('/foods/:id', GetFoodById);
router.delete('/foods/:id', Delete);
router.post('/foods/', Create);
router.put('/foods/:id', Update);



export default router;