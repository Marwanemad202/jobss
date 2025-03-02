import userModel from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { encryptMobileNumber } from "../../../utils/security/encrypt.js";

import { successResponse } from "../../../utils/response/success.response.js";
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
import *as dbService from "../../../DB/db.service.js"

export const signup = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, confirmPassword, mobileNumber } = req.body;
    if (password !== confirmPassword) {
        return next(new Error("Password!==confirmPassword", { cause: 400 }));
    }
    if (await dbService.findOne({ model: userModel, filter: { email } })) {
        return next(new Error("Email exists", { cause: 409 }));
    }
    const user = await dbService.create({
        model: userModel,
        data: {
            firstName,
            lastName,
            email,
            password: generateHash({ plaintext: password }),
            mobileNumber: encryptMobileNumber(mobileNumber),
            username: `${firstName} ${lastName}`
        }
    })

    emailEvent.emit("sendConfirmEmail", { id: user._id, email });
    return successResponse({ res, message: "Done", status: 201 });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { email, code } = req.body;
    const user = await dbService.findOne({ model: userModel, filter: { email } });
    if (!user) {
        return next(new Error("In-valid account", { cause: 404 }));
    }
    if (user.isConfirmed) {
        return next(new Error(" already verified", { cause: 409 }));
    }
    if (!compareHash({ plaintext: code, hashValue: user.confirmEmailOTP })) {
        return next(new Error("Invalid code", { cause: 400 }));
    }
    await dbService.updateOne({ model: userModel, filter: { email } , data: { isConfirmed: true, $unset: { confirmEmailOTP: 0 } }});

    return successResponse({ res, message: "Done", status: 201 });
});
