import { jobModel } from '../../DB/model/Job.model.js';
import applicationModel from '../../DB/model/Application.model.js'; 

import applicationModel from '../../DB/model/Application.model.js'; 

import { jobValidationSchema } from './job.validation.js';
import { asyncHandler } from '../../middleware/validation.middleware.js';

export const updateJob = asyncHandler(async (id, data, userId) => {
    const job = await jobModel.findById(id);
    if (!job) {
        throw new Error('Job not found');
    }
    if (job.addedBy.toString() !== userId) {
        throw new Error('You are not authorized to update this job');
    }

    Object.assign(job, data);
    return await job.save();
});

export const deleteJob = asyncHandler(async (id, userId) => {
    const job = await jobModel.findById(id).populate('companyId');
    if (!job) {
        throw new Error('Job not found');
    }
    if (job.companyId.HR.toString() !== userId) {
        throw new Error('You are not authorized to delete this job');
    }

    await jobModel.findByIdAndDelete(id);
    return { message: 'Job deleted successfully' };
});

export const getJobs = asyncHandler(async (query) => {
    const { companyName, workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills, skip = 0, limit = 10, sort = 'createdAt' } = query;

    const filter = {};
    if (companyName) {
        filter.companyId = { $in: await Company.find({ name: companyName }).select('_id') };
    }
    if (workingTime) {
        filter.workingTime = workingTime;
    }
    if (jobLocation) {
        filter.jobLocation = jobLocation;
    }
    if (seniorityLevel) {
        filter.seniorityLevel = seniorityLevel;
    }
    if (jobTitle) {
        filter.jobTitle = jobTitle;
    }
    if (technicalSkills) {
        filter.technicalSkills = { $in: technicalSkills.split(',') }; // Assuming technicalSkills is a comma-separated string
    }


    const jobs = await jobModel.find(filter)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort({ [sort]: 1 });

    const totalCount = await jobModel.countDocuments(filter);

    return { jobs, totalCount };
});



export const createJob = asyncHandler(async (data) => {




    const { error } = jobValidationSchema.validate(data);
    if (error) {
        throw new Error(error.details[0].message);
    }
    const job = new jobModel({
        ...data,
        createdBy: data.createdBy
    });

    return await job.save();
});
