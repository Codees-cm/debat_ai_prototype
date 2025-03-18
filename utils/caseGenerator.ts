import OpenAI from 'openai';

export class CaseGenerator {
    private openai;

    constructor() {
    
        const token = "";
        const endpoint = "https://models.inference.ai.azure.com";

        this.openai = new OpenAI({
            baseURL: endpoint,
            apiKey: token
        });
    }

    private async generateCasePrompt(type: string, difficulty: string) {
        return `Generate a detailed ${type} court case at ${difficulty} level with the following structure:
    - Case title
    - Brief description
    - Background information
    - Defendant details
    - List of charges
    - Available evidence
    - Witness statements
    - Prosecution arguments
    - Possible defense strategies
    Ensure the case is fictional but realistic and challenging.`;
    }

    async generateCase(type: string, difficulty: string) {
        try {
            const prompt = await this.generateCasePrompt(type, difficulty);

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a legal expert specialized in creating realistic court cases for training purposes."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 1000
            });

            const responseContent = completion.choices[0].message.content;
            const caseData = this.parseAIResponse(responseContent);
            return caseData;
        } catch (error) {
            console.error('Error generating case:', error);
            throw error;
        }
    }

    private parseAIResponse(response: string) {
        try {
            // Basic parsing logic - you might want to enhance this
            const sections = response.split('\n\n');
            return {
                title: sections[0].replace('Case Title: ', '').trim(),
                description: sections[1].replace('Brief Description: ', '').trim(),
                background: sections[2].replace('Background Information: ', '').trim(),
                defendant: sections[3].replace('Defendant Details: ', '').trim(),
                charges: sections[4].replace('List of Charges: ', '').trim().split('\n'),
                evidence: sections[5].replace('Available Evidence: ', '').trim(),
                witnesses: sections[6].replace('Witness Statements: ', '').trim(),
                prosecutionArguments: sections[7].replace('Prosecution Arguments: ', '').trim(),
                defenseStrategies: sections[8].replace('Possible Defense Strategies: ', '').trim()
            };
        } catch (error) {
            console.error('Error parsing AI response:', error);
            throw error;
        }
    }
}