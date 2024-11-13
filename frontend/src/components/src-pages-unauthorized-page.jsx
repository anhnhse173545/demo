import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const UnauthorizedPage = () => {
  return (
    (<Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Unauthorized Access</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">You do not have permission to access this page.</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </CardContent>
    </Card>)
  );
}

export default UnauthorizedPage