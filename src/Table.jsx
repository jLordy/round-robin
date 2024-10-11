import React from 'react';
import styled from 'styled-components';


const TableWrapper = styled.div`
  overflow: auto;
  max-width: 100%;
  margin: 0px auto 20px auto;
  font-family: Helvetica;
  
  background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
  background-position: 0 0, 100%, 0 0, 100%;
  background-attachment: local, local, scroll, scroll;
`;

const StyledTable = styled.table`
  font-family: Helvetica;
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  box-sizing: border-box;


  tr {
    font-family: Helvetica;
    height: 40px;
    line-height: 0;
  }

  th,
  td {
    font-family: Helvetica;
    text-align: left;
    padding: 15px;
    border: 1px solid #e1e1e1;
    line-height: 16.1px;
  }
`;

const HeaderCell = styled.th`
  font-family: Helvetica;
  font-size: 1rem;
  font-weight: 600;
  height: 40px;
  white-space: nowrap;
  color: rgb(233, 239, 236);
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
