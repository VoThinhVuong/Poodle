import { useState } from "react";
import BaseURL from "../../port";

import File_Item from './File_Item';

function PageSessionItem({session, fetchSessions}) { 
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const fetchFiles = () => { 
        try {
            fetch(BaseURL + '/staff/viewFiles', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionID: session.sessionID })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Failed to fetch files: ' + data.error);
                } else {
                    setFiles(data);
                }
            })
        }
        catch (error) { 
            alert('Failed to fetch files while fetching: ' + error);
        }
    }

    const [count, setCount] = useState(0);
    if (count === 0) {
        fetchFiles();
        setCount(1);
    }

    const removeSession = () => { 
        fetch(BaseURL + '/staff/removeSession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionID: session.sessionID })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                fetchSessions();
                alert('Session removed successfully');
            } else {
                fetchFiles();
                alert('Failed to remove session: ' + data.error);
            }
        })
        .catch(err => {
            alert('Failed to remove session: ' + err.message);
        });
    }

    const addFile = () => { 
        if (file === null) { 
            alert('No file selected');
            return
        }
        try {
            const formData = new FormData();
            formData.append('sessionID', session.sessionID);
            formData.append('file', file);
            fetch(BaseURL + '/staff/uploadFile', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                alert('File added');
                if (data.status === 'success') {
                    alert('File added successfully');
                    setFile(null);
                    fetchFiles();
                } else {
                    alert('Failed to add file: ' + data.error);
                }
            })
        }
        catch (error) {
            alert('Failed to add file while fetching: ' + error);
        }
    }

    return (
        <div className="course-element">
            <div className="grid2">
                <div id="grid-left">
                    <h3 id='container-title'>{session.sessionName}</h3>
                </div>
                <div id='grid-right'>
                    <button className="menu-button delete" onClick={removeSession}></button>
                </div>
            </div>
        
            <div className="container-element">
                {files.map(file => <File_Item file_item={file} fetchFiles={fetchFiles} />)}
                <div className="grid2">
                    <input id="grid-left" type="file" onChange={e=>setFile(e.target.files[0])} />
                    <button className="menu-button add" onClick={addFile}></button>
                </div>
                
                
            </div>
        </div>
    )
}

export default PageSessionItem;