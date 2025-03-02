import { customAlphabet } from "nanoid";
import { sendEmail } from "../email/send.email.js";
import { EventEmitter } from "node:events";
import { generateHash } from "../security/hash.security.js";
import userModel from "../../DB/model/User.model.js";
import { verifyAccountTemplate } from "../email/template/verifyAccount.template.js";
export const emailEvent = new EventEmitter()
import * as dbService from "../../DB/db.service.js";
export const emailSubject = {
    confirmEmail: "Confirm-Email",
    resetPassword: "Reset-password",
}

export const sendCode = async ({ data = {}, subject = emailSubject.confirmEmail } = {}) => {
    const { id, email } = data;
    const otp = customAlphabet("0123456789", 4)();
    const hashOTP = generateHash({ plaintext: otp })
    let updateData = {}
    switch (subject) {
        case emailSubject.confirmEmail:
            updateData = { confirmEmailOTP: hashOTP }
            break;
        case emailSubject.resetPassword:
            updateData = { resetPasswordOTP: hashOTP }
            break;
        default:
            break;
    }
    await dbService.updateOne({ model: userModel, filter: { _id: id }, data: updateData })

    const html = verifyAccountTemplate({ code: otp })
    await sendEmail({ to: email, subject, html })
}

emailEvent.on("sendConfirmEmail", async (data) => {
    await sendCode({ data })
})

emailEvent.on("forgotPassword", async (data) => {
    await sendCode({ data, subject: emailSubject.resetPassword })
})

