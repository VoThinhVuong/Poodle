import BaseURL from "../../port";
import "../../styles/staff/file_item.css"

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

    const removeFile = () => { 
        fetch(BaseURL + '/staff/removeFile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileID: file_item.fileID })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                alert('File removed successfully');
                fetchFiles();
            } else {
                fetchFiles();
                alert('Failed to remove file: ' + data.error);
            }
        })
        .catch(err => {
            alert('Failed to remove file: ' + err.message);
        });
    }

    return (
        <div className="file-item">
            <div className="file-item-name">
                {file_item.fileName}
                <div>
                <button className="menu-button" onClick={removeFile}>Remove</button>
                <button className="menu-button" onClick={downloadFile}>Download</button>
                </div>
            </div>
        </div>
    )
}

export default File_Item;