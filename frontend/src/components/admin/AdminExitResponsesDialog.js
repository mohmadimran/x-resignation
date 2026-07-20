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
  IconButton,
  Collapse
} from '@mui/material';
import { getAllExitResponses } from '../../api';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const AdminExitResponsesDialog = ({ open, onClose }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    if (open) {
      fetchExitResponses();
    }
  }, [open]);

  const fetchExitResponses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllExitResponses();
      setResponses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch exit responses');
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getRecommendationColor = (value) => {
    switch(value?.toLowerCase()) {
      case 'yes':
        return 'success';
      case 'no':
        return 'error';
      case 'maybe':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getCultureColor = (value) => {
    switch(value?.toLowerCase()) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'average':
        return 'warning';
      case 'poor':
        return 'error';
      case 'terrible':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Exit Responses</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : responses.length === 0 ? (
          <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
            No exit responses found
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="50px"></TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Reason for Leaving</TableCell>
                  <TableCell>Recommend</TableCell>
                  <TableCell>Culture Rating</TableCell>
                  <TableCell>Submitted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {responses.map((response) => (
                  <React.Fragment key={response._id}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleRow(response._id)}
                        >
                          {expandedRow === response._id ? 
                            <KeyboardArrowUpIcon /> : 
                            <KeyboardArrowDownIcon />
                          }
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {response.employee?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {response.reasonForLeaving?.substring(0, 50)}
                        {response.reasonForLeaving?.length > 50 && '...'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={response.recommendCompany || 'N/A'} 
                          color={getRecommendationColor(response.recommendCompany)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={response.workCulture || 'N/A'} 
                          color={getCultureColor(response.workCulture)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(response.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ py: 0 }}>
                        <Collapse in={expandedRow === response._id} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              Detailed Feedback
                            </Typography>
                            
                            <Box mb={2}>
                              <Typography variant="subtitle2" color="textSecondary">
                                Reason for Leaving:
                              </Typography>
                              <Typography variant="body2">
                                {response.reasonForLeaving || 'Not provided'}
                              </Typography>
                            </Box>

                            <Box mb={2}>
                              <Typography variant="subtitle2" color="textSecondary">
                                Feedback:
                              </Typography>
                              <Typography variant="body2">
                                {response.feedback || 'No feedback provided'}
                              </Typography>
                            </Box>

                            <Box mb={2}>
                              <Typography variant="subtitle2" color="textSecondary">
                                Management Feedback:
                              </Typography>
                              <Typography variant="body2">
                                {response.managementFeedback || 'No feedback provided'}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="subtitle2" color="textSecondary">
                                Additional Details:
                              </Typography>
                              <Typography variant="body2">
                                <strong>Recommend Company:</strong> {response.recommendCompany || 'N/A'}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Work Culture:</strong> {response.workCulture || 'N/A'}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Submitted:</strong> {new Date(response.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
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

export default AdminExitResponsesDialog;