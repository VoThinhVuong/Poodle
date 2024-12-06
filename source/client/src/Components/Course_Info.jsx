import React, {useState, useEffect} from 'react'
import BaseURL from '../port';

function CourseInfo({classID, courseID}) {
  const [classInfo, setClassInfo] = useState('');
  const [lecturerName, setLecturer] = useState('');

  const fetchInfo = () => {
      const postOptions = {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              classID: classID
        }),
      };
      
      try {
          fetch(BaseURL + '/courseInfo', postOptions)
          .then(res => res.json())
          .then(data => {
              if (data.error) {
                alert(data.error);
              } else {
                  setClassInfo(data.classInfo);
                  setLecturer(data.lecturer);
              }
          });
      } catch (error) {
          alert(error);
      }
  }

  useEffect(()=>{
      fetchInfo();
      
  }, []);

  return (
    <div className='Course-info'>
    <h1>Course Information</h1>
    {classInfo && (
        <div>
            <h2>Course: {classInfo.courseID} - {classInfo.courseName}</h2>
            <h3>Credit: {classInfo.credit}</h3>
            <h3>Lecturer: {lecturerName}</h3>
            <h3>Location: {classInfo.location}</h3>
            <h3>Time: {classInfo.weekday + ' ' + classInfo.timeStart + ' - ' + classInfo.timeEnd}</h3>
        </div>
    )}
</div>
  )
}

export default CourseInfo