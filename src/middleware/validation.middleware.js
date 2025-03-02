import Joi from "joi";
import { Types } from "mongoose";
import { genderTypes } from "../DB/model/User.model.js";


export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export const isValidObject = (value, helper) => {

    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid ObjectId');
}

export const generalFields = {
    firstName: Joi.string().min(2).max(50).trim(),
    lastName: Joi.string().min(2).max(50).trim(),
    email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', "net"] } }),
    password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?~`-])[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>\/?~`-]{8,}$/)).required(),
    confirmPassword: Joi.string(),
    code: Joi.string().pattern(new RegExp(/^\d{4}$/)),
    id: Joi.string().custom(isValidObject),
    DOB: Joi.date().less("now"),
    gender: Joi.string().valid(...Object.values(genderTypes)),
    address:Joi.string(),
    phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}/)),
    image: Joi.string().required()



}

export const validation = (Schema) => {
    return (req, res, next) => {
        const inputs = { ...req.query, ...req.body, ...req.params };
        const validationResult = Schema.validate(inputs, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).json({ message: "Validation error", details: validationResult.error.details })
        }
        return next()
    }
}
