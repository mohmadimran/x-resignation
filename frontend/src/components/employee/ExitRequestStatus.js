import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Button,
    Paper,
    Alert,
    CircularProgress,
    Divider
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    Pending,
    Refresh,
    CalendarToday,
    Person,
    Email,
    Badge,
    Business,
    Description
} from '@mui/icons-material';

const ExitRequestStatus = ({ exitRequests, onRefresh, loading }) => {
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Status config
    const getStatusConfig = (status) => {
        const config = {
            pending: { color: 'warning', icon: <Pending />, label: 'Pending' },
            approved: { color: 'success', icon: <CheckCircle />, label: 'Approved' },
            rejected: { color: 'error', icon: <Cancel />, label: 'Rejected' }
        };
        return config[status] || config.pending;
    };

    // Get requests array - properly extract from data property
    const getRequests = () => {
        if (!exitRequests) return [];
        
        // If it's already an array
        if (Array.isArray(exitRequests)) {
            return exitRequests;
        }
        
        // If it has a data property (your API response structure)
        if (exitRequests.data) {
            // If data is an array
            if (Array.isArray(exitRequests.data)) {
                return exitRequests.data;
            }
            // If data is a single object
            return [exitRequests.data];
        }
        
        // If it's a single object with _id
        if (exitRequests._id) {
            return [exitRequests];
        }
        
        return [];
    };

    const requests = getRequests();

    // Filter requests by status
    const filteredRequests = requests.filter(req => {
        if (selectedStatus === 'all') return true;
        return req.status === selectedStatus;
    });

    // Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    };

    if (loading && requests.length === 0) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card>
            <CardContent>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">My Resignation Requests</Typography>
                    <Button
                        startIcon={<Refresh />}
                        onClick={onRefresh}
                        disabled={loading}
                        size="small"
                    >
                        Refresh
                    </Button>
                </Box>

                {/* Status Tabs */}
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                        <Chip
                            key={status}
                            label={`${status.charAt(0).toUpperCase() + status.slice(1)} (${requests.filter(r => status === 'all' ? true : r.status === status).length})`}
                            onClick={() => setSelectedStatus(status)}
                            color={selectedStatus === status ? 'primary' : 'default'}
                            variant={selectedStatus === status ? 'filled' : 'outlined'}
                        />
                    ))}
                </Box>

                {/* No requests */}
                {filteredRequests.length === 0 && (
                    <Box textAlign="center" py={4}>
                        <Typography color="textSecondary">
                            No {selectedStatus !== 'all' ? selectedStatus : ''} requests found
                        </Typography>
                    </Box>
                )}

                {/* Request Cards - Using request.data */}
                {filteredRequests.map((request) => {
                    // Get the actual data from request.data
                    const data = request.data || request;
                    
                    const statusConfig = getStatusConfig(data.status);

                    return (
                        <Paper key={data._id || Math.random()} sx={{ p: 2, mb: 2 }}>
                            {/* Summary Row */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" color="textSecondary">
                                        <CalendarToday fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                        Submitted
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(data.createdAt)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" color="textSecondary">
                                        <Business fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                        Department
                                    </Typography>
                                    <Typography variant="body2">
                                        {data.department || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" color="textSecondary">Status</Typography>
                                    <Chip
                                        label={statusConfig.label}
                                        color={statusConfig.color}
                                        size="small"
                                        icon={statusConfig.icon}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" color="textSecondary">Last Working Day</Typography>
                                    <Typography variant="body2">
                                        {formatDate(data.lwd)}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            {/* Employee Information */}
                            <Typography variant="subtitle2" gutterBottom color="primary">
                                <Person sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                Employee Information
                            </Typography>
                            <Grid container spacing={1} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Person fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            <strong>Name:</strong> {data.employeeName || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Email fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            <strong>Email:</strong> {data.employeeEmail || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Badge fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            <strong>ID:</strong> {data.employeeId || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Business fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            <strong>Department:</strong> {data.department || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Description fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            <strong>Designation:</strong> {data.designation || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <CalendarToday fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            <strong>LWD:</strong> {formatDate(data.lwd)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Exit Interview Responses */}
                            {data.responses && data.responses.length > 0 && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2" gutterBottom color="primary">
                                        <Description sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                        Exit Interview Responses
                                    </Typography>
                                    {data.responses.map((item, index) => (
                                        <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                Q{index + 1}: {item.questionText}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                                                {item.response || 'No response'}
                                            </Typography>
                                        </Box>
                                    ))}
                                </>
                            )}

                            {/* HR Remarks */}
                            {data.remarks && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Alert severity={data.status === 'rejected' ? 'error' : 'info'}>
                                        <Typography variant="subtitle2">HR Remarks</Typography>
                                        {data.remarks}
                                    </Alert>
                                </>
                            )}

                            {/* Status Alert */}
                            <Box sx={{ mt: 2 }}>
                                {data.status === 'pending' && (
                                    <Alert severity="info" icon={<Pending />}>
                                        Awaiting HR review. You'll be notified once updated.
                                    </Alert>
                                )}
                                {data.status === 'approved' && (
                                    <Alert severity="success" icon={<CheckCircle />}>
                                        Approved! Last Working Day: {formatDate(data.lwd)}
                                    </Alert>
                                )}
                                {data.status === 'rejected' && (
                                    <Alert severity="error" icon={<Cancel />}>
                                        Rejected. Please contact HR for more information.
                                    </Alert>
                                )}
                            </Box>
                        </Paper>
                    );
                })}
            </CardContent>
        </Card>
    );
};

export default ExitRequestStatus;