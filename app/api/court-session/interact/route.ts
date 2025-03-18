// app/api/court-session/interact/route.ts
import { NextResponse } from 'next/server';
import { AIJudge } from '@/utils/AIJudge';
import CourtSession from '@/models/CourtSession';
import { connectDB } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { statement, caseId, phase } = await req.json();
        await connectDB();

        // Get or create session
        let session = await CourtSession.findOne({
            caseId,
            status: 'active'
        });

        if (!session) {
            session = await CourtSession.create({
                caseId,
                currentPhase: phase,
                status: 'active'
            });
        }

        // Initialize AI Judge
        const judge = new AIJudge(process.env.OPENAI_API_KEY, session.caseId);
        const response = await judge.getResponse(statement);

        // Update session with new interaction
        session.interactions.push({
            phase,
            userStatement: statement,
            judgeResponse: response.response,
            feedback: response.feedback,
            timestamp: new Date()
        });

        // Update score based on feedback
        session.score = calculateScore(session.interactions);
        await session.save();

        return NextResponse.json({
            response: response.response,
            phase: response.phase,
            feedback: response.feedback,
            score: session.score
        });
    } catch (error) {
        console.error('Error in court session:', error);
        return NextResponse.json(
            { error: 'Failed to process court interaction' },
            { status: 500 }
        );
    }
}

function calculateScore(interactions) {
    // Implement scoring logic based on:
    // - Voice confidence
    // - Response relevance
    // - Professionalism
    // - Judge's feedback
    // Return normalized score (0-100)
}