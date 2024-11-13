import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, DollarSign, Tag, Briefcase, Plane, Fish } from 'lucide-react';

export default function CompleteTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [errorTrip, setErrorTrip] = useState(null);
  const [errorReject, setErrorReject] = useState(null);
  const [errorPay, setErrorPay] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/booking/get/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTripData(data);
        setLoadingTrip(false);
      })
      .catch((error) => {
        setErrorTrip(error);
        setLoadingTrip(false);
      });
  }, [id]);

  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/booking/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...tripData, status: 'Canceled' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedTrip = await response.json();
      setTripData(updatedTrip);
    } catch (error) {
      setErrorReject('Error rejecting the trip: ' + error.message);
    }
  };

  const handlePay = async () => {
    try {
      const response = await fetch(`http://localhost:8080/${id}/payment/api/create-trippayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const data = await response.json();
      
      if (data.approvalUrl) {
        const updateStatusResponse = await fetch(`http://localhost:8080/api/booking/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...tripData, status: 'Paid Booking' }),
        });

        if (!updateStatusResponse.ok) {
          throw new Error('Failed to update booking status to Paid Booking');
        }

        window.location.href = data.approvalUrl;
      } else {
        throw new Error('No approval URL received');
      }
    } catch (error) {
      setErrorPay('Error processing the payment: ' + error.message);
    }
  };

  if (loadingTrip) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">Loading trip data...</div>
      </div>
    );
  }

  if (errorTrip) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-red-600">Error loading trip data: {errorTrip.message}</div>
      </div>
    );
  }

  const renderSection = (title, icon, content) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      {content}
    </div>
  );

  const renderFishOrderDetails = (fishOrderDetails) => (
    <div>
      {fishOrderDetails.map((order) => (
        <div key={order.id} className="mb-4 p-4 bg-gray-50 rounded-md">
          <h4 className="font-medium mb-2">Order ID: {order.id}</h4>
          {order.fishOrderDetails.map((detail) => (
            <div key={detail.id} className="ml-4 mb-2">
              <p><span className="font-medium">Fish Variety:</span> {detail.fish.name}</p>
              <p><span className="font-medium">Description:</span> {detail.fish.description}</p>
              <p><span className="font-medium">Length:</span> {detail.fish.length} cm</p>
              <p><span className="font-medium">Weight:</span> {detail.fish.weight} kg</p>
              <p><span className="font-medium">Price:</span> ${detail.price}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderFishPackOrderDetails = (fishPackOrderDetails) => (
    <div>
      {fishPackOrderDetails.map((pack) => (
        <div key={pack.id} className="mb-4 p-4 bg-gray-50 rounded-md">
          <h4 className="font-medium mb-2">Fish Pack ID: {pack.id}</h4>
          <p><span className="font-medium">Description:</span> {pack.fishPack.description}</p>
          <p><span className="font-medium">Quantity:</span> {pack.fishPack.quantity}</p>
          <p><span className="font-medium">Price:</span> ${pack.price}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-3xl font-bold">Booking Details</h2>
          <p className="text-blue-200">Order ID: {id}</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderSection("Customer Information", <User className="text-blue-600" />, (
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {tripData.customer.name}</p>
              <p><span className="font-medium">Email:</span> {tripData.customer.email || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {tripData.customer.phone || 'N/A'}</p>
              <p><span className="font-medium">Description:</span> {tripData.description}</p>
              <p><span className="font-medium">Created At:</span> {new Date(tripData.createAt).toLocaleString()}</p>
            </div>
          ))}

          {tripData.saleStaff && renderSection("Sales Staff Information", <Briefcase className="text-blue-600" />, (
            <div className="space-y-2">
              <p><span className="font-medium">ID:</span> {tripData.saleStaff.id}</p>
              <p><span className="font-medium">Name:</span> {tripData.saleStaff.name}</p>
              <p><span className="font-medium">Email:</span> {tripData.saleStaff.email || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {tripData.saleStaff.phone || 'N/A'}</p>
            </div>
          ))}

          {tripData.trip && renderSection("Trip Information", <Plane className="text-blue-600" />, (
            <div className="space-y-2">
              <p><span className="font-medium">Trip ID:</span> {tripData.trip.id}</p>
              <p><span className="font-medium">Start Date:</span> {new Date(tripData.trip.startDate).toLocaleString()}</p>
              <p><span className="font-medium">End Date:</span> {new Date(tripData.trip.endDate).toLocaleString()}</p>
              <p><span className="font-medium">Departure Airport:</span> {tripData.trip.departureAirport}</p>
              <p><span className="font-medium">Description:</span> {tripData.trip.description || 'N/A'}</p>
              <p><span className="font-medium">Price:</span> ${tripData.trip.price}</p>
              <p><span className="font-medium">Status:</span> {tripData.trip.status}</p>
            </div>
          ))}

          {tripData.trip.tripDestinations && tripData.trip.tripDestinations.length > 0 && renderSection("Itinerary", <MapPin className="text-blue-600" />, (
            <div>
              {tripData.trip.tripDestinations.map((destination, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">Destination {index + 1}</h4>
                  <p><span className="font-medium">Farm Name:</span> {destination.farm.name}</p>
                  <p><span className="font-medium">Farm Address:</span> {destination.farm.address}</p>
                  <p><span className="font-medium">Phone Number:</span> {destination.farm.phoneNumber || 'N/A'}</p>
                  <div className="mt-2">
                    <h5 className="font-medium">Koi Varieties:</h5>
                    {destination.farm.varieties && destination.farm.varieties.length > 0 ? (
                      destination.farm.varieties.map((variety) => (
                        <div key={variety.id} className="ml-4">
                          <p><span className="font-medium">Variety:</span> {variety.name}</p>
                          <p><span className="font-medium">Description:</span> {variety.description}</p>
                        </div>
                      ))
                    ) : (
                      <p>No koi varieties available for this farm.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {tripData.fishOrders && tripData.fishOrders.length > 0 && renderSection("Fish Orders", <Fish className="text-blue-600" />, renderFishOrderDetails(tripData.fishOrders))}

          {tripData.fishOrders && tripData.fishOrders.length > 0 && renderSection("Fish Pack Orders", <Fish className="text-blue-600" />, renderFishPackOrderDetails(tripData.fishOrders.flatMap(order => order.fishPackOrderDetails)))}
        </div>

        {(errorReject || errorPay) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorReject || errorPay}</span>
          </div>
        )}

        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300 ease-in-out"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back
          </button>
          <div>
            <button
              onClick={handlePay}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 ease-in-out mr-2"
            >
              <DollarSign className="mr-2" size={20} />
              Pay
            </button>
            <button
              onClick={handleReject}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
            >
              <Tag className="mr-2" size={20} />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}