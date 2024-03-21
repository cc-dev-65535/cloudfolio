import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import './LoginSignup.css';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // to do
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
        '& .MuiButton-root': { m: 1 },
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        name="email"
        value={credentials.email}
        onChange={handleChange}
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Log In
      </Button>
    </Box>
  );
}

export default Login;
