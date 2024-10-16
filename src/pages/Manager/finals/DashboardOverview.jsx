import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, MapPin, CreditCard, Check } from 'lucide-react'

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tours</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">-3 from last week</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>A summary of the latest events in your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <Badge variant="secondary"><Check className="h-4 w-4" /></Badge>
              <span className="text-sm">New tour package "European Delight" created</span>
            </li>
            <li className="flex items-center space-x-3">
              <Badge variant="secondary"><Users className="h-4 w-4" /></Badge>
              <span className="text-sm">5 new staff members added to the team</span>
            </li>
            <li className="flex items-center space-x-3">
              <Badge variant="secondary"><CreditCard className="h-4 w-4" /></Badge>
              <span className="text-sm">Payment of $12,450 received for "Asian Explorer" tour</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}