import React from 'react';
import './index.css'; // Importing the CSS file

// Sample data for real koi farms
const koiFarms = [
  {
    id: 1,
    name: 'Ojiya Koi Farm',
    location: 'Ojiya, Niigata',
    description: 'Ojiya Koi Farm is renowned for its high-quality koi, especially Kohaku and Sanke. This farm provides fish breeding services and organizes tours for koi enthusiasts.',
    imageUrl: 'https://thehiddenjapan.com/wp-content/uploads/2023/01/Ojiya-City-1-2-768x512.jpg', // Replace with actual image URLs
  },
  {
    id: 2,
    name: 'Koshiji Koi Farm',
    location: 'Niigata',
    description: 'Koshiji Koi Farm specializes in beautifully patterned koi. It is an excellent place to learn about koi breeding and participate in workshops on fish care.',
    imageUrl: 'https://i.ytimg.com/vi/-4u5CuP8Oac/maxresdefault.jpg', // Replace with actual image URLs
  },
  {
    id: 3,
    name: 'Dainichi Koi Farm',
    location: 'Niigata',
    description: 'Dainichi Koi Farm is known for its large, high-quality koi. They focus on breeding rare varieties, providing many options for collectors.',
    imageUrl: 'https://i.ytimg.com/vi/a-pGFjB7wPg/maxresdefault.jpg', // Replace with actual image URLs
  },
  {
    id: 4,
    name: 'Yamakoshi Koi Farm',
    location: 'Yamakoshi, Niigata',
    description: 'Yamakoshi Koi Farm is one of the oldest and most famous koi farms in Japan. They offer a variety of koi and have a strong reputation in the koi community.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSIRBO9ewdIBmhuux1Z1unKXcwJMeN96T6zw&s', // Replace with actual image URLs
  },
  {
    id: 5,
    name: 'Hoshikin Koi Farm',
    location: 'Niigata',
    description: 'Hoshikin Koi Farm is known for its high-quality koi and attentive customer service. The farm also hosts events and exhibitions related to koi.',
    imageUrl: 'https://i.ytimg.com/vi/fHAv-12Io1w/maxresdefault.jpg', // Replace with actual image URLs
  },
   {
    id: 6,
    name: 'Koi Kichi Koi Farm',
    location: 'Osaka',
    description: 'Koi Kichi Koi Farm is dedicated to breeding high-quality koi with unique color patterns. They offer tours and koi care workshops.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvFFcXENOcbetLSLcngWv-2nY_R1ZQi3SOCA&s',
  },
  {
    id: 7,
    name: 'Koi Zone',
    location: 'Tokyo',
    description: 'Koi Zone features a vast collection of koi and offers breeding services. They are known for their knowledgeable staff and excellent customer service.',
    imageUrl: 'https://thietbibeca.com/uploads/ca-koi-nhat/haitung-koizone1.jpg',
  },
  {
    id: 8,
    name: 'Takano Koi Farm',
    location: 'Fukuoka',
    description: 'Takano Koi Farm specializes in show-quality koi and hosts competitions. Visitors can participate in koi selection and care tutorials.',
    imageUrl: 'https://i.ytimg.com/vi/ABxX9uzxCEw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA5cNlOnPqv_B6LvQEoW4LTCjS3tA',
  },
  {
    id: 9,
    name: 'Marusho Koi Farm',
    location: 'Ehime',
    description: 'Marusho Koi Farm is known for its stunning Kohaku koi and offers a range of koi-related products and services.',
    imageUrl: 'https://i.ytimg.com/vi/WXGVhGA5M5s/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC2Bv0ttBBATgGwsrQqVWw7D9InjQ',
  },
  {
    id: 10,
    name: 'Higashiyama Koi Farm',
    location: 'Kyoto',
    description: 'Higashiyama Koi Farm is a picturesque farm set in the mountains, known for its tranquil atmosphere and premium koi.',
    imageUrl: 'https://i.ytimg.com/vi/pUADEpL3DNM/maxresdefault.jpg',
  },
];

const KoiFarmPage = () => {
  return (
    <div className="koi-farm-container">
      <h1>Explore Koi Farms in Japan</h1>
      <p>
        Japan is the birthplace of koi, beautiful fish nurtured and developed over generations. 
        The koi farms here are not only famous for their quality fish but also offer amazing experiences for visitors. 
        Let’s explore some of the standout koi farms in Japan!
      </p>
      <div className="farm-list">
        {koiFarms.map(farm => (
          <div key={farm.id} className="farm-card">
            <div className="farm-details">
              <h2 className="farm-title">{farm.name}</h2>
              <p className="farm-location"><strong>Location:</strong> {farm.location}</p>
              <p>{farm.description}</p>
            </div>
            <img src={farm.imageUrl} alt={farm.name} className="farm-image" />
          </div>
        ))}
      </div>
      <p>
        Besides these koi farms, Japan has many other places for you to explore and learn more about koi culture. 
        Plan your trip so you don't miss out on these wonderful experiences!
      </p>
    </div>
  );
};

export default KoiFarmPage;
