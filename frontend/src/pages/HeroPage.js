import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Grid,
  Card,
  CardContent,
  Divider,
  Paper,
  useTheme,
  Chip,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  WorkOutline,
  PeopleOutline,
  Description,
  ArrowForward,
  Login,
  PersonAdd,
  Dashboard,
  CheckCircleOutline,
  TrendingUp,
  People
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated, loading, user } = useAuth();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role === 'employee') {
      navigate('/employee/dashboard');
    } else if (user?.role === 'HR' || user?.role === 'admin') {
      navigate('/hr/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const features = [
    {
      icon: <Description sx={{ fontSize: 40 }} />,
      title: 'Submit Exit Request',
      description: 'Employees can submit resignation and exit formalities with ease.',
      role: 'Employee',
      color: 'primary'
    },
    {
      icon: <PeopleOutline sx={{ fontSize: 40 }} />,
      title: 'Manage Exit Processes',
      description: 'HR can review, approve, and manage employee exit requests efficiently.',
      role: 'HR',
      color: 'success'
    },
    {
      icon: <WorkOutline sx={{ fontSize: 40 }} />,
      title: 'Track Status',
      description: 'Track your exit request status in real-time with notifications.',
      role: 'All',
      color: 'warning'
    }
  ];

  const stats = [
    { 
      value: '100+', 
      label: 'Exits Processed',
      icon: <CheckCircleOutline />
    },
    { 
      value: '50+', 
      label: 'Companies Using',
      icon: <TrendingUp />
    },
    { 
      value: '98%', 
      label: 'Satisfaction Rate',
      icon: <People />
    }
  ];

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography>Loading...</Typography>
            </Box>
        );
    }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: { xs: 'auto', md: '90vh' },
          py: { xs: 6, sm: 8, md: 12 },
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.default',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: { xs: '-30%', md: '-50%' },
            right: { xs: '-50%', md: '-30%' },
            width: { xs: '80%', md: '60%' },
            height: { xs: '80%', md: '100%' },
            background: `radial-gradient(circle, ${theme.palette.primary.main}08 0%, transparent 70%)`,
            transform: 'rotate(-10deg)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: { xs: '-20%', md: '-30%' },
            left: { xs: '-50%', md: '-20%' },
            width: { xs: '60%', md: '40%' },
            height: { xs: '60%', md: '80%' },
            background: `radial-gradient(circle, ${theme.palette.secondary.main}05 0%, transparent 70%)`,
            transform: 'rotate(10deg)',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={7}>
              <Box>
                <Chip 
                  label="Exit Management System"
                  color="primary"
                  sx={{ 
                    mb: { xs: 2, sm: 3 },
                    fontWeight: 'bold',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 1, sm: 1.5 }
                  }}
                />
                
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                    lineHeight: { xs: 1.2, md: 1.3 },
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: { xs: 2, sm: 3 }
                  }}
                >
                  Streamline Your Exit Process
                </Typography>

                <Typography 
                  variant="h6" 
                  color="textSecondary" 
                  sx={{ 
                    maxWidth: { xs: '100%', md: '90%' },
                    mb: { xs: 3, sm: 4 },
                    lineHeight: 1.8,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                  }}
                >
                  A centralized system for managing employee resignations and exit formalities.
                  Submit, review, and track exit requests seamlessly.
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1.5, sm: 2 }, 
                  flexWrap: 'wrap',
                  mb: { xs: 4, sm: 5 }
                }}>
                  {!isAuthenticated ? (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/login')}
                        startIcon={<Login />}
                        sx={{
                          px: { xs: 3, sm: 4 },
                          py: { xs: 1, sm: 1.5 },
                          borderRadius: 2,
                          fontWeight: 600,
                          flex: { xs: '1 1 auto', sm: '0 1 auto' },
                          minWidth: { xs: '120px', sm: '150px' }
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/register')}
                        startIcon={<PersonAdd />}
                        sx={{
                          px: { xs: 3, sm: 4 },
                          py: { xs: 1, sm: 1.5 },
                          borderRadius: 2,
                          fontWeight: 600,
                          flex: { xs: '1 1 auto', sm: '0 1 auto' },
                          minWidth: { xs: '120px', sm: '150px' }
                        }}
                      >
                        Register
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGetStarted}
                      startIcon={<Dashboard />}
                      sx={{
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1, sm: 1.5 },
                        borderRadius: 2,
                        fontWeight: 600,
                        minWidth: { xs: '180px', sm: '200px' }
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  )}
                </Box>

                {/* Quick Stats */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 2, sm: 4 }, 
                  flexWrap: 'wrap',
                  pt: { xs: 2, sm: 3 },
                  borderTop: `1px solid ${theme.palette.divider}`
                }}>
                  {stats.map((stat, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: 'primary.main' }}>
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography 
                          variant="h5" 
                          color="primary" 
                          fontWeight="bold"
                          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="textSecondary"
                          sx={{ display: 'block' }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Right Panel - Quick Actions */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  bgcolor: 'background.paper',
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: theme.shadows[10]
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/register')}
                    startIcon={<PersonAdd />}
                    sx={{ 
                      justifyContent: 'flex-start', 
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    Register as Employee
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="success"
                    onClick={() => navigate('/register')}
                    startIcon={<PeopleOutline />}
                    sx={{ 
                      justifyContent: 'flex-start', 
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    Register as HR
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="info"
                    onClick={() => navigate('/login')}
                    startIcon={<Login />}
                    sx={{ 
                      justifyContent: 'flex-start', 
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    Login to Dashboard
                  </Button>
                </Stack>

                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 2,
                  textAlign: 'center'
                }}>
                  <Typography variant="body2" color="textSecondary">
                    🎯 Demo Credentials
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                    john@example.com / Password123
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ 
        py: { xs: 6, sm: 8, md: 10 },
        px: { xs: 2, sm: 3 }
      }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
          <Chip 
            label="Features"
            color="primary"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
            }}
          >
            Why Choose Our Exit Management System?
          </Typography>
          <Typography 
            variant="body1" 
            color="textSecondary" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              fontSize: { xs: '0.95rem', sm: '1rem' }
            }}
          >
            Streamlined processes for both employees and HR professionals
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: 3,
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-8px)' },
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardContent sx={{ 
                  p: { xs: 3, sm: 4 }, 
                  flexGrow: 1,
                  textAlign: { xs: 'center', sm: 'left' }
                }}>
                  <Box sx={{ 
                    mb: 2,
                    display: 'flex',
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    <Box sx={{ 
                      color: theme.palette[feature.color].main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    sx={{ 
                      mb: 2,
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    {feature.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    <Chip 
                      label={feature.role}
                      size="small"
                      color={feature.color}
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, sm: 8, md: 10 },
          textAlign: 'center',
          px: { xs: 2, sm: 3 }
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h4" 
            gutterBottom 
            fontWeight="bold"
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 3, sm: 4 }, 
              opacity: 0.9,
              fontSize: { xs: '0.95rem', sm: '1rem' }
            }}
          >
            Join thousands of employees and HR professionals using our platform
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 1.8 },
              borderRadius: 2,
              fontWeight: 600,
              fontSize: { xs: '0.95rem', sm: '1rem' },
              minWidth: { xs: '200px', sm: '250px' },
              '&:hover': {
                bgcolor: 'grey.100',
              }
            }}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;