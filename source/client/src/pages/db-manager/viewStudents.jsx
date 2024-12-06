import React, {useState, useEffect} from 'react'
import BaseURL from "../../port.js";

import Navbar from '../../Components/Navbar.jsx';
import Footer from '../../Components/Footer.jsx';

import EditStudentStaffForm from './editStudentStaffForm.jsx';
import Account_item from '../../Components/Account_item.jsx';

import "../../styles/DBM/viewStudents.css"

function ViewExistStudent() {
  const [students, setStudents] = useState([]);
  const [searchID, setSearchID] = useState(''); 
  const [allStudents, setAllStudents] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [editAction, setEditAction] = useState(false);
  const [deleteAction, setDeleteAction] = useState(false); 

  // Fetch students when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = (accountID) => { 
    if (window.confirm('Are you sure you want to delete this student?')) {
      fetch(`${BaseURL}/dbmanager/deleteStudentStaff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountID }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            alert('Student deleted successfully');
            fetchStudents(); // Refresh the student list
          } else {
            alert('Failed to delete student: ' + data.error);
          }
        })
        .catch((error) => {
          alert('Failed to delete student: ' + error);
        });
    }
  };

  const handleStudentClick = (selectedStudent) => { 
    if (deleteAction) { 
        handleDeleteStudent(selectedStudent.accountID);
    } else if (editAction) {
        setEditStudent(selectedStudent);
    }
  };

  const toggleEditAction = () => {
    setDeleteAction(false);
    setEditAction(prevEditAction => !prevEditAction);
  };

  const toggleDeleteAction = () => {
    setEditAction(false);
    setDeleteAction(prevDeleteAction => !prevDeleteAction);
  };

  const fetchStudents = () => {
    fetch(BaseURL + '/dbmanager/viewExistStudents')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setAllStudents(data.students);
          setStudents(data.students);
        } else {
          alert('Failed to fetch students: ' + data.error);
        }
      });
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase().trim(); // Convert to lowercase and trim whitespace
    setSearchID(searchValue);

    const filteredStudents = allStudents.filter(student => {
      const accountID = student.accountID.toString().toLowerCase(); // Convert to lowercase
      console.log("Comparing with:", accountID); // Log the account ID for each student
      return accountID.includes(searchValue);
    });

    setStudents(filteredStudents);
  };

  return (
    <div>
      <Navbar/>
      <div className="DBM_container">
          <h1>VIEW    STUDENT</h1>
          <div id = "input-section">
            <input
              type="text"
              value={searchID}
              onChange={handleSearchChange}
              placeholder="Find specific student with ID"
            />
          </div>
          
          <div className='Button'>
          <button
            onClick={toggleEditAction} 
            className={editAction ? 'chosen' : 'notChosen'}
          >
            {editAction ? 'Edit' : 'Edit'}
          </button>

            <button
              onClick={toggleDeleteAction}
              className={deleteAction ? 'chosen' : 'notChosen'}
            >
              {deleteAction ? "Delete" : "Delete"}
            </button>
          </div>
          
          <div id="StudentList">
            {students.map((student, index) => (
              <div
              key={index} 
              onClick={() => handleStudentClick(student)}
              >
                  <Account_item account={student} />
              </div>
            ))}

            {editStudent && (
              <EditStudentStaffForm 
                student={editStudent}
                onUpdate={fetchStudents}
                onClose={() => setEditStudent(null)}
              />
            )}
          </div>
      </div>
      <Footer/>
    </div>
  );
}

export default ViewExistStudent;
