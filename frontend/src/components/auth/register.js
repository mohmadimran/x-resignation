import { registerUser } from "../../api";
import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Alert,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '',
    email: '',
    password: '',
    role: 'employee',
    department: '',
    designation: '',
    employeeId: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Role descriptions for user guidance
  const roleDescriptions = {
    employee: {
      title: 'Employee',
      icon: <PersonIcon />,
      description: 'Register as an employee to submit exit requests and manage your profile',
      color: '#1976d2',
      fields: ['Department', 'Designation', 'Employee ID']
    },
    HR: {
      title: 'HR Professional',
      icon: <BusinessIcon />,
      description: 'Register as HR to manage employee exit processes and reviews',
      color: '#2e7d32',
      fields: ['No additional fields required']
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6 && /^(?=.*[A-Za-z])(?=.*\d)/.test(password);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username || formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email || !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password || !validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters with letters and numbers';
    }

    if (formData.role === 'employee') {
      if (!formData.department?.trim()) {
        errors.department = 'Department is required for employees';
      }
      if (!formData.designation?.trim()) {
        errors.designation = 'Designation is required for employees';
      }
      if (!formData.employeeId?.trim()) {
        errors.employeeId = 'Employee ID is required for employees';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const submitData = { ...formData };
      if (formData.role !== 'employee') {
        delete submitData.department;
        delete submitData.designation;
        delete submitData.employeeId;
      }

      const response = await registerUser(submitData);
      setMessage(response.data?.message || 'Registration successful!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      
      if (errorMessage.includes('Email already exists')) {
        setFieldErrors({ email: 'This email is already registered' });
      } else if (errorMessage.includes('Employee ID already exists')) {
        setFieldErrors({ employeeId: 'This Employee ID is already registered' });
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const isEmployee = formData.role === 'employee';
  const currentRole = roleDescriptions[formData.role];

  return (
    <Box display="flex" justifyContent="center" mt={3} mb={5}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 550 }}>
        {/* Header with Role Selection Guide */}
        <Typography variant="h5" gutterBottom align="center">
          Create Your Account
        </Typography>
        
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
          Choose your role and fill in the required details
        </Typography>

        {/* Role Selection Card with Visual Guide */}
        <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Select Your Role:
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Box 
                flex={1} 
                minWidth="150px"
                sx={{
                  p: 2,
                  border: '2px solid',
                  borderColor: formData.role === 'employee' ? '#1976d2' : '#e0e0e0',
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: formData.role === 'employee' ? '#e3f2fd' : 'white',
                  '&:hover': { bgcolor: '#f0f7ff' }
                }}
                onClick={() => {
                  setFormData(prev => ({ ...prev, role: 'employee' }));
                  setFieldErrors({});
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon color="primary" />
                  <Typography variant="subtitle1">Employee</Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  Submit exit requests
                </Typography>
              </Box>

              <Box 
                flex={1} 
                minWidth="150px"
                sx={{
                  p: 2,
                  border: '2px solid',
                  borderColor: formData.role === 'HR' ? '#2e7d32' : '#e0e0e0',
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: formData.role === 'HR' ? '#e8f5e9' : 'white',
                  '&:hover': { bgcolor: '#f0f9f0' }
                }}
                onClick={() => {
                  setFormData(prev => ({ ...prev, role: 'HR' }));
                  setFieldErrors({});
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <BusinessIcon color="success" />
                  <Typography variant="subtitle1">HR</Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  Manage exit processes
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Role Information Banner */}
        <Alert 
          severity="info" 
          icon={currentRole.icon}
          sx={{ mb: 3 }}
        >
          <Typography variant="subtitle2">
            {currentRole.title} Registration
          </Typography>
          <Typography variant="body2">
            {currentRole.description}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Required: {currentRole.fields.join(' • ')}
          </Typography>
        </Alert>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                name="username"
                fullWidth
                required
                value={formData.username}
                onChange={handleChange}
                error={!!fieldErrors.username}
                helperText={fieldErrors.username}
                autoFocus
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password || 'Min 6 characters with letters and numbers'}
                disabled={loading}
              />
            </Grid>

            {isEmployee && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Chip label="Employee Details" size="small" />
                  </Divider>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Department"
                    name="department"
                    fullWidth
                    required
                    value={formData.department}
                    onChange={handleChange}
                    error={!!fieldErrors.department}
                    helperText={fieldErrors.department}
                    disabled={loading}
                    InputProps={{
                      startAdornment: <BadgeIcon color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Designation"
                    name="designation"
                    fullWidth
                    required
                    value={formData.designation}
                    onChange={handleChange}
                    error={!!fieldErrors.designation}
                    helperText={fieldErrors.designation}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Employee ID"
                    name="employeeId"
                    fullWidth
                    required
                    value={formData.employeeId}
                    onChange={handleChange}
                    error={!!fieldErrors.employeeId}
                    helperText={fieldErrors.employeeId}
                    disabled={loading}
                    placeholder="EMP001"
                  />
                </Grid>
              </>
            )}

            {!isEmployee && (
              <Grid item xs={12}>
                <Alert severity="success" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    ✅ You're registering as HR. No additional fields required.
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Registering...' : `Register as ${formData.role}`}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" display="inline">
              Already have an account?
            </Typography>
            <Button 
              color="primary" 
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none', ml: 1 }}
              disabled={loading}
            >
              Login here
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;