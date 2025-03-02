import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import { uploadFileDisk } from "../../utils/multer/local.multer.js";

import { createCompanyValidation, softDeleteCompanyValidation, updateCompanyValidation, uploadLogoValidation, uploadCoverPicValidation, deleteLogoValidation, deleteCoverValidation } from "./company.validation.js";
import { addCompany, softDeleteCompany, updateCompany, getCompanyWithJobs, DeleteCompanyLogo, DeleteCompanyCoverPic, searchCompanyByName, UploadCompanyLogo, UploadCompanyCoverPic } from "./company.service.js"; // Import the upload functions

const router = Router();

router.post("/add", validation(createCompanyValidation), addCompany);

router.post("/upload/logo", validation(uploadLogoValidation), uploadFileDisk().single('logo'), UploadCompanyLogo);
router.post("/upload/cover", validation(uploadCoverPicValidation), uploadFileDisk().single('cover'), UploadCompanyCoverPic); 

router.delete("/delete/logo", validation(deleteLogoValidation), DeleteCompanyLogo);
router.delete("/delete/cover", validation(deleteCoverValidation), DeleteCompanyCoverPic); 

router.delete("/soft-delete/:companyId", validation(softDeleteCompanyValidation), softDeleteCompany);
router.get("/company/search", validation(getCompanyByNameValidation), searchCompanyByName);
router.get("/company/:companyId/jobs", validation(getCompanyWithJobsValidation), getCompanyWithJobs);

router.put("/update/:companyId", validation(updateCompanyValidation), updateCompany);

export default router;
