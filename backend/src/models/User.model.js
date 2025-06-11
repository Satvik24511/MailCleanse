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

    unsubscribedCount: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;