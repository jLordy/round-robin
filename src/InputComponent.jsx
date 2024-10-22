import Swal from 'sweetalert2';
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
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "0 burst time is not allowed",
              });;
            return;
        } else if (arrivalTimeArr.length !== burstTimeArr.length) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "The number of arrival time and burst time does not match",
              });;
            return;
        }else if (
            arrivalTimeArr.includes(NaN) ||
            burstTimeArr.includes(NaN) ||
            (isNaN(timeQuantumInt))
        ) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please complete the input values",
              });;
    
            return;
        } else if (
            arrivalTimeArr.some((t) => t < 0) ||
            burstTimeArr.some((t) => t < 0)
        ) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Negative numbers are invalid",
              });;
      
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
        <div className="input-container" onSubmit={handleSubmit}>
            <div className="design">
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
        </div>
    );
}

export default InputComponent;
