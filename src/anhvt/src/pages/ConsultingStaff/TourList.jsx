import { useState, useEffect } from "react";
import { Table, Button, Badge, message, Select } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import moment from "moment"; // For handling date comparisons

const initialTourData = [
  {
    key: "1",
    customer: "John Doe",
    startDate: "2024-10-01",
    endDate: "2024-10-05",
    status: "Completed",
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
    status: "Completed",
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
    status: "Completed",
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

const TourList = () => {
  const [tourData, setTourData] = useState(initialTourData);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("ascend");
  const [sortBy, setSortBy] = useState("startDate"); // New state for sorting criteria
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  // Automatically cancel tours if start date has passed and status is still "Not Check In"
  useEffect(() => {
    const updatedTourData = tourData.map((tour) => {
      const today = moment(); // Current date
      const tourStartDate = moment(tour.startDate, "YYYY-MM-DD");

      if (tour.status === "Not Check In" && today.isAfter(tourStartDate)) {
        return { ...tour, status: "Cancelled" };
      }
      return tour;
    });

    setTourData(updatedTourData);
  }, [tourData]);

  const handleCheckIn = (key) => {
    const updatedTourData = tourData.map((tour) => {
      if (tour.key === key && tour.status === "Not Check In") {
        return { ...tour, status: "Checked In" };
      }
      return tour;
    });

    setTourData(updatedTourData);
    message.success("Status changed to Checked In.");
  };

  const handleCancel = (key) => {
    const updatedTourData = tourData.map((tour) => {
      if (tour.key === key && tour.status !== "Checked In") {
        return { ...tour, status: "Cancelled" };
      }
      return tour;
    });

    setTourData(updatedTourData);
    message.success("Status changed to Cancelled.");
  };

  const handleMarkCompleted = (key) => {
    const updatedTourData = tourData.map((tour) => {
      if (tour.key === key && tour.status === "Checked In") {
        return { ...tour, status: "Completed" };
      }
      return tour;
    });

    setTourData(updatedTourData);
    message.success("Tour marked as Completed.");
  };

  const handleViewDetails = (tour) => {
    navigate(`/tour-details/${tour.key}`); // Navigate to the details page
  };

  const handleStatusFilter = (value) => {
    setFilteredStatus(value);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
  };

  const filteredData = tourData.filter((tour) => {
    if (filteredStatus === "All") return true;
    return tour.status === filteredStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = moment(a[sortBy]);
    const dateB = moment(b[sortBy]);
    return sortOrder === "ascend" ? dateA - dateB : dateB - dateA;
  });

  const columns = [
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Not Check In", value: "Not Check In" },
        { text: "Checked In", value: "Checked In" },
        { text: "Cancelled", value: "Cancelled" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.status.includes(value),
      render: (text) => {
        const statusColor =
          text === "Checked In"
            ? "success"
            : text === "Cancelled"
            ? "error"
            : text === "Completed"
            ? "processing"
            : "warning";
        return <Badge status={statusColor} text={text} />;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            disabled={
              record.status === "Checked In" ||
              record.status === "Cancelled" ||
              record.status === "Completed"
            }
            onClick={() => handleCheckIn(record.key)}
            style={{ marginRight: 8 }}
          >
            {record.status === "Checked In" ? "Checked In" : "Check In"}
          </Button>
          <Button
            type="danger"
            disabled={
              record.status === "Checked In" ||
              record.status === "Cancelled" ||
              record.status === "Completed"
            }
            onClick={() => handleCancel(record.key)}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button type="default" onClick={() => handleViewDetails(record)}>
            More
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Tour List</h1>
      <div style={{ marginBottom: 16 }}>
        <Select
          value={sortBy}
          onChange={handleSortByChange}
          style={{ width: 200, marginRight: 16 }}
          options={[
            { label: "Sort by Start Date", value: "startDate" },
            { label: "Sort by End Date", value: "endDate" },
          ]}
        />

        <Select
          value={sortOrder}
          onChange={handleSortOrderChange}
          style={{ width: 150 }}
          options={[
            { label: "Date Ascending", value: "ascend" },
            { label: "Date Descending", value: "descend" },
          ]}
        />
      </div>
      <Table columns={columns} dataSource={sortedData} pagination={false} />
    </div>
  );
};

export default TourList;
