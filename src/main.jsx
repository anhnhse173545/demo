import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
// import App from './App'

import ManagerDashboard from './pages/Manager/ManagerDashboard'
import TripApiTesterComponent from './pages/Manager/tests/trip-api-tester'
import { HomepageComponent } from './pages/Manager/tests/homepage'
import { TripListComponent } from './pages/Manager/tests/trip-list'
import AccountApiTester from './pages/Manager/tests/account-api-tester'
import { AccountManagerComponent } from './pages/Manager/manage/account-manager'
import { BookingManagementJsx } from './pages/Manager/manage/booking-management'
import { SalesStaffAssignmentViewComponent } from './pages/Manager/pages/SalesStaff-Assign'
import { BookingApiTesterComponent } from './pages/Manager/temp/booking-api-tester'
  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <BookingApiTesterComponent /> */}
    {/* <App/> */}
    <ManagerDashboard />
    {/* <TripApiTesterComponent />
    <TripListComponent />
    <HomepageComponent /> */}
    {/* <AccountApiTester /> */}

    {/* /* <AccountManagerComponent /> */}
    
    <AccountManagerComponent />
    <BookingManagementJsx />
    <SalesStaffAssignmentViewComponent /> */

  </StrictMode>
      
)
