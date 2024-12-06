import { useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import BaseURL from "../port.js";

import Logo from '../assets/Logo.png'

import "../styles/Login.css"

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cookie, setCookie] = useCookies(['user'], {
		doNotParse: false,
		doNotUpdate: false
	});
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        fetch(BaseURL + '/login', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
        })
        }).then(res => res.json()).then(data => {
            if (data.user) {
                setCookie('user', data.user, {maxAge: 1800});
                navigate(from, { replace: true });
            } else {
                alert('Failed to login: ' + data.error);
            }
        })
    }

  return (
    <div className='login' onSubmit={handleSubmit}>
        <img className='logo' src={Logo}/>
        <form className='container'>
            <input type="text"
                    placeholder="Username"
                    name='username'
                    value={username}
                    onChange={(event) => {setUsername(event.target.value)}}></input>
            <input type="password"
                    placeholder="Password"
                    name='password'
                    value={password}
                    onChange={(event) => {setPassword(event.target.value)}}></input>
            <p><Link to='/forgotpassword'
            style={{ color: 'inherit', textDecoration: 'none' }}
            >Forgot Password?</Link></p>           
            <input type="submit" value="Login"></input>
        </form>
    </div>
  )
}

export default Login