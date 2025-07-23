import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


function App() {

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
