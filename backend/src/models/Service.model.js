import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    iconUrl: {
        type: String,
        required: true
    },
    emailCount: {
        type: Number,
        default: 0
    }    
}, {
    timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;