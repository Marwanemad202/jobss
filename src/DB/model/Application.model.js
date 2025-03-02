import mongoose, { model, Schema, Types } from "mongoose";

const applicationSchema = new Schema({
    jobId: { type: Types.ObjectId, ref: 'Job', required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    userCV: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'viewed', 'in consideration', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

export const applicationModel = mongoose.model.Application || model("Application", applicationSchema);

export default applicationModel;
