import React, { Children } from 'react'
import '../styles/LayoutStyles.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
// import {  adminMenu, userMenu } from '../Data/data'
import { useSelector } from 'react-redux'
// import { SidebarMenu } from './../Data/data';
import {Badge, message} from 'antd'
const Layout = ({children}) => {
    const { user } = useSelector(state => state.user)
    const location = useLocation();
    const navigate = useNavigate();

    //logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success('Logout Successfully');
    navigate('/login');
  };


  // =========== Doctor Menu ========== //
  const doctorMenu = [
    {
        name: 'Home',
        path: '/',
        icon: 'fa-solid fa-house'
    },
    {
        name: 'Appointments',
        path: '/doctor-appointments',
        icon: 'fa-solid fa-list'
    },
    {
        name: 'Profile',
        path: `/doctor/profile/${user?._id}`,
        icon: 'fa-solid fa-user'
    },
    
]
  // =========== Doctor Menu ========== //


  const userMenu = [
    {
        name: 'Home',
        path: '/',
        icon: 'fa-solid fa-house'
    },
    {
        name: 'Appointments',
        path: '/appointments',
        icon: 'fa-solid fa-list'
    },
    {
        name: 'Doctor Registration',
        path: '/apply-doctor',
        icon: 'fa-solid fa-user-doctor'
    },
    // {
    //     name: 'Profile',
    //     path: `/user/profile/${user?._id}`,
    //     icon: 'fa-solid fa-user'
    // },
    
]


// const { user } = useSelector(state => state.user);
// admin menu
const adminMenu = [
    {
        name: 'Home',
        path: '/',
        icon: 'fa-solid fa-house'
    },
    {
        name: 'Doctors',
        path: '/admin/doctors',
        icon: 'fa-solid fa-user-doctor'
    },
    {
        name: 'Users',
        path: '/admin/users',
        icon: 'fa-solid fa-user'
    },
    // {
    //     name: 'Profile',
    //     path: `/admin/profile/${user?._id}`,
    //     icon: 'fa-solid fa-user'
    // },
    
]
// ======== admin menu

  //rendering menu list
  const SidebarMenu = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
  return (
    <>
        <div className='main'>
            <div className='layout'>
                <div className='sidebar'>
                    <div className='logo'>
                        <h6>DocMed's</h6> 
                        <hr />
                    </div>
                    <div className='menu' id='menu'>
                        {SidebarMenu.map((menu) => {
                            const isActive = location.pathname === menu.path;
                            return (
                                <>
                                    <div className={`menu-item ${isActive && 'active'}`}>
                                        <i className={menu.icon}></i>
                                        <Link to={menu.path}>{menu.name}</Link>
                                    </div>
                                </>
                            );
                        })}
                        <div className={`menu-item `} onClick={handleLogout}>
                            <i className='fa-solid fa-right-from-bracket'></i>
                            <Link to='/login'>Logout</Link>
                        </div>
                    </div> 
                    {/* <div className='toggleMenu' id='menuToggle'>
                        <input type="checkbox" />
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>                    */}
                </div>
                <div className='content'>
                    <div className='header'>
                        <div className='header-content' style={{cursor:'pointer'}}>
                            <Badge 
                                count={user && user.notifcation.length} 
                                onClick={() => {navigate('/notification')}}
                            >
                                <i className="fa-solid fa-bell"></i>
                            </Badge>
                            <Link to='/profile'>{user?.name}</Link>
                        </div>
                    </div>
                    <div className='body'>{children}</div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Layout
