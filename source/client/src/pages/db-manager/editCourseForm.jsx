import React, {useState, useEffect} from 'react'
import BaseURL from "../../port.js";

function EditCourseForm({ course, onClose, onUpdate }) {
    const [courseName, setCourseName] = useState(course.courseName);
    const [courseCredit, setCourseCredit] = useState(course.credit);
    const [dateOpen, setDateOpen] = useState(course.dateOpen.split('T')[0]);
    const [dateClose, setDateClose] = useState(course.dateClose.split('T')[0]);

    const courseID = course.courseID;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirm = window.confirm('Are you sure you want to update this course?');
        if (!confirm) return;
        
        const clickedButton = e.nativeEvent.submitter.name
        if (clickedButton === 'cancel') { 
            onClose();
            return
        }

        if (!courseName) {
            alert('Please fill in the fields');
            return;
        }
      
        if (dateOpen >= dateClose) {
            alert('Invalid opening and closing dates');
            return;
        }
        alert('dateOpen: ' + dateOpen + ' dateClose: ' + dateClose);
        alert('credit: ' + courseCredit);
        try {
            fetch(`${BaseURL}/dbmanager/editCourse`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseID, courseName, courseCredit, dateOpen, dateClose }),
            }).then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Course updated successfully');
                    onUpdate();
                    onClose();
                } else {
                    alert('Failed to update course: ' + data.error);
                }
            })
            .catch((error) => {
                alert('Failed to update course: ' + error);
            });
        } catch (error) { 
            alert('Failed to update course: ' + error);
        }
    };

    return (
        <div>
            <h2>Edit Course</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Course Name:
                    <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Course Credit:
                    <select value={courseCredit} onChange={e => setCourseCredit(e.target.value)}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                </label>
                <label>
                    Start Date:
                    <input
                        type="date"
                        value={dateOpen}
                        onChange={e => setDateOpen(e.target.value)}
                        required
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="date"
                        value={dateClose}
                        onChange={e => setDateClose(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Update Course</button>
                <button type="submit" name="cancel">Cancel</button>
            </form>
        </div>
    );
}

export default EditCourseForm;
