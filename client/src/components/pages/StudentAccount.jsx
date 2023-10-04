import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import BackendURL from '../backend URL/BackendURL';

// icons
import { FaCircleUser } from "react-icons/fa6";
import { HiOutlineDocumentDuplicate, HiOutlineLogout } from "react-icons/hi";
import { FaUsers, FaEyeSlash, FaEye, FaStreetView } from "react-icons/fa";
import { LiaFileSolid } from "react-icons/lia";
import { SlNotebook } from "react-icons/sl";
import { LiaBarsSolid } from "react-icons/lia";
import { FiUser, FiUsers } from "react-icons/fi";
import { FaRegFile } from "react-icons/fa";
import { HiBars3 } from "react-icons/hi2";
import { BiSolidUser } from "react-icons/bi";
import { LuSettings } from "react-icons/lu";
import { GiAutoRepair } from "react-icons/gi";
import { MdDateRange, MdNotificationsNone } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { IoMdSearch } from "react-icons/io";
import { VscDeviceCamera } from "react-icons/vsc";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FcApprove } from "react-icons/fc";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import axios from 'axios';

// images
import logo from '../assets/images/logo.png';
import user from '../assets/images/user.png';

function StudentAccount() {

  const navigate = useNavigate();
  //backend url
  const backendUrl = BackendURL();
  // token
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/');
  }

  // response variables
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [recordsIcon, setRecordsIcon] = useState(true);
  const [reportIcon, setReportIcon] = useState(true);
  const [usersIcon, setUsersIcon] = useState(false);
  const [maintenanceIcon, setMaintenanceIcon] = useState(true);
  const [barOnclick, setBarOnClick] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [isUserProfileClicked, setIsUserProfileClicked] = useState(false);
  const [deleteAndEdit, setDeleteAndEdit] = useState(false);
  const [logout, setLogout] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [showNotification, setShowNotification] = useState(false);


  // clicked function
  const [isStudentAccount, setIsStudentAccount] = useState(true);
  const [isStaffAccount, setIsStaffAccount] = useState(false);
  const [isStudentList, setIsStudentList] = useState(false);
  const [isPromoteStudent, setIsPromoteStudent] = useState(false);
  const [isSubjectList, setIsSubjectList] = useState(false);
  const [isSchoolYear, setIsSchoolYear] = useState(false);
  const [isGradeList, setIsGradeList] = useState(false);

  // student side buttong clicked function
  const studentButtonClicked = async () => {
    setIsStudentAccount(true);
    setIsStaffAccount(false);
    setIsPromoteStudent(false);
    setIsStudentList(false);
    setIsSubjectList(false);
    setIsSchoolYear(false);
    setIsGradeList(false);
  }

  // Staff account side buttong clicked function
  const staffAccountButtonClicked = async () => {
    setIsStudentAccount(false);
    setIsStaffAccount(true);
    setIsStudentList(false);
    setIsPromoteStudent(false);
    setIsSubjectList(false);
    setIsSchoolYear(false);
    setIsGradeList(false);
  }

  // Student list side buttong clicked function
  const studentListButtonClicked = async () => {
    setIsStudentAccount(false);
    setIsStaffAccount(false);
    setIsStudentList(true);
    setIsPromoteStudent(false);
    setIsSubjectList(false);
    setIsSchoolYear(false);
    setIsGradeList(false);
  }

  // Promote student side buttong clicked function
  const promoteStudentButtonClicked = async () => {
    setIsStudentAccount(false);
    setIsStaffAccount(false);
    setIsStudentList(false);
    setIsPromoteStudent(true);
    setIsSubjectList(false);
    setIsSchoolYear(false);
    setIsGradeList(false);
  }

  // Subject list side buttong clicked function
  const subjectListButtonClicked = async () => {
    setIsStudentAccount(false);
    setIsStaffAccount(false);
    setIsStudentList(false);
    setIsPromoteStudent(false);
    setIsSubjectList(true);
    setIsSchoolYear(false);
    setIsGradeList(false);
  }

  // School Year side buttong clicked function
  const schoolYearButtonClicked = async () => {
    setIsStudentAccount(false);
    setIsStaffAccount(false);
    setIsStudentList(false);
    setIsPromoteStudent(false);
    setIsSubjectList(false);
    setIsSchoolYear(true);
    setIsGradeList(false);
  }

  // Grade list side buttong clicked function
  const gradeListButtonClicked = async () => {
    setIsStudentAccount(false);
    setIsStaffAccount(false);
    setIsStudentList(false);
    setIsPromoteStudent(false);
    setIsSubjectList(false);
    setIsSchoolYear(false);
    setIsGradeList(true);
  }

  // #################################################################  FETCH USER DATA  #############################################################
  // user credentials
  const [userCredentials, setUserCredentials] = useState(null);
  const [autoFetchChecker, setAutoFetchChecker] = useState(false);

  useEffect(() => {
    if (token !== "") {
      const checkProtected = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${backendUrl}/api/protected`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.status === 200) {
            // setNotLogin(true);
            // setUserId(response.data.user);
            const userId = (response.data.user.id).toString();
            // setUserCredentials(response.data.user);

            const fetchUserCredentials = async () => {
              try {
                const response = await axios.post(`${backendUrl}/api/fetch-user`, { userId }, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                if (response.status === 200) {
                  setUserCredentials(response.data.message);
                  setIsLoading(false);
                }
              } catch (error) {
                setIsLoading(false);
                if (error.response && error.response.status === 401) {
                  console.log(error.response.data.message);
                } else {
                  console.log('Error: ', error);
                }
              }
            }
            fetchUserCredentials();
          }

        } catch (error) {
          setIsLoading(false);
          if (error.response && error.response.status === 401) {
            console.log(error.response.data.message);
          } else {
            console.log('Error: ', error);
          }
        }
      }
      checkProtected();
    }
  }, [token, autoFetchChecker]);

  // #################################################################  CHANGE PASSWORD REQUEST  ###################################################################
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const userId = (userCredentials[0].id).toString();
    const requestChangePassword = { userId, password, newPassword, confirmPassword, username };

    try {
      const response = await axios.post(`${backendUrl}/api/change-password`, requestChangePassword, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setIsLoading(false);
        setAutoFetchChecker(autoFetchChecker ? false : true);


        setErrorMessage(response.data.message);
        setIsSuccess(true);

        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 401) {
        setErrorMessage(error.response.data.message);
        setIsError(true);

        setTimeout(() => {
          setIsError(false);
        }, 5000);
      } else {
        console.log('Error: ', error);
      }
    }
  };

  // #################################################################  AUTO Profile Upload  ###################################################################
  const [profileUpload, setProfileUpload] = useState([]);
  useEffect(() => {
    if (profileUpload) {
      if (profileUpload.length === 0) {
        // console.log('nothing change!')
      }
      else {
        setIsLoading(true);
        const autoUpload = async () => {

          const requestImageToUpload = new FormData();
          requestImageToUpload.append('image', profileUpload);
          requestImageToUpload.append('userId', userCredentials[0].id);

          try {
            const response = await axios.post(`${backendUrl}/api/auto-image-upload`, requestImageToUpload, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (response.status === 200) {
              setIsLoading(false);
              setAutoFetchChecker(autoFetchChecker ? false : true);


              setErrorMessage(response.data.message);
              setIsSuccess(true);

              setTimeout(() => {
                setIsSuccess(false);
              }, 5000);
            }
          } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.status === 401) {
              setErrorMessage(error.response.data.message);
              setIsError(true);

              setTimeout(() => {
                setIsError(false);
              }, 5000);
            } else {
              console.log('Error: ', error);
            }
          }
        };
        autoUpload();
      }
    }
  }, [profileUpload]);

  return (
    <div className='account-container' onClick={(e) => { setIsProfile(false); setShowNotification(false) }}>
      {/* <div className='account-container' onClick={(e) => { setIsProfile(false); setCheckRowClicked(false); setSelectedRow(null) }}> */}
      <div className={barOnclick ? 'header body-header' : 'header'}>
        <div className='bars'>
          <span><HiBars3 size={40} onClick={() => setBarOnClick(barOnclick ? false : true)} /></span>
        </div>
        <div className='title-label'>
          <span>MABES | Grading System</span>
        </div>
        <div className='profile' onClick={(e) => { e.stopPropagation(); setIsProfile(isProfile ? false : true); setShowNotification(false) }}>
          {/* <FaCircleUser size={30} /> */}
          <img src={userCredentials && userCredentials[0].image ? `${backendUrl}/assets/image uploads/${userCredentials[0].image}` : user} height={30} width={30} style={{ borderRadius: '50%' }} />
        </div>
        <div className="profile-list" style={{ display: isProfile ? 'block' : 'none' }}>
          <div className="profile-parent" style={{ marginTop: '0' }} onClick={() => setIsUserProfileClicked(isUserProfileClicked ? false : true)}>
            <BiSolidUser size={25} />
            <span>{userCredentials && `${userCredentials[0].first_name} ${userCredentials[0].middle_name} ${userCredentials[0].last_name}`}</span>
          </div>
          <div className="profile-parent" style={{ marginBottom: '10px' }} onClick={() => { setChangePassword(changePassword ? false : true); setUsername(userCredentials[0].username) }}>
            <LuSettings size={25} />
            <span>Change Password</span>
          </div>
          <hr />
          <div className="profile-parent" onClick={() => setLogout(true)}>
            <HiOutlineLogout size={25} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* notification side */}
      <div className='notification-icon profile' onClick={(e) => e.stopPropagation()}>
        <div onClick={() => {setShowNotification(showNotification ? false : true); setIsProfile(false)}}>
          <MdNotificationsNone className='not-icon' size={30} />
        </div>
        <div className="notification-number">
          <span>2</span>

          <div style={{ display: showNotification ? 'block' : 'none' }}>
            <div className="notification-list">
              <div className="not-found">
                <span>2 Notification</span>
              </div>
              <hr />
              <div className="five-not-list seen">
                <MdNotificationsNone className='left-not' size={25} />
                <div className="not-text">
                  <span>This is the first notification ffffffffsssssssss</span>
                </div>
              </div>
              <div className="five-not-list seen">
                <MdNotificationsNone className='left-not' size={25} />
                <div className="not-text">
                  <span>This is the first notification ffffffffsssssssss</span>
                </div>
              </div>
              <div className="five-not-list">
                <MdNotificationsNone className='left-not' size={25} />
                <div className="not-text">
                  <span>This is the first notification ffffffffsssssssss</span>
                </div>
              </div>
              <div className="five-not-list">
                <MdNotificationsNone className='left-not' size={25} />
                <div className="not-text">
                  <span>This is the first notification ffffffffsssssssss</span>
                </div>
              </div>
              <div className="five-not-list seen">
                <MdNotificationsNone className='left-not' size={25} />
                <div className="not-text">
                  <span>This is the first notification ffffffffsssssssss</span>
                </div>
              </div>
              <hr />
              <div className="not-found">
                <span>See All Notifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={barOnclick ? 'side-bar update-side-bar' : 'side-bar'} style={{ animation: barOnclick ? 'barReverse .3s linear' : '' }}>
        <div className='user-type'>
          <div className="user-span">
            <img src={logo} height={50} width={50} alt="" />
            <label>Student</label>
          </div>
          <div className="close-bar" onClick={() => setBarOnClick(true)}>
            <AiOutlineClose size={26} />
          </div>
        </div>
        <hr className='hr' />

        <div className="user-type top" onClick={() => setIsUserProfileClicked(isUserProfileClicked ? false : true)}>
          <img src={userCredentials && userCredentials[0].image ? `${backendUrl}/assets/image uploads/${userCredentials[0].image}` : user} height={50} width={50} alt="" style={{ borderRadius: '50%' }} />
          <span>{userCredentials && `${userCredentials[0].first_name} ${userCredentials[0].middle_name} ${userCredentials[0].last_name}`}</span>
        </div>

        <hr className='hr' />

        <div className="side-parent" style={{ padding: usersIcon ? '' : '0px 10px 10px 0px' }}>
          <div className="form-control side" onClick={() => setUsersIcon(usersIcon ? false : true)}>
            <FaUsers size={20} />
            <span>Users</span>
            {usersIcon ? (
              <IoIosArrowDown className='font-icon' size={20} />
            ) : (
              <IoIosArrowUp className='font-icon' size={20} />
            )}
          </div>
          <div style={{ display: usersIcon ? 'none' : 'block' }}>
            <div className={isStudentAccount ? 'side-list add-button-background' : 'side-list'} onClick={studentButtonClicked}>
              <FiUsers size={18} />
              <span>Student</span>
            </div>
          </div>
        </div>

        {/* <div className="side-parent" style={{ padding: usersIcon ? '' : '0px 10px 10px 0px' }}>
                    <div className="form-control side" onClick={() => setUsersIcon(usersIcon ? false : true)}>
                        <LiaFileSolid size={20} />
                        <span>Add Users</span>
                        {usersIcon ? (
                            <IoIosArrowDown className='font-icon' size={20} />
                        ) : (
                            <IoIosArrowUp className='font-icon' size={20} />
                        )}
                    </div>
                    <div style={{ display: usersIcon ? 'none' : 'block' }}>
                        <div className="side-list">
                            <HiOutlineDocumentDuplicate size={18} />
                            <span>Add Student</span>
                        </div>
                        <div className="side-list">
                            <FiUser size={18} />
                            <span>Promote Candidates</span>
                        </div>
                        <div className="side-list">
                            <FaUsers size={18} />
                            <span>Candidates List</span>
                        </div>
                    </div>
                </div> */}

        <div className="side-parent" style={{ padding: recordsIcon ? '' : '0px 10px 10px 0px' }}>
          <div className="form-control side" onClick={() => setRecordsIcon(recordsIcon ? false : true)}>
            <LiaFileSolid size={20} />
            <span>Records</span>
            {recordsIcon ? (
              <IoIosArrowDown className='font-icon' size={20} />
            ) : (
              <IoIosArrowUp className='font-icon' size={20} />
            )}
          </div>
          <div style={{ display: recordsIcon ? 'none' : 'block' }}>
            <div className={isStudentList ? 'side-list add-button-background' : 'side-list'} onClick={studentListButtonClicked}>
              <FiUsers size={18} />
              <span>Student List</span>
            </div>
            <div className={isPromoteStudent ? 'side-list add-button-background' : 'side-list'} onClick={promoteStudentButtonClicked}>
              <FiUser size={18} />
              <span>Promote Student</span>
            </div>
            <div className={isSubjectList ? 'side-list add-button-background' : 'side-list'} onClick={subjectListButtonClicked}>
              <SlNotebook size={18} />
              <span>Subject List</span>
            </div>
          </div>
        </div>

        <div className="side-parent" style={{ padding: maintenanceIcon ? '' : '0px 10px 10px 0px' }}>
          <div className="form-control side" onClick={() => setMaintenanceIcon(maintenanceIcon ? false : true)}>
            <GiAutoRepair size={20} />
            <span>Maintenance</span>
            {maintenanceIcon ? (
              <IoIosArrowDown className='font-icon' size={20} />
            ) : (
              <IoIosArrowUp className='font-icon' size={20} />
            )}
          </div>
          <div style={{ display: maintenanceIcon ? 'none' : 'block' }}>
            <div className={isSchoolYear ? 'side-list add-button-background' : 'side-list'} onClick={schoolYearButtonClicked}>
              <MdDateRange size={18} />
              <span>School Year</span>
            </div>
            <div className={isGradeList ? 'side-list add-button-background' : 'side-list'} onClick={gradeListButtonClicked}>
              <LiaFileSolid size={18} />
              <span>Grade List</span>
            </div>
          </div>
        </div>

        {/* <div className="side-parent" style={{ padding: reportIcon ? '' : '0px 10px 10px 0px' }}>
                    <div className="form-control side" onClick={() => setReportIcon(reportIcon ? false : true)}>
                        <LiaFileSolid size={20} />
                        <span>Reports</span>
                        {reportIcon ? (
                            <IoIosArrowDown className='font-icon' size={20} />
                        ) : (
                            <IoIosArrowUp className='font-icon' size={20} />
                        )}
                    </div>
                    <div style={{ display: reportIcon ? 'none' : 'block' }}>
                        <div className="side-list">
                            <FiUser size={18} />
                            <span>Promote Student</span>
                        </div>
                        <div className="side-list">
                            <FiUsers size={18} />
                            <span>Student List</span>
                        </div>
                        <div className="side-list">
                            <SlNotebook size={18} />
                            <span>Subject List</span>
                        </div>
                    </div>
                </div> */}

        <div className="side-parent">
          <div className="form-control side" >
            <TfiAnnouncement size={20} />
            <span>Announcement</span>
          </div>
        </div>
      </div>

      {/* user popup modal */}
      <div className="popup-modal-profile" onClick={() => setIsUserProfileClicked(false)} style={{ visibility: isUserProfileClicked ? 'visible' : 'hidden' }}>
        <div className="popup-body" onClick={(e) => e.stopPropagation()} style={{ animation: isUserProfileClicked ? 'dropBottom .3s linear' : '' }}>
          <div className="modal-close" onClick={() => setIsUserProfileClicked(false)}>
            <AiOutlineCloseCircle size={30} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src={userCredentials && userCredentials[0].image ? `${backendUrl}/assets/image uploads/${userCredentials[0].image}` : user} alt="" style={{ borderRadius: '50%', height: '130px', width: '130px', border: '3px solid #ccc' }} />
            {/* <img src={userCredentials && userCredentials[0].image[0] === "h" ? userCredentials[0].image : userCredentials && userCredentials[0].image[0] && userCredentials[0].image[0].match(/^\d/) ? `${backendUrl}/assets/image uploads/${userCredentials[0].image}` : givenProfile} alt="" style={{ borderRadius: '50%', height: '130px', width: '130px', border: '3px solid #ccc' }} /> */}
            <label htmlFor="uploadPhoto" style={{ marginTop: '100px', marginLeft: '-40px', cursor: 'pointer', zIndex: '3', color: 'white' }}>
              <VscDeviceCamera size={30} style={{ backgroundColor: 'rgb(71, 71, 98)', padding: '3px', borderRadius: '50%' }} />
              <input type="file" id="uploadPhoto" onChange={(e) => setProfileUpload(e.target.files[0])} style={{ display: 'none' }} />
            </label>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div>
              <h2>{userCredentials && `${userCredentials[0].first_name} ${userCredentials[0].middle_name} ${userCredentials[0].last_name}`}</h2>
            </div>
            <div style={{ marginTop: '10px' }}>
              <span>{userCredentials && userCredentials[0].user_type}</span>
            </div><br />
          </div>
          <hr />
          <div className="form-control" style={{ textAlign: 'center' }}>
            <span>Other profile view</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="popup-modal-profile popup-student" style={{ visibility: logout ? 'visible' : 'hidden' }}>
        <div className="popup-body student-body" onClick={(e) => e.stopPropagation()} style={{ animation: logout ? 'dropBottom .3s linear' : '' }}>

          <div className="popup-edit">
            <span>Logout?</span>
          </div>
          <hr />
          <div className="form-control manage-account">
            <span>Are you sure you wan't to Logout ?</span>
          </div>
          <div className="form-control" style={{ justifyContent: 'space-between', marginTop: '25px', display: 'flex' }}>
            <button className='update-button' onClick={() => setLogout(false)}>No</button>
            <button className='cancel-button' onClick={() => { localStorage.removeItem('token'); navigate('/') }}>Yes</button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="popup-modal-profile popup-student" style={{ visibility: changePassword ? 'visible' : 'hidden' }}>
        <div className="popup-body student-body" onClick={(e) => e.stopPropagation()} style={{ animation: changePassword ? 'dropBottom .3s linear' : '' }}>

          <div className="popup-edit">
            <span>Change Password</span>
          </div>
          <hr />
          <form onSubmit={handleChangePassword}>
            <div className="form-control manage-account">
              <span>Username</span>
              <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className='form-input manage-account' style={{ height: '35px' }} />
            </div>
            <div className="form-control manage-account">
              <span>Current Password</span>
              <input type="text" placeholder='*********' value={password} onChange={(e) => setPassword(e.target.value)} className='form-input manage-account' style={{ height: '35px' }} />
            </div>
            <div className="form-control manage-account">
              <span>New Password</span>
              <input type="text" placeholder='*********' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='form-input manage-account' style={{ height: '35px' }} />
            </div>
            <div className="form-control manage-account">
              <span>Confirm Password</span>
              <input type="text" placeholder='*********' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='form-input manage-account' style={{ height: '35px' }} />
            </div>
            <div className="form-control" style={{ justifyContent: 'space-between', marginTop: '25px', display: 'flex' }}>
              <button className='update-button' type='button' onClick={() => setChangePassword(false)}>Cancel</button>
              <button className='cancel-button' type='submit'>Save</button>
            </div>
          </form>
        </div>
      </div>

      {/* fetching data screen */}
      <div className="popup-modal-profile" style={{ display: isLoading ? 'block' : 'none' }}>
        <div className="modal-pop-up-loading">
          <div className="modal-pop-up-loading-spiner"></div>
          <p>Loading...</p>
        </div>
      </div>

      {/* Loading div */}
      <div className='error-respond' style={{ display: isError || isSuccess ? 'block' : 'none', backgroundColor: isSuccess && !isError ? '#7b4ae4' : '#fb7d60' }}>
        <div>
          <h5>{errorMessage}</h5>
        </div>
      </div>

    </div>
  )
}

export default StudentAccount
