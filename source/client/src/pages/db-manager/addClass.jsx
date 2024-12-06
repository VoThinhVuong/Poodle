import React, {useState, useEffect} from 'react'
import BaseURL from "../../port.js";

import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

function AddClass() {
    const [classID, setClassID] = useState('');
    const [courseID, setCourseID] = useState('');
    const [semester, setSemester] = useState(1);
    const [weekday, setWeekday] = useState(2);
    const [maxSlot, setMaxSlot] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [dateStart, setDateStart] = useState(new Date().toISOString().split('T')[0]);
    const [dateEnd, setDateEnd] = useState(new Date().toISOString().split('T')[0]);

    // function to format date and time
    // time: from 12-hour AM/PM to 24-hour
    const formatAmPmToSQLTime = (timeString) => {
        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':');
    
        if (hours === '12') {
            hours = '00';
        }
    
        if (modifier === 'PM') {
            hours = String(parseInt(hours, 10) + 12);
        }
    
        return `${hours}:${minutes}:00`;
    };
    // date: from MM/DD/YYYY to YYYY-MM-DD
    const formatDateToSQLDateOnly = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const confirm = window.confirm('Are you sure you want to add this class?');
        if (!confirm) { 
            return;
        }

        if (!classID || !courseID || !semester || !maxSlot || !weekday || !startTime || !endTime || !location) {
            alert('Please fill in all fields!');
            return;
          }


        if (classID.length > 10) { 
            alert('Class ID must be less than 10 characters!');
            return;
        }


        if (startTime >= endTime) { 
            alert('Start time must be before end time!');
            return;
        }
        
        if (dateStart > dateEnd) { 
            alert('Start date must be before end date!');
            return;
        }

        if (dateEnd < new Date()) { 
            alert('End date must be after today!');
            return;
        } 

        if (isNaN(maxSlot)) {
            alert ('Max slot must be a number!');
            return;
        }

        if (maxSlot < 1) { 
            alert('Max slot must be greater than 0!');
            return;
        }
        
        if (maxSlot > 1000) {
            alert('Max slot must be less than 1000!');
            return;
        }
        
        const specialCharRegex = /[^a-zA-Z0-9\s]/;
        if (specialCharRegex.test(location)) {
            alert('Location must not contain special characters!');
            return
        }

          try {
            fetch(BaseURL + '/dbmanager/addClass', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    classID: classID,
                    courseID: courseID,
                    semester: Number(semester),
                    weekday: Number(weekday),
                    maxSlot: Number(maxSlot),
                    timeStart: formatAmPmToSQLTime(startTime),
                    timeEnd: formatAmPmToSQLTime(endTime),
                    location: location,
                    dateStart: dateStart,
                    dateEnd: dateEnd
                }),
            }).then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setClassID('');
                    setCourseID('');
                    setSemester(1);
                    setWeekday(2);
                    setMaxSlot('');
                    setStartTime('');
                    setEndTime('');
                    setLocation('');
                    setDateStart(new Date());
                    setDateEnd(new Date());
                    alert('Class added successfully!');
                } else {
                    setClassID('');
                    setCourseID('');
                    setSemester(1);
                    setWeekday(2);
                    setMaxSlot('');
                    setStartTime('');
                    setEndTime('');
                    setLocation('');
                    setDateStart(new Date());
                    setDateEnd(new Date());
                    alert('Failed to add class: ' + data.error);
                }
            })
        } catch (error) {
            alert('Failed to add class: ' + error);
        }
    }
    

    return (
        <div>
            <Navbar/>
            <div className='DBM_container'>
                <h1>Add Class</h1>
                <div className='Create_Acc_Form'>
                <form onSubmit={handleSubmit}>
                    <label>
                        Class ID:
                        <input
                            type="text" 
                            value={classID}
                            onChange={(e) => setClassID(e.target.value)}
                            placeholder="Enter Class ID"
                            required
                        />
                    </label>
                    <br/>
                    <label>
                        Course ID:
                        <input
                            type="text"
                            value={courseID}
                            onChange={(e) => setCourseID(e.target.value)}
                            placeholder="Enter Course ID"
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Semester:
                        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Weekday:
                        <select value={weekday} onChange={(e)=>setWeekday(e.target.value)}>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Max Slot:
                        <input
                            type="text"
                            value={maxSlot}
                            onChange={(e) => setMaxSlot(e.target.value)}
                            placeholder="Enter Max Slot"
                            required
                        />
                    </label>
                    <br/>
                    <label>
                        Start Time:
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            placeholder="Enter Start Time"
                            required
                        />
                    </label>
                    <br />
                    <label>
                        End Time:
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            placeholder="Enter End Time"
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Location:
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter Location"
                            required
                        />
                    </label>
                    <br/>
                    <label>
                        Date Start:
                        <input
                            type="date"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                            placeholder="Enter Date Start"
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Date End:
                        <input
                            type="date"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                            placeholder="Enter Date End"
                            required
                        />
                    </label>
                    <br />
                    <button type='submit'>Add Class</button>
                </form>
                </div>
            </div>
            {/* <Footer/> */}
        </div>
        
    )
}

export default AddClass