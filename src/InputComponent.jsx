import './InputComponent.css';
import { useState, useRef, useEffect } from 'react';

function InputComponent(props) {
    const [arrivalTime, setArrivalTime] = useState('');
    const [burstTime, setBurstTime] = useState('');
    const [timeQuantum, setTimeQuantum] = useState('');

    const arrivalTimeRef = useRef(null);
    const burstTimeRef = useRef(null);

    useEffect(() => {
        if (arrivalTimeRef.current && burstTimeRef.current) {
            arrivalTimeRef.current.value = '';
            burstTimeRef.current.value = '';
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const arrivalTimeArr = arrivalTime.trim().split(/\s+/).map((at) => parseInt(at));
        const burstTimeArr = burstTime.trim().split(/\s+/).map((bt) => parseInt(bt));
        const timeQuantumInt = parseInt(timeQuantum);

        // Input validation
        if (burstTimeArr.includes(0)) {
            console.log('0 burst time is invalid');
            return;
        } else if (arrivalTimeArr.length !== burstTimeArr.length) {
            console.log('Number of the arrival times and burst times do not match');
            return;
        } else if (
            arrivalTimeArr.includes(NaN) ||
            burstTimeArr.includes(NaN) ||
            (isNaN(timeQuantumInt))
        ) {
            console.log('Please enter only integers');
            return;
        } else if (
            arrivalTimeArr.some((t) => t < 0) ||
            burstTimeArr.some((t) => t < 0)
        ) {
            console.log('Negative numbers are invalid');
            return;
        }

        // Call the onInputSubmit function provided by App immediately after gathering data
        props.onInputSubmit(arrivalTimeArr, burstTimeArr, timeQuantumInt);

        // Pass the gathered data back to the App component
        props.setArrivalTime(arrivalTimeArr);
        props.setBurstTime(burstTimeArr);
        props.setTimeQuantum(timeQuantumInt);

        console.log("Arrival Time: " + arrivalTimeArr);
        console.log("Burst Time: " + burstTimeArr);
        console.log("Time Quantum: " + timeQuantumInt);
    };

    return (
        <div className="form-container" onSubmit={handleSubmit}>
            <h1>Round Robin Scheduling Algorithm</h1>
            <h2>Arrival Time</h2>
            <input
                onChange={(e) => setArrivalTime(e.target.value)}
                type="text"
                id="arrival-time"
                placeholder='Example: 1 2 3 4 5'
                ref={arrivalTimeRef}
            />
            <h2>Burst Time</h2>
            <input
                onChange={(e) => setBurstTime(e.target.value)}
                type="text"
                id="burst-time"
                placeholder='Example: 2 4 6 8 10'
                ref={burstTimeRef}
            />
            <h2>Time Quantum</h2>
            <input
                onChange={(e) => setTimeQuantum(e.target.value)}
                type="number"
                id="time-quantum"
                name="timeQuantum"
                placeholder='Example: 3'
            />
            <button onClick={handleSubmit}>Solve</button>
        </div>
    );
}

export default InputComponent;
