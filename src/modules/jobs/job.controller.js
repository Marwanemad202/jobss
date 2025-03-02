import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import { createJob, updateJob, deleteJob, getJobs } from "./job.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import { jobValidationSchema } from "./job.validation.js"; 

const router = Router();

router.post('/jobs', validation(jobValidationSchema), createJob);

router.get('/jobs', authentication(), validation(jobValidationSchema), getJobs);

router.delete('/jobs/:id', authentication(), validation(jobValidationSchema), deleteJob);

export default router;
