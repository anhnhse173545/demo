import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChevronLeft,
  LogOut,
  Bell,
  FlaskConical,
  BarChart,
  ClipboardList,
  Users,
  MapPin,
  CreditCard,
  Menu,
} from 'lucide-react'

///////////////
// import { TripListComponent } from './tests/trip-list'
import { TripListComponent } from './pages/trip-list-component'
 
///////////////

import DashboardOverview from './finals/DashboardOverview'
import CustomerRequestView from './CustomerRequestView'
import StaffManagerView from './finals/StaffManagerView'
import TourManagerView from './TourManagerView'
import PaymentStatusView from './PaymentStatusView'
import { BookingManagementJsx } from './manage/booking-management'
import { EnhancedBookingManagementComponent } from './tests/enhanced-booking-management'

import { ConsultingStaffAssignmentViewJsx } from './pages/components-consulting-staff-assignment-view'
 import { QuoteDetails } from './pages/quote-details'
import { SalesStaffManagementComponent } from './finals/sales-staff-management'
import { ConsultingStaffAssignmentComponent } from './finals/consulting-staff-assignment-component'
import { ExtendedQuoteReviewComponent } from './finals/extended-quote-review'
import { DeliveryStaffAssignment } from './finals/delivery-staff-assignment'
     

export default function ManagerDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(true)

  const toggleNav = () => setIsNavExpanded(!isNavExpanded)

  const navItems = [
    ///////////////
    
    
    { name: 'Sales Staff Assignment', icon: <FlaskConical className="h-5 w-5" />, path: '/sales-staff-assignment' },
    { name: 'Quotes Review', icon: <FlaskConical className="h-5 w-5" />, path: '/test1' },
    { name: 'Consulting Staff Assignment', icon: <FlaskConical className="h-5 w-5" />, path: '/consulting-staff-assignment' },
    { name: 'Delivery Staff Assignment', icon: <FlaskConical className="h-5 w-5" />, path: '/delivery-staff-assignment' },
    ///////////////
    { name: 'Dashboard Overview', icon: <BarChart className="h-5 w-5" />, path: '/dashboard' }, 
    { name: 'Staff Manager', icon: <Users className="h-5 w-5" />, path: '/staff-manager' },
    { name: 'Tour Manager', icon: <MapPin className="h-5 w-5" />, path: '/tour-manager' },
    { name: 'Payment Status', icon: <CreditCard className="h-5 w-5" />, path: '/payment-status' },
     { name: 'Test3', icon: <FlaskConical className="h-5 w-5" />, path: '/test3' },
  ]

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Navigation Sidebar */}
        <nav
          className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
            isNavExpanded ? 'w-64' : 'w-20'
          }`}
        >
          <div className="p-4 flex justify-between items-center">
            {isNavExpanded && <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">KOSJapan</span>}
            <Button
              onClick={toggleNav}
              variant="ghost"
              size="icon"
              className="text-gray-500 dark:text-gray-400"
            >
              {isNavExpanded ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          <ul className="space-y-2 mt-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link to={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                  >
                    {item.icon}
                    {isNavExpanded && <span className="ml-3">{item.name}</span>}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Manager Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString()}</span>
                <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
                  <Bell className="h-5 w-5" />
                </Button>
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Routes>
                {/* /////////////////// */}
                <Route path='/test1' element={<ExtendedQuoteReviewComponent  />} />
                <Route path='/test2' element={<QuoteDetails />} />
                <Route path='/test3' element={<EnhancedBookingManagementComponent />} />
                <Route path='/sales-staff-assignment' element={<SalesStaffManagementComponent />} />
                <Route path='/consulting-staff-assignment' element={<ConsultingStaffAssignmentComponent />} />
                <Route path='/delivery-staff-assignment' element={<DeliveryStaffAssignment />} />
                {/* ///////////////////// */}

                <Route path="/dashboard" element={<DashboardOverview />} />
                 <Route path="/staff-manager" element={<StaffManagerView />} />
                <Route path="/tour-manager" element={<TourManagerView />} />
                <Route path="/payment-status" element={<PaymentStatusView />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}