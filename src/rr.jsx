const rr = ({ arrivalTime, burstTime, timeQuantum }) => {
  const processesInfo = arrivalTime
    .map((item, index) => ({
      job: `P${index + 1}`,
      at: item,
      bt: burstTime[index],
    }))
    .sort((obj1, obj2) => obj1.at - obj2.at);

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
      const idleTime = unfinishedJobs[0].at - currentTime;
      if (idleTime > 0) {
        ganttChartInfo.push({
          job: 'Idle',
          start: currentTime,
          stop: unfinishedJobs[0].at,
          duration: idleTime
        });
      }
      readyQueue.push(unfinishedJobs[0]);
      currentTime = readyQueue[0].at;
    }

    const processToExecute = readyQueue[0];

    const executionTime = Math.min(remainingTime[processToExecute.job], timeQuantum);
    remainingTime[processToExecute.job] -= executionTime;
    const prevCurrentTime = currentTime;
    currentTime += executionTime;

    ganttChartInfo.push({
      job: processToExecute.job,
      start: prevCurrentTime,
      stop: currentTime,
      duration: executionTime
    });

    const processToArriveInThisCycle = processesInfo.filter((p) => 
      p.at <= currentTime &&
      p !== processToExecute &&
      !readyQueue.includes(p) &&
      unfinishedJobs.includes(p)
    );

    readyQueue.push(...processToArriveInThisCycle);
    readyQueue.push(readyQueue.shift());

    if (remainingTime[processToExecute.job] === 0) {
      unfinishedJobs.splice(unfinishedJobs.indexOf(processToExecute), 1);
      readyQueue.splice(readyQueue.indexOf(processToExecute), 1);
      solvedProcessesInfo.push({
        ...processToExecute,
        ft: currentTime,
        tat: currentTime - processToExecute.at,
        wat: currentTime - processToExecute.at - processToExecute.bt,
      });
    }
  }

  solvedProcessesInfo.sort((obj1, obj2) => {
    if (obj1.at !== obj2.at) return obj1.at - obj2.at;
    return obj1.job.localeCompare(obj2.job);
  });

  return { solvedProcessesInfo, ganttChartInfo };
};

export default rr;
