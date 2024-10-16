'use client';
import React, { useState, useCallback } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8081/accounts',
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

export default function AccountApiTester() {
  // State management
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newAccountData, setNewAccountData] = useState({
     
    password: '',
    name: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    profile_image: '',
    is_deleted: false
  })
  const [updateAccountData, setUpdateAccountData] = useState({
     
    password: '',
    name: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    profile_image: '',
    is_deleted: false
  })
  const [getAccountId, setGetAccountId] = useState('')
  const [deleteAccountId, setDeleteAccountId] = useState('')

  // Error handling function
  const handleError = useCallback((error) => {
    if (axios.isAxiosError(error)) {
      setError(error.response?.data?.message || error.message)
    } else {
      setError('An unexpected error occurred')
    }
    setLoading(false)
  }, [])

  // Fetch all accounts
  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/all')
      setAccounts(response.data)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [handleError])

  // Create a new account
  const handleCreateAccount = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/create-new-account', newAccountData)
      await fetchAccounts()
      // Reset form after successful creation
      setNewAccountData({
       
      password: '',
      name: '',
      role: '',
      email: '',
      phone: '',
      address: '',
      profile_image: '',
      is_deleted: false
      })
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [fetchAccounts, handleError, newAccountData])

  // Update an account
  const handleUpdateAccount = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.put(`/${updateAccountData.id}/update-account`, updateAccountData)
      await fetchAccounts()
      // Reset form after successful update
      setUpdateAccountData({
         
        password: '',
        name: '',
        role: '',
        email: '',
        phone: '',
        address: '',
        profile_image: '',
        is_deleted: false
      })
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [fetchAccounts, handleError, updateAccountData])

  // Get a single account
  const handleGetAccount = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/${getAccountId}`)
      setAccounts([response.data])
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [getAccountId, handleError])

  // Delete an account
  const handleDeleteAccount = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/${deleteAccountId}/delete`)
      await fetchAccounts()
      setDeleteAccountId('')
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [deleteAccountId, fetchAccounts, handleError])

  return (
    (<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Account API Tester</h1>
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="list">List Accounts</TabsTrigger>
          <TabsTrigger value="create">Create Account</TabsTrigger>
          <TabsTrigger value="update">Update Account</TabsTrigger>
          <TabsTrigger value="get">Get Account</TabsTrigger>
          <TabsTrigger value="delete">Delete Account</TabsTrigger>
        </TabsList>

        {/* List Accounts Tab */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>List All Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchAccounts} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Fetch Accounts'}
              </Button>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {accounts.length > 0 && (
                <div className="mt-4 space-y-4">
                  {accounts.map((account) => (
                    <Card key={account.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p><strong>ID:</strong> {account.id}</p>
                            <p><strong>Name:</strong> {account.name}</p>
                            <p><strong>Email:</strong> {account.email}</p>
                            <p><strong>Role:</strong> {account.role}</p>
                            <p><strong>Phone:</strong> {account.phone}</p>
                            <p><strong>Address:</strong> {account.address}</p>
                            <p><strong>Is Deleted:</strong> {account.isDeleted ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Account Tab */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                 
                <Input
                  type="password"
                  placeholder="Password"
                  value={newAccountData.password}
                  onChange={(e) => setNewAccountData({ ...newAccountData, password: e.target.value })}
                  required />
                <Input
                  placeholder="Name"
                  value={newAccountData.name}
                  onChange={(e) => setNewAccountData({ ...newAccountData, name: e.target.value })}
                  required />
                <Input
                  placeholder="Role"
                  value={newAccountData.role}
                  onChange={(e) => setNewAccountData({ ...newAccountData, role: e.target.value })}
                  required />
                <Input
                  placeholder="Phone"
                  value={newAccountData.phone}
                  onChange={(e) => setNewAccountData({ ...newAccountData, phone: e.target.value })}
                  required />
                <Input
                  placeholder="Address"
                  value={newAccountData.address}
                  onChange={(e) => setNewAccountData({ ...newAccountData, address: e.target.value })}
                  required />
                <Input
                  placeholder="Profile Image URL"
                  value={newAccountData.profileImg}
                  onChange={(e) => setNewAccountData({ ...newAccountData, profileImg: e.target.value })} />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDeleted"
                    checked={newAccountData.isDeleted}
                    onCheckedChange={(checked) => setNewAccountData({ ...newAccountData, isDeleted: checked })} />
                  <Label htmlFor="isDeleted">Is Deleted</Label>
                </div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={newAccountData.email}
                  onChange={(e) => setNewAccountData({ ...newAccountData, email: e.target.value })}
                  required />
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
                </Button>
              </form>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Update Account Tab */}
        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle>Update Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateAccount} className="space-y-4">
                <Input
                  placeholder="ID"
                  value={updateAccountData.id}
                  onChange={(e) => setUpdateAccountData({ ...updateAccountData, id: e.target.value })}
                  required />
                <Input
                  type="password"
                  placeholder="Password"
                  value={updateAccountData.password}
                  onChange={(e) => setUpdateAccountData({ ...updateAccountData, password: e.target.value })} />
                <Input
                  placeholder="Name"
                  value={updateAccountData.name}
                  onChange={(e) => setUpdateAccountData({ ...updateAccountData, name: e.target.value })} />
                <Input
                  placeholder="Role"
                  value={updateAccountData.role}
                  onChange={(e) => setUpdateAccountData({ ...updateAccountData, role: e.target.value })} />
                <Input
                  placeholder="Phone"
                  value={updateAccountData.phone}
                  onChange={(e) => setUpdateAccountData({ ...updateAccountData, phone: e.target.value })} />
                <Input
                  placeholder="Address"
                  value={updateAccountData.address}
                  onChange={(e) => setUpdateAccountData({ ...updateAccountData, address: e.target.value })} />
                <Input
                  placeholder="Profile Image URL"
                  value={updateAccountData.profileImg}
                  onChange={(e) => setUpdateAccountData({ ...updateAccountData, profileImg: e.target.value })} />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="updateIsDeleted"
                    checked={updateAccountData.isDeleted}
                    onCheckedChange={(checked) => setUpdateAccountData({ ...updateAccountData, isDeleted: checked })} />
                  <Label htmlFor="updateIsDeleted">Is Deleted</Label>
                </div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={updateAccountData.email}
                  onChange={(e) => setUpdateAccountData({ ...updateAccountData, email: e.target.value })} />
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update Account'}
                </Button>
              </form>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Get Account Tab */}
        <TabsContent value="get">
          <Card>
            <CardHeader>
              <CardTitle>Get Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGetAccount} className="space-y-4">
                <Input
                  placeholder="Account ID"
                  value={getAccountId}
                  onChange={(e) => setGetAccountId(e.target.value)}
                  required />
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Account'}
                </Button>
              </form>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delete Account Tab */}
        <TabsContent value="delete">
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <Input
                  placeholder="Account ID"
                  value={deleteAccountId}
                  onChange={(e) => setDeleteAccountId(e.target.value)}
                  required />
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete Account'}
                </Button>
              </form>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>)
  );
}