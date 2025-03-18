import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    stats: {
        courtCases: [{
            caseId: String,
            confidence: Number,
            result: String,
            date: Date
        }],
        debates: [{
            topicId: String,
            rounds: Number,
            score: Number,
            date: Date
        }],
        overallScore: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.User || mongoose.model('User', userSchema)