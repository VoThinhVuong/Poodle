// import React from 'react'
// import BaseURL from "../../port";
// import { useState } from "react";
// import File_Item from './File_Item';

// function PageSessionTier2Item({sessionID, sessionName, classID}) { 
//     const [file, setFile] = useState(null);
//     const [files, setFiles] = useState([]);
//     const [showFiles, setShowFiles] = useState(false);

//     const fetchFiles = async () => {
//         try {
//             const response = await fetch(BaseURL + '/staff/viewFiles', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ sessionID })
//             });
//             const data = await response.json();
//             if (data.error) {
//                 alert('Failed to fetch files: ' + data.error);
//             } else {
//                 setFiles(data);
//             }
//         } catch (error) {
//             alert('Failed to fetch files: ' + error.message);
//         }
//     };

//     // if (!files.length) { 
//     //     fetchFiles();
//     // }

//     const handleShowFiles = () => { 
//         setShowFiles(!showFiles);
//         if (!showFiles) {
//             fetchFiles();
//         } else {
//             setFiles([]);
//         }
//     }

//     const removeSession = () => { 
//         fetch(BaseURL + '/staff/removeSession', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ sessionID: sessionID })
//         })
//         .then(res => res.json())
//         .then(data => {
//             if (data.status === 'success') {
//                 alert('Session removed successfully');
//             } else {
//                 alert('Failed to remove session: ' + data.error);
//             }
//         })
//         .catch(err => {
//             alert('Failed to remove session: ' + err.message);
//         });
//     }

//     const addFile = () => { 
//         if (!file) {
//             alert('Please select a file');
//             return;
//         } else {
//             const formData = new FormData();
//             formData.append('file', file);
//             formData.append('sessionID', sessionID);
//             fetch(BaseURL + '/staff/uploadFile', {
//                 method: 'POST',
//                 body: formData
//             })
//             .then(res => res.json())
//             .then(data => {
//                 if (data.status === 'success') {
//                     alert('File uploaded successfully');
//                     fetchFiles();
//                 } else {
//                     alert('Failed to upload file: ' + data.error);
//                 }
//             })
//             .catch(err => {
//                 alert('Failed to upload file: ' + err.message);
//             });
//         }
//     }

//     return (
//         <div>
//             <div>
//                 <h4>{sessionName}</h4>
//                 <button onClick={handleShowFiles}>{!showFiles ? 'Show Files' : 'Hide File'}</button>
//                 <button onClick={removeSession}>Remove Session</button>
//                 <br/>
//                 <input
//                     type="file"
//                     onChange={(e) => setFile(e.target.files[0])}
//                 />
//                 <button onClick={addFile}>Upload File</button>
//             </div>
//             { files.length > 0 && files.map((file, index) => ( 
//                 <File_Item key={index} file_item={file}/>
//             ))}
//         </div>
//     );
// }

// export default PageSessionTier2Item;