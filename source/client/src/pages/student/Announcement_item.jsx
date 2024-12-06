import React, {useState, useEffect} from 'react'

function Student_Announcement_Item({announcement, fetchAnnouncements}) { 
    const [title] = useState(announcement.title);
    const [content] = useState(announcement.content);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const datePart = date.toLocaleDateString(undefined, optionsDate);
        const optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric'};
        const timePart = date.toLocaleTimeString(undefined, optionsTime);
        return datePart + " - " + timePart;
    }

    return (
        <div className='Anon_page'>
            <h1>
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
            <p>
                {content}
            </p>
        </div>
    )
}

export default Student_Announcement_Item;