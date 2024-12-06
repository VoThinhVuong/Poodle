import React, {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import {ProtectedRoute, Authorize, ToHome} from './auth.jsx';

import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPass.jsx';

import Home from './pages/Home.jsx';
import Enroll from './pages/Enroll.jsx';

import StudentAccount from './pages/student/account.jsx';
import ViewGPA from './pages/student/viewGPA.jsx';
import ViewSchedule from './pages/student/viewSchedule.jsx';
import CourseSite from './Components/Course_site.jsx';

import StaffAccount from './Components/Account_Info.jsx';

import DBM_Home from './pages/db-manager/Home.jsx';
import AddStudentStaff from './pages/db-manager/addStudentStaff.jsx';
import AddClass from './pages/db-manager/addClass.jsx';
import AddCourse from './pages/db-manager/addCourse.jsx';
import ViewExistStudent from './pages/db-manager/viewStudents.jsx';
import ViewExistStaffs from './pages/db-manager/viewExistStaffs.jsx';
import ViewExistCourses from './pages/db-manager/viewExistCourses.jsx';
import ViewExistClasses from './pages/db-manager/viewExistClasses.jsx';


import "./styles/App.css"

export default function App() {
	const [cookie] = useCookies(['user']);
	return <BrowserRouter>
		<link rel="stylesheet" href='https://fonts.googleapis.com/css2?family=Anonymous+Pro:ital,wght@0,400;0,700;1,400;1,700&display=swap' />
		{/* <UserContext.Provider value={{user: user, updateUser: updateUser}}> */}
			<Routes>
				{/* GENERAL */}
				<Route path='/login' element={cookie.user ? <ToHome/> : <Login/>}/>
				<Route path='/forgotpassword' element={<ForgotPassword/>}/>
				<Route path='/' element={<ToHome/>}/>

				{/*PROTECTED - ROLE BASED */}
				<Route element={<ProtectedRoute/>}>
					
					{/* STUDENT */}
					<Route element={<Authorize role={1}/>}>
						<Route path='/student/home' element={<Home/>}/>
						<Route path='/student/enroll' element={<Enroll/>}/>
						<Route path='/student/account' element={<StudentAccount/>}/>
						<Route path='/student/viewGPA' element={<ViewGPA/>}/>
						<Route path='/student/viewSchedule' element={<ViewSchedule/>}/>
						<Route path='/student/course/:CCID' element={<CourseSite/>}/>
						{/* ADDMORE */}

					</Route>
					
					{/* STAFF */}
					<Route element={<Authorize role={2}/>}>
						<Route path='/staff/home' element={<Home/>}/>
						<Route path='/staff/account' element={<StaffAccount/>}/>
						<Route path='/staff/course/:CCID' element={<CourseSite/>}/>
						{/* ADDMORE */}






					</Route>

					{/* ADMIN */}
					<Route element={<Authorize role={3}/>}>
						<Route path='/db-manager/home' element={<DBM_Home/>}/>
						<Route path='/db-manager/account' element={<StaffAccount/>}/>
						<Route path='/db-manager/AddStudentStaff' element={<AddStudentStaff/>}/>
						<Route path='/db-manager/viewStudents' element={<ViewExistStudent/>}/>
						<Route path='/db-manager/viewExistStaffs' element={<ViewExistStaffs/>}/>
						<Route path='/db-manager/viewExistCourses' element={<ViewExistCourses/>}/>
						<Route path='/db-manager/viewExistClasses' element={<ViewExistClasses/>}/>
						<Route path='/db-manager/addCourse' element={<AddCourse/>}/>
						<Route path='/db-manager/addClass' element={<AddClass/>}/>





					</Route>
				</Route>
			</Routes>
		{/* </UserContext.Provider> */}
	</BrowserRouter>
}

	