// GanttChart.jsx
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const ChartContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  height: 80px;  // Increased height
`;

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Bar = styled.div`
  height: 80px;  // Increased height
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 16px;  // Increased font size
`;

const TimeLabel = styled.div`
  font-size: 14px;  // Increased font size
  position: absolute;
  bottom: -25px;
  transform: translateX(-50%);
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

  useLayoutEffect(() => {
    function updateSize() {
      setContainerWidth(containerEl.current.offsetWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (currentAnimatingIndex < ganttChartInfo.length) {
      const timer = setTimeout(() => {
        setCurrentAnimatingIndex(currentAnimatingIndex + 1);
      }, ganttChartInfo[currentAnimatingIndex].duration * 100); // Adjust this multiplier to control overall animation speed
      return () => clearTimeout(timer);
    }
  }, [currentAnimatingIndex, ganttChartInfo]);

  const totalDuration = ganttChartInfo.reduce((sum, info) => sum + info.duration, 0);
  const scale = (containerWidth - 1) / totalDuration;

  let accumulatedWidth = 0;
  return (
    <Container ref={containerEl}>
      <ChartContainer>
        {ganttChartInfo.map((info, index) => {
          const width = Math.max(info.duration * scale, 30);
          const leftPosition = accumulatedWidth;
          accumulatedWidth += width;
          return (
            <BarContainer key={index} style={{ width: `${width}px` }}>
              {index <= currentAnimatingIndex && (
                <>
                  <AnimatedBar
                    style={{
                      backgroundColor: info.job === 'Idle' ? 'lightgray' : getColor(info.job),
                      animationDuration: `${info.duration * 0.05}s`, // Adjust this multiplier to control individual animation speed
                    }}
                  >
                    {info.job}
                  </AnimatedBar>
                  <AnimatedTimeLabel 
                    style={{ 
                      left: `${leftPosition}px`,
                      animationDelay: `${info.duration * 0.05}s` // Sync with bar animation
                    }}
                  >
                    {info.start}
                  </AnimatedTimeLabel>
                  {index === ganttChartInfo.length - 1 && (
                    <AnimatedTimeLabel 
                      style={{ 
                        left: `${accumulatedWidth}px`,
                        animationDelay: `${info.duration * 0.05}s` // Sync with bar animation
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
