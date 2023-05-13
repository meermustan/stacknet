import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import '../styling/AdminPanel.css'

function AdminPanel() {
  window.scrollTo(0, 0);
  document.title = "StackNET - Dashboard"
  return (
    <div className='AdminPanelBody'>
      <div className='AdminContainer'>
        <h1>Admin Dashboard</h1>
        <div className='ButtonsAndContainer'>
          <div className='AdminButtons'>
            <NavLink to='/admin/allusers'>
              <div><i className="fas fa-users"></i> Manage Users </div>
            </NavLink>
            <NavLink to='/admin/approveposts/Tutorials'>
              <div><i className="fas fa-person-chalkboard"></i> Approve tutorials </div>
            </NavLink>
            <NavLink to='/admin/approveposts/Projects'>
              <div><i className="fas fa-diagram-project"></i> Approve projects </div>
            </NavLink>
          </div>
          <div className='DetailBox'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel