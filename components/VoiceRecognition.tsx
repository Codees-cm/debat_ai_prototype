"use client"
import { useState, useEffect, useCallback } from 'react';

const VoiceRecognition = ({
                              onSpeechResult,
                              onConfidenceAnalysis,
                              expectedScript = '',
                              isListening = false,
                          }) => {
    const [recognition, setRecognition] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [confidence, setConfidence] = useState(0);
    const [error, setError] = useState('');
    const [volumeLevel, setVolumeLevel] = useState(0);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    console.log('Voice recognition started');
                };

                recognition.onresult = (event) => {
                    let finalTranscript = '';
                    let interimTranscript = '';
                    let maxConfidence = 0;

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        const confidence = event.results[i][0].confidence;

                        if (event.results[i].isFinal) {
                            finalTranscript += transcript;
                            maxConfidence = Math.max(maxConfidence, confidence);
                        } else {
                            interimTranscript += transcript;
                        }
                    }

                    if (finalTranscript) {
                        setTranscript(finalTranscript);
                        setConfidence(maxConfidence);
                        analyzeConfidence(finalTranscript, maxConfidence);

                        if (onSpeechResult) {
                            onSpeechResult(finalTranscript);
                        }
                    }
                };

                recognition.onerror = (event) => {
                    setError(`Error: ${event.error}`);
                };

                setRecognition(recognition);
            } else {
                setError('Speech recognition not supported in this browser.');
            }
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, []);

    // Handle audio analysis for volume
    useEffect(() => {
        if (typeof window !== 'undefined' && isListening) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const audioContext = new AudioContext();
                    const analyser = audioContext.createAnalyser();
                    const microphone = audioContext.createMediaStreamSource(stream);
                    microphone.connect(analyser);
                    analyser.fftSize = 256;
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    const checkVolume = () => {
                        analyser.getByteFrequencyData(dataArray);
                        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
                        setVolumeLevel(average);
                        if (isListening) {
                            requestAnimationFrame(checkVolume);
                        }
                    };

                    checkVolume();
                })
                .catch(err => {
                    setError(`Microphone access error: ${err.message}`);
                });
        }
    }, [isListening]);

    // Analysis functions remain the same
    const calculateTextSimilarity = (text1, text2) => {
        const words1 = text1.split(' ');
        const words2 = text2.split(' ');
        const matchingWords = words1.filter(word => words2.includes(word));
        return matchingWords.length / Math.max(words1.length, words2.length);
    };

    const calculateSpeakingPace = (text) => {
        const words = text.split(' ').length;
        const timeInMinutes = transcript.length / 100;
        return words / timeInMinutes;
    };

    const calculateOverallConfidence = ({
                                            rawConfidence,
                                            similarity,
                                            volumeLevel,
                                            wordsPerMinute
                                        }) => {
        const weights = {
            recognition: 0.3,
            similarity: 0.3,
            volume: 0.2,
            pace: 0.2
        };

        const normalizedVolume = volumeLevel / 255;
        const normalizedPace = Math.max(0, 1 - Math.abs(140 - wordsPerMinute) / 140);

        return (
            rawConfidence * weights.recognition +
            similarity * weights.similarity +
            normalizedVolume * weights.volume +
            normalizedPace * weights.pace
        );
    };

    const analyzeConfidence = useCallback((spokenText, rawConfidence) => {
        if (!expectedScript || !spokenText) return;

        const similarity = calculateTextSimilarity(spokenText.toLowerCase(), expectedScript.toLowerCase());
        const wordsPerMinute = calculateSpeakingPace(spokenText);

        const overallConfidence = calculateOverallConfidence({
            rawConfidence,
            similarity,
            volumeLevel,
            wordsPerMinute
        });

        if (onConfidenceAnalysis) {
            onConfidenceAnalysis({
                overallConfidence,
                details: {
                    speechRecognitionConfidence: rawConfidence,
                    scriptSimilarity: similarity,
                    volume: volumeLevel,
                    pace: wordsPerMinute
                }
            });
        }
    }, [expectedScript, volumeLevel, onConfidenceAnalysis]);

    // Start/Stop recording
    useEffect(() => {
        if (recognition) {
            if (isListening) {
                recognition.start();
            } else {
                recognition.stop();
            }
        }
    }, [isListening, recognition]);

    // Return null since this is a controller component
    return null;
};

export default VoiceRecognition;