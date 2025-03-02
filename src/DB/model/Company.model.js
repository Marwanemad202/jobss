import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    companyName: { type: String, unique: true, required: true },
    description: { type: String},
    industry: { type: String},
    address: { type: String},
    numberOfEmployees: { type: String},
    companyEmail: { type: String, unique: true, required: true },
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    Logo: {
        secure_url: { type: String},
        public_id: { type: String}
    },
    coverPic: {
        secure_url: { type: String},
        public_id: { type: String}
    },
    HRs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bannedAt: { type: Date },
    deletedAt: { type: Date },
    legalAttachment: {
        secure_url: { type: String},
        public_id: { type: String}
    },
    approvedByAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

export default Company;
