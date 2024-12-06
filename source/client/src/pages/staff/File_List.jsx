import { useState } from "react";
import BaseURL from '../../port';

import File_Item from "./File_Item";

function File_List({sessionID}) { 
    const [files, setFiles] = useState([]);
    const fetchFiles = () => { 
        try {
            fetch(BaseURL + '/staff/viewFiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionID: sessionID })
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

    return (
        <div>
            <h1>Files</h1>
            {files.map(file => <File_Item file_item={file} />)}
        </div>
    )
}

export default File_List