import express from 'express';
import machineController from "../Controllers/machineController.js";

const router = express.Router();

router.get('/machines', machineController.GetAllMachines);
router.get('/machines/:id', machineController.GetMachineById);
router.get('/machines/institution/:institutionId', machineController.GetMachinesByInstitutionId);
router.post('/machines', machineController.Create);
router.put('/machines/:id', machineController.Update);
router.delete('/machines/:id', machineController.Delete);

export default router;
