import express from 'express';
import institutionController from '../Controllers/InstitutionController.js';

const router = express.Router();

router.get('/institutions', institutionController.GetAllInstitutions);
router.get('/institutions/:id', institutionController.GetInstitutionById);
router.post('/institutions', institutionController.Create);
router.put('/institutions/:id', institutionController.Update);
router.delete('/institutions/:id', institutionController.Delete);

export default router;
