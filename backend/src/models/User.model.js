import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true,
        index: true   
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,  
        lowercase: true, 
        trim: true    
    },
    profilePicture: {
        type: String
    },

    accessToken: {
        type: String,
        required: true,
        select: false
    },
    refreshToken: {
        type: String,
        required: true,
        select: false
    },
    accessTokenExpiresAt: {
        type: Date,
        select: false
    },

    unsubscribedCount: { // Simple counter for how many emails the user unsubscribed via your app
        type: Number,
        default: 0
    }

}, {
    timestamps: true, // Mongoose automatically adds `createdAt` and `updatedAt` fields
});

// Create the Mongoose model
const User = mongoose.model('User', userSchema);

export default User;