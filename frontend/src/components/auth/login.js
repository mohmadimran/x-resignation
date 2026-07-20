import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  Grid,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../../api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email || !validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // Extract data from response
      const userData = response.data.data; 
      const tokenData = response.data.token; 

      //  Call login with userData and token
      login(userData, tokenData);

      //  Redirect based on role
      const userRole = userData.role;
      
      if (userRole === "employee") {
        navigate("/employee/dashboard", { replace: true });
      } else if (userRole === "HR" || userRole === "admin") {
        navigate("/hr/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      
      if (errorMessage.toLowerCase().includes("invalid email") || 
          errorMessage.toLowerCase().includes("invalid credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (errorMessage.toLowerCase().includes("deactivated")) {
        setError("Your account has been deactivated. Please contact HR.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
          Login to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
                autoFocus
                placeholder="john@example.com"
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
                helperText={fieldErrors.password}
                disabled={loading}
                placeholder="Enter your password"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" display="inline">
              Don't have an account?
            </Typography>
            <Button
              component={Link}
              to="/register"
              color="primary"
              sx={{ textTransform: "none", ml: 1 }}
              disabled={loading}
            >
              Register here
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;