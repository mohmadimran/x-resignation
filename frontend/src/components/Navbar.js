import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const { user, isAuthenticated, loading, logout, role } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
        setDrawerOpen(false);
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // Mobile drawer content
    const drawerContent = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {isAuthenticated ? (
                    <>
                        <ListItem>
                            <Box sx={{ width: '100%' }}>
                                <Chip 
                                    label={`Role: ${role}`} 
                                    size="small" 
                                    sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: 'primary.main', mb: 1 }}
                                />
                                <Typography variant="body2" fontWeight="bold">
                                    Welcome, {user?.username || 'User'}
                                </Typography>
                            </Box>
                        </ListItem>
                        <ListItem button onClick={() => navigate('/dashboard')}>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button onClick={handleLogout}>
                            <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem button onClick={() => navigate('/login')}>
                            <ListItemText primary="Login" />
                        </ListItem>
                        <ListItem button onClick={() => navigate('/register')}>
                            <ListItemText primary="Register" />
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                {/* Logo */}
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                        Exit Management
                    </Link>
                </Typography>

                {/* Desktop View */}
                {!isMobile ? (
                    <>
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : isAuthenticated ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Chip 
                                    label={`Role: ${role}`} 
                                    size="small" 
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                />
                                <Typography variant="body2">
                                    Welcome, {user?.username || 'User'}
                                </Typography>
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button color="inherit" component={Link} to="/login">
                                    Login
                                </Button>
                                <Button color="inherit" component={Link} to="/register">
                                    Register
                                </Button>
                            </Box>
                        )}
                    </>
                ) : (
                    /* Mobile View - Hamburger Menu */
                    <>
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <IconButton
                                size="large"
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </>
                )}
            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawerContent}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;