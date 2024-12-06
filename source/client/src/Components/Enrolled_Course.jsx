import {Link} from "react-router-dom"
import {useCookies} from 'react-cookie'

function Enrolled_Course({courseName, courseID,  classID}) {
  const [cookie] = useCookies(['user']);
  const role = cookie.user.role;

  let path = "";
  if(role == 1) path = "/student/course/"
  if(role == 2) path = "/staff/course/"

  return (
    <Link className='Enrolled_Course' to={path + courseID + "&" + classID + '&' + courseName}>
        <p>{courseName}</p>
        <p>Class: {classID}</p>
    </Link>
  )
}

export default Enrolled_Course