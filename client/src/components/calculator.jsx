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
};