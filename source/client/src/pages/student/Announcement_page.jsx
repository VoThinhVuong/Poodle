import React, {useState, useEffect} from 'react'
import BaseURL from '../../port';

import Student_Announcement_Item from './Announcement_Item';

function Announcement_Page({classID}) { 
    const [announcements, setAnnouncements] = useState('');

    useEffect(() => { 
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = () => { 
        try {
            fetch(BaseURL + '/staff/viewAnnouncements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({classID}),
            })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    alert(data.error);
                } else {
                    setAnnouncements(data.announcements);
                }
            })
        } catch (error) { 
            alert(error);
        }
    }

    return (
        <div>
            {announcements.length === 0 && <h2>No Announcements</h2>}

            {announcements.length > 0 && announcements.map((announcement, index) => 
                <Student_Announcement_Item key={index} announcement={announcement} fetchAnnouncements={fetchAnnouncements}/>
            )}    
        </div>
    )
}

export default Announcement_Page;