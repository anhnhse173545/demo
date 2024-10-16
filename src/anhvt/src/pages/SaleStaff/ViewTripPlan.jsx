import React from "react";
import { useLocation } from "react-router-dom";
import { Card, Typography, Divider } from "antd";

const { Title, Text } = Typography;

const ViewTripPlan = () => {
  const location = useLocation();
  const { customer } = location.state || {};

  // Sample itinerary; this can be dynamic based on your application logic
  const itinerary = [
    "Day 1: Arrive at the Koi Farm, Introduction to Koi Breeding.",
    "Day 2: Koi Health Management Workshop.",
    "Day 3: Visit Local Koi Auctions and Varieties.",
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>
        Trip Plan for {customer ? customer.name : "Unknown Customer"}
      </Title>

      {customer ? (
        <>
          <Card style={{ marginBottom: "20px" }}>
            <Title level={4}>Customer Information</Title>
            <Text strong>Name:</Text> {customer.name}
            <br />
            <Text strong>Contact:</Text> {customer.contact}
            <br />
            <Text strong>Koi Type:</Text> {customer.koiType}
            <br />
            <Text strong>Koi Farm:</Text> {customer.farm}
            <br />
            <Text strong>Start Date:</Text> {customer.startDate}
            <br />
            <Text strong>End Date:</Text> {customer.endDate}
            <br />
            <Text strong>Trip Details:</Text> {customer.tripDetails}
            <br />
            <Text strong>Status:</Text> {customer.status}
          </Card>

          <Divider />

          <Card>
            <Title level={4}>Itinerary</Title>
            {itinerary.map((item, index) => (
              <Text key={index}>{item}</Text>
            ))}
          </Card>
        </>
      ) : (
        <Text>No customer data available.</Text>
      )}
    </div>
  );
};

export default ViewTripPlan;
