import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function FarmImageUpload() {
  const [farmId, setFarmId] = useState('1')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file to upload.' })
      return
    }

    setUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`http://localhost:8080/media/farm/${farmId}/upload/image`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      setMessage({ type: 'success', text: 'Image uploaded successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    (<Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload Farm Image</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Farm ID"
              value={farmId}
              onChange={(e) => setFarmId(e.target.value)}
              className="mb-2" />
          </div>
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading} />
          </div>
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </form>
        {message && (
          <Alert
            variant={message.type === 'error' ? 'destructive' : 'default'}
            className="mt-4">
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>)
  );
}