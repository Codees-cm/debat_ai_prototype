"use client"
import { useState } from 'react';



const CaseSelection = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
    const [selectedType, setSelectedType] = useState('criminal');

    const generateNewCase = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/cases/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: selectedType,
                    difficulty: selectedDifficulty,
                }),
            });

            const newCase = await response.json();
            setCases(prev => [newCase, ...prev]);
        } catch (error) {
            console.error('Error generating case:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Case Selection</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Case Type</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="criminal">Criminal</option>
                            <option value="civil">Civil</option>
                            <option value="corporate">Corporate</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Difficulty</label>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={generateNewCase}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {loading ? 'Generating Case...' : 'Generate New Case'}
                </button>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Available Cases</h3>
                    <div className="space-y-4">
                        {cases.map((case_) => (
                            <div key={case_._id} className="border rounded-lg p-4 hover:bg-gray-50">
                                <h4 className="font-medium">{case_.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{case_.description}</p>
                                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Difficulty: {case_.difficulty}
                  </span>
                                    <button
                                        onClick={() => handleCaseSelection(case_._id)}
                                        className="bg-green-500 text-white px-4 py-1 rounded-md text-sm"
                                    >
                                        Start Case
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseSelection;