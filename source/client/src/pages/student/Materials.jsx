import { useState, useEffect } from "react";
import BaseURL from "../../port";

import PageSessionItem from './PageSession';

function Student_Material_Session({classID}) {
    const [sessions, setSessions] = useState([]);

    const fetchSessions = () => {
        try {
            fetch(BaseURL + '/staff/viewSessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ classID: classID })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Failed to fetch sessions: ' + data.error);
                } else {
                    setSessions(data);
                }
            })
        }
        catch (error) {
            alert('Failed to fetch sessions while fetching: ' + error);
        }
    }
    
    useEffect(() => { 
        fetchSessions();
    }, []);

    
    return (
        <div>
            {sessions.map((session, index) => 
                <PageSessionItem key={index} session={session} />
            )}
        </div>
    )
}

export default Student_Material_Session;