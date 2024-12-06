import { useState } from "react";
import BaseURL from "../../port";

function File_Item({file_item, fetchFiles}) { 
    
    const downloadFile = () => { 
        fetch(BaseURL + '/staff/downloadFile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileID: file_item.fileID })
        })
        .then(res => res.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file_item.fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        })
        .catch(err => {
            alert('Failed to download file: ' + err.message);
        });
    }

    return (
        <div className="file-item">
            <div className="file-item-name">    
                {file_item.fileName}
                <button className="downloadButton" onClick={downloadFile}>Download</button>
            </div>
        </div>
    )
}

export default File_Item;