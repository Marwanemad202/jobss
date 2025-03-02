import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const shareProfile = Joi.object().keys({
    profileId: generalFields.id.required()
}).required();

export const updatePassword = Joi.object().keys({
    oldPassword: generalFields.password.required(),
    password: generalFields.password.not(Joi.ref('oldPassword')).required(),
    confirmPassword: generalFields.confirmPassword.valid(Joi.ref('password')).required(),
}).required()

export const updateProfile = Joi.object().keys({
    firstName: generalFields.firstName.optional(),
    lastName: generalFields.lastName.optional(),
    DOB: generalFields.DOB.optional(),
    gender: generalFields.gender.optional(),
    phone: generalFields.phone.optional(),
    address: generalFields.address.optional(),
}).required()

export const updateProfileImage = Joi.object().keys({
    image: generalFields.image.required()
}).required();

export const updateCoverImage = Joi.object().keys({
    image: generalFields.image.required()
}).required();
