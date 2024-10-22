import React from 'react';
import styled from 'styled-components';

const TableWrapper = styled.div`
  overflow-x: auto;  /* Horizontal scrolling if content overflows */
  max-width: 100%;
  margin: 0px auto 20px auto;
  font-family: Helvetica;

  /* Optional: Remove background if not required */
  background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
  background-position: 0 0, 100%, 0 0, 100%;
  background-attachment: local, local, scroll, scroll;

  /* Adding padding for better spacing */
  padding: 20px;
`;

const StyledTable = styled.table`
  font-family: Helvetica;
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden; /* Ensure overflow is handled for round corners */
  table-layout: auto; /* Allows columns to resize naturally */

  tr {
    height: 40px;
    line-height: 0;
  }

  th, td {
    text-align: left;
    padding: 15px;
    border: 1px solid #e1e1e1;
    line-height: 16.1px;
    white-space: nowrap; /* Prevents text from wrapping */
  }

  /* Responsive adjustments for smaller screens */
  @media (max-width: 390px) {
    th, td {
      padding: 8px;
      font-size: 0.9rem; /* Reduce font size */
    }

    tr {
      height: 35px; /* Adjust row height for smaller screens */
    }

    th, td {
      white-space: normal; /* Allow text wrapping on small screens */
    }
  }
`;

const HeaderCell = styled.th`
  font-family: Helvetica;
  font-size: 1rem;
  font-weight: 600;
  height: 40px;
  white-space: nowrap;
  color: rgb(233, 239, 236); /* Light text color */
  background-color: rgb(22, 66, 60); /* Dark header background */
  padding: 10px 15px; /* Consistent padding */
`;


const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};


const Table = ({ solvedProcessesInfo}) => {

  const total = (array) =>
    array.reduce((acc, currentValue) => acc + currentValue, 0);

  const numberOfProcesses = solvedProcessesInfo.length;
  const turnaoundTime = solvedProcessesInfo.map((process) => process.tat);
  const waitingTime = solvedProcessesInfo.map((process) => process.wat);

  const totalTAT = total(turnaoundTime);
  const averageTAT = totalTAT / numberOfProcesses;

  const totalWAT = total(waitingTime);
  const averageWAT = totalWAT / numberOfProcesses;

  return (
    <TableWrapper>    
    <StyledTable>
      <thead>
        <tr>
          <HeaderCell>Process</HeaderCell>
          <HeaderCell>Arrival Time</HeaderCell>
          <HeaderCell>Burst Time</HeaderCell>
          <HeaderCell>Finish Time</HeaderCell>
          <HeaderCell>Turnaround Time</HeaderCell>
          <HeaderCell>Waiting Time</HeaderCell>
        </tr>
      </thead>
      <tbody>
        {solvedProcessesInfo.map((item, index) => (
          <tr key={`process-row-${item.job}`}>
            <td>{item.job}</td>
            <td>{item.at}</td>
            <td>{item.bt}</td>
            <td>{item.ft}</td>
            <td>{item.tat}</td>
            <td>{item.wat}</td>
          </tr>
        ))}
        {
          <tr>
            <td colSpan={4} style={{ textAlign: 'right' }}>
              Average
            </td>
            <td>
              {totalTAT} / {numberOfProcesses} = {precisionRound(averageTAT, 3)}
            </td>
            <td>
              {totalWAT} / {numberOfProcesses} = {precisionRound(averageWAT, 3)}
            </td>
          </tr>
        }
      </tbody>
    </StyledTable>
  </TableWrapper>
);
};
export default Table;
