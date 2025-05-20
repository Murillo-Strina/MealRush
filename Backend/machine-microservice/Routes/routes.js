import express from 'express';
const router = express.Router();
import machineController from "../Controllers/machineController.js";

router.get('/machines', machineController.GetAllMachines);
router.get('/machines/:id', machineController.GetMachineById);
router.delete('/machines/:id', machineController.Delete);
router.post('/machines/', machineController.Create);
router.put('/machines/:id', machineController.Update);

export default router;