import Staff_Material_Session from './Materials';
import Staff_Assignment_Session from './Assignments';

import '../../styles/Course_page.css'
import '../../styles/staff/Staff_Course_Page.css'
function Staff_Course_Page ({classID, courseID}) {
    return (
        <div className='container-course-page'>
            <div>
                <Staff_Material_Session classID={classID}/>
            </div>
            <div>
                <Staff_Assignment_Session classID={classID}/>
            </div>
        </div>
    )

}

export default Staff_Course_Page