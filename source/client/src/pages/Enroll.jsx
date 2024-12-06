import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import BaseURL from "../port.js";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import Open_course from "../Components/Open_course.jsx";

import "../styles/Enroll.css"

function Enroll() {

  const [cookie] = useCookies(['user'], {
		doNotParse: false,
		doNotUpdate: false
	});
  const [classes, setClasses] = useState([]);

  const user = cookie.user;

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = () => {
    fetch(BaseURL + '/student/openingCourseView')
    .then(res => res.json())
    .then(data => {
        if (data.data) {
            setClasses(data.data);
        } else {
            alert('Failed to fetch classes: ' + data.status);
        }
    });
  }

  return (
    <div className='enroll'>
      <Navbar />
      <div className='Header'>
        <h1>Course enrollment</h1>
        <h1>Available courses for this semester:</h1>
      </div>
      <div className="Enroll_container">
        {classes.map((course, index) => (
            <Open_course key={index} course_name={course.courseName} classID={course.classID} accountID={user.ID} className={course.classID}></Open_course>
        ))}
      </div>
      {/*<Footer />*/}
    </div>
  );
}

export default Enroll;
