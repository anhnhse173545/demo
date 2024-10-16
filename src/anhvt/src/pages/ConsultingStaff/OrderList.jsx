import React, { useState } from "react";
import { Table, Button, message, Badge } from "antd";
import { useNavigate } from "react-router-dom"; // For navigation

// Initial Data for the Main Table
const initialData = [
  {
    key: "1",
    tripId: "T001",
    customer: "John Doe",
    startDate: "2024-10-01",
    endDate: "2024-10-05",
    koiDetails: [
      {
        breeder: "Breeder A",
        date: "2024-10-02",
        koi: "Koi A",
        type: "Kohaku",
        price: 100,
        paymentMethod: "Credit Card", // Specific to this koi
        status: "Not Pay Yet", // Specific to this koi
      },
      {
        breeder: "Breeder B",
        date: "2024-10-03",
        koi: "Koi B",
        type: "Sanke",
        price: 150,
        paymentMethod: "PayPal", // Specific to this koi
        status: "Paid", // Specific to this koi
      },
    ],
  },
  {
    key: "2",
    tripId: "T002",
    customer: "Jane Smith",
    startDate: "2024-10-03",
    endDate: "2024-10-06",
    koiDetails: [
      {
        breeder: "Breeder C",
        date: "2024-10-04",
        koi: "Koi C",
        type: "Showa",
        price: 120,
        paymentMethod: "PayPal",
        status: "Paid",
      },
    ],
  },
  {
    key: "3",
    tripId: "T003",
    customer: "Bob Brown",
    startDate: "2024-10-01",
    endDate: "2024-10-05",
    koiDetails: [
      {
        breeder: "Breeder D",
        date: "2024-10-02",
        koi: "Koi D",
        type: "Asagi",
        price: 110,
        paymentMethod: "Bank Transfer",
        status: "Not Pay Yet",
      },
    ],
  },
];

const OrderList = () => {
  const [data, setData] = useState(initialData);
  const navigate = useNavigate();
  const handleEditKoi = (updatedKoi) => {
    // Update Koi details in the main data
    const updatedData = data.map((trip) => {
      const updatedKoiDetails = trip.koiDetails.map((koi) => {
        if (koi.koi === updatedKoi.koi) {
          return { ...koi, ...updatedKoi }; // Merge updated details
        }
        return koi;
      });
      return { ...trip, koiDetails: updatedKoiDetails };
    });
    setData(updatedData);
    message.success("Koi details updated successfully.");
  };
  const handleAddKoi = (tripId, newKoi) => {
    const updatedData = data.map((trip) => {
      if (trip.tripId === tripId) {
        return { ...trip, koiDetails: [...trip.koiDetails, newKoi] };
      }
      return trip;
    });
    setData(updatedData);
  };

  // Update status to 'Paid' when "Mark as Paid" is clicked
  const handleMarkAsPaid = (tripKey, koiKey) => {
    const updatedData = data.map((trip) => {
      if (trip.key === tripKey) {
        const updatedKoiDetails = trip.koiDetails.map((koi) => {
          if (koi.koi === koiKey && koi.status === "Not Pay Yet") {
            return { ...koi, status: "Paid" };
          }
          return koi;
        });
        return { ...trip, koiDetails: updatedKoiDetails };
      }
      return trip;
    });
    setData(updatedData);
    message.success("Koi status changed to Paid.");
  };

  const handleSendToDelivery = (tripKey, koiKey) => {
    message.success(`Koi ${koiKey} from trip ID ${tripKey} sent to delivery.`);
  };

  // Expanded row for each trip (with payment method, status, and mark as paid button)
  const expandedRowRender = (record) => {
    const expandedColumns = [
      { title: "Breeder", dataIndex: "breeder", key: "breeder" },
      { title: "Date", dataIndex: "date", key: "date" },
      { title: "Koi", dataIndex: "koi", key: "koi" },
      { title: "Type", dataIndex: "type", key: "type" },
      { title: "Price", dataIndex: "price", key: "price" },
      {
        title: "Payment Method",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusColor = status === "Paid" ? "success" : "warning";
          return <Badge status={statusColor} text={status} />;
        },
      },
      {
        title: "Action",
        key: "action",
        render: (_, koiRecord) => (
          <>
            <Button
              type="primary"
              disabled={koiRecord.status === "Paid"}
              onClick={() => handleMarkAsPaid(record.key, koiRecord.koi)}
              style={{ marginRight: 8 }}
            >
              {koiRecord.status === "Paid" ? "Paid" : "Mark as Paid"}
            </Button>
            <Button
              type="default"
              onClick={() => handleSendToDelivery(record.key, koiRecord.koi)}
              disabled={koiRecord.status !== "Paid"}
            >
              Send to Delivery
            </Button>
            <Button
              type="link"
              onClick={() =>
                navigate("/koi-details", { state: { koi: koiRecord } })
              }
              style={{ marginLeft: 8 }}
            >
              More
            </Button>
          </>
        ),
      },
    ];

    return (
      <div>
        <Table
          columns={expandedColumns}
          dataSource={record.koiDetails}
          pagination={false}
          rowKey={(row) => row.koi}
        />
        <Button
          type="primary"
          onClick={() =>
            navigate("/add-koi", { state: { tripId: record.tripId } })
          }
          style={{ marginTop: 16 }}
        >
          Add New Koi
        </Button>
      </div>
    );
  };

  const columns = [
    { title: "Trip ID", dataIndex: "tripId", key: "tripId" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    {
      title: "Price",
      key: "price",
      render: (_, record) => (
        <span>
          {record.koiDetails.reduce((total, koi) => total + koi.price, 0)}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>On-Going Order List</h1>
      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: expandedRowRender,
        }}
        rowKey="tripId" // Make sure each row is uniquely identified by tripId
      />
    </div>
  );
};

export default OrderList;
