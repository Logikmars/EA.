import mongoose from 'mongoose';

const adminLoginChallengeSchema = new mongoose.Schema({
    tokenHash: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: {
            expires: 0,
        },
    },
    attempts: {
        type: Number,
        default: 0,
    },
    usedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

export const AdminLoginChallengeModel = mongoose.models.AdminLoginChallenge
    || mongoose.model('AdminLoginChallenge', adminLoginChallengeSchema);
