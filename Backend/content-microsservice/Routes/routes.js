import express from 'express';
const router = express.Router();
import contentController from '../Controllers/ContentController.js';

router.get('/contents', contentController.getAllContents);
router.get('/contents/:id', contentController.getContentById);
router.post('/contents', contentController.create);
router.put('/contents/:id', contentController.update);
router.delete('/contents/:id', contentController.delete);

export default router;
