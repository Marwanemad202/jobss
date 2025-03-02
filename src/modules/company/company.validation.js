import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createCompanyValidation = Joi.object().keys({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.string().pattern(/^\d{1,2}-\d{1,2}$/).required(),
    companyEmail: Joi.string().email().required(),
    CreatedBy: Joi.string().optional(),
    Logo: Joi.object().keys({
        secure_url: Joi.string().optional(),
        public_id: Joi.string().optional()
    }).optional(),
    coverPic: Joi.object().keys({
        secure_url: Joi.string().optional(),
        public_id: Joi.string().optional()
    }).optional(),
    legalAttachment: Joi.object().keys({
        secure_url: Joi.string().optional(),
        public_id: Joi.string().optional()
    }).optional(),
    approvedByAdmin: Joi.boolean().optional()
}).required();

export const softDeleteCompanyValidation = Joi.object().keys({
    companyId: Joi.string().required()
}).required();

export const updateCompanyValidation = Joi.object().keys({
    companyName: Joi.string().optional(),
    description: Joi.string().optional(),
    industry: Joi.string().optional(),
    address: Joi.string().optional(),
    numberOfEmployees: Joi.string().pattern(/^\d{1,2}-\d{1,2}$/).optional(),
    companyEmail: Joi.string().email().optional(),
    legalAttachment: Joi.object().keys({
        secure_url: Joi.string().optional(),
        public_id: Joi.string().optional()
    }).optional(),
}).required();

export const getCompanyWithJobsValidation = Joi.object().keys({
    companyId: Joi.string().required()
}).required();

export const getCompanyByNameValidation = Joi.object().keys({
    name: Joi.string().required()
}).required();

export const uploadCoverPicValidation = Joi.object().keys({
    cover: Joi.object().required().messages({
        'any.required': 'Cover image is required.'
    }).custom((value, helpers) => {
        const fileType = value.mimetype.split('/')[1];
        const allowedTypes = ['jpeg', 'jpg', 'png'];
        if (!allowedTypes.includes(fileType)) {
            return helpers.message('Invalid file type. Only JPEG and PNG are allowed.');
        }
        return value;
    }),
}).required();

export const uploadLogoValidation = Joi.object().keys({
    logo: Joi.object().required().messages({
        'any.required': 'Logo image is required.'
    }).custom((value, helpers) => {
        const fileType = value.mimetype.split('/')[1];
        const allowedTypes = ['jpeg', 'jpg', 'png'];
        if (!allowedTypes.includes(fileType)) {
            return helpers.message('Invalid file type. Only JPEG and PNG are allowed.');
        }
        return value;
    }),
}).required();

export const deleteLogoValidation = Joi.object().keys({
    userId: Joi.string().required().messages({
        'any.required': 'User ID is required for logo deletion.'
    }),
}).required();

export const deleteCoverValidation = Joi.object().keys({
    userId: Joi.string().required().messages({
        'any.required': 'User ID is required for cover deletion.'
    }),
}).required();
