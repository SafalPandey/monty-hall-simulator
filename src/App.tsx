import { Line } from 'react-chartjs-2';
import { useRef, useState } from 'react';
import { registerables, Chart } from 'chart.js';

import simulate from './service/simulator';
import { ResultType, StrategyType } from './types';

import './App.css';

Chart.register(...registerables);

function renderResults(results: { wins: number; loss: number }, maxIterations: number) {
  const NORMALIZE_TO = 1800;

  return [
    ...Array.from({ length: Math.floor((results.wins / maxIterations) * NORMALIZE_TO) })
      .map((_, idx) => <span key={`win-${idx}`} style={{ color: "black" }} >🏆</span>),
    ...Array.from({ length: Math.floor((results.loss / maxIterations) * NORMALIZE_TO) })
      .map((_, idx) => <span key={`loss-${idx}`} style={{ color: "black" }} >🐐</span>)
  ]
}

const DEFAULT_RESULT = { wins: 0, loss: 0, maxIterations: 0, iterationLog: new Map() };
const DEFAULT_MAX_ITERATIONS = 10000;

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const randomizeRef = useRef<HTMLInputElement>(null);

  const [shouldShowChart, setShouldShowChart] = useState(false);
  const [switchResults, setSwitchResults] = useState<ResultType>(DEFAULT_RESULT);
  const [noSwitchResults, setNoSwitchResults] = useState<ResultType>(DEFAULT_RESULT);

  const startSimulation = () => {
    const maxIterations = Number(inputRef.current?.value) || DEFAULT_MAX_ITERATIONS;
    const randomizeRevealedDoor = randomizeRef.current?.checked;
    setSwitchResults(simulate({ strategyType: "switch", maxIterations, randomizeRevealedDoor }))
    setNoSwitchResults(simulate({ strategyType: "don't switch", maxIterations, randomizeRevealedDoor }))
  }

  return (
    <div className="App">
      <header className="App-header">
        Monty Hall Simulator
      </header>
      <div className='input-block'>
        <label htmlFor="iterations">Max iterations: </label>
        <input ref={inputRef} type="number" name="iterations" id="iterations" defaultValue={DEFAULT_MAX_ITERATIONS} />&nbsp;&nbsp;&nbsp;

        <label htmlFor="randomize" title="If the revealed door is randomized the advantage of switching is nullified">
          Randomize revealed door:
        </label>
        <input
          ref={randomizeRef}
          type="checkbox"
          name="randomize"
          id="randomize"
          title="If the revealed door is randomized the advantage of switching is nullified"
        />
        &nbsp;
        <button onClick={startSimulation}>Simulate</button>
        <button onClick={() => setShouldShowChart(!shouldShowChart)}>
          {shouldShowChart ? "Display wins" : "Display Chart"}
        </button>
      </div>

      {shouldShowChart ? (
        <SimulationChart
          resultsByType={{ "switch": switchResults, "don't switch": noSwitchResults }}
        />
      )
        : (<div style={{ display: "flex", flexDirection: "row" }}>
          <SimulationOutput type='switch' results={switchResults} />
          <SimulationOutput type="don't switch" results={noSwitchResults} />
        </div>)}
    </div>
  );
}

function SimulationOutput(props: {
  type: StrategyType
  results: ResultType
}) {
  const { type, results } = props;

  return <div className="simulation">
    {type === "switch" ? "Switching after door reveal" : "Without Switching after door reveal"}
    <div >
      {renderResults(results, results.maxIterations)}
      <div style={{ color: 'black' }}>Percentage wins: {results.iterationLog.get(results.maxIterations)}</div>
    </div>
  </div>
}

function SimulationChart({
  resultsByType }: {
    resultsByType: { [K in StrategyType]: ResultType }
  }) {
  const { switch: switchResults, "don't switch": noSwitchResults } = resultsByType;

  return <Line
    options={{
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Winning percentage over game iterations',
        },
      },
    }}

    data={{
      labels: Array.from(switchResults.iterationLog.keys()),
      datasets: [{
        label: "Switching after reveal",
        data: Array.from(switchResults.iterationLog.values()),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: "No switching after reveal",
        data: Array.from(noSwitchResults.iterationLog.values()),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }]
    }}
  />
}

export default App;

