import { useRef, useState } from 'react';
import './App.css';
import simulate from './service/simulator';
import { StrategyType } from './types';

function renderResults(results: { wins: number; loss: number }, maxIterations: number) {
  return [
    ...Array.from({ length: Math.floor((results.wins / maxIterations) * 2000) })
      .map((_, idx) => <span key={`win-${idx}`} style={{ color: "black" }} >🀫</span>),
    ...Array.from({ length: Math.floor((results.loss / maxIterations) * 2000) })
      .map((_, idx) => <span key={`loss-${idx}`} style={{ color: "black" }} >🀆</span>)
  ]
}

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [switchResults, setSwitchResults] = useState({ wins: 0, loss: 0, maxIterations: 0 });
  const [noSwitchResults, setNoSwitchResults] = useState({ wins: 0, loss: 0, maxIterations: 0 });

  const startSimulation = () => {
    const maxIterations = Number(inputRef.current?.value) || 1000;

    setSwitchResults(simulate("switch", maxIterations))
    setNoSwitchResults(simulate("don't switch", maxIterations))
  }

  return (
    <div className="App">
      <header className="App-header">
        Monty Hall Simulator
      </header>
      <div className='input-block'>
        <label htmlFor="iterations">Max iterations: </label>
        <input ref={inputRef} type="number" name="iterations" id="iterations" defaultValue={1000} />&nbsp;
        <button onClick={startSimulation}>Simulate</button>
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <SimulationOutput type='switch' results={switchResults} />
        <SimulationOutput type="don't switch" results={noSwitchResults} />
      </div>
    </div>
  );
}

function SimulationOutput(props: {
  type: StrategyType
  results: { wins: number, loss: number, maxIterations: number }
}) {
  const { type, results } = props;

  return <div className="simulation">
    {type === "switch" ? "Switching after door reveal" : "Without Switching after door reveal"}
    <div >
      {renderResults(results, results.maxIterations)}
      <div style={{ color: 'black' }}>Percentage wins: {(results.wins / results.maxIterations) * 100}</div>
    </div>
  </div>
}

export default App;

