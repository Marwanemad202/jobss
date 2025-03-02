import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from "../../../DB/db.service.js"
import userModel from "../../../DB/model/User.model.js";
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
import fs from 'fs/promises'; 
import path from 'path';

export const profile = asyncHandler(async (req, res, next) => {
    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: req.user._id },
        populate: [{
            path: "viewers.userId",
            select: 'username image'
        }]
    })
    return successResponse({ res, data: { user: req.user } })
})

export const updateProfile = asyncHandler(async (req, res, next) => {
    const user = await dbService.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        data: req.body
    })
    return successResponse({ res, data: { user: req.user } })
})

export const updateProfileImage = asyncHandler(async (req, res, next) => {
    const fileName = req.file ? req.file.filename : null;
    if (!fileName) {
        return next(new Error('Image upload failed', { cause: 400 }));
    }

    await dbService.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        data: { image: fileName }
    });

    return successResponse({ res, data: { fileName } });
})

export const deleteProfileImage = asyncHandler(async (req, res, next) => {
    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: req.user._id },
        select: 'image'
    });

    if (user.image) {
        const imagePath = path.join(__dirname, '../../../uploads', user.image);
        await fs.unlink(imagePath); 
    }

    await dbService.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        data: { image: null }
    });

    return successResponse({ res, data: { message: "Profile image deleted successfully." } });
});

export const deleteCoverImage = asyncHandler(async (req, res, next) => {
    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: req.user._id },
        select: 'cover'
    });

    if (user.cover) {
        const coverPath = path.join(__dirname, '../../../uploads', user.cover);
        await fs.unlink(coverPath); 
    }

    await dbService.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        data: { cover: null }
    });

    return successResponse({ res, data: { message: "Cover image deleted successfully." } });
});

export const updateCoverImage = asyncHandler(async (req, res, next) => {
    const fileName = req.file ? req.file.filename : null;
    if (!fileName) {
        return next(new Error('Cover image upload failed', { cause: 400 }));
    }

    await dbService.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        data: { cover: fileName }
    });

    return successResponse({ res, data: { fileName } });
})

export const shareProfile = asyncHandler(async (req, res, next) => {
    const { profileId } = req.params;
    let user = null;
    if (profileId === req.user._id.toString()) {
        user = req.user;
    } else {
        let user = await dbService.findOneAndUpdate({
            model: userModel,
            filter: { _id: profileId, isDelete: false },
            data: {
                $push: { viewers: { userId: req.user._id, time: Date.now() } }
            },
            select: 'username image email'
        })
    }
    return user ? successResponse({ res, data: { user } }) : next(new Error('In-valid account', { cause: 404 }))
})

export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, password } = req.body;

    if (!compareHash({ plaintext: oldPassword, hashValue: req.user.password })) {
        return next(new Error('Old password is incorrect', { cause: 400 }))
    }

    await dbService.updateOne({
        model: userModel,
        filter: { _id: req.user._id },
        data: {
            password: generateHash({ plaintext: password }),
            changeCredentialsTime: Date.now(),
        }
    })
    return successResponse({ res, data: {} })
})
