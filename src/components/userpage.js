import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from 'axios';
import aboutimage from "./backgro.avif"

  const appStyles = {
    fontFamily: 'Arial, sans-serif',
   
    background: `url(${aboutimage}) `,
    backgroundSize: 'cover', // Use 'cover' to make the image cover the entire body
    backgroundAttachment: 'fixed', // Optional, to fix the background image
    height: '100vh',
   
    // Set the height to fill the screen
  };
function TestPage() {
  const apiUrl = 'http://127.0.0.1:8000/storeapi/medicine';

  const [medicineData, setMedicineData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedicineData, setFilteredMedicineData] = useState([]);

  useEffect(() => {
    axios.get(apiUrl)
      .then(response => {
        setMedicineData(response.data);
        setFilteredMedicineData(response.data); // Initialize filtered data with all medicines
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSearch = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredData = medicineData.filter(medicine =>
      medicine.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredMedicineData(filteredData);
  };

  const containerStyle = {
    
    padding: '16px',
    margin: '8px 0',
    backgroundColor: '#f5f5f5', // Light background color
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const medicineNameStyle = {
    
    fontSize: '18px',
    margin: '0',
    padding: '4px 0',
  };
  

  return (
    <div style={appStyles}>
    
      <Navbar />
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Medicine"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 16px', fontSize: '16px' }}>
          Search
        </button>
      </div>
      <div className="medicine-container">
        {filteredMedicineData.length > 0 ? (
          <div>
            <h1>Medicine List</h1>
            {filteredMedicineData.map(medicine => (
              <div key={medicine.id} style={containerStyle}>
                <p style={medicineNameStyle}>name:{medicine.name}</p>
                <p>price:{medicine.price}</p>
                <p>quantity:{medicine.quantity}</p>

                {/* Add more details or components related to each medicine here */}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '16px', color: 'red' }}>No matching medicine found.</p>
        )}
      </div>
    </div>
  );
}

export default TestPage;
