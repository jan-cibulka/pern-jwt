import React from 'react';

const Dashboard = ({ setAuth }) => {
  return (
    <>
      <h1>Dashboard</h1>
      <button onClick={() => setAuth(false)}>logout</button>
    </>
  );
};

export default Dashboard;
