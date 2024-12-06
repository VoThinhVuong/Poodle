import React, {useState, useEffect} from 'react'
import BaseURL from "../../port.js";

function EditStudentStaffForm({ student, onClose, onUpdate }) { 
    const [accountID, setAccountID] = useState(student.accountID);
    const [fullname, setFullname] = useState(student.fullname);
    const [password, setPassword] = useState(student.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const clickedButton = e.nativeEvent.submitter.name

        if (clickedButton === 'cancel') { 
            onClose();
            return
        }
        
        if (!fullname || !password) { 
            alert('Please fill in all fields');
            return;
        }

        try {
            fetch(`${BaseURL}/dbmanager/editStudentStaff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountID: student.accountID, fullname, password }),
            }).then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Student/Staff updated successfully');
                    onUpdate();
                    onClose(); // Hide the form after update
                } else {
                    alert('Failed to update student/staff: ' + data.error);
                }
            })
            .catch((error) => {
                alert('Failed to update student/staff: ' + error);
            });
        } catch (error) {
            alert('Failed to update student/staff: ' + error);
        }
    };

    return (
        <div className='editSection'>
            <h2>Edit Student/Staff Section</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Account ID:
                    <input
                        type="text"
                        value={accountID}
                        readOnly
                    />
                </label>
                <br />
                <label>
                    Full Name:
                    <input
                        type="text"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <div className='button-section'>
                    <button type="submit" name='update' style={{ cursor: 'pointer' }}>
                        Update
                    </button>
                    <button 
                        type="submit"
                        name='cancel' 
                        style={{ cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditStudentStaffForm;
