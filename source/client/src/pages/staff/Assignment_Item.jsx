import { useState } from "react";
import BaseURL from "../../port";
import { useCookies } from "react-cookie";

import Edit_AssignmentForm from './Edit_AssignmentForm';

function Staff_Assignment_Item({assignment, fetchAssignments}) { 
    const [submits, setSubmits] = useState([]);
    const [showSubmits, setShowSubmits] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [cookies] = useCookies(['user']);
    const accountID = cookies.user.accountID;

    const removeAssignment = () => { 
        try {
            fetch(BaseURL + '/staff/removeAssignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assignmentID: assignment.assignmentID, accountID: accountID})
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Assignment removed successfully.');
                    fetchAssignments();
                } else {
                    alert('Failed to remove assignment: ' + data.error);
                }
            })
            .catch(error => {
                alert('Failed to remove assignment while fetching: ' + error);
            });
        } catch (error) { 
            alert('Failed to remove assignment while fetching: ' + error);
        }
    }

    const editAssignment = () => { 
        setShowEdit(!showEdit);
    }

    const viewSubmit = () => { 
        try {
            fetch(BaseURL + '/staff/viewSubmits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assignmentID: assignment.assignmentID })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Failed to fetch submissions: ' + data.error);
                } else {
                    setSubmits(data);
                    if (data.length > 0)
                        alert('Submissions fetched successfully.');
                    else
                        alert('No submissions found.'); }
            })
        }
        catch (error) { 
            alert('Failed to fetch submits while fetching: ' + error);
        }
        setShowSubmits(!showSubmits);
    }

    return (
        <div className="course-element">
            <h3 id='container-title'>{assignment.assignmentTitle}</h3>
            <div className="container-element">
                <div className="grid2">
                    <p id='grid-left'>{assignment.assignmentDescription}</p>
                    <div className="menu" id='grid-right'>
                        <button className="menu-button" onClick={viewSubmit}>View Submissions</button>
                        <button className='menu-button edit' onClick={editAssignment}></button>
                        <button className="menu-button delete" onClick={removeAssignment}></button>
                    </div>
                </div>
                
                
                
                
                {showEdit && <Edit_AssignmentForm assignment_item={assignment} fetchAssignments={fetchAssignments}/>}
                {showSubmits && <div>
                    {submits.map(submit => <div key={submit.submitID}>
                        <p>{submit.accountID}</p>
                        <p>{submit.submitDate}</p>
                    </div>)}
                </div>}
            </div>

        </div>
    )
}

export default Staff_Assignment_Item