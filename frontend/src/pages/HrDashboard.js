import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Divider,
    Snackbar,
    Alert,
    Grid,
    Card,
    CardContent,
    Chip,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress
} from '@mui/material';
import {
    Pending,
    CheckCircle,
    Cancel,
    Visibility,
    ThumbUp,
    ThumbDown,
    Refresh
} from '@mui/icons-material';
import useHR from '../hooks/useHR';

const HRDashboardPage = () => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectRemarks, setRejectRemarks] = useState('');
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const {
        loading,
        exitRequests,
        selectedRequest,
        getAllExitRequests,
        getExitRequest,
        approveRequest,
        rejectRequest,
        clearError,
        clearSuccess
    } = useHR();

    // Load data on mount
    useEffect(() => {
        getAllExitRequests();
    }, [getAllExitRequests]);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Get filtered requests based on tab
    const getFilteredRequests = () => {
        if (tabValue === 0) return exitRequests;
        if (tabValue === 1) return exitRequests.filter(r => r.status === 'pending');
        if (tabValue === 2) return exitRequests.filter(r => r.status === 'approved');
        if (tabValue === 3) return exitRequests.filter(r => r.status === 'rejected');
        return exitRequests;
    };

    // Handle view request
    const handleViewRequest = async (id) => {
        await getExitRequest(id);
        setViewDialogOpen(true);
    };

    // Handle approve
    const handleApprove = async (id) => {
        if (window.confirm('Are you sure you want to approve this exit request?')) {
            try {
                await approveRequest(id);
                setSnackbar({
                    open: true,
                    message: 'Exit request approved successfully!',
                    severity: 'success'
                });
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: err.message || 'Failed to approve request',
                    severity: 'error'
                });
            }
        }
    };

    // Handle reject
    const handleRejectClick = (id) => {
        setSelectedRequestId(id);
        setRejectDialogOpen(true);
        setRejectRemarks('');
    };

    const handleRejectConfirm = async () => {
        if (!rejectRemarks.trim()) {
            setSnackbar({
                open: true,
                message: 'Please provide remarks for rejection',
                severity: 'error'
            });
            return;
        }

        try {
            await rejectRequest(selectedRequestId, rejectRemarks);
            setRejectDialogOpen(false);
            setRejectRemarks('');
            setSnackbar({
                open: true,
                message: 'Exit request rejected successfully!',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.message || 'Failed to reject request',
                severity: 'error'
            });
        }
    };

    // Handle refresh
    const handleRefresh = async () => {
        await getAllExitRequests();
        setSnackbar({
            open: true,
            message: 'Requests refreshed successfully',
            severity: 'success'
        });
    };

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
        clearError();
        clearSuccess();
    };

    // Get status chip
    const getStatusChip = (status) => {
        const config = {
            pending: { color: 'warning', icon: <Pending />, label: 'Pending' },
            approved: { color: 'success', icon: <CheckCircle />, label: 'Approved' },
            rejected: { color: 'error', icon: <Cancel />, label: 'Rejected' }
        };
        return config[status] || config.pending;
    };

    const filteredRequests = getFilteredRequests();

    // Stats
    const stats = {
        total: exitRequests.length,
        pending: exitRequests.filter(r => r.status === 'pending').length,
        approved: exitRequests.filter(r => r.status === 'approved').length,
        rejected: exitRequests.filter(r => r.status === 'rejected').length
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        HR Dashboard
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Manage and review employee exit requests
                    </Typography>
                </Box>
                <Button
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    disabled={loading}
                    variant="outlined"
                >
                    Refresh
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Requests
                            </Typography>
                            <Typography variant="h4">{stats.total}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderLeft: '4px solid #ff9800' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Pending
                            </Typography>
                            <Typography variant="h4" color="warning.main">
                                {stats.pending}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderLeft: '4px solid #4caf50' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Approved
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {stats.approved}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderLeft: '4px solid #f44336' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Rejected
                            </Typography>
                            <Typography variant="h4" color="error.main">
                                {stats.rejected}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label={`All (${stats.total})`} />
                    <Tab label={`Pending (${stats.pending})`} />
                    <Tab label={`Approved (${stats.approved})`} />
                    <Tab label={`Rejected (${stats.rejected})`} />
                </Tabs>
            </Paper>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>LWD</TableCell>
                            <TableCell>Submitted</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : filteredRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography color="textSecondary">
                                        No {tabValue === 0 ? '' : tabValue === 1 ? 'pending ' : tabValue === 2 ? 'approved ' : 'rejected '} requests found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRequests.map((request) => {
                                const statusConfig = getStatusChip(request.status);
                                return (
                                    <TableRow key={request._id}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">
                                                {request.employeeName}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {request.employeeEmail}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {request.department}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {request.designation}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(request.lwd).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusConfig.label}
                                                color={statusConfig.color}
                                                size="small"
                                                icon={statusConfig.icon}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box display="flex" gap={1} justifyContent="flex-end">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleViewRequest(request._id)}
                                                >
                                                    <Visibility fontSize="small" />
                                                </Button>
                                                {request.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="success"
                                                            onClick={() => handleApprove(request._id)}
                                                        >
                                                            <ThumbUp fontSize="small" />
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="error"
                                                            onClick={() => handleRejectClick(request._id)}
                                                        >
                                                            <ThumbDown fontSize="small" />
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* View Request Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Exit Request Details</DialogTitle>
                <DialogContent>
                    {selectedRequest ? (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="primary">Employee Information</Typography>
                                    <Typography variant="body2"><strong>Name:</strong> {selectedRequest.employeeName}</Typography>
                                    <Typography variant="body2"><strong>Email:</strong> {selectedRequest.employeeEmail}</Typography>
                                    <Typography variant="body2"><strong>Department:</strong> {selectedRequest.department}</Typography>
                                    <Typography variant="body2"><strong>Designation:</strong> {selectedRequest.designation}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="primary">Request Details</Typography>
                                    <Typography variant="body2"><strong>LWD:</strong> {new Date(selectedRequest.lwd).toLocaleDateString()}</Typography>
                                    <Typography variant="body2"><strong>Submitted:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</Typography>
                                    <Typography variant="body2">
                                        <strong>Status:</strong>{' '}
                                        <Chip
                                            label={getStatusChip(selectedRequest.status).label}
                                            color={getStatusChip(selectedRequest.status).color}
                                            size="small"
                                        />
                                    </Typography>
                                    {selectedRequest.reviewedAt && (
                                        <Typography variant="body2">
                                            <strong>Reviewed:</strong> {new Date(selectedRequest.reviewedAt).toLocaleString()}
                                        </Typography>
                                    )}
                                    {selectedRequest.reviewedBy && (
                                        <Typography variant="body2">
                                            <strong>Reviewed By:</strong> {selectedRequest.reviewedBy?.username || 'HR'}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>

                            {selectedRequest.responses?.length > 0 && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2" color="primary">Exit Interview Responses</Typography>
                                    {selectedRequest.responses.map((item, index) => (
                                        <Box key={index} sx={{ mt: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                Q{index + 1}: {item.questionText}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                                                {item.response}
                                            </Typography>
                                        </Box>
                                    ))}
                                </>
                            )}

                            {selectedRequest.remarks && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2" color="error">Remarks</Typography>
                                    <Alert severity={selectedRequest.status === 'rejected' ? 'error' : 'info'}>
                                        {selectedRequest.remarks}
                                    </Alert>
                                </>
                            )}
                        </Box>
                    ) : (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                    {selectedRequest?.status === 'pending' && (
                        <>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                    handleApprove(selectedRequest._id);
                                    setViewDialogOpen(false);
                                }}
                            >
                                Approve
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    setViewDialogOpen(false);
                                    handleRejectClick(selectedRequest._id);
                                }}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
                <DialogTitle>Reject Exit Request</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Please provide remarks for rejecting this request.
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Remarks"
                        value={rejectRemarks}
                        onChange={(e) => setRejectRemarks(e.target.value)}
                        placeholder="Explain why this request is being rejected..."
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleRejectConfirm}
                        disabled={!rejectRemarks.trim()}
                    >
                        Confirm Reject
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default HRDashboardPage;