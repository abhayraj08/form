const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    education: {
        type: String,
        trim: true
    },
    skills: {
        type: [String],
        default: []
    },
    projects: [
        {
            title: { type: String},
            description: { type: String },
            link: { type: String }
        }
    ],
    works: [
        {
            company: { type: String },
            role: { type: String },
            // duration: { type: String },
            startDate: { type: Date },
            endDate: { type: Date, default: null },
            description: { type: String }
        }
    ],
    links: {
        github: { type: String },
        linkedin: { type: String },
        portfolio: { type: String }
    }

}, { timestamps: true });


const User = mongoose.model("User", UserSchema);
module.exports = User;