import { useState } from 'react';

// Normalized moin max range
const ranges = {
  carbon: { min: 30, max: 124 },        // kg CO2e
  water: { min: 500, max: 10000 },      // Liters
  energy: { min: 100, max: 2000 },      // MJ
  resource: { min: 0.002, max: 0.02 }   // kg Sb eq
}

const weights = {
    carbon: 0.4,
    water: 0.25,
    energy: 0.2,
    resource: 0.15
}

function Calculator() {
    const [inputs, setInputs] = useState({
        carbon: '',
        water: '',
        energy: '',
        resource: ''
    });

    const [score, setScore] = useState(null);

    const normalize = (value, min, max) => {
        const v = parseFloat(value);
        return Math.max(0, Math.min(1, 1 - (v - min) / (max - min)));
    };

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const calculate = (e) => {
        e.preventDefault();

        const carbonScore = normalize(inputs.carbon, ranges.carbon.min, ranges.carbon.max);
        const waterScore = normalize(inputs.water, ranges.water.min, ranges.water.max);
        const energyScore = normalize(inputs.energy, ranges.energy.min, ranges.energy.max);
        const resourceScore = normalize(inputs.resource, ranges.resource.min, ranges.resource.max);

        const total = 
            carbonScore * weights.carbon +
            waterScore * weights.water +
            energyScore * weights.energy +
            resourceScore * weights.resource;

        setScore((total * 100).toFixed(2))
    };
};

return (
    <div style={{ padding: '1rem', maxWidth: '400px', margin: 'auto' }}>
        <h2>Enviromental  Im,pact Analyzer</h2>
        <form onSubmit={calculate}>
            <label htmlFor=""></label>
        </form>
    </div>
)