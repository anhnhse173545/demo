import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";

// Sample Koi data (for demonstration)
const koiData = {
  koi: "Koi A",
  description: "This is a beautiful Kohaku koi fish.",
  type: "Kohaku",
  breeder: "Breeder A",
  date: "2024-10-02",
  price: 100,
  paymentMethod: "Credit Card",
  status: "Not Pay Yet",
  video: "KoiDetails.mp4",
  image: "KoiDetails.png",
};

const KoiDetails = () => {
  const { koiKey } = useParams(); // Get Koi key from the URL params
  const navigate = useNavigate();

  // State to manage Koi details
  const [koi, setKoi] = useState(koiData);

  // Function to handle editing fields
  const handleEdit = () => {
    // Here, you would typically make an API call to save the edited data
    message.success("Koi details updated successfully.");
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Koi Details: {koi.koi}</h1>
      <img
        src={koi.image}
        alt={koi.koi}
        style={{ width: "300px", height: "200px" }}
      />
      <video width="400" controls>
        <source src={koi.video} type="video/mp4" />
      </video>
      <div>
        <h2>Description</h2>
        <Input.TextArea
          value={koi.description}
          onChange={(e) => setKoi({ ...koi, description: e.target.value })}
          rows={4}
        />
      </div>
      <div>
        <h2>Type</h2>
        <Input
          value={koi.type}
          onChange={(e) => setKoi({ ...koi, type: e.target.value })}
        />
      </div>
      <div>
        <h2>Breeder</h2>
        <Input
          value={koi.breeder}
          onChange={(e) => setKoi({ ...koi, breeder: e.target.value })}
        />
      </div>
      <div>
        <h2>Date</h2>
        <Input
          value={koi.date}
          onChange={(e) => setKoi({ ...koi, date: e.target.value })}
        />
      </div>
      <div>
        <h2>Price</h2>
        <Input
          type="number"
          value={koi.price}
          onChange={(e) => setKoi({ ...koi, price: Number(e.target.value) })}
        />
      </div>
      <div>
        <h2>Payment Method</h2>
        <Input
          value={koi.paymentMethod}
          onChange={(e) => setKoi({ ...koi, paymentMethod: e.target.value })}
        />
      </div>
      <div>
        <h2>Status</h2>
        <Input
          value={koi.status}
          onChange={(e) => setKoi({ ...koi, status: e.target.value })}
        />
      </div>
      <Button type="primary" onClick={handleEdit}>
        Save Changes
      </Button>
    </div>
  );
};

export default KoiDetails;
