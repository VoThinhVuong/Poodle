import React, {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie';
import BaseURL from '../../port'

import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

function ViewSchedule() { 
    const [schedule, setSchedule] = useState([]);
    const [cookie] = useCookies(['user'], {
		doNotParse: false,
		doNotUpdate: false
	});

    const user = cookie.user;
    
    useEffect(() => {
        getSchedule();
     }, []);

    const getSchedule = async () => {
        try {
            fetch(`${BaseURL}/student/viewSchedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountID: user.ID }),
            }).then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setSchedule(data.schedule);
                } else {
                    alert('Failed to view schedule: ' + data.error);
                }
            })
            .catch((error) => {
                alert('Failed to view schedule: ' + error);
            });
        } catch (error) {
            alert('Failed to view schedule: ' + error);
        }
    };

    return (
        <div>
            <Navbar/>
            <div className='Header'>
                <h1>View Schedule</h1>
                <h2>Your Schedule:</h2>
                <ul>
                    {schedule.map((course, index) => (
                        <li key={index}>
                            <p>{course.name}</p>
                            <p>{course.day}</p>
                            <p>{course.time}</p>
                            <p>{course.location}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <Footer/>
        </div>
    )
}

export default ViewSchedule