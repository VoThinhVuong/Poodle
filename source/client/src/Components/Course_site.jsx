import React, {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

import Navbar from "./Navbar";
import Footer from "./Footer";
import CourseInfo from './Course_info';

import Staff_Announcement_Page from '../pages/staff/Announcement_page';
import Staff_Course_Page from '../pages/staff/Course_page';
import Staff_Grade_Page from '../pages/staff/Grade_page';

import Student_Announcement_Page from '../pages/student/Announcement_page';
import Student_Course_Page from '../pages/student/Course_page';
import Student_Grade_Page from '../pages/student/Grade_page';

import '../styles/Course_site.css'

function CourseSite () {
    const {CCID} = useParams();
    const [courseID, classID, courseName] = CCID.split("&");
    const [content, setContent] = useState('course');
    const [cookie] = useCookies(['user']);

    const SwitchAnnouncement = ({classID}) => {
        if (cookie.user.role === 1)
            return <Student_Announcement_Page classID={classID}/>
        else (cookie.user.role === 2)
            return <Staff_Announcement_Page classID={classID}/>
    }

    const SwitchCoursePage = ({classID, courseID}) => {
        if (cookie.user.role === 1)
            return <Student_Course_Page classID={classID} courseID={courseID}/>
        else (cookie.user.role === 2)
            return <Staff_Course_Page classID={classID} courseID={courseID}/>
    }

    const SwitchGradePage = ({classID}) => {
        if (cookie.user.role === 1)
            return <Student_Grade_Page classID={classID}/>
        else (cookie.user.role === 2)
            return <Staff_Grade_Page classID={classID}/>
    }

    return (
        <div>
            <Navbar />
            <div className='Header'>
                <div><h1>{courseName}</h1></div>
                <div className='Course_Container'>
                    <div className="Course_Menu">
                        <button className={content === 'course' ? 'active-button' : 'inac-button'} onClick={(e) => {setContent('course')}}>
                            <p>Course</p>
                        </button>

                        <button className={content === 'announcement' ? 'active-button' : 'inac-button'} onClick={(e) => {setContent('announcement')}}>
                            <p>Announcements</p>
                        </button>

                        <button className={content === 'grade' ? 'active-button' : 'inac-button'} onClick={(e) => {setContent('grade')}}>
                            <p>Grades</p>
                        </button>

                        <button className={content === 'info' ? 'active-button' : 'inac-button'} onClick={(e) => {setContent('info')}}>
                            <p>Info</p>
                        </button>

                    </div>
                    <div className='Course_Content'>
                        {content === 'course' && <SwitchCoursePage classID={classID} courseID={courseID}/>}
                        {content === 'announcement' && <SwitchAnnouncement classID={classID}/>}
                        {content === 'grade' && <SwitchGradePage classID={classID}/>}
                        {content === 'info' && <CourseInfo classID={classID} courseID={courseID}/>}
                    </div>
                </div>
            </div>  
            <Footer />
        </div>
    )
}

export default CourseSite;