import './styles/index.css'
import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChevronLeft,
  LogOut,
  Bell,
  FlaskConical,
  BarChart,
  Users,
  MapPin,
  CreditCard,
  Menu,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ManagerDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(true)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const toggleNav = () => setIsNavExpanded(!isNavExpanded)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  const navItems = [
    { name: 'All Booking List', icon: <BarChart className="h-5 w-5" />, path: '/manager-dashboard/all-booking' },
    { name: 'Sales Staff Assignment', icon: <FlaskConical className="h-5 w-5" />, path: '/manager-dashboard/sales-staff-assignment' },
    { name: 'Quotes Review', icon: <FlaskConical className="h-5 w-5" />, path: '/manager-dashboard/quotes-review' },
    { name: 'Consulting Staff Assignment', icon: <FlaskConical className="h-5 w-5" />, path: '/manager-dashboard/consulting-staff-assignment' },
    { name: 'Delivery Staff Assignment', icon: <FlaskConical className="h-5 w-5" />, path: '/manager-dashboard/delivery-staff-assignment' },
    { name: 'Farm Control', icon: <FlaskConical className="h-5 w-5" />, path: '/manager-dashboard/farm-control' },
    { name: 'Variety Control', icon: <FlaskConical className="h-5 w-5" />, path: '/manager-dashboard/variety-control' },
    { name: 'Farm View', icon: <FlaskConical className="h-5 w-5" />, path: '/manager-dashboard/farm-view' },
    { name: 'Trip View', icon: <FlaskConical className="h-5 w-5" />, path: '/manager-dashboard/trip-view' },
  ]

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation Sidebar */}
      <nav
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isNavExpanded ? 'w-64' : 'w-20'
        }`}>
        <div className="p-4 flex justify-between items-center">
          {isNavExpanded && <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">KOSJapan</span>}
          <Button
            onClick={toggleNav}
            variant="ghost"
            size="icon"
            className="text-gray-500 dark:text-gray-400">
            {isNavExpanded ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        <ul className="space-y-2 mt-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100">
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
        <header
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
          <div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Manager Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString()}</span>
              <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user?.mediaUrl || "/placeholder.svg?height=32&width=32"} alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</span>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}