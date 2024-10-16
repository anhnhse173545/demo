import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const API_BASE_URL = 'http://localhost:8081';

export function AccountManagerComponent() {
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [role, setRole] = useState("")

  const createAccount = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const accountData = Object.fromEntries(formData)
    
    try {
      const response = await axios.post(`${API_BASE_URL}/accounts/create`, accountData)
      const newAccount = response.data
      setAccounts([...accounts, newAccount])
    } catch (error) {
      console.error('Error creating account:', error)
    }
  }

  const updateAccount = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const accountData = Object.fromEntries(formData)
    
    try {
      const response = await axios.put(`${API_BASE_URL}/accounts/${selectedAccount.id}/update`, accountData)
      const updatedAccount = response.data
      setAccounts(accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc))
    } catch (error) {
      console.error('Error updating account:', error)
    }
  }

  const fetchAccountDetails = async (accountId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts/${accountId}/detail`)
      const accountDetails = response.data
      setSelectedAccount(accountDetails)
    } catch (error) {
      console.error('Error fetching account details:', error)
    }
  }

  const fetchAllAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts/all`)
      const allAccounts = response.data
      setAccounts(allAccounts)
    } catch (error) {
      console.error('Error fetching all accounts:', error)
    }
  }

  const fetchAccountsByRole = async () => {
    if (!role) return
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts/${role}/all`)
      const accountsByRole = response.data
      setAccounts(accountsByRole)
    } catch (error) {
      console.error('Error fetching accounts by role:', error)
    }
  }

  const deleteAccount = async (accountId) => {
    try {
      await axios.delete(`${API_BASE_URL}/accounts/${accountId}/delete`)
      setAccounts(accounts.filter(acc => acc.id !== accountId))
      setSelectedAccount(null)
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  return (
    (<div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Add a new account to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createAccount}>
              <div className="space-y-2">
                <Label htmlFor="create-name">Name</Label>
                <Input id="create-name" name="name" required />
                <Label htmlFor="create-email">Email</Label>
                <Input id="create-email" name="email" type="email" required />
                <Label htmlFor="create-password">Password</Label>
                <Input id="create-password" name="password" type="password" required />
                <Label htmlFor="create-phone">Phone</Label>
                <Input id="create-phone" name="phone" />
                <Label htmlFor="create-address">Address</Label>
                <Textarea id="create-address" name="address" />
                <Label htmlFor="create-role">Role</Label>
                <Select name="role">
                  <SelectTrigger id="create-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Sales Staff">Sales Staff</SelectItem>
                    <SelectItem value="Consulting Staff">Consulting Staff</SelectItem>
                    <SelectItem value="Delivery Staff">Delivery Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="mt-4">Create Account</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Account</CardTitle>
            <CardDescription>Modify existing account details</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAccount ? (
              <form onSubmit={updateAccount}>
                <div className="space-y-2">
                  <Label htmlFor="update-name">Name</Label>
                  <Input id="update-name" name="name" defaultValue={selectedAccount.name} required />
                  <Label htmlFor="update-email">Email</Label>
                  <Input
                    id="update-email"
                    name="email"
                    type="email"
                    defaultValue={selectedAccount.email}
                    required />
                  <Label htmlFor="update-phone">Phone</Label>
                  <Input id="update-phone" name="phone" defaultValue={selectedAccount.phone} />
                  <Label htmlFor="update-address">Address</Label>
                  <Textarea id="update-address" name="address" defaultValue={selectedAccount.address} />
                  <Label htmlFor="update-role">Role</Label>
                  <Select name="role" defaultValue={selectedAccount.role}>
                    <SelectTrigger id="update-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Sales Staff">Sales Staff</SelectItem>
                    <SelectItem value="Consulting Staff">Consulting Staff</SelectItem>
                    <SelectItem value="Delivery Staff">Delivery Staff</SelectItem>
                  </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="mt-4">Update Account</Button>
              </form>
            ) : (
              <p>Select an account to update</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>View detailed information for a specific account</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAccount ? (
              <div>
                <p><strong>ID:</strong> {selectedAccount.id}</p>
                <p><strong>Name:</strong> {selectedAccount.name}</p>
                <p><strong>Email:</strong> {selectedAccount.email}</p>
                <p><strong>Phone:</strong> {selectedAccount.phone}</p>
                <p><strong>Role:</strong> {selectedAccount.role}</p>
              </div>
            ) : (
              <p>Select an account to view details</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Accounts</CardTitle>
            <CardDescription>List of all accounts in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchAllAccounts}>Fetch All Accounts</Button>
            <ul className="mt-4 space-y-2">
              {Array.isArray(accounts) && accounts.map(account => (
                <li key={account.id} className="flex justify-between items-center">
                  <span>{account.name}</span>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAccountDetails(account.id)}
                      className="mr-2">
                      View
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteAccount(account.id)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounts by Role</CardTitle>
            <CardDescription>Filter accounts by their assigned role</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Sales Staff">Sales Staff</SelectItem>
                    <SelectItem value="Consulting Staff">Consulting Staff</SelectItem>
                    <SelectItem value="Delivery Staff">Delivery Staff</SelectItem>
                  </SelectContent>
            </Select>
            <Button onClick={fetchAccountsByRole} className="mt-4">Fetch Accounts by Role</Button>
            <ul className="mt-4 space-y-2">
              {Array.isArray(accounts) && accounts.map(account => (
                <li key={account.id}>{account.name} - {account.role}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>)
  );
}