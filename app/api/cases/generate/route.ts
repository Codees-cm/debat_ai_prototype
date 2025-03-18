import { NextResponse } from 'next/server';
import { CaseGenerator } from '@/utils/caseGenerator';
import Case from '@/models/Case';
import { connectDB } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { type, difficulty } = await req.json();
        await connectDB();

        console.log({ type, difficulty });

        const generator = new CaseGenerator(process.env.OPENAI_API_KEY);
        const caseData = await generator.generateCase(type, difficulty);
        console.log({ type, difficulty });

        console.log(caseData);
        const newCase = await Case.create({...caseData, difficulty, type });
        console.log({ type, difficulty });

        return NextResponse.json(newCase, { status: 201 });
    } catch (error) {
        console.error('Error in case generation:', error);
        return NextResponse.json(
            { error: 'Failed to generate case' },
            { status: 500 }
        );
    }
}