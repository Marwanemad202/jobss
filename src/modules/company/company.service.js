import { asyncHandler } from "../../middleware/validation.middleware.js";
import Company from "../../DB/model/company.model.js";
import { successResponse } from "../../utils/response/success.response.js";
import { errorResponse } from "../../utils/response/error.response.js";
import * as dbService from "../../DB/db.service.js";

export const addCompany = asyncHandler(async (req, res, next) => {
    const { companyName, companyEmail } = req.body;

    const { error } = createCompanyValidation.validate(req.body);
    if (error) {
        return errorResponse({ res, message: error.details[0].message });
    }

    if (await dbService.findOne({ model: Company, filter: { companyEmail } })) {
        return next(new Error("Company email exists", { cause: 409 }));
    }
    if (await dbService.findOne({ model: Company, filter: { companyName } })) {
        return next(new Error("Company name exists", { cause: 409 }));
    }

    const newCompany = await dbService.create({
        model: Company,
        data: {
            companyName,
            companyEmail
        }
    });

    return successResponse({ res, message: "Company created successfully", status: 201, data: newCompany });
});

export const updateCompany = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;
    const userId = req.user._id;

    const company = await Company.findById(companyId);
    if (!company || company.CreatedBy.toString() !== userId.toString()) {
        return next(new Error("Unauthorized: You are not the owner of this company", { cause: 403 }));
    }

    const { legalAttachment, ...updateData } = req.body;

    const updatedCompany = await dbService.findOneAndUpdate({
        model: Company,
        filter: { _id: companyId },
        data: updateData
    });

    return successResponse({ res, data: updatedCompany });
});

export const getCompanyWithJobs = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    const company = await Company.findById(companyId).populate('jobs');
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }

    return successResponse({ res, data: company });
});

export const searchCompanyByName = asyncHandler(async (req, res, next) => {
    const { name } = req.query;

    const companies = await Company.find({ companyName: { $regex: name, $options: 'i' } });
    if (companies.length === 0) {
        return next(new Error("No companies found with that name", { cause: 404 }));
    }

    return successResponse({ res, data: companies });
});

export const softDeleteCompany = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;
    const userId = req.user._id;

    const company = await Company.findById(companyId);
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }

    if (company.CreatedBy.toString() !== userId.toString() && !req.user.isAdmin) {
        return next(new Error("Unauthorized: You are not allowed to delete this company", { cause: 403 }));
    }

    company.deletedAt = new Date();
    await company.save();

    return successResponse({ res, message: "Company soft deleted successfully", status: 200 });
});

export const UploadCompanyLogo  = asyncHandler(async (req, res, next) => {
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

export const UploadCompanyCoverPic = asyncHandler(async (req, res, next) => {
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

export const DeleteCompanyLogo = asyncHandler(async (req, res, next) => {
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

export const DeleteCompanyCoverPic = asyncHandler(async (req, res, next) => {
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
