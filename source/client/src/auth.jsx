import React, {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

//V1
// const ProtectedRoute = ({ children, factor }) => {
//   const location = useLocation();
//   if (!factor) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

//V2


const ProtectedRoute = () => {
  const [cookie, setCookie, removeCookie] = useCookies(['user'], {
		doNotParse: false,
		doNotUpdate: false
	});
  const user = cookie.user;


  const location = useLocation();
  if (!user || user === 'undefined') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    return <Outlet/>;
  }

  
};

const ToHome = () => {
  const [cookie] = useCookies(['user'], {
		doNotParse: false,
		doNotUpdate: false
	});

  const user = cookie.user;
  
  if (!user || user === 'undefined')
    return <Navigate to="/login" replace />;
  switch (user.role) {
    case 1:
      return <Navigate to='/student/home' replace/>;
    case 2:
      return <Navigate to='/staff/home' replace/>;
    case 3:
      return <Navigate to='/db-manager/home' replace/>;
  }
}


//Restricting role access
const Authorize = ({ role }) => {
  const [cookie] = useCookies(['user'], {
		doNotParse: false,
		doNotUpdate: false
	});

  const user = cookie.user;
  
  if (user.role == role)
    return <Outlet/>;
  else
  {
    return <ToHome/>;
  }
}

export  {ProtectedRoute, ToHome, Authorize};

