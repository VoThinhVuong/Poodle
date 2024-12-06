import React, {useState, useEffect} from 'react'
import BaseURL from '../port';

import Enrolled_Course from './Enrolled_course';

function Home_courses({ accountID, role }) {

  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    if (role === 1) {
      fetch(BaseURL + '/student/enrolledCourseView', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "ID": accountID }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setCourses([]); // Clear courses if there's an error
        } else if (data.length === 0) {
          setError('No courses found');
          setCourses([]);
        } else {
          setCourses(data);
          setError(null);
        }
      })
      .catch(err => {
        setError('Failed to fetch courses: ' + err.message);
        setCourses([]); // Clear courses on fetch failure
      });
    } else if (role === 2) {
      fetch(BaseURL + '/staff/TeachingCourseView', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "ID": accountID }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setCourses([]); // Clear courses if there's an error
        } else if (data.length === 0) {
          setError('No courses found');
          setCourses([]);
        } else {
          setCourses(data);
          setError(null);
        }
      })
      .catch(err => {
        setError('Failed to fetch courses: ' + err.message);
        setCourses([]); // Clear courses on fetch failure
      });
    }
  }

  return (
    <div className='Courses'>
      {error ? (
        <p>{error}</p>
      ) : (
        courses.length > 0 && courses.map((course, index) => (
          <Enrolled_Course key={index} courseName={course.Class.Course.courseName} courseID = {course.Class.Course.courseID} classID={course.Class.classID}></Enrolled_Course>
        ))
      )}
    </div>
  );
}

export default Home_courses;
