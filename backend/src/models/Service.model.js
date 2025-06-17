import mongoose from 'mongoose';

const recentEmailSchema = new mongoose.Schema({
    subject: { type: String },
    date: { type: Date },
    snippet: { type: String }
}, { _id: false });

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    iconUrl: { 
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    domain: {
        type: String,
        trim: true
    },
    emailCount: {
        type: Number,
        default: 0
    },
    lastEmailSubject: {
        type: String
    },
    lastEmailDate: {
        type: Date
    },
    recentEmails: {
        type: [recentEmailSchema],
        default: []
    },
    unsubscribeUrl: {
        type: String
    },
    oneClickPost: {
        type: Boolean,
        default: false
    },
    isUnsubscribed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'services'
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;