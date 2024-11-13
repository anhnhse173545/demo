import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './viewtrip.scss'; // Ensure correct path to CSS

const CreateTrip = () => {
    const { id } = useParams(); // Get bookingId from URL
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [departureAirport, setDepartureAirport] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('On-going'); // Default status
    const [tripDestinations, setTripDestinations] = useState(''); // For multiple destinations, this could be an array
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); // To show success message
    const navigate = useNavigate();
    const MAX_TRIPS = 100; // Max trip limit

    const [existingTripCount, setExistingTripCount] = useState(0);

    useEffect(() => {
        const fetchTripCount = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/booking/customer/AC0007`);
                if (!response.ok) {
                    throw new Error('Failed to fetch trips');
                }
                const trips = await response.json();
                setExistingTripCount(trips.length); // Store the count of existing trips
            } catch (error) {
                setError(error.message);
            }
        };

        fetchTripCount();
    }, []);

   

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form action


        const tripData = {
            id, // Assign new ID to tripData
            startDate,
            endDate,
            departureAirport,
            price: Number(price), // Ensure price is a number
            description,
            status, // Add the status field
            tripDestinations: tripDestinations.split(',').map(dest => dest.trim()), // Split destinations into an array
        };

        try {
            // Send request using bookingId from URL
            const response = await fetch(`http://localhost:8080/api/booking/${id}/create-trip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripData),
            });

            if (!response.ok) {
                throw new Error('Failed to create trip');
            }

            setSuccess('Trip created successfully!'); // Show success message
            setError(null);
            setTimeout(() => navigate('/CustomerRequest'), 2000); // Redirect to home after 2 seconds
        } catch (error) {
            setError(error.message);
            setSuccess(null);
        }
    };

    return (
        <div className="create-trip">
            <h2>Create Customer's Trip</h2>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>} {/* Success message */}
            <form onSubmit={handleSubmit}>
                <label>
                    Start Date:
                    <input 
                        type="datetime-local" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        required 
                        aria-label="Start Date"
                    />
                </label>
                <label>
                    End Date:
                    <input 
                        type="datetime-local" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        required 
                        aria-label="End Date"
                    />
                </label>
                <label>
                    Departure Airport:
                    <input 
                        type="text" 
                        value={departureAirport} 
                        onChange={(e) => setDepartureAirport(e.target.value)} 
                        required 
                        aria-label="Departure Airport"
                    />
                </label>
                <label>
                    Price:
                    <input 
                        type="number" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        required 
                        aria-label="Price"
                    />
                </label>
                <label>
                    Description:
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        aria-label="Description"
                    />
                </label>
              
                
                <button type="submit">Create Trip</button>
            </form>
            {/* Back button */}
            <button onClick={() => navigate(-1)} className="back-button">Back</button>
        </div>
    );
};

export default CreateTrip;
