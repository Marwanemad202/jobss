import Joi from "joi";

export const jobValidationSchema = Joi.object({
    createdBy: Joi.string().valid('HR', 'Owner').required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    company: Joi.string().required(),
    location: Joi.string().required(),
    salary: Joi.number().positive().required(),
    type: Joi.string().valid('full-time', 'part-time', 'contract').required(),
});
