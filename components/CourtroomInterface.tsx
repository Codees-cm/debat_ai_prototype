"use client"
import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
import VoiceRecognition from './VoiceRecognition';

const CourtroomInterface = ({ caseData }) => {
    // const { data: session } = useSession();
    const [isListening, setIsListening] = useState(false);
    const [currentScript, setCurrentScript] = useState('');
    const [judgeResponse, setJudgeResponse] = useState(null);
    const [sessionState, setSessionState] = useState({
        phase: 'opening',
        score: 0,
        feedback: null
    });
    const [voiceAnalysis, setVoiceAnalysis] = useState(null);

    const handleSpeechResult = async (transcript) => {
        setIsListening(false);
        // Send to AI Judge
        try {
            const response = await fetch('/api/court-session/interact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    statement: transcript,
                    caseId: caseData._id,
                    phase: sessionState.phase
                }),
            });

            const data = await response.json();
            setJudgeResponse(data.response);
            updateSessionState(data);
        } catch (error) {
            console.error('Error in court interaction:', error);
        }
    };

    const handleConfidenceAnalysis = (analysis) => {
        setVoiceAnalysis(analysis);
    };

    const updateSessionState = (data) => {
        setSessionState(prev => ({
            ...prev,
            phase: data.phase,
            score: data.score,
            feedback: data.feedback
        }));
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-3 gap-6">
                {/* Case Information Panel */}
                <div className="col-span-1 bg-white shadow-lg rounded-lg p-4">
                    <h3 className="text-xl font-bold mb-4">Case Details</h3>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-medium">Current Phase</h4>
                            <p className="text-blue-600">{sessionState.phase}</p>
                        </div>
                        <div>
                            <h4 className="font-medium">Score</h4>
                            <p className="text-green-600">{sessionState.score}</p>
                        </div>
                        {voiceAnalysis && (
                            <div>
                                <h4 className="font-medium">Voice Analysis</h4>
                                <div className="text-sm">
                                    <p>Confidence: {voiceAnalysis.confidence}%</p>
                                    <p>Volume: {voiceAnalysis.volume}%</p>
                                    <p>Pace: {voiceAnalysis.pace} wpm</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Courtroom Interface */}
                <div className="col-span-2 bg-white shadow-lg rounded-lg p-4">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">Courtroom Session</h2>
                        <p className="text-gray-600">Case: {caseData.title}</p>
                    </div>

                    {/* Judge's Response */}
                    {judgeResponse && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Judge:</h4>
                            <p>{judgeResponse}</p>
                        </div>
                    )}

                    {/* Speech Input Section */}
                    <div className="mb-6">
                        <button
                            onClick={() => setIsListening(!isListening)}
                            className={`w-full py-3 px-4 rounded-md font-medium ${
                                isListening
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                        >
                            {isListening ? 'Stop Speaking' : 'Start Speaking'}
                        </button>

                        <VoiceRecognition
                            isListening={isListening}
                            onSpeechResult={handleSpeechResult}
                            onConfidenceAnalysis={handleConfidenceAnalysis}
                        />
                    </div>

                    {/* Feedback Section */}
                    {sessionState.feedback && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Feedback:</h4>
                            <div className="space-y-2">
                                <p>Relevance: {sessionState.feedback.relevance}</p>
                                <p>Professionalism: {sessionState.feedback.professionalism}</p>
                                <p>Effectiveness: {sessionState.feedback.effectiveness}</p>
                                {sessionState.feedback.suggestions && (
                                    <div>
                                        <p className="font-medium">Suggestions:</p>
                                        <ul className="list-disc pl-5">
                                            {sessionState.feedback.suggestions.map((suggestion, index) => (
                                                <li key={index}>{suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourtroomInterface;