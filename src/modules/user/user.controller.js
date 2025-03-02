import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import * as profileService from "./service/user.service.js"
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./user.validation.js"
import { uploadFileDisk } from "../../utils/multer/local.multer.js";

const router = Router();

router.get("/profile", authentication(), profileService.profile)
router.get("/profile/:profileId", validation(validators.shareProfile), authentication(), profileService.shareProfile)

router.patch("/profile/password", validation(validators.updatePassword), authentication(), profileService.updatePassword)
router.patch("/profile", validation(validators.updateProfile), authentication(), profileService.updateProfile)
router.patch("/profile/image", authentication(), uploadFileDisk().single('image'), profileService.updateProfileImage)

router.delete("/profile/image/delete", authentication(), profileService.deleteProfileImage);

router.delete("/profile/cover/delete", authentication(), profileService.deleteCoverImage);

router.patch("/profile/cover", authentication(), uploadFileDisk().single('cover'), profileService.updateCoverImage)

export default router;
