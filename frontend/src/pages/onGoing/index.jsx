import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Phone, Calendar, MapPin, DollarSign, Tag, Briefcase, Plane, Fish, ArrowLeft } from 'lucide-react';

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

  const renderFishOrderDetails = (fishOrderDetails) => (
    <div className="space-y-4">
      {fishOrderDetails.map((order) => (
        <div key={order.id} className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-2">Order ID: {order.id}</h4>
          {order.fishOrderDetails.map((detail) => (
            <div key={detail.id} className="ml-4 space-y-1">
              <p><span className="font-medium">Fish Variety:</span> {detail.fish.fish_variety_name}</p>
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
    <div className="space-y-4">
      {fishPackOrderDetails.map((pack) => (
        <div key={pack.id} className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-2">Fish Pack ID: {pack.id}</h4>
          <p><span className="font-medium">Description:</span> {pack.fishPack.description}</p>
          <p><span className="font-medium">Quantity:</span> {pack.fishPack.quantity}</p>
          <p><span className="font-medium">Price:</span> ${pack.price}</p>
        </div>
      ))}
    </div>
  );

  if (loadingTrip) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">Loading data...</div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-3xl font-bold">Booking Details for ID: {id}</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <User className="mr-2 text-blue-600" />
              Customer Information
            </h3>
            <p><span className="font-medium">Name:</span> {tripData.customer.name}</p>
            <p><span className="font-medium">Email:</span> {tripData.customer.email || 'N/A'}</p>
            <p><span className="font-medium">Phone:</span> {tripData.customer.phone || 'N/A'}</p>
            <p><span className="font-medium">Description:</span> {tripData.description}</p>
            <p><span className="font-medium">Created At:</span> {new Date(tripData.createAt).toLocaleString()}</p>
          </div>

          {tripData.saleStaff && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Briefcase className="mr-2 text-blue-600" />
                Sales Staff Information
              </h3>
              <p><span className="font-medium">ID:</span> {tripData.saleStaff.id}</p>
              <p><span className="font-medium">Name:</span> {tripData.saleStaff.name}</p>
              <p><span className="font-medium">Email:</span> {tripData.saleStaff.email || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {tripData.saleStaff.phone || 'N/A'}</p>
            </div>
          )}

          {tripData.consultingStaff && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Briefcase className="mr-2 text-blue-600" />
                Consulting Staff Information
              </h3>
              <p><span className="font-medium">ID:</span> {tripData.consultingStaff.id}</p>
              <p><span className="font-medium">Name:</span> {tripData.consultingStaff.name}</p>
              <p><span className="font-medium">Email:</span> {tripData.consultingStaff.email || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {tripData.consultingStaff.phone || 'N/A'}</p>
            </div>
          )}

          {tripData.trip && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Plane className="mr-2 text-blue-600" />
                Trip Information
              </h3>
              <p><span className="font-medium">Trip ID:</span> {tripData.trip.id}</p>
              <p><span className="font-medium">Start Date:</span> {new Date(tripData.trip.startDate).toLocaleString()}</p>
              <p><span className="font-medium">End Date:</span> {new Date(tripData.trip.endDate).toLocaleString()}</p>
              <p><span className="font-medium">Departure Airport:</span> {tripData.trip.departureAirport}</p>
              <p><span className="font-medium">Description:</span> {tripData.trip.description || 'N/A'}</p>
              <p><span className="font-medium">Price:</span> ${tripData.trip.price}</p>
              <p><span className="font-medium">Status:</span> {tripData.trip.status}</p>
            </div>
          )}

          {tripData.trip.tripDestinations && tripData.trip.tripDestinations.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="mr-2 text-blue-600" />
                Itinerary
              </h3>
              {tripData.trip.tripDestinations.map((destination, index) => (
                <div key={index} className="mb-4 p-4 bg-white rounded-md shadow">
                  <h4 className="font-semibold">Destination {index + 1}</h4>
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
          )}

          {tripData.fishOrders && tripData.fishOrders.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Fish className="mr-2 text-blue-600" />
                Fish Orders
              </h3>
              {renderFishOrderDetails(tripData.fishOrders)}
            </div>
          )}

          {tripData.fishOrders && tripData.fishOrders.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Fish className="mr-2 text-blue-600" />
                Fish Pack Orders
              </h3>
              {renderFishPackOrderDetails(tripData.fishOrders.flatMap(order => order.fishPackOrderDetails))}
            </div>
          )}
        </div>

        {(errorReject || errorPay) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorReject || errorPay}</span>
          </div>
        )}

        <div className="bg-gray-100 px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}