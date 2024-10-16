import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, CreditCard, Users, TrendingUp } from 'lucide-react'

export default function PaymentStatusView() {
  const [payments, setPayments] = useState([
    { id: 1, customerName: "Alice Johnson", tourName: "European Adventure", amount: 2500, status: "Paid", date: "2024-05-15" },
    { id: 2, customerName: "Bob Smith", tourName: "Asian Explorer", amount: 3000, status: "Pending", date: "2024-06-01" },
    { id: 3, customerName: "Charlie Brown", tourName: "African Safari", amount: 4000, status: "Refunded", date: "2024-07-10" },
    { id: 4, customerName: "Diana Ross", tourName: "European Adventure", amount: 2500, status: "Paid", date: "2024-05-20" },
    { id: 5, customerName: "Edward Norton", tourName: "Asian Explorer", amount: 3000, status: "Overdue", date: "2024-06-05" },
  ])

  const [filterStatus, setFilterStatus] = useState("all")

  const filteredPayments = payments.filter(payment => 
    filterStatus === "all" ? true : payment.status.toLowerCase() === filterStatus
  )

  const totalRevenue = payments.reduce((sum, payment) => sum + (payment.status === "Paid" ? payment.amount : 0), 0)
  const pendingRevenue = payments.reduce((sum, payment) => sum + (payment.status === "Pending" ? payment.amount : 0), 0)

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
      case 'refunded':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Payment Status</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalRevenue / payments.length).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Overview</CardTitle>
          <CardDescription>Track and manage payment statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Tour</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.customerName}</TableCell>
                  <TableCell>{payment.tourName}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}