// GanttChart.jsx
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const paddingFactor = 1.5; // Increase this value to add more space

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 40px;
`;



const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 80px;
`;

const BarContainer = styled.div`
  position: absolute;
  height: 100%;
`;

const Bar = styled.div`
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  flex: 1;
`;

const TimeLabel = styled.div`
  font-size: 12px;
  position: absolute;
  bottom: -25px;
  transform: translateX(-50%);
  white-space: nowrap;
`;



const growAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const AnimatedBar = styled(Bar)`
  @media (max-width: 600px) {
    font-size: 10px; // Smaller font on narrow screens
  }
  width: 0;
  animation: ${growAnimation} forwards;
`;

const AnimatedTimeLabel = styled(TimeLabel)`
  opacity: 0;
  animation: ${fadeInAnimation} 0.5s forwards;
`;
const getColor = (job) => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F06292", "#AED581", "#7986CB", "#4DB6AC", "#FFD54F"
  ];
  const index = parseInt(job.slice(1)) - 1;
  return colors[index % colors.length];
};

const GanttChart = ({ ganttChartInfo }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentAnimatingIndex, setCurrentAnimatingIndex] = useState(0);
  const containerEl = useRef(null);

  function updateSize() {
    const availableWidth = containerEl.current.offsetWidth;
    const totalDuration = ganttChartInfo.reduce((sum, info) => sum + info.duration, 0);
    const scale = Math.max((availableWidth / totalDuration) * paddingFactor, 40);
    const requiredWidth = totalDuration * scale;
    
    // Calculate the new width, but don't exceed the available width if not necessary
    const newWidth = Math.min(Math.max(availableWidth, requiredWidth), availableWidth);

    // Reset the container width to the available width or the required width, whichever is larger
    setContainerWidth(Math.max(availableWidth, requiredWidth));
  
    // Reset the parent container's width
    const parentContainer = containerEl.current.closest('.parent-container');
    if (parentContainer) {
      parentContainer.style.width = `${Math.max(availableWidth, requiredWidth)}px`;
    }
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    updateSize();
  }, [ganttChartInfo]);

  useEffect(() => {
    if (currentAnimatingIndex < ganttChartInfo.length) {
      const timer = setTimeout(() => {
        setCurrentAnimatingIndex(currentAnimatingIndex + 1);
      }, ganttChartInfo[currentAnimatingIndex].duration * 100);
      return () => clearTimeout(timer);
    }
  }, [currentAnimatingIndex, ganttChartInfo]);

  useEffect(() => {
    const handleRecalculate = () => updateSize();
    window.addEventListener('recalculateGanttChart', handleRecalculate);
    return () => window.removeEventListener('recalculateGanttChart', handleRecalculate);
  }, []);

  const totalDuration = ganttChartInfo.reduce((sum, info) => sum + info.duration, 0);
  const scale = containerWidth / totalDuration;


  let accumulatedWidth = 0;
  return (
    <Container ref={containerEl}>
      <ChartContainer>
        {ganttChartInfo.map((info, index) => {
          const width = (info.duration / totalDuration) * 100; // Calculate width as a percentage
          const leftPosition = (accumulatedWidth / totalDuration) * 100; // Calculate left position as a percentage
          accumulatedWidth += info.duration;
          return (
            <BarContainer key={index} style={{ width: `${width}%`, left: `${leftPosition}%` }}>
              {index <= currentAnimatingIndex && (
                <>
                  <AnimatedBar
                    style={{
                      backgroundColor: info.job === 'Idle' ? 'lightgray' : getColor(info.job),
                      animationDuration: `${info.duration * 0.05}s`,
                    }}
                  >
                    {info.job}
                  </AnimatedBar>
                  <AnimatedTimeLabel 
                    style={{ 
                      left: '0',
                      animationDelay: `${info.duration * 0.05}s`
                    }}
                  >
                    {info.start}
                  </AnimatedTimeLabel>
                  {index === ganttChartInfo.length - 1 && (
                    <AnimatedTimeLabel 
                      style={{ 
                        left: '100%',
                        animationDelay: `${info.duration * 0.05}s`
                      }}
                    >
                      {info.stop}
                    </AnimatedTimeLabel>
                  )}
                </>
              )}
            </BarContainer>
          );
        })}
      </ChartContainer>
    </Container>
  );
};




export default GanttChart;