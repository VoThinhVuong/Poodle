import React, {useState, useEffect} from 'react'
import BaseURL from "../../port.js";

import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

function addCourse() {
  const [courseID, setCourseID] = useState('');
  const [courseName, setCourseName] = useState('');
  const [credit, setCredit] = useState(1);
  const [dateOpen, setDateOpen] = useState(new Date().toISOString().split('T')[0]);
  const [dateClose, setDateClose] = useState(new Date().toISOString().split('T')[0]);


  const handleSubmit = (event) => {
    event.preventDefault();
    const confirm = window.confirm('Are you sure you want to add this course?');
    if (!confirm) return;

    if (!courseID || !courseName) {
      alert('Please fill in the fields');
      return;
    }

    if ((dateOpen) >= (dateClose)) {
      alert('Invalid opening and closing dates');
      return;
    }

    if (Date(dateClose) <= new Date()) { 
      alert('Close date must be in the future');
      return
    }

    if (courseID.length > 10) { 
      alert('Course ID must be less than 10 characters!');
      return;
    }

    if (courseName.length > 50) { 
      alert('Course name must be less than 50 characters!');
      return;
    }


    try {
      fetch(BaseURL + '/dbmanager/addCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseID: courseID,
          courseName: courseName,
          credit: credit,
          dateOpen: dateOpen,
          dateClose: dateClose
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            setCourseID('');
            setCourseName('');
            setCredit(1);
            setDateOpen(new Date().toISOString().split('T')[0]);
            setDateClose(new Date().toISOString().split('T')[0]);
            alert('Course added successfully!');
          } else {
            alert('Failed to add course: ' + data.error);
          }
        });
    } catch (error) {
      alert('Failed to add course: ' + error);
    }
  }



  return (
    <div>
      <Navbar/>
      <div className='DBM_container'>
        <h1>Add Course</h1>
        <div className='Create_Acc_Form'>
        <form onSubmit={handleSubmit}>
          <label>
            Course ID:
            <input
              type="text"
              value={courseID}
              onChange={(e) => setCourseID(e.target.value)}
              placeholder="Enter Course ID"
              required
            />
          </label>
          <br />
          <label>
            Course Name:
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Enter Course Name"
              required
            />
          </label>
          <br />
          <label>
            Credit:
            <select value={credit} onChange={(e) => setCredit(Number(e.target.value))}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>
          <br/>
          <label>
            Course registration duration:
            Start date:
            <input type="date" value={dateOpen} required onChange={(e) => setDateOpen(e.target.value)}/>
            End date:
            <input type="date" value={dateClose} required onChange={(e) => setDateClose(e.target.value)}/>
          </label>
          <br />
          <button type="submit">Add Course</button>
        </form>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default addCourse;
