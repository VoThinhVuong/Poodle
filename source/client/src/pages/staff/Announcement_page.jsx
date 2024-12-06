import React, {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'

import BaseURL from '../../port';

import Staff_Announcement_Item from './Announcement_Item';

function Staff_Announcement_Page({classID}) { 
    const [announcements, setAnnouncements] = useState([]);
    const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [cookie] = useCookies(['user']);
    const user = cookie.user;

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

    const addAnnouncement = () => {
        const confirm = window.confirm('Are you sure you want to add this announcement?');
        if (!confirm) return;

        try {
            fetch(BaseURL + '/staff/addAnnouncement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({classID: classID, announcementTitle: title, announcementContent: content, accountID: user.ID}),
            })
            .then(res => res.json())
            .then(data => {
                setTitle('');
                setContent('');
                if(data.error) {
                    alert(data.error);
                } else {
                    alert('Annoucnement Added');
                    fetchAnnouncements();
                }
                setShowAddAnnouncement(!showAddAnnouncement);
            })
        } catch (error) {
            alert(error);
            setShowAddAnnouncement(!showAddAnnouncement);
        }
        
    }
    return (
        <div>
            <div>
                <button className='add' onClick={() => setShowAddAnnouncement(!showAddAnnouncement)}></button>
                {showAddAnnouncement && 
                    <div>
                        <input type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
                        <input type='text' placeholder='Content' value={content} onChange={(e) => setContent(e.target.value)}/>
                        <button onClick={addAnnouncement}>Add</button>
                        <button onClick={() => {setShowAddAnnouncement(!showAddAnnouncement)}}>Cancel</button>
                    </div>
                }
            </div>
            {announcements.length === 0 && <h2>No Announcements</h2>}

            {announcements.length > 0 && announcements.map((announcement, index) => 
                <Staff_Announcement_Item key={index} announcement={announcement} fetchAnnouncements={fetchAnnouncements}/>
            )}
        </div>
    )
}

export default Staff_Announcement_Page;