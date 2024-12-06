import { useState, useEffect } from "react";
import BaseURL from "../../port";

import File_Item from './File_Item';

function PageSessionItem({session}) { 
    const [files, setFiles] = useState([]);
    const fetchFiles = () => { 
        try {
            fetch(BaseURL + '/staff/viewFiles', {
                method: 'POST',
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

    useEffect(() => { 
        fetchFiles();
    }, []);

    return (
        <div className='course-element'>
            <h3 id="container-title">{session.sessionName}</h3>
            <div className="container-element">
                {files.map(file => <File_Item file_item={file} fetchFiles={fetchFiles} />)}
            </div>
        </div>
    )
}

export default PageSessionItem;