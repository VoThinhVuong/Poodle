import React, {useState, useEffect} from 'react'
import BaseURL from "../../port.js";

function EditClassForm({ class_item, onClose, onUpdate }) { 
    const [classID, setClassID] = useState(class_item.classID);
    const [courseID, setCourseID] = useState(class_item.courseID);
    const [weekday, setWeekday] = useState(class_item.weekday);
    const [timeStart, setTimeStart] = useState(class_item.timeStart);
    const [timeEnd, setTimeEnd] = useState(class_item.timeEnd);
    const [dateStart, setDateStart] = useState(new Date(class_item.dateStart).toISOString().split('T')[0]);
    const [dateEnd, setDateEnd] = useState(new Date(class_item.dateEnd).toISOString().split('T')[0]);
    const [location, setLocation] = useState(class_item.location);
    const [lecturerID, setLecturerID] = useState(class_item.lecturer);


    useEffect(() => { 
        fetchLecturer();
    }, []);

    const fetchLecturer = async () => { 
        fetch(`${BaseURL}/dbmanager/getLecturer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ classID: classID }),
        }) 
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    if (data.lecturer.length === 0) {
                        return;
                    }
                    setLecturerID(data.lecturer[0].accountID);
                } else {
                    alert('Failed to fetch lecturer: ' + data.error);
                }
            })
            .catch((error) => {
                alert('Failed to fetch lecturer: ' + error);
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        


        const clickedButton = e.nativeEvent.submitter.name
        if (clickedButton === 'cancel') { 
            onClose();
            return
        }
        const confirm = window.confirm('Are you sure you want to update this class?');
        if (!confirm) return;

        if (!courseID || !weekday || !timeStart || !timeEnd || !dateStart || !dateEnd || !location) { 
            alert('Please fill in all fields');
            return;
        }

        if (timeStart >= timeEnd) { 
            alert('Start time must be before end time');
            return;
        }

        if (dateStart >= dateEnd) { 
            alert('Start date must be before end date');
            return;
        }

        try {
            fetch(`${BaseURL}/dbmanager/editClass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ classID: class_item.classID, courseID, weekday, timeStart, timeEnd, dateStart, dateEnd, location, accountID: lecturerID }),
            }).then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Class updated successfully');
                    onUpdate();
                    onClose();
                } else {
                    alert('Failed to update class: ' + data.error);
                }
            })
            .catch((error) => {
                alert('Failed to update class: ' + error);
            });
        } catch (error) {
            alert('Failed to update class: ' + error);
        }
    };

    return (
        <div className='Edit_class'>
            <h3>Edit Class Section</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Class ID:
                    <input
                        type="text"
                        value={classID}
                        readOnly
                    />
                </label>
                <br />
                <label>
                    Course ID:
                    <input
                        type="text"
                        value={courseID}
                        onChange={(e) => setCourseID(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Weekday:
                    <select value={weekday} onChange={(e)=>setWeekday(e.target.value)}>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                    </select>
                </label>
                <br />
                <label>
                    Start Time:
                    <input
                        type="time"
                        value={timeStart}
                        onChange={(e) => setTimeStart(e.target.value)}
                        placeholder="Enter Start Time"
                        required
                    />
                </label>
                <br />
                <label>
                    End Time:
                    <input
                        type="time"
                        value={timeEnd}
                        onChange={(e) => setTimeEnd(e.target.value)}
                        placeholder="Enter End Time"
                        required
                    />
                </label>
                <br />
                <label>
                    Date Start:
                    <input
                        type="date"
                        value={dateStart}
                        onChange={(e) => setDateStart(e.target.value)}
                        placeholder="Enter Date Start"
                        required
                    />
                </label>
                <br />
                <label>
                    Date End:
                    <input
                        type="date"
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                        placeholder="Enter Date End"
                        required
                    />
                </label>
                <br />
                <label>
                    Location:
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Add lecturer:
                    <input
                        type="text"
                        value={lecturerID}
                        onChange={(e) => setLecturerID(e.target.value)}
                        placeholder='accountID'
                        
                    />
                </label>
                <br />
                <div className='Submit_Section'>
                    <button type="submit">Update</button>
                    <button type="submit" name="cancel" >Cancel</button>
                </div>
                
            </form>
        </div>
    );
}

export default EditClassForm;