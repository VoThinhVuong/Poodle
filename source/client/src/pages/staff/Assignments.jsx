import { useState } from "react";
import BaseURL from "../../port";

import Staff_Assignment_Item from './Assignment_Item';
import Add_AssignmentForm from './Add_AssignmentForm';

function Staff_Assignment_Session({classID}) { 
    const [assignments, setAssignments] = useState([]);
    const [assignment, setAssignment] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    const fetchAssignments = () => { 
        try {
            fetch(BaseURL + '/staff/viewAssignments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ classID: classID })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Failed to fetch assignments: ' + data.error);
                } else {
                    setAssignments(data);
                }
            })
        }
        catch (error) { 
            alert('Failed to fetch assignments while fetching: ' + error);
        }
    }

    const [count, setCount] = useState(0);
    if (count === 0) {
        fetchAssignments();
        setCount(1);
    }

    const handleShowForm = () => { 
        setShowForm(!showForm);
    }

    return (
        <div>
            <div className="title-section">
                <div className="grid2">
                    <h1 id='grid-left'>Assignments</h1>

                    <div className="menu" id="grid-right">
                        <button className="menu-button view" onClick={fetchAssignments}></button>
                        <button className="menu-button add" onClick={handleShowForm}></button>   
                    </div>
                </div>
            </div>
            
            <div>
                {showForm && <Add_AssignmentForm classID={classID} fetchAssignments={fetchAssignments}/>}
                {assignments.map(assignment => <Staff_Assignment_Item key={assignment.assignmentID} assignment={assignment} fetchAssignments={fetchAssignments}/>)}
            </div>
        </div>
        
    )

}

export default Staff_Assignment_Session