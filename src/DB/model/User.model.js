
import mongoose, { model, Schema, Types } from "mongoose";

export const genderTypes = { male: "male", female: "female" };
export const providerTypes = { google: "google", system: "system" };
export const roleTypes = { user: "user", admin: "admin" };

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, unique: true }, // Added username as a regular field
    email: { type: String, unique: true, required: true },
    confirmEmailOTP: String,
    password: { type: String, required: true },
    resetPasswordOTP: String,
    provider: {
        type: String,
        enum: Object.values(providerTypes),
        default: providerTypes.system
    },
    gender: {
        type: String,
        enum: Object.values(genderTypes),
        default: genderTypes.male
    },
    DOB: {
        type: Date,
        validate: {
            validator: function (v) {
                return v < new Date() && new Date().getFullYear() - v.getFullYear() > 18;
            },
            message: props => `${props.value} is not a valid date of birth!`
        }
    },
    mobileNumber: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(roleTypes),
        default: roleTypes.user
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isDeleted: {
    confirmEmailOTPExpires: { type: Date },
    resetPasswordOTPExpires: { type: Date },

        type: Boolean,
        default: false
    },
    deletedAt: { type: Date },
    bannedAt: { type: Date },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User ' },
    changeCredentialTime: Date,
    profilePic: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    coverPic: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    viewers: [{
        userId: { type: Types.ObjectId, ref: 'User' },
        time: Date
    }
    ]

}, { timestamps: true });

export const userModel = mongoose.model.User || model("User", userSchema);

export default userModel;
