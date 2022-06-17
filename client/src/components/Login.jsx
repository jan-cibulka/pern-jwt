import React from 'react';

const Login = ({ setAuth }) => {
  return (
    <>
      <h1>Login</h1>
      <button onClick={setAuth}>authenticate</button>
    </>
  );
};

export default Login;
