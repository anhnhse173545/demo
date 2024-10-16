import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "antd";

// Sample trip plan
const tripPlan = `
Day 1: Tokyo – A Blend of Old and New
  Morning: Tsukiji Market and Toyosu Market
  Midday: Tokyo Tower and Modern Art
  Afternoon: Shibuya Crossing and Shopping
  Evening: Dining in Golden Gai

Day 2: Kyoto – Timeless Traditions
  Morning: Fushimi Inari Shrine
  Midday: Nishiki Market and Lunch
  Afternoon: Traditional Arts and Green Tea Ceremony
  Evening: Traditional Japanese Dinner and Ryokan Experience

Day 3: The Mount Fuji Experience
  Early Morning: Travel to Mount Fuji
  Midday: Boat Ride and Lunch
  Afternoon: Hiking and Nature Exploration
  Evening: Luxury Onsen Ryokan Stay

Day 4: Tokyo Revisited – Cherry Blossoms and Serenity
  Morning: Meguro River Cherry Blossoms
  Midday: Lunch and Quirky Convenience Store Experience
  Afternoon: Cultural Sites and Relaxation
  Evening: Shibuya Sensory Overload

Day 5: Departure from Narita Airport
  Morning: Last Minute Shopping and Sightseeing
  Midday: Reflective Lunch
  Afternoon: Departure Preparations
`;

const initialTourData = [
  {
    key: "1",
    customer: "John Doe",
    startDate: "2024-10-01",
    endDate: "2024-10-05",
    status: "Not Check In",
  },
  {
    key: "2",
    customer: "Jane Smith",
    startDate: "2024-10-03",
    endDate: "2024-10-06",
    status: "Not Check In",
  },
  {
    key: "3",
    customer: "Alice Johnson",
    startDate: "2024-10-04",
    endDate: "2024-10-07",
    status: "Checked In",
  },
  {
    key: "4",
    customer: "Bob Brown",
    startDate: "2024-10-02",
    endDate: "2024-10-08",
    status: "Not Check In",
  },
  {
    key: "5",
    customer: "Emily Davis",
    startDate: "2024-10-09",
    endDate: "2024-10-12",
    status: "Cancelled",
  },
  {
    key: "6",
    customer: "Michael Wilson",
    startDate: "2024-10-05",
    endDate: "2024-10-10",
    status: "Checked In",
  },
  {
    key: "7",
    customer: "Sarah Miller",
    startDate: "2024-10-07",
    endDate: "2024-10-10",
    status: "Not Check In",
  },
  {
    key: "8",
    customer: "David Martin",
    startDate: "2024-10-15",
    endDate: "2024-10-20",
    status: "Cancelled",
  },
  {
    key: "9",
    customer: "Laura Martinez",
    startDate: "2024-10-17",
    endDate: "2024-10-22",
    status: "Not Check In",
  },
  {
    key: "10",
    customer: "James Taylor",
    startDate: "2024-10-12",
    endDate: "2024-10-18",
    status: "Not Check In",
  },
  {
    key: "11",
    customer: "Linda Harris",
    startDate: "2024-10-20",
    endDate: "2024-10-25",
    status: "Not Check In",
  },
  {
    key: "12",
    customer: "Richard Clark",
    startDate: "2024-10-10",
    endDate: "2024-10-14",
    status: "Checked In",
  },
  {
    key: "13",
    customer: "Barbara Lewis",
    startDate: "2024-10-22",
    endDate: "2024-10-27",
    status: "Not Check In",
  },
  {
    key: "14",
    customer: "Daniel Walker",
    startDate: "2024-10-14",
    endDate: "2024-10-19",
    status: "Cancelled",
  },
  {
    key: "15",
    customer: "Matthew Lee",
    startDate: "2024-10-25",
    endDate: "2024-10-29",
    status: "Not Check In",
  },
];

const TourDetails = () => {
  const { tourId } = useParams();
  const selectedTour = initialTourData.find((tour) => tour.key === tourId);

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Tour Details", 20, 10);

    doc.autoTable({
      head: [["Customer", "Start Date", "End Date", "Status"]],
      body: [
        [
          selectedTour.customer,
          selectedTour.startDate,
          selectedTour.endDate,
          selectedTour.status,
        ],
      ],
    });

    doc.text("Trip Plan", 20, 50);
    // Split the trip plan into lines and add each line to the PDF
    doc.autoTable({
      body: tripPlan.split("\n").map((line) => [line.trim()]), // Displaying each line of the trip plan
    });

    doc.save(`${selectedTour.customer}_tour_details.pdf`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tour Details</h1>
      <p>
        <strong>Customer:</strong> {selectedTour.customer}
      </p>
      <p>
        <strong>Start Date:</strong> {selectedTour.startDate}
      </p>
      <p>
        <strong>End Date:</strong> {selectedTour.endDate}
      </p>
      <p>
        <strong>Status:</strong> {selectedTour.status}
      </p>
      <h3>Trip Plan</h3>
      <pre>{tripPlan}</pre> {/* Displaying the trip plan */}
      <Button type="primary" onClick={handleExportToPDF}>
        Export to PDF
      </Button>
    </div>
  );
};

export default TourDetails;
