import express from 'express';
const router = express.Router();
import contentController from '../Controllers/ContentController.js';

router.get('/contents', contentController.getAllContents);
router.get('/contents/:id/details', contentController.getDetails);
router.get('/contents/:id', contentController.getContentById);
router.post('/contents', contentController.create);
router.put('/contents/:id/machine/:machineId', contentController.update);
router.get('/contents/machine/:machineId', contentController.getContentsByMachineId);
router.delete('/contents/:id', contentController.delete);

export default router;