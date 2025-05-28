import express from 'express';
import feedbackController from "../Controllers/FeedbackController.js"; 

const router = express.Router();


router.get('/feedbacks', feedbackController.getAllFeedbacks);
router.get('/feedbacks/institution/:institutionId', feedbackController.getFeedbacksByInstitutionId);
router.get('/feedbacks/:id', feedbackController.getFeedbackById);
router.post('/feedbacks', feedbackController.createFeedback);
router.put('/feedbacks/:id', feedbackController.updateFeedback);
router.delete('/feedbacks/:id', feedbackController.deleteFeedback);

export default router;