import React, {useState, useEffect} from 'react'
import BaseURL from "../../port.js";

import Navbar from '../../Components/Navbar.jsx';
import Footer from '../../Components/Footer.jsx';

import Course_item from "../../Components/Course_item.jsx";
import EditCourseForm from './editCourseForm.jsx'; // Assuming you have this component

function ViewExistCourses() {
    const [courses, setCourses] = useState([]);
    const [searchID, setSearchID] = useState('');
    const [allCourses, setAllCourses] = useState([]);
    const [editCourse, setEditCourse] = useState(null);
    const [editAction, setEditAction] = useState(false);
    const [deleteAction, setDeleteAction] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        fetch(BaseURL + '/dbmanager/viewExistCourses')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setAllCourses(data.courses);
                    setCourses(data.courses);
                } else {
                    alert('Failed to fetch courses: ' + data.error);
                }
            });
    };

    const handleCourseClick = (selectedCourse) => { 
        if (deleteAction) { 
            handleDeleteCourse(selectedCourse.courseID);
        } else if (editAction) {
            setEditCourse(selectedCourse);
        }
    };

    const handleDeleteCourse = (courseID) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            fetch(`${BaseURL}/dbmanager/deleteCourse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseID }),
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Course deleted successfully');
                    fetchCourses(); // Refresh the course list
                } else {
                    alert('Failed to delete course: ' + data.error);
                }
            })
            .catch((error) => {
                alert('Failed to delete course: ' + error);
            });
        }
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase().trim();
        setSearchID(searchValue);

        const filteredCourses = allCourses.filter(course => {
            return course.courseID.toLowerCase().includes(searchValue);
        });

        setCourses(filteredCourses);
    };

    const toggleEditAction = () => {
        setDeleteAction(false);
        setEditAction(prevEditAction => !prevEditAction);
    };

    const toggleDeleteAction = () => {
        setEditAction(false);
        setDeleteAction(prevDeleteAction => !prevDeleteAction);
    };

    return (
        <div>
            <Navbar/>
            <div className='DBM_container'> 
                <h1>View Courses</h1>
                <div className='input_box'>
                    <label>Course ID:</label>    
                    <input
                        type="text"
                        value={searchID}
                        onChange={handleSearchChange}
                        placeholder="Enter Course ID"
                    />
                </div>
                <div className='Button'>
                    <button onClick={toggleEditAction}
                        className={editAction ? 'chosen' : 'notChosen'}
                    >
                        {editAction ? 'Edit' : 'Edit'}
                    </button>
                    <button onClick={toggleDeleteAction}
                    className={deleteAction ? 'chosen' : 'notChosen'}
                    >
                        {deleteAction ? 'Delete' : 'Delete'}
                    </button>
                </div>

                <div className='CourseList'>
                    {courses.map((course, index) => (
                        <div
                            key={index}
                            onClick={() => handleCourseClick(course)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Course_item 
                                name={course.courseID} 
                                courseClass={course.courseName} 
                                credit={course.credit}
                            />
                        </div>
                    ))}
                </div>

                {editCourse && (
                    <EditCourseForm
                        course={editCourse}
                        onClose={() => setEditCourse(null)}
                        onUpdate={fetchCourses}
                    />
                )}
            </div>

            <Footer/>
        </div>
    );
}

export default ViewExistCourses;
