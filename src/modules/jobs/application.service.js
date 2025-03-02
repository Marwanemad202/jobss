import applicationModel from '../../DB/model/Application.model.js';
import { asyncHandler } from '../../middleware/validation.middleware.js';

export const createApplication = asyncHandler(async (applicationData) => {
    const application = new applicationModel(applicationData);
    return await application.save();
});

export const getApplicationsByUserId = asyncHandler(async (userId) => { 
    return await applicationModel.find({ userId });
});
