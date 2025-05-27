import express from 'express';
import machineController from "../Controllers/MachineController.js";

const router = express.Router();

router.get('/machines', machineController.GetAllMachines);
router.get('/machines/:id', machineController.GetMachineById);
router.get('/machines/institution/:institutionId', machineController.GetMachinesByInstitutionId);
router.post('/machines', machineController.Create);
router.put('/machines/:id/institution/:institutionId', machineController.Update);
router.delete('/machines/:id/institution/:institutionId', machineController.Delete);

export default router;
