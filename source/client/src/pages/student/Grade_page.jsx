import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import BaseURL from "../../port";

function Student_Grade_Page({ classID }) {
    const [gradeCols, setGradeCols] = useState('');
    const [grades, setGrades] = useState('');
    const [overall, setOverall] = useState('');

    const [cookie] = useCookies(['user']);
    const user = cookie.user;

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = () => {
        try {
            fetch(BaseURL + '/student/viewCourseGrade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    classID: classID,
                    accountID: user.ID
                }),
            })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    alert(data.error);
                } else {
                    setOverall(data.overall);
                    
                    setGradeCols(data.grades.map(grade => ({name: grade.gradeName, percentage: grade.percentage})));
                    setGrades(data.grades.map(item => item.grade));
                }
            })
        } catch (error) { 
            alert(error);
        }
    }

    return (
        <div>
            <h1>Grade Page</h1>
            <table>
                <thead>
                    <tr>{
                            gradeCols.length > 0 && gradeCols.map((item, index) => (
                                <th key={index}>{item.name}({item.percentage + "%"})</th>
                            ))
                        }
                        <th>Overall</th>
                    </tr>
                    
                </thead>
                <tbody>
                    <tr>
                        {
                            grades.length > 0 && grades.map((grade, index) => (
                                <td key={index}>{grade}</td>
                            ))
                        }
                        <td>{overall}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Student_Grade_Page;
