import mongoose, { model, Schema } from "mongoose";

const jobSchema = new Schema({
    jobTitle: { type: String },
    jobLocation: { type: String },
    workingTime: { type: String },
    seniorityLevel: { type: String },
    jobDescription: { type: String },
    technicalSkills: { type: [String] },
    softSkills: { type: [String] },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    closed: { type: Boolean, default: false },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' }
}, { timestamps: true });

export const jobModel = mongoose.model("Job", jobSchema);

export default jobModel;
