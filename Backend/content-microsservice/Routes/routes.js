import express from 'express';
const router = express.Router();
import contentController from '../Controllers/ContentController';

router.get('/contents', contentController.GetAllContents);
router.get('/contents/:id', contentController.GetContentById);
router.get('/contents/institution/:institutionId/machine/:machineId', contentController.GetContentByInstitutionIDAndMachineID);
router.post('/contents', contentController.Create);
router.put('/contents/:id', contentController.Update);
router.delete('/contents/:id', contentController.Delete);

export default router;