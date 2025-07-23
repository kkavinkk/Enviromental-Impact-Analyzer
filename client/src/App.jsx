import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


function App() {
  //Carbon Footprint, Water footprint, Energy consumption, resopurce depletion
  // Yes, you can create an environmental score out of 100 by using a weighted normalization formula that combines different environmental impact metrics like Carbon Footprint, Water Footprint, Energy Consumption, and Resource Depletion.

  // ✅ Step-by-Step Formula to Create an Environmental Score (Out of 100)
  // Step 1: Normalize Each Metric (Convert to 0–1 scale)
  // You first normalize each value using min-max normalization:

  // Normalized Metric
  // =
  // Value
  // −
  // Min
  // Max
  // −
  // Min
  // Normalized Metric= 
  // Max−Min
  // Value−Min
  // ​
  
  // If lower is better (which it usually is for environmental impact), you invert it:

  // Score
  // 𝑖
  // =
  // 1
  // −
  // Value
  // 𝑖
  // −
  // Min
  // 𝑖
  // Max
  // 𝑖
  // −
  // Min
  // 𝑖
  // Score 
  // i
  // ​
  // =1− 
  // Max 
  // i
  // ​
  // −Min 
  // i
  // ​
  
  // Value 
  // i
  // ​
  // −Min 
  // i
  // ​
  
  // ​
  
  // This gives each metric a score from 0 (worst) to 1 (best).

  // Step 2: Apply Weights
  // Assign weights (based on importance or expert guidance). Example:

  // Metric	Weight (%)
  // Carbon Footprint	40%
  // Water Footprint	25%
  // Energy Consumption	20%
  // Resource Depletion	15%

  // Weights must total 100%.

  // Step 3: Combine Scores
  // Total Score
  // =
  // (
  // CarbonScore
  // ×
  // 0.4
  // )
  // +
  // (
  // WaterScore
  // ×
  // 0.25
  // )
  // +
  // (
  // EnergyScore
  // ×
  // 0.2
  // )
  // +
  // (
  // ResourceScore
  // ×
  // 0.15
  // )
  // Total Score=(CarbonScore×0.4)+(WaterScore×0.25)+(EnergyScore×0.2)+(ResourceScore×0.15)
  // Step 4: Scale to 100
  // Environmental Score
  // =
  // Total Score
  // ×
  // 100
  // Environmental Score=Total Score×100
  // 🔢 Example Calculation
  // Metric	Value	Min	Max	Normalized Score	Weight	Weighted Score
  // Carbon Footprint	50 kg	30	100	1 - (50-30)/70 = 0.714	0.4	28.6
  // Water Footprint	200 L	100	500	1 - (200-100)/400 = 0.75	0.25	18.75
  // Energy Consumption	80 MJ	50	200	1 - (80-50)/150 = 0.8	0.2	16.0
  // Resource Depletion	20 kg	10	50	1 - (20-10)/40 = 0.75	0.15	11.25

  // Total Score = 28.6 + 18.75 + 16.0 + 11.25 = 74.6

  // ✅ Environmental Score = 74.6 / 100
  return (
    <div>
      <p>
        Carbon Emissions Footprint
      </p>
      <form>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
      <p>
        Water Consumption(L)
      </p>
      <form>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
      <p>
        Energy Consumption(kWh or MJ)
      </p>
      <form>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
      <p>
        Resource Depletion
      </p>
      <form>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </div>
  )
}

export default App
