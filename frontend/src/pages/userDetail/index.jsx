import { useEffect, useState } from 'react';
import axios from 'axios';
import './ngu.css'; // Import CSS file
import { useNavigate, useParams } from 'react-router-dom';

const UserDetailPage = () => {
  const { id } = useParams(); // Lấy accountId từ URL
  const [userDetails, setUserDetails] = useState(null); // Store fetched user details
  const [formData, setFormData] = useState({}); // Store form data for editing
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message state
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
  const [selectedImage, setSelectedImage] = useState(null); // Store selected image for upload
  const navigate = useNavigate(); // For navigation

  // Fetch user details from API
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/accounts/${id}/detail`);
        setUserDetails(response.data);
        setFormData(response.data); // Initialize formData with fetched data
      } catch (err) {
        setError('Error loading user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Save changes and update user details
  const handleSaveChanges = async () => {
    try {
      const { password, phone, role, ...dataToUpdate } = formData;
      const response = await axios.put(`http://localhost:8080/accounts/${id}/update`, dataToUpdate);

      if (response.status === 200) {
        setUserDetails(formData);
        setIsEditing(false);
      }
    } catch (err) {
      setError('Error updating user details.');
      console.error(err);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post(`http://localhost:8080/media/accounts/${id}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setUserDetails({ ...userDetails, profile_image: response.data.imageUrl });
        setSelectedImage(null);
      }
    } catch (err) {
      setError('Error uploading image.');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-detail-container">
      <h1>User Details</h1>
      {userDetails && (
        <div>
          <img 
            src={userDetails.profile_image || "https://i.pinimg.com/236x/59/f0/d0/59f0d0067c5d04c5db5f92f517767002.jpg"} 
            alt="Profile" 
            className="profile-image" 
          />
          <div className="user-info">
            {isEditing ? (
              <div>
                <p><strong>ID:</strong> {userDetails.id}</p>
                <p>
                  <strong>Name:</strong> 
                  <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} />
                </p>
                <p>
                  <strong>Email:</strong> 
                  <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} />
                </p>
                <p>
                  <strong>Address:</strong> 
                  <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} />
                </p>
                <button className="back-button" onClick={handleSaveChanges}>Save Changes</button>
                <button className="back-button" onClick={handleEditToggle}>Cancel</button>
              </div>
            ) : (
              <div>
                <p><strong>ID:</strong> {userDetails.id}</p>
                <p><strong>Name:</strong> {userDetails.name}</p>
                <p><strong>Phone:</strong> {userDetails.phone || "No phone available"}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Address:</strong> {userDetails.address}</p>
                <p><strong>Role:</strong> {userDetails.role}</p>
              </div>
            )}
          </div>
          {isEditing && (
            <div>
              <input type="file" onChange={handleImageChange} />
              <button onClick={handleImageUpload}>Upload Image</button>
            </div>
          )}
          <button className="back-button" onClick={() => navigate(-1)}>Back</button>
          <button className="back-button" onClick={handleEditToggle}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
