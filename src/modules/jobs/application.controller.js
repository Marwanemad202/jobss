import { Router } from "express";
import { createApplication, getApplicationsByUserId } from './application.service.js';
import { validation } from "../../middleware/validation.middleware.js";
import { applicationValidationSchema } from "./application.validation.js"; 

const router = Router();

router.post('/applications', validation(applicationValidationSchema), createApplication);

router.get('/applications/:userId', getApplicationsByUserId);

export default router;
