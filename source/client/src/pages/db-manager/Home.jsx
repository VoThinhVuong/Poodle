import { Link } from "react-router-dom";

import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

import "../../styles/DBM/Home.css";

function DBM_Home() {
  return (
    <div className="DBM_home">
      <Navbar/>
      <div className='Header'>
        <h1>Welcome P o o d l e's admin!</h1>
        <div className='container-header'>
          <div className='left'>
            <h1>Features:</h1>  
          </div>
          <div className='right'>
            <ul className='pop-up-list'>
              <li>
                <Link to="/db-manager/viewStudents">View Student List</Link>
                <br/>
              </li>
              <li>
                <Link to="/db-manager/viewExistStaffs">View Staff List</Link>
                <br/>
              </li>
              <li>
                <Link to="/db-manager/addStudentStaff">Add Student and Staff</Link>
                <br/>
              </li>
              <li>
                <Link to="/db-manager/viewExistClasses">View Class List</Link>
                <br/>
              </li>
              <li>
                <Link to="/db-manager/addClass">Add Class</Link>
                <br/>
              </li>
              <li>
                <Link to="/db-manager/viewExistCourses">View Course List</Link>
                <br/>
              </li>
              <li>
                <Link to="/db-manager/addCourse">Add Course</Link>
                <br/>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default DBM_Home