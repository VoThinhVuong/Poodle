import Student_Material_Session from './Materials';
import Student_Assignment_Session from './Assignments';

import '../../styles/Course_page.css'


function Course_Page ({classID, courseID}) {



    return (
        <div className='container-course-page'>
            <div className='sub-container'>
                <h1 id='title-section'>Materials</h1>
                <Student_Material_Session classID={classID}/>
            </div>
            <div className='sub-container'>
                <h1 id='title-section'>Assignments</h1>
                <Student_Assignment_Session classID={classID}/>
            </div>
        </div>
    )

}

export default Course_Page