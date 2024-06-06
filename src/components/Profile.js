import React from 'react';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const { account, description, location: userLocation, role } = location.state || {};

  console.log('Profile State:', location.state); // Debugging log

  return (
    <div className="container mt-5">
      <h1>{role} Profile Page</h1>
      {account ? (
        <div>
          <p><strong>Account:</strong> {account}</p>
          <p><strong>Role:</strong> {role}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Location:</strong> {userLocation}</p>
        </div>
      ) : (
        <p>No profile information available.</p>
      )}
    </div>
  );
};

export default Profile;
