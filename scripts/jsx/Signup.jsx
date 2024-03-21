import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import './LoginSignup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // Add other fields as needed
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        Sign Up
      </Typography>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      {/* Add other input fields if necessary */}
      <Button type="submit" variant="contained" color="primary">
        Sign Up
      </Button>
    </Box>
  );
}

export default Signup;
