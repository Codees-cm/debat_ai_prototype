"use client"
import { useState } from 'react';
import VoiceRecognition from './VoiceRecognition';

const VoicePractice = () => {
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const sampleScript = "Your Honor, my client is innocent of all charges. The evidence clearly shows...";

    const handleSpeechResult = (transcript: any) => {
        console.log('Speech detected:', transcript);

        // Ensure we are handling a string and not an object
        if (typeof transcript === 'object' && transcript.transcript) {
            setFeedback(transcript.transcript);  // Extract text if transcript is an object
        } else {
            setFeedback(String(transcript));  // Fallback for other cases
        }
    };


    const handleConfidenceAnalysis = (analysis: { overallConfidence: number; details: { speechRecognitionConfidence: number; scriptSimilarity: number; volume: number; pace: any; }; }) => {
        setFeedback({
            overall: Math.round(analysis.overallConfidence * 100),
            details: {
                recognition: Math.round(analysis.details.speechRecognitionConfidence * 100),
                similarity: Math.round(analysis.details.scriptSimilarity * 100),
                volume: Math.round((analysis.details.volume / 255) * 100),
                pace: analysis.details.pace
            }
        });
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Voice Practice Session</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Your Script:</h3>
                    <p className="p-4 bg-gray-50 rounded-md">{sampleScript}</p>
                </div>

                <button
                    onClick={() => setIsListening(!isListening)}
                    className={`w-full py-3 px-4 rounded-md font-medium ${
                        isListening
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    {isListening ? 'Stop Recording' : 'Start Recording'}
                </button>

                <VoiceRecognition
                    isListening={isListening}
                    expectedScript={sampleScript}
                    onSpeechResult={handleSpeechResult}
                    onConfidenceAnalysis={handleConfidenceAnalysis}
                />

                {feedback && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">Performance Analysis</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-gray-50 rounded-md">
                                <div className="text-xl font-bold text-blue-600">
                                    Overall Confidence: {feedback.overall}%
                                </div>
                                <div className="mt-3 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Speech Recognition:</span>
                                        <span>{feedback.details.recognition}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Script Accuracy:</span>
                                        <span>{feedback.details.similarity}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Volume Level:</span>
                                        <span>{feedback.details.volume}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Speaking Pace:</span>
                                        <span>{Math.round(feedback.details.pace)} words/min</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoicePractice;