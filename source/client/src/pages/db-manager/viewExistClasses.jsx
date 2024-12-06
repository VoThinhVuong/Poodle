import React, { useState, useEffect } from 'react';
import BaseURL from "../../port.js";

import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

import Class_item from '../../Components/Class_item.jsx';
import EditClassForm from './editClassForm.jsx';

import "../../styles/DBM/viewClasses.css"

function ViewExistClasses() {
    const [classes, setClasses] = useState([]);
    const [searchID, setSearchID] = useState('');
    const [searchYear, setSearchYear] = useState('');
    const [searchLecturer, setSearchLecturer] = useState('');
    const [allClasses, setAllClasses] = useState([]);
    const [editAction, setEditAction] = useState(false);
    const [deleteAction, setDeleteAction] = useState(false);
    const [editClass, setEditClass] = useState(null);
    

    // Fetch classes when the component mounts
    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = () => {
        fetch(BaseURL + '/dbmanager/viewExistClasses')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setAllClasses(data.classes);
                    setClasses(data.classes);
                } else {
                    alert('Failed to fetch classes: ' + data.error);
                }
            });
    }

    const handleDeleteClass = (classID) => { 
        if (window.confirm('Are you sure you want to delete this class?')) {
            fetch(`${BaseURL}/dbmanager/deleteClass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ classID }),
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Class deleted successfully');
                    fetchClasses(); // Refresh the class list
                } else {
                    alert('Failed to delete class: ' + data.error);
                }
            })
            .catch((error) => {
                alert('Failed to delete class: ' + error);
            });
        }
    }

    const classClickEvent = (class_item) => {
        if (deleteAction) {
            handleDeleteClass(class_item.classID);
        } else if (editAction) {
            setEditClass(class_item);
        }
    }

    const toggleEditAction = () => {
        setDeleteAction(false);
        setEditAction(prevEditAction => !prevEditAction);
    };

    const toggleDeleteAction = () => {
        setEditAction(false);
        setDeleteAction(prevDeleteAction => !prevDeleteAction);
    };

    const handleSearchChange = (e) => {
        const { value, placeholder } = e.target;

        if (placeholder === 'Enter Class ID') setSearchID(value.toLowerCase());
        else if (placeholder === 'Enter Year') setSearchYear(value.toLowerCase());
        else if (placeholder === 'Enter Lecturer') setSearchLecturer(value.toLowerCase());

        filterClasses(value.toLowerCase(), placeholder);
    };

    // get the last 4 digits of the date
    // date: August 1, 2022
    const getYear = (date) => { 
        return date.split(' ')[2];
    };

    const filterClasses = (searchValue, placeholder) => {
        const filteredClasses = allClasses.filter(clas => {
            const classID = clas.classID.toString().toLowerCase();
            const year = getYear(clas.dateStart);
            const lecturer = clas.lecturer.toString().toLowerCase();

            if (placeholder === 'Enter Class ID') return classID.includes(searchValue);
            if (placeholder === 'Enter Year') return year.includes(searchValue);
            if (placeholder === 'Enter Lecturer') return lecturer.includes(searchValue);
            return true;
        });

        setClasses(filteredClasses);
    };

    const onClose = () => { 
        setEditClass(null);
    };

    return (
        <div>
            <Navbar/>
            <div className='DBM_container'>
                <h1>View Classes</h1>
                <div className='input_box'>
                    <label>Class ID:</label>    
                    <input
                        type="text"
                        value={searchID}
                        onChange={handleSearchChange}
                        placeholder="Enter Class ID"
                    />
                </div>
                <div className='input_box'>
                    <label>Year:</label>
                    <input
                            type="text"
                            value={searchYear}
                            onChange={handleSearchChange}
                            placeholder="Enter Year"
                    />
                </div>
                <div className='input_box'>
                    <label>Lecturer:</label>
                    <input
                        type="text"
                        value={searchLecturer}
                        onChange={handleSearchChange}
                        placeholder="Enter Lecturer"
                    />
                </div>
                <div className="Button">
                        <button onClick={toggleEditAction}
                        className={editAction ? 'chosen' : 'notChosen'}>
                            {editAction ? 'Edit' : 'Edit'}
                        </button>
                        <button onClick={toggleDeleteAction}
                            className={deleteAction ? 'chosen' : 'notChosen'}>
                            {deleteAction ? 'Delete' : 'Delete'}
                    </button>
                </div>
                <br />
                <table className='Tab'>
                    <thead>
                        <tr>
                            <th id="col_left">Class ID</th>
                            <th>Course ID</th>
                            <th>Weekday</th>
                            <th>Time</th>
                            <th>Date</th>
                            <th>Room</th>
                            <th id="col_right">Lecturer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((clas, index) => (
                            <React.Fragment key={index}>
                                <tr onClick={() => classClickEvent(clas)} style={{ cursor: 'pointer' }}>
                                    <Class_item class_item={clas}/>
                                </tr>
                                {editClass && editClass === clas && (
                                <tr>
                                    <td colSpan="7"> {/* Adjust colSpan as needed */}
                                        <EditClassForm
                                            class_item={editClass}
                                            onUpdate={() => fetchClasses()}
                                            onClose={() => setEditClass(null)}
                                        />
                                    </td>
                                </tr>
                                )}
                            </React.Fragment> 
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer/>
        </div>
    )
}

export default ViewExistClasses