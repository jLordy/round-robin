// OutputComponent.jsx
import React from 'react';
import Table from './Table'; // Make sure to import TableComponent
import GanttChart from './GanttChart'; // Import the GanttChart component
import './OutputComponent.css';

const OutputComponent = ({ solvedProcessesInfo, ganttChartInfo, arrivalTime, burstTime }) => {
  if (!arrivalTime.length || !burstTime.length) {
  return (
    <div className='output-container'>
      <h1>Output</h1>
      <h2>Gantt chart and table will be shown here</h2>
    </div>
  );
  }else{
    return(
      <div className='output-container'>
      <h1>Output</h1>
        <div className="gantt-chart-wrapper">
          <GanttChart ganttChartInfo={ganttChartInfo} /> {/* Pass data to GanttChart */}
        </div>
      <Table solvedProcessesInfo={solvedProcessesInfo} /> {/* Pass data to TableComponent */}
    </div>
    )
  }
};

export default OutputComponent;
