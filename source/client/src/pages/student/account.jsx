import React, {useState, useEffect} from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import BaseURL from '../../port';

import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

import '../../styles/Account.css';

function StudentAccount () {
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


    const navigate = useNavigate(); 
    const viewSchedule = () => {
        navigate('/student/viewSchedule');
    }

    const viewGPA = () => {
        navigate('/student/viewGPA');
    }


    return (
        <div>
        <Navbar/>
        
        <div className='Header'>
            <div className="Menu">

                <div className='Button_grid' id='function'>
                    <div className='Item_grid' onClick={viewSchedule}>
                        <p>View Schedule</p>
                    
                    </div>
                    <div className='Item_grid' onClick={viewGPA}>
                        <p>View GPA</p>
                    </div>
                    
                </div>

                <div className="Box" id='info'>
                    <div>
                        <p>Fullname: {info.fullname}</p>
                    </div>
                </div>
            </div>
        </div>
        
            
        <Footer/>
        </div>
    )
}

export default StudentAccount