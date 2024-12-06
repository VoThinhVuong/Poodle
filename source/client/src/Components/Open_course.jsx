import BaseURL from '../port';

function Open_course({ course_name, classID, accountID, className }) {


    const fetchEnrollReq = () => {
        fetch(BaseURL + '/student/enrollCourseReq', {
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "courseName" : course_name,
                "classID" : classID,
                "ID" : accountID
            }),
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                alert(data.status);
            }
        });

    };

    const fetchDropReq = () => {

        fetch(BaseURL + '/student/dropCourse', {
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "ID" : accountID,
                "classID" : classID
            }),
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                alert(data.status);
            }
        });

    };


    return (
        <div className='Open_course'>
            <p>{course_name}</p>
            <div>
                <p>{className}</p>
                <div>
                    <button id="leave_button" onClick={fetchDropReq}>
                        Leave
                    </button>
                    <button id='enroll_button' onClick={fetchEnrollReq}>
                        Enroll
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Open_course;
