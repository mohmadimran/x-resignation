import React from 'react';
import { Button, Box } from '@mui/material';

const AdminActions = ({ onResignClick, onExitClick }) => {
  return (
    <Box display="flex" gap={2} mt={2}>
      <Button
        variant="contained"
        color="warning"
        onClick={onResignClick}
      >
        Manage Resignations
      </Button>
      <Button
        variant="contained"
        color="info"
        onClick={onExitClick}
      >
        View Exit Responses
      </Button>
    </Box>
  );
};

export default AdminActions;