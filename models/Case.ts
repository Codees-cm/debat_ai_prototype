import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
    title: String,
    description: String,
    type: {
        type: String,
        enum: ['criminal', 'civil', 'corporate'],
        required: true
    },
    background: {
        summary: String,
        evidence: [String],
        witnesses: [{
            name: String,
            statement: String,
            role: String
        }]
    },
    defendant: {
        name: String,
        background: String,
        charges: [String]
    },
    prosecution: {
        mainArguments: [String],
        evidence: [String]
    },
    defense: {
        possibleArguments: [String],
        keyPoints: [String],
        evidenceToPresent: [String]
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Case || mongoose.model('Case', caseSchema);