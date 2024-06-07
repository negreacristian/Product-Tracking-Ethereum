import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const Profile = () => {
  const location = useLocation();
  const { account, description, userLocation, role } = location.state || {};
  const navigate = useNavigate();
  console.log('Profile State:', location.state); // Debugging log

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary back-button" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
      </button>
      
      {account ? (
        <div className="card">
          <div className="card-body">
          <h1>{role} Profile Page</h1>
            <p><strong>Account:</strong> {account}</p>
            <p><strong>Role:</strong> {role}</p>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Location:</strong> {userLocation}</p>
          </div>
        </div>
      ) : (
        <p>No profile information available.</p>
      )}
    </div>
  );
};

export default Profile;
