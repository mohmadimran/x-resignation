import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Divider,
    Alert,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Paper,
    CircularProgress,
    Chip
} from '@mui/material';

const ExitProcessForm = ({
    onSubmit,
    loading,
    error,
    onErrorClear,
    success,
    onSuccessClear
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        lwd: '',
        responses: [
            { questionText: 'Why are you leaving the company?', response: '' },
            { questionText: 'What did you like most about working here?', response: '' },
            { questionText: 'What could we improve?', response: '' },
            { questionText: 'Would you recommend this company to others?', response: '' },
            { questionText: 'Any additional feedback?', response: '' }
        ]
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const steps = ['Resignation Details', 'Exit Interview', 'Review & Submit'];

    // Get today's date in YYYY-MM-DD format for min attribute
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, lwd: value }));
        if (fieldErrors.lwd) {
            setFieldErrors(prev => ({ ...prev, lwd: '' }));
        }
        if (error) onErrorClear();
    };

    const handleResponseChange = (index, value) => {
        const updatedResponses = [...formData.responses];
        updatedResponses[index].response = value;
        setFormData(prev => ({ ...prev, responses: updatedResponses }));

        if (fieldErrors[`response_${index}_answer`]) {
            setFieldErrors(prev => ({ ...prev, [`response_${index}_answer`]: '' }));
        }
        if (error) onErrorClear();
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (!formData.lwd) {
                setFieldErrors({ lwd: 'Please select your Last Working Day' });
                return;
            }
            const lwdDate = new Date(formData.lwd);
            if (lwdDate <= new Date()) {
                setFieldErrors({ lwd: 'Last Working Day must be a future date' });
                return;
            }
        }

        if (activeStep === 1) {
            const hasEmptyResponse = formData.responses.some(item => !item.response?.trim());
            if (hasEmptyResponse) {
                const errors = {};
                formData.responses.forEach((item, index) => {
                    if (!item.response?.trim()) {
                        errors[`response_${index}_answer`] = 'Please provide an answer';
                    }
                });
                setFieldErrors(errors);
                return;
            }
        }

        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.lwd) {
            setFieldErrors({ lwd: 'Please select your Last Working Day' });
            return;
        }

        const lwdDate = new Date(formData.lwd);
        if (lwdDate <= new Date()) {
            setFieldErrors({ lwd: 'Last Working Day must be a future date' });
            return;
        }

        const hasEmptyResponse = formData.responses.some(item => !item.response?.trim());
        if (hasEmptyResponse) {
            const errors = {};
            formData.responses.forEach((item, index) => {
                if (!item.response?.trim()) {
                    errors[`response_${index}_answer`] = 'Please provide an answer';
                }
            });
            setFieldErrors(errors);
            return;
        }

        try {
            const submitData = {
                lwd: formData.lwd,
                responses: formData.responses
            };

            await onSubmit(submitData);
        } catch (err) {
            throw new Error(err.message || 'Submission failed');
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Please select your Last Working Day. This must be a future date.
                        </Typography>

                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                <strong>Note:</strong> Your resignation will be in <strong>pending</strong> status until
                                HR reviews and approves it.
                            </Typography>
                        </Alert>

                        <TextField
                            label="Last Working Day"
                            type="date"
                            fullWidth
                            margin="normal"
                            value={formData.lwd}
                            onChange={handleDateChange}
                            error={!!fieldErrors.lwd}
                            helperText={fieldErrors.lwd || 'Select a future date'}
                            disabled={loading || success}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min: getTodayDate(),
                            }}
                        />

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="textSecondary">
                                <strong>Next Step:</strong> After selecting your LWD, you'll be asked to complete an exit interview.
                            </Typography>
                        </Box>
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Please complete the exit interview. Your responses will be kept confidential.
                        </Typography>

                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                <strong>Note:</strong> Your exit interview responses will be reviewed by HR
                                along with your resignation request.
                            </Typography>
                        </Alert>

                        {formData.responses.map((item, index) => (
                            <Box key={index} sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    {index + 1}. {item.questionText}
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    placeholder="Enter your response..."
                                    value={item.response}
                                    onChange={(e) => handleResponseChange(index, e.target.value)}
                                    error={!!fieldErrors[`response_${index}_answer`]}
                                    helperText={fieldErrors[`response_${index}_answer`]}
                                    variant="outlined"
                                    disabled={loading || success}
                                />
                            </Box>
                        ))}
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            Review Your Exit Process
                        </Typography>

                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', mt: 2 }}>
                            <Typography variant="subtitle2" color="primary">
                                Resignation Details
                            </Typography>
                            <Typography variant="body2">
                                <strong>Last Working Day:</strong> {formData.lwd ? new Date(formData.lwd).toLocaleDateString() : 'Not selected'}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                Exit Interview Responses
                            </Typography>
                            {formData.responses.map((item, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        Q{index + 1}: {item.questionText}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                                        {item.response || 'No response provided'}
                                    </Typography>
                                </Box>
                            ))}

                            <Divider sx={{ my: 2 }} />

                            <Alert severity="warning">
                                <Typography variant="body2">
                                    <strong>Status: Pending Review</strong>
                                    <br />
                                    Your resignation will be pending until HR reviews and approves it.
                                    You'll be notified once there's an update.
                                </Typography>
                            </Alert>
                        </Paper>
                    </Box>
                );

            default:
                return 'Unknown step';
        }
    };

    if (success) {
        return (
            <Card>
                <CardContent>
                    <Alert
                        severity="success"
                        onClose={onSuccessClear}
                        sx={{ mb: 2 }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold">
                            ✓ Exit Process Submitted Successfully!
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Your resignation and exit interview have been submitted and is <strong>pending</strong> HR review.
                            <br />
                            You will be notified once HR approves or rejects your request.
                        </Typography>
                    </Alert>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                onSuccessClear();
                                setActiveStep(0);
                                setFormData({
                                    lwd: '',
                                    responses: [
                                        { questionText: 'Why are you leaving the company?', response: '' },
                                        { questionText: 'What did you like most about working here?', response: '' },
                                        { questionText: 'What could we improve?', response: '' },
                                        { questionText: 'Would you recommend this company to others?', response: '' },
                                        { questionText: 'Any additional feedback?', response: '' }
                                    ]
                                });
                            }}
                        >
                            Submit Another Request
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => window.location.reload()}
                        >
                            View Status
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                        Submit Resignation
                    </Typography>
                    <Chip
                        label="Status: Pending Review"
                        color="warning"
                        size="small"
                    />
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Complete the resignation process. Your request will be reviewed by HR.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={onErrorClear}>
                        {error}
                    </Alert>
                )}

                <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {getStepContent(index)}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <Button
                                        disabled={activeStep === 0 || loading}
                                        onClick={handleBack}
                                        variant="outlined"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} />
                                        ) : activeStep === steps.length - 1 ? (
                                            'Submit Resignation'
                                        ) : (
                                            'Next'
                                        )}
                                    </Button>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </CardContent>
        </Card>
    );
};

export default ExitProcessForm;