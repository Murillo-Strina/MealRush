import express, { Router } from "express";
const router = Router();
import { GetAllMachines, GetMachineById, Delete, Create, Update } from '../Controllers/MachineController';

router.get('/machines', GetAllMachines);
router.get('/machines/:id', GetMachineById);
router.delete('/machines/:id', Delete);
router.post('/machines/', Create);
router.put('/machines/:id', Update);

export default router;