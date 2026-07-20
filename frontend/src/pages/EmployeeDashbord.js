import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Typography,
    Box,
    Paper,
    Tabs,
    Tab,
    Divider,
    Snackbar,
    Alert
} from '@mui/material';
import ExitProcessForm from '../components/employee/ExitProcessForm';
import ExitRequestStatus from '../components/employee/ExitRequestStatus';
import useEmployee from '../hooks/useEmployee';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EmployeeDashboardPage = () => {
    const [tabValue, setTabValue] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const {
        loading,
        error,
        exitRequests,
        submissionSuccess,
        submitExitProcess,
        getMyExitRequests,
        clearError,
        clearSuccess
    } = useEmployee();

    useEffect(() => {
        const loadData = async () => {
            try {
                await getMyExitRequests();
            } catch (err) {
         throw new Error(err.message || 'failed');            }
        };
        loadData();

        return () => {
            clearError();
            clearSuccess();
        };
    }, [getMyExitRequests, clearError, clearSuccess]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        clearError();
    };

    const handleSubmitExit = async (data) => {
        try {
            await submitExitProcess(data);
            setSnackbar({
                open: true,
                message: 'Exit process submitted successfully!',
                severity: 'success'
            });
            await getMyExitRequests();
            setTabValue(1);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.message || 'Failed to submit exit process',
                severity: 'error'
            });
        }
    };

    const handleRefresh = async () => {
        try {
            await getMyExitRequests();
            setSnackbar({
                open: true,
                message: 'Requests refreshed successfully',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to refresh requests',
                severity: 'error'
            });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading && exitRequests.length === 0 && tabValue === 1) {
        return <LoadingSpinner />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Employee Dashboard
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Manage your exit process and track request status
                </Typography>
                <Divider sx={{ mt: 2 }} />
            </Box>

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab
                        label="Submit Exit Process"
                        icon={<span>📝</span>}
                        iconPosition="start"
                    />
                    <Tab
                        label={`My Exit Status (${exitRequests.length})`}
                        icon={<span>📊</span>}
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {tabValue === 0 && (
                        <ExitProcessForm
                            onSubmit={handleSubmitExit}
                            loading={loading}
                            error={error}
                            success={submissionSuccess}
                            onErrorClear={clearError}
                            onSuccessClear={clearSuccess}
                        />
                    )}

                    {tabValue === 1 && (
                        <ExitRequestStatus
                            exitRequests={exitRequests}
                            // Pass the raw data, component will handle it
                            onRefresh={handleRefresh}
                            loading={loading}
                        />
                    )}
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default EmployeeDashboardPage;