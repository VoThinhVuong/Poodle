import React, {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie';
import BaseURL from '../../port';

function Staff_Announcement_Item({announcement, fetchAnnouncements}) { 
    const [contentEditable, setContentEditable] = useState(false);
    const [title, setTitle] = useState(announcement.title);
    const [content, setContent] = useState(announcement.content);
    const [cookie] = useCookies(['user']);
    const user = cookie.user;

    const removeAnnouncement = (announcementID) => { 
        const confirm = window.confirm('Are you sure you want to remove this announcement?');
        if (!confirm) return;

        try {
            fetch(BaseURL + '/staff/removeAnnouncement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({announcementID: announcementID}),
            })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    alert(data.error);
                } else {
                    fetchAnnouncements();
                }
            })
        } catch (error) {
            alert(error); 
        }
    }

    const editAnnouncement = (announcementID) => { 
        const confirm = window.confirm('Are you sure you want to edit this announcement?');
        if (!confirm) return;

        try {
            fetch(BaseURL + '/staff/editAnnouncement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({announcementID: announcementID, announcementTitle: title, announcementContent: content}),
            })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    alert(data.error);
                } else {
                    alert('Announcement Edited Successfully');
                    fetchAnnouncements();
                    setContentEditable(false);
                }
            })
        } catch (error) {
            alert(error); 
        }
    }

    const handleTitleChange = (e) => {
        // if (e.target.innerText === '') {
        //     e.target.innerText = title;
        // } 
        setTitle(e.target.innerText);
    }

    const handleContentChange = (e) => { 
        // if (e.target.innerText === '') {
        //     e.target.innerText = content;
        // }
        setContent(e.target.innerText);
    }

    const handleCancelEdit = () => {
        setTitle(announcement.title);
        setContent(announcement.content);
        setContentEditable(false);
    }


    const StaffTool = () => {
        if (user.role === 2)
            return <div>
                <button className='edit' onClick={() => setContentEditable(!contentEditable)}></button>
                <button className='delete' onClick={() => removeAnnouncement(announcement.announcementID)}></button>
                {contentEditable && <button onClick={() => editAnnouncement(announcement.announcementID)}>Save</button>}
                {contentEditable && <button onClick={handleCancelEdit}>Cancel</button>}
            </div>
        return null;
    }

    const formatDateTime = (dateString) =>
    {
        const date = new Date(dateString);
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const datePart = date.toLocaleDateString(undefined, optionsDate);
        const optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric'};
        const timePart = date.toLocaleTimeString(undefined, optionsTime);
        return datePart + " - " + timePart;
    }

    return (
        <div>
            {StaffTool()}
            <div className='Anon_page'>
                <h1 contentEditable={contentEditable} suppressContentEditableWarning={true} onBlur={(e) => handleTitleChange(e)}>
                    {title}
                </h1>
                <span>
                    <h3>
                        {formatDateTime(announcement.date)}
                    </h3>
                    <h3>
                        {announcement.Account.AccountInfo.fullname}
                    </h3>
                </span>
                <p contentEditable={contentEditable}  suppressContentEditableWarning={true} onBlur={(e) => handleContentChange(e)}>
                    {content}
                </p>
            </div>
        </div>
    )
}

export default Staff_Announcement_Item;