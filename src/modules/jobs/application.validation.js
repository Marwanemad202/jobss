import Joi from "joi";

export const applicationValidationSchema = Joi.object({
    jobId: Joi.string().required(),
    userId: Joi.string().required(),
    userCV: Joi.object({
        secure_url: Joi.string().uri().required(),
        public_id: Joi.string().required()
    }).required(),
    status: Joi.string().valid('pending', 'accepted', 'viewed', 'in consideration', 'rejected').default('pending')
});
