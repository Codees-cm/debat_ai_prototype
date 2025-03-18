import mongoose from 'mongoose';

const courtSessionSchema = new mongoose.Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentPhase: {
        type: String,
        enum: ['opening', 'examination', 'crossExamination', 'closing', 'verdict'],
        default: 'opening'
    },
    interactions: [{
        phase: String,
        userStatement: String,
        judgeResponse: String,
        feedback: Object,
        confidence: Number,
        timestamp: Date
    }],
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    score: {
        overall: Number,
        breakdown: {
            argumentation: Number,
            presentation: Number,
            legalKnowledge: Number,
            effectiveness: Number
        }
    }
});

export default mongoose.models.CourtSession || mongoose.model('CourtSession', courtSessionSchema);