import { useState, useEffect } from "react";
import BaseURL from "../../port";

import Assignment_Item from './Assignment_Item';

function Student_Assignment_Session({classID}) { 
    const [assignments, setAssignments] = useState([]);
    
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

    useEffect(() => { 
        fetchAssignments();
    }, []);

    return (
        <div>
            {assignments.map(assignment => <Assignment_Item key={assignment.assignmentID} assignment={assignment} fetchAssignments={fetchAssignments}/>)}
        </div>
    )

}

export default Student_Assignment_Session