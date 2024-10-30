import React, { useState } from "react";
import InputComponent from "./InputComponent.jsx";
import OutputComponent from "./OutputComponent.jsx";
import './App.css';
import rr from './rr'; // Ensure rr is correctly imported



function App() {
  const [arrivalTime, setArrivalTime] = useState([]);
  const [burstTime, setBurstTime] = useState([]);
  const [timeQuantum, setTimeQuantum] = useState(0);
  const [ganttChartInfo, setGanttChartInfo] = useState([]);
  const [solvedProcessesInfo, setSolvedProcessesInfo] = useState([]); // State to hold solved processes

  // Modify this function to accept the parameters directly
  const handleInputSubmit = (arrivalTimeArr, burstTimeArr, timeQuantumInt) => {
    // Set the state directly from the parameters received
    setArrivalTime(arrivalTimeArr);
    setBurstTime(burstTimeArr);
    setTimeQuantum(timeQuantumInt);

    // Call the rr function and get results
    const { solvedProcessesInfo: newSolvedProcessesInfo, ganttChartInfo: newGanttChartInfo } = rr({
      arrivalTime: arrivalTimeArr,
      burstTime: burstTimeArr,
      timeQuantum: timeQuantumInt
    });
    
    // Set results in state
    setSolvedProcessesInfo(newSolvedProcessesInfo); // Store solved processes
    setGanttChartInfo(newGanttChartInfo); // Store Gantt chart info

    // Dispatch custom event to force recalculation
    window.dispatchEvent(new Event('recalculateGanttChart'));
  };

  return (
    <div className="wrapper">
      <div className="component-container">
        <InputComponent 
          setArrivalTime={setArrivalTime}
          setBurstTime={setBurstTime}
          setTimeQuantum={setTimeQuantum}
          onInputSubmit={handleInputSubmit} // Pass the input submit handler
        />
        <OutputComponent 
          solvedProcessesInfo={solvedProcessesInfo} // Pass solved processes to OutputComponent
          ganttChartInfo={ganttChartInfo} // Pass Gantt chart info to OutputComponent
          arrivalTime={arrivalTime}  // Pass arrivalTime to OutputComponent
          burstTime={burstTime}      // Pass burstTime to OutputComponent
        />
      </div>
    </div>
     
  );
}

export default App;
