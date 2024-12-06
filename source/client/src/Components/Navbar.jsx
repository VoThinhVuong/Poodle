import {Link} from "react-router-dom"
import { useCookies } from 'react-cookie'

import Logo from '../assets/Nav_Logo.png'
import Noti from '../assets/Noti.png'
import Account from '../assets/Account.png'
import Logout from '../assets/Logout.png'

import "../styles/Navbar.css"

function Navbar() {

  const [cookie, setCookie, removeCookie] = useCookies(['user'], {
		doNotParse: false,
		doNotUpdate: false
	});

  const user = cookie.user;
  
  const path = () =>{
    if(user.role == 1){
      return "/student" 
    }
    if(user.role == 2){
      return "/staff" 
    }
    if(user.role == 3){
      return "/db-manager" 
    }
  }


  const logout = (event) => {
      removeCookie("user");
  }

  return (
    <div className='Navbar'>
        <div className='Right'>
            <img src={Logo}/>
        </div>
        <div className='Left'>
            <Link to={path() + "/home"}><div>Home</div></Link>
            <Link id={user.role == 1 ? "show" : "hide"} to='/student/enroll' ><div>Enroll</div></Link>
            <Link to={path() + "/notification"}><img src={Noti} /></Link>
            <Link to={path() + "/account"} ><img src={Account}/></Link>
            <Link to="/login" onClick={logout}><img src={Logout}/></Link>
        </div>
    </div>
  )
}

export default Navbar