import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
        >
            <CircularProgress size={60} />
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                {message}
            </Typography>
        </Box>
    );
};

export default LoadingSpinner;