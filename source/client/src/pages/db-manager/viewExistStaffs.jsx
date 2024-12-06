import React, {useState, useEffect} from 'react'
import BaseURL from '../../port';

import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

import EditStudentStaffForm from './editStudentStaffForm';
import Account_item from '../../Components/Account_item';

import '../../styles/DBM/viewStudents.css'

function ViewExistStaffs() {
  const [Staffs, setStaffs] = useState([]);
  const [searchID, setSearchID] = useState(''); 
  const [allStaffs, setAllStaffs] = useState([]);
  const [editStaff, setEditStaff] = useState(null);
  const [editAction, setEditAction] = useState(false);
  const [deleteAction, setDeleteAction] = useState(false);

  // Fetch Staffs when the component mounts
  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = () => {
    fetch(BaseURL + '/dbmanager/viewExistStaffs')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setAllStaffs(data.staffs);
          setStaffs(data.staffs);
        } else {
          alert('Failed to fetch staffs: ' + data.error);
        }
      });
  };

  const handleDeleteStaff = (accountID) => {
    if (window.confirm('Are you sure you want to delete this staff?')) {
      fetch(`${BaseURL}/dbmanager/deleteStudentStaff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountID }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            alert('Staff deleted successfully');
            fetchStaffs(); // Refresh the staff list
          } else {
            alert('Failed to delete staff: ' + data.error);
          }
        })
        .catch((error) => {
          alert('Failed to delete staff: ' + error);
        });
    }
  };

  const handleStaffClick = (selectedStaff) => {
    if (deleteAction) {
      handleDeleteStaff(selectedStaff.accountID);
    } else if (editAction) {
      setEditStaff(selectedStaff);
    }
  };

  const toggleEditAction = () => {
    setDeleteAction(false);
    setEditAction(prevEditAction => !prevEditAction);
  };

  const toggleDeleteAction = () => {
    setEditAction(false);
    setDeleteAction(prevDeleteAction => !prevDeleteAction);
  };



  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase().trim(); // Convert to lowercase and trim whitespace
    setSearchID(searchValue);

    const filteredStaffs = allStaffs.filter(student => {
      const accountID = student.accountID.toString().toLowerCase(); // Convert to lowercase
      console.log("Comparing with:", accountID); // Log the account ID for each student
      return accountID.includes(searchValue);
    });

    setStaffs(filteredStaffs);
  };

  return (
    <div>
      <Navbar/>
      <div className='DBM_container'>
        <h1>View Staffs</h1>
        <div id="input-section">
          <input
            type="text"
            value={searchID}
            onChange={handleSearchChange}
            placeholder="Find specific staff with ID"
          />
        </div>

        <div className='Button'>
          <button onClick={toggleEditAction}
            className={editAction ? 'chosen' : 'notChosen'}
          >
            {editAction ? 'Edit' : 'Edit'}
          </button>

          <button onClick={toggleDeleteAction}
            className={deleteAction ? 'chosen' : 'notChosen'}>
            {deleteAction ? 'Delete' : 'Delete'}
          </button>
        </div>

        <div id="StaffList">
          {Staffs.map((staff, index) => (
            <div
              key={index}
              onClick={() => handleStaffClick(staff)}
            >
              <Account_item 
                account = {staff}
              />
            
              {editStaff && editStaff.accountID === staff.accountID && (
                <EditStudentStaffForm
                  student={editStaff}
                  onUpdate={fetchStaffs}
                  onClose={() => setEditStaff(null)}
                />
              )}
        </div>
          ))}
        </div>
      </div>    
      <Footer/>
    </div>

  );
}

export default ViewExistStaffs;