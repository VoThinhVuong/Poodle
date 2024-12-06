import { useState, useEffect } from "react";
import BaseURL from "../../port";

function Staff_Grade_Page({ classID }) { 
    const [grades, setGrades] = useState([]);
    const [gradeNames, setGradeNames] = useState([]);
    const [showAddGrade, setShowAddGrade] = useState(false);
    const [name, setName] = useState('');
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = () => {
        try {
            fetch(BaseURL + '/staff/viewGrades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({classID}),
            })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    alert(data.error);
                } else {
                    setGrades(data.grades);
                    setGradeNames(data.gradeNames);
                }
            })
        } catch (error) { 
            alert(error);
        }
    }

    const addGrade = () => {
        alert('Add Grade ' + name + ' ' + percentage + ' ' + classID);
        try {
            fetch(BaseURL + '/staff/addGrade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({classID: classID, gradeName: name, gradePercentage: percentage}),
            })
            .then(res => res.json())
            .then(data => {
                setName('');
                setPercentage(0);
                if(data.error) {
                    alert(data.error);
                } else {
                    alert('Grade Added');
                    fetchGrades();
                }
            })
        } catch (error) {
            alert(error);
        }
        setShowAddGrade(prev=>!prev)
    }

    const handleGradeChange = (e, index, subIndex) => { 
        const newGrades = [...grades];
        if (e.target.innerHTML === '' || e.target.innerHTML === ' ' || e.target.innerHTML < 0) {
            e.target.innerHTML = 0;
        }
        if (isNaN(parseFloat(e.target.innerHTML))) {
            e.target.innerHTML = 0;
        }
        if (parseFloat(e.target.innerHTML) > 10) {
            e.target.innerHTML = 10; 
        }
        newGrades[index].grades[subIndex] = parseFloat(e.target.innerHTML);
        let total = 0;
        for (let i = 0; i < newGrades[index].grades.length; i++) {
            let percent = gradeNames[i].split(' ')[-1].split('%')[0].split('(')[1];
            total += newGrades[index].grades[i] * percent;
        }
        // T1 (5%) T2 (20%) T3 (30%) T4 (40%): string
        newGrades[index].total = total/100;
        setGrades(newGrades);
    }

    const handleUpdateGrade = () => { 
        const confirmUpdate = window.confirm('Are you sure you want to update the grades?');

        if (!confirmUpdate) {
            return;
        }

        try {
            fetch(BaseURL + '/staff/updateGrade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({grades: grades, gradeNames: gradeNames, classID: classID}),
            })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    alert(data.error);
                } else {
                    alert('Grade Updated');
                }
            })
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="grade_page">
            <h1>Student's grade</h1>
            <button className="add" onClick={e=>setShowAddGrade(prev=>!prev)}></button>
            {showAddGrade && (
                <form>
                    <input type="text" placeholder="Grade Name" onChange={e=>setName(e.target.value)}required/>
                    <input type="number" placeholder="Percentage" step='1' onChange={e=>setPercentage(e.target.value)} required/>
                    <button onClick={addGrade}>Submit</button>
                </form>
            )}
            <button className="edit" onClick={handleUpdateGrade}></button>
            <button className="refresh" onClick={fetchGrades}></button>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Student ID</th>
                        {gradeNames.map((gradeName, index) => ( 
                            <th key={index}>{gradeName}</th>)
                        )}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.map((grade, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{grade.accountID}</td>
                            {grade.grades.map((gradeValue, subIndex) => (
                                <td
                                key={subIndex}
                                contentEditable={true} // Make the cell editable
                                suppressContentEditableWarning={true} // Suppress warning for contentEditable
                                onBlur={(e) => handleGradeChange(e, index, subIndex)} // Handle changes
                            >{gradeValue}</td>
                            ))}
                            <td>{grade.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
        </div>
    );
}

export default Staff_Grade_Page;
