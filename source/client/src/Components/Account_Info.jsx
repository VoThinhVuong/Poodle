import React, {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie';
import BaseURL from '../port';

import Navbar from "./Navbar";
import Footer from "./Footer";

import '../styles/Account.css';

function StaffAccount () {
    const [cookie] = useCookies(['user'], {
		doNotParse: false,
		doNotUpdate: false
	});
    const [info, setInfo] = useState('');
    const fetchInfo = () => {
        const postOptions = {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ID: cookie.user.ID
          }),
        };

        fetch(BaseURL + '/accountInfo', postOptions)
        .then(res => res.json())
        .then(data => {
            setInfo({
                fullname: data.fullname
            });
      });
    }

    useEffect(() => {
        fetchInfo();
    },[]);

    return (
        <div>
        <Navbar/>
        
        <div className='Header'>
            <div className="Box" id='info'>
                    <div>
                        <p>Fullname: {info.fullname}</p>
                    </div>
            </div>
        </div>
        
            
        <Footer/>
        </div>
    )
}

export default StaffAccount