import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  Chip,
  CircularProgress,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { getAllResignations, concludeResignation } from '../../api';

const AdminResignationDialog = ({ open, onClose }) => {
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [concluding, setConcluding] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    if (open) {
      fetchResignations();
    }
  }, [open]);

  const fetchResignations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllResignations();
      setResignations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resignations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (resignationId, status) => {
    setSelectedStatus(prev => ({ ...prev, [resignationId]: status }));
  };

  const handleConclude = async (resignationId) => {
    const status = selectedStatus[resignationId];
    if (!status) {
      setError('Please select a status');
      return;
    }

    setConcluding(true);
    setError(null);
    setSuccess(null);

    try {
      await concludeResignation({ resignationId, status });
      setSuccess(`Resignation ${status} successfully!`);
      // Refresh the list after a delay
      setTimeout(() => {
        fetchResignations();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to conclude resignation');
    } finally {
      setConcluding(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Manage Resignations</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2, mt: 1 }}>
            {success}
          </Alert>
        )}
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : resignations.length === 0 ? (
          <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
            No resignation requests found
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Notice Period</TableCell>
                  <TableCell>Last Working Day</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resignations.map((resignation) => (
                  <TableRow key={resignation._id}>
                    <TableCell>
                      {resignation.employee?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>{resignation.reason}</TableCell>
                    <TableCell>{resignation.noticePeriod}</TableCell>
                    <TableCell>
                      {new Date(resignation.lastWorkingDay).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={resignation.status || 'Pending'} 
                        color={getStatusColor(resignation.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {resignation.status === 'pending' && (
                        <Box display="flex" gap={1} alignItems="center">
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={selectedStatus[resignation._id] || ''}
                              onChange={(e) => handleStatusChange(resignation._id, e.target.value)}
                              label="Status"
                            >
                              <MenuItem value="approved">Approve</MenuItem>
                              <MenuItem value="rejected">Reject</MenuItem>
                            </Select>
                          </FormControl>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleConclude(resignation._id)}
                            disabled={concluding || !selectedStatus[resignation._id]}
                          >
                            Conclude
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminResignationDialog;