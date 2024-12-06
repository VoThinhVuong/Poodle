import { useState } from "react";
import BaseURL from "../../port";

function Edit_AssignmentForm({assignment_item, fetchAssignments}) {
    const [assignmentTitle, setAssignmentTitle] = useState(assignment_item.assignmentTitle);
    const [assignmentDescription, setAssignmentDescription] = useState(assignment_item.assignmentDescription);
    const [dueDate, setDueDate] = useState(new Date(assignment_item.assignmentEndDate).toISOString().split('T')[0]);
    const [file, setFile] = useState(null);

    const editAssignment = (e) => { 
        e.preventDefault();
        alert(assignment_item.assignmentEndDate)
        try {
            const formData = new FormData();
            formData.append('assignmentID', assignment_item.assignmentID);
            formData.append('assignmentTitle', assignmentTitle);
            formData.append('assignmentDescription', assignmentDescription);
            formData.append('dueDate', dueDate);
            formData.append('file', file);
            fetch(BaseURL + '/staff/editAssignment', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Assignment edited successfully');
                    setAssignmentTitle('');
                    setAssignmentDescription('');
                    setDueDate('');
                    setFile(null);
                    fetchAssignments();
                } else {
                    alert('Failed to edit assignment: ' + data.error);
                }
            })
            .catch(error => {
                alert('Failed to edit assignment while fetching: ' + error);
            });
        } catch (error) { 
            alert('Failed to edit assignment while fetching: ' + error);
        }
    };

    return (
        <div>
            <h1>Edit Assignment Form</h1>
            <form onSubmit={editAssignment}>
                <label>Assignment Name</label>
                <input 
                    type="text" 
                    name="assignmentTitle" 
                    placeholder="Assignment Title" 
                    value={assignmentTitle}
                    onChange={e => setAssignmentTitle(e.target.value)} 
                    required 
                />
                <label>Assignment Description</label>
                <input 
                    type="text" 
                    name="assignmentDescription" 
                    placeholder="Assignment Description" 
                    value={assignmentDescription}
                    onChange={e => setAssignmentDescription(e.target.value)} 
                    required 
                />
                <label>Due Date</label>
                <input 
                    type="date" 
                    name="dueDate" 
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)} 
                    required 
                />
                <label>Upload New File (Optional)</label>
                <input
                    type="file"
                    name="file"
                    onChange={e => setFile(e.target.files[0])}
                />
                <button type="submit">Edit Assignment</button>
            </form>
        </div>
    )
}

export default Edit_AssignmentForm