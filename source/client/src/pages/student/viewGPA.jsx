import React, {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie';
import BaseURL from '../../port'

import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

function ViewGPA() { 
    const [scores, setScores] = useState([]);
    const [GPA, setGPA] = useState(0);
    const [cookie] = useCookies(['user'], {
		doNotParse: false,
		doNotUpdate: false
	});

    const user = cookie.user;
    
    useEffect(() => {
        getGPAs();
        calculateGPA();
     }, []);


    const getGPAs = async () => {
        try {
            fetch(`${BaseURL}/student/viewScore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountID: user.ID }),
            }).then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setScores(data.scores);
                } else {
                    alert('Failed to view GPA: ' + data.error);
                }
            })
            .catch((error) => {
                alert('Failed to view GPA: ' + error);
            });
        } catch (error) {
            alert('Failed to view GPA: ' + error);
        }
    };

    const calculateGPA = async () => {
        let total = 0;
        let credit = 0;
        for (let score in scores) {
            total += score.grade * score.credit;
            credit += score.credit;
        }
        setGPA(total / credit);
    }

    return (
        <div>
            <Navbar/>
            <div className='Header'>
                <h1>View GPA</h1>
                <h2>Your GPA is: {GPA}</h2>
                <ul>
                    {scores.map((gpa, index) => (
                        <li key={index}>
                            <h3>Course: {gpa.courseName + ' - ' + gpa.courseID}</h3>
                            <h3>Grade: {gpa.grade}</h3>
                            <h3>Credit: {gpa.credit}</h3>
                        </li>
                    ))}
                </ul>
            </div>
            <Footer/>
        </div>
    )


}

export default ViewGPA