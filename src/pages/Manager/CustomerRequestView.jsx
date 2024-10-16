import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Calendar, TrendingUp } from 'lucide-react'

export default function CustomerRequestsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Customer Requests</h2>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Incoming Tour Requests</CardTitle>
            <CardDescription>Manage and process customer inquiries</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Input type="text" placeholder="Search requests..." className="w-64" />
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {['John Doe', 'Jane Smith', 'Bob Johnson'].map((customer) => (
              <li key={customer} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={customer} />
                      <AvatarFallback>{customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Requested Tour: City Explorer</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700">
                    Pending
                  </Badge>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      Request Date: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Potential Value: $2,500
                  </div>
                </div>
                <div className="mt-2">
                  <Button size="sm" variant="outline">Assign Staff</Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}