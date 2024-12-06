import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import BaseURL from "../../port";
import React from 'react';  


function Assignment_Item({assignment, fetchAssignments}) { 
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileURL, setFileURL] = useState(null);

    const [submit, setSubmit] = useState(null);
    const [submitFile, setSubmitFile] = useState(null);
    const [submitFileName, setSubmitFileName] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [newSubmit, setNewSubmit] = useState(null);

    const [cookie] = useCookies(['user']);
    const user = cookie.user;

    useEffect(() => { 
        fetchSubmit();
        fetchAssignmentFile();
        // handleChangeLink();
    }, []);

    const fetchAssignmentFile = () => { 
        try {
            fetch(BaseURL + '/student/viewAssignmentFile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assignmentID: assignment.assignmentID })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Failed to fetch assignment file: ' + data.error);
                } else {
                    if (data.files === null || data.files.length === 0) return;
                    setFile(data.files);
                    let url = window.URL.createObjectURL(new Blob([data.files.fileInfo]));
                    let link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', data.files.fileName);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                    setFileURL(link);
                    setFileName(file.fileName);
                }
            })
        } catch (error) { 
            alert('Failed to fetch assignment file while fetching: ' + error);
        }
    }

    const fetchSubmit = () => { 
        try {
            fetch(BaseURL + '/student/viewSubmit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assignmentID: assignment.assignmentID, accountID: user.ID})
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Failed to fetch submit: ' + data.error);
                } else {
                    setSubmit(data.submit);
                    let url = window.URL.createObjectURL(new Blob([data.submit.fileInfo]));
                    setSubmitFile(url);
                    setSubmitFileName(submit.fileName);
                }
            })
        } catch (error) { 
            alert('Failed to fetch submit while fetching: ' + error);
        }
    }

    const handleChangeLink = () => { 
        let url1 = window.URL.createObjectURL(new Blob([file.fileInfo]));
        setFileURL(url1);
        setFileName(file.fileName);
        let url2 = window.URL.createObjectURL(new Blob([submit.fileInfo]));
        setSubmitFile(url2);
        setSubmitFileName(submit.fileName);
    }

    const handleNewSubmit = (e) => { 
        e.preventDefault();
        const confirm = window.confirm('Are you sure you want to submit this file?');
        if (!confirm) return;
        try {
            const formData = new FormData();
            formData.append('assignmentID', assignment.assignmentID);
            formData.append('accountID', user.ID);
            formData.append('file', newSubmit);
            fetch(BaseURL + '/student/submitAssignment', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Failed to submit assignment: ' + data.error);
                } else {
                    alert('Assignment submitted successfully');
                }
            })
        } catch (error) {
            alert('Failed to submit assignment while submitting: ' + error);
        }
        setShowForm(false);
        fetchSubmit();
    }


    return (
        <div className='course-element'>
            <h3 id="container-title">{assignment.assignmentTitle}</h3>
            <div className="container-element">
                <p>Discription: {assignment.assignmentDescription}</p>
                <p>Deadline: {assignment.assignmentDeadline}</p>
                <p>Files: </p>
                <div>
                    {file && <a href={fileURL} download={file.fileName}>{file.fileName}</a>}
                </div>
                <p>Submit: </p>
                <div>
                    {submit && <a href={submitFile} download={submit.fileName}>{submit.fileName}</a>}
                    
                </div>
                <button onClick={e=>setShowForm(prev=>!prev)}>{submitFile ? 'Re-Submit': 'Submit'}</button>
                {showForm &&
                    <form onSubmit={handleNewSubmit}> 
                        <input type="file" onChange={e=>setNewSubmit(e.target.files[0])}/>
                        <button type='submit'>Submit</button>
                    </form>
                }
            </div>
        </div>
    )
}

export default Assignment_Item