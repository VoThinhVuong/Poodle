import { useState } from "react";
import BaseURL from "../../port";

import PageSessionItem from './PageSession';

function Staff_Material_Session({classID}) {
    const [showInput, setShowInput] = useState(false);
    const [name, setName] = useState('');
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
    const [count, setCount] = useState(0);
    if (count === 0) {
        fetchSessions();
        setCount(1);
    }

    const handleShowInput = () => {
        setShowInput(!showInput);
    }

    const addSession = (e) => { 
        e.preventDefault();
        handleShowInput();
        try {
            fetch(BaseURL + '/staff/addSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ classID: classID, sessionName: name, sessionTier: 1, parentSession: null})
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Session added successfully');
                    fetchSessions();
                    setName('');
                } else {
                    alert('Failed to add session: ' + data.error);
                }
            })
        }
        catch (error) {
            alert('Failed to add session while fetching: ' + error);
        }
    }

    
    return (
    <div>
        <div className="title-section">
            <div className="grid2">
                <h1 id="grid-left">Materials</h1>
                
                <div className="menu" id='grid-right'>
                    <button className="menu-button view" onClick={fetchSessions}></button>
                    <button className="menu-button add" onClick={handleShowInput}></button>
                </div>
            </div>

        </div>
        
        <div className='container-material'>
            
            {showInput && 
                <form onSubmit={addSession}>
                    <input type="text" name="sessionName" placeholder="Session Name" onChange={e=>setName(e.target.value)} required />
                    <button type="submit">Submit</button>
                </form>
            }
            <div>
                {sessions.map((session, index) => 
                    <PageSessionItem key={index} session={session} fetchSessions={fetchSessions} />
                )}
            </div>
        </div>
    </div>

    )
}

export default Staff_Material_Session;