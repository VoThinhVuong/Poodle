import React, {useState, useEffect} from 'react'
import BaseURL from "../../port.js";

import Navbar from '../../Components/Navbar.jsx';

import "../../styles/DBM/createAcc.css"

// this add funtcion is used to add a student to the database
// it takes in the username, full name and file of the student
// file of student: the file of the student that is being added
// file structure: 
// MSSV1, Fullname1, role1
// MSSV2, Fullname2, role2
// ...

function AddStudentStaff() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const confirm = window.confirm('Are you sure you want to create this account?');
    if (!confirm) return;

    if (!file) {
      if (!username || !fullName) {
        alert('Please fill in the fields or upload a file');
        return ;
      }
    }
    const formData = new FormData();
    // Conditionally append the file if it exists
    if (file) {
      formData.append('file', file);
    }

    // Append other form fields
    formData.append('username', username);
    formData.append('fullname', fullName);

    // Determine the role based on the selected option in the dropdown
    const selectedRole = document.querySelector('input[name="role"]:checked').value === 'student' ? 1 : 2;
    formData.append('role', selectedRole);

    setUsername('');
    setFullName('');
    setFile(null);



    try {
      fetch(BaseURL + '/dbmanager/add-student-staff',{
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          alert('Account created');
        } else {
          alert('Failed to create account: ' + data.error);
        }
      });
    } catch (error) {
      alert('Failed to create account: ' + error);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className='DBM_container'>
        <h1>Create Account</h1>
        <div className='Create_Acc_Form'>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Username: </p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            <p>Full Name: </p>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>
          <label>
            <p>Role: </p> 
            <label>
              <input name='role' type='radio' value='student'/>
              Student
            </label>
            <label>
              <input name='role' type='radio' value='staff'/>
              Staff
            </label>
          </label>

          <div className='line-container'>
            <span>OR</span>
          </div>

          <label>
            <p>Upload file: </p>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])} // Correct handling
            />
          </label>
          <br />
          <button type="submit">Create</button>
          
        </form>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  );
}

export default AddStudentStaff;
