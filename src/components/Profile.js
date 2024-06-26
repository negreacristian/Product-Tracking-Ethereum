import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const location = useLocation();
  const { account, role } = location.state || {};
  const [userLocation, setUserLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        setUserLocation(response.data.city);
        // Save profile information to localStorage
        const profile = { account, role, location: response.data.city };
        localStorage.setItem('profile', JSON.stringify(profile));
      } catch (error) {
        console.error('Error fetching location:', error);
        setUserLocation('Location not available');
      }
    };

    fetchLocation();
  }, [account, role]);

  console.log('Profile State:', location.state); // Debugging log

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary back-button" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
      </button>
      {account ? (
        <div className="card">
          <div className="card-body d-flex flex-column" style={{ height: '300px' }}>
            <h1 style={{ fontWeight: 'bold' }}>{role} Profile Page</h1>
            <div className="mt-auto" style={{ textAlign: 'left' }}>
              <p><strong>Account:</strong> {account}</p>
              <p><strong>Role:</strong> {role}</p>
              <p><strong>Location:</strong> {userLocation}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>No profile information available.</p>
      )}
    </div>
  );
};

export default Profile;
