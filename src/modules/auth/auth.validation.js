import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const signup = Joi.object().keys({
    firstName: generalFields.firstName.required(),
    lastName: generalFields.lastName.required(),
    email: generalFields.email.required(),
    username: Joi.string().optional(),
    mobileNumber: Joi.string().required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.valid(Joi.ref('password')).required()
}).required()

export const confirmEmail = Joi.object().keys({
    email: generalFields.email.required(),
    code: generalFields.code.required()
}).required()

export const validateForgotPassword = confirmEmail

export const forgotPassword = Joi.object().keys({
    email: generalFields.email.required()
}).required()

export const resetPassword = Joi.object().keys({
    code: generalFields.code.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.valid(Joi.ref('password')).required()
}).required()

export const login = Joi.object().keys({
    email: generalFields.email.required(),
    password: generalFields.password.required()
}).required()

export const googleSignup = Joi.object().keys({
    firstName: generalFields.firstName.required(),
    lastName: generalFields.lastName.required(),
    email: generalFields.email.required(),
    googleId: Joi.string().required()
}).required()

export const googleLogin = Joi.object().keys({
    token: Joi.string().required()
}).required()
