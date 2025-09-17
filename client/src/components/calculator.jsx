import { useState } from 'react';

// Normalized min max range
const ranges = {
    carbon: { min: 30, max: 124 },        // kg CO2e
    water: { min: 500, max: 10000 },      // Liters
    energy: { min: 100, max: 2000 },      // MJ
    resource: { min: 0.002, max: 0.02 }  // kg Sb eq
};

const weights = {
    carbon: 0.4,
    water: 0.25,
    energy: 0.2,
    resource: 0.15
};

function Calculator() {
    const [inputs, setInputs] = useState({
        carbon: '',
        water: '',
        energy: '',
        resource: ''
    });

    const [score, setScore] = useState(null);
    const [productQuery, setProductQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [geminiData, setGeminiData] = useState(null);
    const [error, setError] = useState('');

    const normalize = (value, min, max) => {
        const v = parseFloat(value);
        return Math.max(0, Math.min(1, 1 - (v - min) / (max - min)));
    };

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const fetchEnvironmentalData = async () => {
        if (!productQuery.trim()) {
            setError('Please enter a product or service to analyze');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productQuery }),
            });

            if (!response.ok) {
                // The server will now return the error message in the response body
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const data = await response.json();
            setGeminiData(data);

            // Auto-populate the form with Gemini data
            setInputs({
                carbon: data.carbon?.toString() || '',
                water: data.water?.toString() || '',
                energy: data.energy?.toString() || '',
                resource: data.resource?.toString() || ''
            });

        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching environmental data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculate = () => {
        if (!inputs.carbon || !inputs.water || !inputs.energy || !inputs.resource) {
            setError('Please fill in all fields');
            return;
        }

        const carbonScore = normalize(inputs.carbon, ranges.carbon.min, ranges.carbon.max);
        const waterScore = normalize(inputs.water, ranges.water.min, ranges.water.max);
        const energyScore = normalize(inputs.energy, ranges.energy.min, ranges.energy.max);
        const resourceScore = normalize(inputs.resource, ranges.resource.min, ranges.resource.max);

        const total = 
            carbonScore * weights.carbon +
            waterScore * weights.water +
            energyScore * weights.energy +
            resourceScore * weights.resource;

        setScore((total * 100).toFixed(2));
        setError('');
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-grey rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Environmental Impact Analyzer
            </h2>
            
            {/* Gemini Data Retrieval Section */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                    Get Environmental Data with AI
                </h3>
                <div className="flex flex-col space-y-3">
                    <input
                        type="text"
                        value={productQuery}
                        onChange={(e) => setProductQuery(e.target.value)}
                        placeholder="Enter product/service (e.g., 'smartphone', '1kg beef', 'car manufacturing')"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={fetchEnvironmentalData}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition-colors"
                    >
                        {loading ? 'Fetching Data...' : 'Get Environmental Data'}
                    </button>
                </div>
                
                {geminiData && (
                    <div className="mt-4 p-3 bg-green-50 rounded">
                        <h4 className="font-semibold text-green-800">AI Retrieved Data:</h4>
                        <p className="text-sm text-gray-600 mt-1">{geminiData.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Assumptions: {geminiData.assumptions}</p>
                    </div>
                )}
            </div>

            {/* Manual Input Section */}
            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Environmental Metrics</h3>
                
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Carbon Footprint (kg CO₂e):
                    </label>
                    <input 
                        name="carbon" 
                        type="number" 
                        step="any" 
                        value={inputs.carbon} 
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Water Consumption (L):
                    </label>
                    <input 
                        name="water" 
                        type="number" 
                        step="any" 
                        value={inputs.water} 
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Energy Consumption (MJ):
                    </label>
                    <input 
                        name="energy" 
                        type="number" 
                        step="any" 
                        value={inputs.energy} 
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Resource Depletion (kg Sb eq):
                    </label>
                    <input 
                        name="resource" 
                        type="number" 
                        step="any" 
                        value={inputs.resource} 
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <button 
                onClick={calculate}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded transition-colors"
            >
                Calculate Environmental Score
            </button>

            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {loading && (
                <div className="mt-4 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Fetching environmental data...</p>
                </div>
            )}

            {score && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-3">Results:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p><strong>Carbon Footprint:</strong> {inputs.carbon || 0} kg CO₂e</p>
                            <p><strong>Water Consumption:</strong> {inputs.water || 0} L</p>
                        </div>
                        <div>
                            <p><strong>Energy Consumption:</strong> {inputs.energy || 0} MJ</p>
                            <p><strong>Resource Depletion:</strong> {inputs.resource || 0} kg Sb eq</p>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded border-l-4 border-green-500">
                        <h4 className="text-lg font-bold text-green-600">
                            Environmental Score: {score} / 100
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                            {score > 70 ? 'Excellent environmental performance!' :
                            score > 50 ? 'Good environmental performance' :
                            score > 30 ? 'Moderate environmental impact' :
                            'High environmental impact - consider improvements'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calculator;