import React, {useState, useEffect} from 'react'
import BaseURL from '../../port';

function Add_AssignmentForm({ classID }) {
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [file, setFile] = useState(null);

    const addAssignment = (e) => { 
        e.preventDefault();
        alert('Adding assignment');

        try {
            const formData = new FormData();
            formData.append('classID', classID);
            formData.append('assignmentTitle', assignmentTitle);
            formData.append('assignmentDescription', assignmentDescription);
            formData.append('dueDate', dueDate);
            formData.append('file', file);
            fetch(BaseURL + '/staff/addAssignment', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Assignment added successfully');
                    setAssignmentTitle('');
                    setAssignmentDescription('');
                    setDueDate('');
                    setFile(null);                    
                } else {
                    alert('Failed to add assignment: ' + data.error);
                }
            })
            .catch(error => {
                alert('Failed to add assignment while fetching: ' + error);
            });
        } catch (error) { 
            alert('Failed to add assignment while fetching: ' + error);
        }

        
    };

    return (
        <div className='container-element'>
            <h1>Add Assignment Form</h1>
            <form onSubmit={addAssignment}>
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
                <label>File</label>
                <input 
                    type="file" 
                    name="file" 
                    onChange={e => setFile(e.target.files[0])}  
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Add_AssignmentForm;
