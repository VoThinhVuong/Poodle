// import Navbar from "../../Components/Navbar";
// import Footer from "../../Components/Footer";
// import React, { useContext, useState } from 'react'
// import BaseURL from "../../port";
// import { UserContext } from "../../context";
// import Cookies from 'js-cookie';
// import { useCookies } from "react-cookie";



// function RegisterCourseForm() { 
//     const [cookie] = useCookies(['user'], {
// 		doNotParse: false,
// 		doNotUpdate: false
// 	});
//     const [openCourses, setOpenCourses] = useState([]);
//     const [registeredCourses, setRegisteredCourses] = useState([]);
//     const [notRegisteredCourses, setNotRegisteredCourses] = useState([]);
//     const [error, setError] = useState('');

//     const user = cookie.user;
    
//     const fetchOpenCourses = () => { 
//         fetch(BaseURL + '/student/openingCourseView', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({}),
//         })
//         .then(res => res.json())
//         .then(data => {
//             if (data.status === 'success') { 
//                 if (data.data.length === 0) { 
//                     setError('No courses available to register');
//                     setOpenCourses([]);
//                     return;
//                 }
//                 setOpenCourses(data.courses);
//             } else {
//                 setError(data.error);
//                 setOpenCourses([]); // Clear courses on fetch failure
//             }
//         })
//         .catch(err => {
//             setError(error + 'Failed to fetch courses');
//             setOpenCourses([]); // Clear courses on fetch failure
//         });
//     }

//     const fetchRegisteredCourses = () => {
//         fetch(BaseURL + '/student/getRegisteredCourses', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ ID: user.ID }),
//         })
//         .then(res => res.json())
//         .then(data => {
//             alert("COURSE " + JSON.stringify(data));
//             if (data.status === 'success') { 
//                 if (data.courses.length === 0) { 
//                     setError('No registered courses');
//                     alert('No registered courses');
//                     setRegisteredCourses([]);
//                     return;
//                 }
//                 setRegisteredCourses(data.courses);
//             } else { 
//                 alert('Failed to fetch registered courses');
//                 setError(data.error + 'Failed to fetch registered courses');
//                 setRegisteredCourses([]); // Clear courses on fetch failure
//             }
//         })
//         .catch(err => {
//             alert('Failed to fetch registered courses');
//             setRegisteredCourses([]); // Clear courses on fetch failure
//         });
//     }

//     const fetchNotRegisteredCourses = () => { 
//         let temp = openCourses.filter(course => { 
//             return !registeredCourses.includes(course);
//         });
//         setNotRegisteredCourses(temp);
//         alert(JSON.stringify('Temp ' + temp));
//     }

//     const setData = () => {
//         fetchOpenCourses();
//         fetchRegisteredCourses();
//         fetchNotRegisteredCourses();
//     }

//     const registerCourse = (classID) => {
//         fetch(BaseURL + '/student/registerCourse', { 
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//                 accountID: user.ID,
//                 classID: classID
//             })
//         }).then(res => res.json())
//         .then(data => {
//             if (data.status === 'success') {
//                 setData();
//             } else { 
//                 alert('Failed to register course: ' + data.error);
//             }
//         })
//     }

//     const dropCourse = (classID) => { 
//         fetch(BaseURL + '/student/dropCourse', { 
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//                 accountID: user.ID,
//                 classID: classID
//             })
//         }).then(res => res.json())
//         .then(data => {
//             if (data.status === 'success') {
//                 setData();
//             } else { 
//                 alert('Failed to drop course: ' + data.error);
//             }
//         })
//     }

//     return   (
//         <div>
//             <Navbar/>
//             <div className='Header'>
//                 <h1>Register Course</h1>
//             </div>
//             <button onClick={setData}>Refresh</button>
//             <div className='Registered'> 
//                 <h2>REGISTERED COURSE</h2>
//                 {registeredCourses.map((course, index) => (
//                     <div 
//                     key={index}
//                     >
//                         <h2>{course.courseName}</h2>
//                         <h3>{course.className}</h3>
//                         <p>{course.weekday} {course.timeStart} - {course.timeEnd}</p>
//                         <p>{course.dateStart} - {course.dateEnd}</p>
//                         <button onClick={() => dropCourse(course.classID)}>Drop</button>
//                     </div>
//                 ))}

//             </div>
//             <div className='NotRegistered'>
//                 <h2>NOT REGISTER COURSE</h2>

//             {notRegisteredCourses.map((course, index) => (
//                 <div 
//                 key={index}               
//                 >
//                     <h2>{course.courseName}</h2>
//                     <h3>{course.className}</h3>
//                     <p>{course.weekday} {course.timeStart} - {course.timeEnd}</p>
//                     <p>{course.dateStart} - {course.dateEnd}</p>
//                     <button onClick={() => registerCourse(course.classID)}>Register</button>
//                 </div>
//             ))}
//             </div>
//             {/* <Footer/> */}
//         </div>
//     )
// }

// export default RegisterCourseForm;