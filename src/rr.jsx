const rr = ({ arrivalTime, burstTime, timeQuantum }) => {
  const processesInfo = arrivalTime
    .map((item, index) => {
      const job =
        arrivalTime.length > 26
          ? `P${index + 1}`
          : (index + 10).toString(36).toUpperCase();

      return {
        job,
        at: item,
        bt: burstTime[index],
      };
    })
    .sort((obj1, obj2) => obj1.at - obj2.at); // Sort by arrival time

  const solvedProcessesInfo = [];
  const ganttChartInfo = [];

  const readyQueue = [];
  let currentTime = processesInfo[0].at;
  const unfinishedJobs = [...processesInfo];

  const remainingTime = processesInfo.reduce((acc, process) => {
    acc[process.job] = process.bt;
    return acc;
  }, {});

  readyQueue.push(unfinishedJobs[0]);
  
  while (
    Object.values(remainingTime).reduce((acc, cur) => acc + cur, 0) &&
    unfinishedJobs.length > 0
  ) {
    if (readyQueue.length === 0 && unfinishedJobs.length > 0) {
      // Previously idle
      readyQueue.push(unfinishedJobs[0]);
      currentTime = readyQueue[0].at;
    }

    const processToExecute = readyQueue[0];

    // Determine the time to execute
    const executionTime = Math.min(remainingTime[processToExecute.job], timeQuantum);
    remainingTime[processToExecute.job] -= executionTime;
    const prevCurrentTime = currentTime;
    currentTime += executionTime;

    ganttChartInfo.push({
      job: processToExecute.job,
      start: prevCurrentTime,
      stop: currentTime,
    });

    const processToArriveInThisCycle = processesInfo.filter((p) => {
      return (
        p.at <= currentTime &&
        p !== processToExecute &&
        !readyQueue.includes(p) &&
        unfinishedJobs.includes(p)
      );
    });

    // Push new processes to readyQueue
    readyQueue.push(...processToArriveInThisCycle);

    // Requeueing (move head/first item to tail/last)
    readyQueue.push(readyQueue.shift());

    // When the process finishes executing
    if (remainingTime[processToExecute.job] === 0) {
      const indexToRemoveUJ = unfinishedJobs.indexOf(processToExecute);
      if (indexToRemoveUJ > -1) {
        unfinishedJobs.splice(indexToRemoveUJ, 1);
      }
      const indexToRemoveRQ = readyQueue.indexOf(processToExecute);
      if (indexToRemoveRQ > -1) {
        readyQueue.splice(indexToRemoveRQ, 1);
      }

      solvedProcessesInfo.push({
        ...processToExecute,
        ft: currentTime,
        tat: currentTime - processToExecute.at,
        wat: currentTime - processToExecute.at - processToExecute.bt,
      });
    }
  }

  // Sort the solved processes by arrival time and then by job name
  solvedProcessesInfo.sort((obj1, obj2) => {
    if (obj1.at > obj2.at) return 1;
    if (obj1.at < obj2.at) return -1;
    if (obj1.job > obj2.job) return 1;
    if (obj1.job < obj2.job) return -1;
    return 0;
  });

  return { solvedProcessesInfo, ganttChartInfo }; // Return the results
};

export default rr;
